package util;



import java.sql.*;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Random;
import java.util.TimeZone;

public class SimpleGenerator {
    static Random random = new Random();

    static int[] spikeValues = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 40, 46, 60,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};

    static int total = 60 * 24 * 14;   // two week data, 1 entry per minute
    static int startPoints = 60 * 24 * 12; // spike start 13th day
    static int peakPoints = 41;   // 41 mins spike
    static int avg = 16;   // normal value
    static int numberOfChildren = 4;

    static String createCPUTotal = "create Table cpu_total (timestamp int not null, value int not null)";
    static String createCPUNode_1 = "create Table cpu_node_1 (timestamp int not null, value int not null)";
    static String createCPUNode_2 = "create Table cpu_node_2 (timestamp int not null, value int not null)";
    static String createCPUNode_3 = "create Table cpu_node_3 (timestamp int not null, value int not null)";
    static String createCPUNode_4 = "create Table cpu_node_4 (timestamp int not null, value int not null)";

    static String insertCPUTotal = "INSERT INTO cpu_total values(?,?)";
    static Connection conn;

    public static void main(String[] args) throws ParseException {
        SimpleGenerator generator = new SimpleGenerator();
//        int[] r = generator.generateSpikeValues(5, 1, 30);
//       System.out.println( Arrays.toString(r));

//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
//        sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
//
//        String inputString = "00:01:30";
//
//        Date date = sdf.parse("2017-05-03 15:00:00");
//
//        int curTime = (int)(date.getTime()/1000);
        int curTime = (int)(System.currentTimeMillis()/1000);
        int startTime = curTime- total * 60 ;

        try {
            generator.setConnection();
            // create cpu data: cpu_total, cpu_node[1-4]
            generator.putCPUData(startTime);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // num = 41, 31, 21, 11;
    // TODO
//    private int[] generateSpikeValues(int num, int low, int high) {
//        int[]  res  = new int[num];
//        int mid = num /2;
//
//        if (num % 2 == 1) {
//            res[mid] = high;
//        }
//
//        int delta = (high-low) /3;
//        int mm = mid/2;
//
//        int step = delta / mm;
//        for (int i = 0; i < mm; i ++) {
//            res[i] = low + step;
//            res[num - i -1] = res[i];
//            step += step;
//        }
//        if (mid % 2 == 1) {
//            res[mm] = high;
//            res[mm + mid + 1] = res[mm];
//        } else {
//            res[mm] = low + delta + step/2;
//            res[mm + mid - 1] = res[mm];
//        }
//        step = (delta * 2) / mm;
//        for (int i = mm + 1; i < mid; i ++) {
//            res[i] = res[mm] + step;
//            res[num - i -1] = res[i];
//            step += step;
//        }
//        return res;
//    }
    private void putCPUData(int startTime) throws SQLException {
        drop_CPU_tables();
        create_CPU_tables();
        int[][] cPUs = generateParentAndChildrenData(numberOfChildren);
        insertToCPUTotal(startTime, cPUs[0]);
        for (int i = 1; i <= numberOfChildren; i ++) {
            insertCPUDataForNode(startTime, cPUs[i], i);
        }
        selectRows("SELECT * FROM cpu_total");
        selectRows("SELECT * FROM cpu_node_1");
        selectRows("SELECT * FROM cpu_node_2");
        selectRows("SELECT * FROM cpu_node_3");
        selectRows("SELECT * FROM cpu_node_4");
    }

    public void setConnection () throws Exception {
            Class.forName("org.sqlite.JDBC");
            conn = DriverManager.getConnection("jdbc:sqlite:demo");
            System.out.println("Opened database successfully");
            System.out.println("Connection to SQLite has been established.");
    }

    private void drop_CPU_tables() throws SQLException {
        Statement stmt;
        stmt = conn.createStatement();
        stmt.executeUpdate("Drop table IF EXISTS cpu_total ");
        stmt.executeUpdate("Drop table IF EXISTS cpu_node_1");
        stmt.executeUpdate("Drop table IF EXISTS cpu_node_2");
        stmt.executeUpdate("Drop table IF EXISTS cpu_node_3");
        stmt.executeUpdate("Drop table IF EXISTS cpu_node_4");
        stmt.close();
    }

    private void create_CPU_tables() throws SQLException {
        Statement stmt;
        stmt = conn.createStatement();
        stmt.executeUpdate(createCPUTotal);
        stmt.executeUpdate(createCPUNode_1);
        stmt.executeUpdate(createCPUNode_2);
        stmt.executeUpdate(createCPUNode_3);
        stmt.executeUpdate(createCPUNode_4);
        stmt.close();
    }

    private void insertToCPUTotal(int startTime, int[] values) throws SQLException {
        System.out.println(insertCPUTotal);
        PreparedStatement stmt;
        stmt = conn.prepareStatement(insertCPUTotal);
        insertByBatch(startTime, values, stmt);
    }

    private void insertCPUDataForNode(int startTime, int[] values, int index) throws SQLException {
        PreparedStatement stmt;
        String sql = "INSERT INTO cpu_node_" + index + " values(?,?)";
        System.out.println(sql);
        stmt = conn.prepareStatement(sql);
        insertByBatch(startTime, values, stmt);
    }

    private void insertByBatch(int startTime, int[] values, PreparedStatement stmt) throws SQLException {
        for (int i = 0; i< values.length; i++) {
            stmt.setInt(1, startTime + i * 60);
            stmt.setInt(2, values[i]);
            stmt.addBatch();
        }
        stmt.executeBatch();
        stmt.close();
    }

    private void selectRows(String sql) throws SQLException {
        Statement stmt;
        stmt = conn.createStatement();

        ResultSet rs = stmt.executeQuery( sql );
        int count = 0;
        while ( rs.next() ) {
            int timestamp = rs.getInt("timestamp");
            int  value = rs.getInt("value");
            if (value > 16) {
                System.out.println("count = " + count + "; timestamp = " + timestamp + "; value = " + value);
            }
            count ++;
        }
        System.out.println(sql);
        System.out.println("total=" + count);
        rs.close();
        stmt.close();
    }

    private int[] generateSingleLineDataWithSpike() {
        int[] res = new int[total];
        int bounce = 6;
        for (int i = 0; i< startPoints; i ++) {
            res[i] = random.nextInt(bounce) + avg - bounce;
        }
        for (int i = startPoints; i < startPoints + peakPoints; i ++) {
            res [i] = spikeValues[i- startPoints] + avg;
            //System.out.println(i +"==>" + res[i]);
        }

        for (int i = startPoints + peakPoints; i < total ; i ++) {
            res[i]= random.nextInt(bounce) + avg - bounce;
        }
        return res;
    }

    private int[][] generateParentAndChildrenData(int numOfChildren) {
        int[][] groupData = new int[numOfChildren+1][total];
        groupData[0] = generateSingleLineDataWithSpike();
        for (int i = 0; i < total; i ++) {
            int[] subs = distributeDataBetweenChildren(groupData[0][i], numOfChildren);
            for (int j = 1 ; j <= numOfChildren; j ++) {
                groupData[j][i]= subs[j-1];
            }
        }
        return groupData;
    }

    private int[] distributeDataBetweenChildren(int sum, int numOfChildren) {
        int[] res = new int[numOfChildren];
        int tgt = sum/numOfChildren;
//        res[0]= tgt - tgt/numOfChildren;
//        res[1]= tgt - 2*tgt/numOfChildren;
//        res[2] = tgt + tgt/numOfChildren;
//        res[3]= tgt + 2*tgt/numOfChildren;

        if (numOfChildren % 2 == 1) {
            res[numOfChildren/2] = tgt;
        }
        int delta = tgt/numOfChildren;
        int midIndex = numOfChildren/2;
        for (int i = 0; i < numOfChildren/2; i ++) {
            res[i] = tgt - delta;
            res[midIndex + i] = tgt + delta;
            delta += delta;
        }

        return res;
    }
}



