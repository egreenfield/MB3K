package util;



import java.sql.*;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Random;

public class SimpleGenerator {
    static Random random = new Random();

    static int[] spikeValues = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 40, 46, 80,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};

    static int total = 60 * 24 * 14;   // two week data, 1 entry per minute
    static int startPoints = 60 * 24 * 12; // spike start 13th day
    static int peakPoints = 41;   // 41 mins spike
    static int avg = 20;   // normal value
    static int numberOfChildren = 8;

    static String createTable = "create Table metrics (metricpath TEXT not null, timestamp BIGINT not null, value double not null)";

    static String insertSql = "INSERT INTO metrics values(?,?,?)";
    static Connection conn;

    public static void main(String[] args) throws ParseException {
        SimpleGenerator generator = new SimpleGenerator();
    //    int[] r = generator.generateSpikeValues(5, 1, 30);
    //  System.out.println(Arrays.toString(generator.distributeDataBetweenChildren(20, 8)));

        long startTime = total * 60 * 1000 - 60000;

        try {
            generator.setConnection();
            generator.dropTable();
            generator.createTable();
            // create cpu data
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
    private int[] generateSpikeValues(int num, int low, int high) {
        int[]  res  = new int[num];
        return res;
    }
    private void putCPUData(long startTime) throws SQLException {
        double[][] cPUs = generateParentAndChildrenData(numberOfChildren);
        insertToCPUTotal(startTime, cPUs[0]);
        String[] names = {
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-175|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-197|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-76|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-51|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-85|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-91|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-2-128|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-2-239|Hardware Resources|CPU|%Busy"
        };
        for (int i = 1; i <= numberOfChildren; i ++) {
            insertCPUDataForNode(startTime, cPUs[i], names[i-1]);
        }
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

    private void insertToCPUTotal(long startTime, double[] values) throws SQLException {
        System.out.println(insertSql);
        PreparedStatement stmt;
        stmt = conn.prepareStatement(insertSql);
        insertByBatch(startTime, values, stmt,"Application Infrastructure Performance|lemminghost|Hardware Resources|CPU|%Busy" );
    }

    private void insertCPUDataForNode(long startTime, double[] values, String name) throws SQLException {
        PreparedStatement stmt;
        stmt = conn.prepareStatement(insertSql);
        insertByBatch(startTime, values, stmt, name);
    }

    private void insertByBatch(long startTime, double[] values, PreparedStatement stmt, String metricsPath) throws SQLException {
        for (int i = 0; i< values.length; i++) {
            stmt.setString(1, metricsPath);
            stmt.setLong(2, startTime - i * 60 * 1000);
            stmt.setDouble(3, values[i]);
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
            if (value > avg) {
                System.out.println("name = " + name + "; timestamp = " + timestamp + "; value = " + value);
            }
            count ++;
        }
        System.out.println(sql);
        System.out.println("total=" + count);
        rs.close();
        stmt.close();
    }

    private double[] generateSingleLineDataWithSpike() {
        double[] res = new double[total];
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

    private double[][] generateParentAndChildrenData(int numOfChildren) {
        double[][] groupData = new double[numOfChildren+1][total];
        groupData[0] = generateSingleLineDataWithSpike();
        for (int i = 0; i < total; i ++) {
            double[] subs = distributeDataBetweenChildren(groupData[0][i], numOfChildren);
            for (int j = 1 ; j <= numOfChildren; j ++) {
                groupData[j][i]= subs[j-1];
            }
        }
        return groupData;
    }

    private double[] distributeDataBetweenChildren(double sum, int numOfChildren) {
        double[] res = new double[numOfChildren];
        double tgt = sum/numOfChildren;

        if (numOfChildren % 2 == 1) {
            res[numOfChildren/2] = tgt;
        }
        double delta = 0.7 * tgt/(numOfChildren);
        // int midIndex = numOfChildren/2;
        for (int i = 0; i < numOfChildren/2; i ++) {
            res[i] = tgt - delta;
            res[numOfChildren -1 - i] = tgt + delta;
            delta += delta;
        }

        return res;
    }
}



