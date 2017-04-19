package util;



import java.sql.*;
import java.text.ParseException;
import java.util.Random;

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

    static String createTable = "create Table metrics (metricpath TEXT not null, timestamp BIGINT not null, value int not null)";

    static String insertSql = "INSERT INTO metrics values(?,?,?)";
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
      //  long curTime = System.currentTimeMillis();
        long startTime = total * 60 * 1000 - 60000;

        try {
            generator.setConnection();
            generator.dropTable();
            generator.createTable();
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
    private void putCPUData(long startTime) throws SQLException {

        int[][] cPUs = generateParentAndChildrenData(numberOfChildren);
        insertToCPUTotal(startTime, cPUs[0]);
//        String[] names = {
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-175|Hardware Resources|CPU|%Busy",
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-197|Hardware Resources|CPU|%Busy",
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-76|Hardware Resources|CPU|%Busy",
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-51|Hardware Resources|CPU|%Busy",
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-85|Hardware Resources|CPU|%Busy",
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-91|Hardware Resources|CPU|%Busy",
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-2-128|Hardware Resources|CPU|%Busy",
//                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-2-239|Hardware Resources|CPU|%Busy"
//        };
//        for (int i = 1; i <= numberOfChildren; i ++) {
//            insertCPUDataForNode(startTime, cPUs[i], names[i-1]);
//        }
        selectRows("SELECT * FROM metrics");

    }

    public void setConnection () throws Exception {
            Class.forName("org.sqlite.JDBC");
            conn = DriverManager.getConnection("jdbc:sqlite:demo");
            System.out.println("Opened database successfully");
            System.out.println("Connection to SQLite has been established.");
    }

    private void dropTable() throws SQLException {
        Statement stmt;
        stmt = conn.createStatement();
        stmt.executeUpdate("Drop table IF EXISTS metrics");
        stmt.close();
    }

    private void createTable() throws SQLException {
        Statement stmt;
        stmt = conn.createStatement();
        stmt.executeUpdate(createTable);
        stmt.close();
    }

    private void insertToCPUTotal(long startTime, int[] values) throws SQLException {
        System.out.println(insertSql);
        PreparedStatement stmt;
        stmt = conn.prepareStatement(insertSql);
        insertByBatch(startTime, values, stmt,"Application Infrastructure Performance|lemminghost|Hardware Resources|CPU|%Busy" );
    }

    private void insertCPUDataForNode(long startTime, int[] values, String name) throws SQLException {
        PreparedStatement stmt;
        stmt = conn.prepareStatement(insertSql);
        insertByBatch(startTime, values, stmt, name);
    }

    private void insertByBatch(long startTime, int[] values, PreparedStatement stmt, String metricsPath) throws SQLException {
        for (int i = 0; i< values.length; i++) {
            stmt.setString(1, metricsPath);
            stmt.setLong(2, startTime - i * 60 * 1000);
            stmt.setInt(3, values[i]);
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
            String name = rs.getString("metricpath");
            long timestamp = rs.getLong("timestamp");
            int  value = rs.getInt("value");
            //if (value > 16) {
                System.out.println("name = " + name + "; timestamp = " + timestamp + "; value = " + value);
            //}
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



