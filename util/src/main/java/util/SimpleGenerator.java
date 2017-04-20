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
            30, 35, 40, 46, 80,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};

    static int[] dropValues = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 40, 46, 80,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};

    static int[] spikeCPUValues_0 = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 40, 46, 78,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};

    static int[] spikeCPUValues_1 = {
            1, 1, 1, 2, 2,
            2, 3, 4, 6, 7,
            10, 14, 17, 20, 25,
            28, 32, 38, 44, 76,
            44, 41, 33, 28, 25,
            20, 16, 15, 10, 7,
            6, 5, 4,3,3,
            3, 2, 1, 1,1, 1};
    static int[] spikeCPUValues_2 = {
            1, 1, 2, 2, 3,
            3, 3, 3, 4, 5,
            11, 15, 18, 23, 26,
            29, 33, 37, 45, 75,
            45, 43, 32, 29, 24,
            21, 17, 16, 11, 8,
            7, 6, 5,3,3,
            3, 2, 2, 1,1, 1};
    static int[] spikeCPUValues_3 = {
            1, 1, 1, 2, 4,
            5, 6, 7, 8, 10,
            12, 13, 19, 20, 25,
            31, 33, 40, 46, 76,
            47, 44, 35, 31, 26,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};
    static int[] spikeCPUValues_4 = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 43, 45, 76,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};
    static int[] spikeCPUValues_5 = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 40, 46, 75,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};
    static int[] spikeCPUValues_6 = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 40, 46, 74,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};
    static int[] spikeCPUValues_7 = {
            1, 2, 2, 2, 3,
            3, 4, 5, 7, 9,
            12, 15, 18, 22, 27,
            30, 35, 40, 46, 73,
            46, 43, 35, 30, 27,
            22, 18,15, 12, 9,
            7, 6, 5,4,4,
            3, 3, 2, 1,1, 1};
    static int[][] spikeCPUValues = {
            spikeCPUValues_0,
            spikeCPUValues_1,
            spikeCPUValues_2,
            spikeCPUValues_3,
            spikeCPUValues_4,
            spikeCPUValues_5,
            spikeCPUValues_6,
            spikeCPUValues_7};
    static int total = 60 * 24 * 14;   // two week data, 1 entry per minute
    static int spikeStartPoints = 60 * 24 * 12; // spike start 13th day
    static int peakPoints = 41;   // 41 mins spike
    static int avg = 20;   // normal value
    static int numberOfChildren = 8;

    static String createTable = "create Table metrics (metricpath TEXT not null, timestamp BIGINT not null, value double not null)";

    static String insertSql = "INSERT INTO metrics values(?,?,?)";
    static Connection conn;

    public static void main(String[] args) throws ParseException {
        SimpleGenerator generator = new SimpleGenerator();
    //    int[] r = generator.generateSpikeValues(5, 1, 30);
//      System.out.println(Arrays.toString(generator.distributeDataBetweenChildrenWhenSpike(20, 8)));

        long startTime = total * 60 * 1000 - 60000;

        try {
            generator.setConnection();
            generator.dropTable();
            generator.createTable();

            // create revenue data
            generator.putRevenueData(startTime);
            // insert internal error
            generator.putInternalErrorData(startTime);
            // create cpu data
            generator.putCPUData(startTime);

            generator.selectRows("SELECT * FROM metrics");
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

    private void putInternalErrorData(long startTime) throws SQLException {

        String[] names = {
                "Application Infrastructure Performance|shepherd|Custom Metrics|Synthetic|Shepherd|Sessions|Failed|By session status|INTERNAL_ERROR|Overall",
                "Application Infrastructure Performance|shepherd|Custom Metrics|Synthetic|Shepherd|Sessions|Failed|By session status|INTERNAL_ERROR|By error code|FAILED_TO_START_SANDBOX|Overall",
                "Application Infrastructure Performance|shepherd|Custom Metrics|Synthetic|Shepherd|Sessions|Failed|By session status|INTERNAL_ERROR|By error code|AGENT_FAILED_TO_POST_RESULT|Overall",
                "Application Infrastructure Performance|shepherd|Custom Metrics|Synthetic|Shepherd|Sessions|Failed|By session status|INTERNAL_ERROR|By error code|EMPTY_HAR|Overall",
                "Application Infrastructure Performance|shepherd|Custom Metrics|Synthetic|Shepherd|Sessions|Failed|By session status|INTERNAL_ERROR|By error code|FETCH_HAR_ERROR|Overall",
        };
        double[][] values = generateParentAndChildrenInternalDataWithSpike(names.length -1);
        for (int i = 0; i < names.length; i++) {
            insertMetricsData(startTime, values[i], names[i]);
        }
    }
       // num = 41, 31, 21, 11;
    // TODO
    private int[] generateSpikeValues(int num, int low, int high) {
        int[]  res  = new int[num];
        return res;
    }
    private void putCPUData(long startTime) throws SQLException {
        String[] names = {
                "Application Infrastructure Performance|lemminghost|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-175|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-197|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-0-76|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-51|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-85|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-1-91|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-2-128|Hardware Resources|CPU|%Busy",
                "Application Infrastructure Performance|lemminghost|Individual Nodes|ip-10-130-2-239|Hardware Resources|CPU|%Busy"
        };
        double[][] cPUs = generateParentAndChildrenCPUDataWithSpike(names.length -1);

        for (int i = 0; i < names.length; i ++) {
            insertMetricsData(startTime, cPUs[i], names[i]);
        }

    }

    private void putRevenueData(long startTime) throws  SQLException {
        double[] values = generateSingleLineDataWithDrop();
        insertMetricsData(startTime, values, "Custom Metrics|Revenue|Overall");
    }
    public void setConnection () throws Exception {
            Class.forName("org.sqlite.JDBC");
            conn = DriverManager.getConnection("jdbc:sqlite:demo.db");
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

    private void insertMetricsData(long startTime, double[] values, String name) throws SQLException {
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
            if (count % 100 == 0) {
                System.out.println("name = " + name + "; timestamp = " + timestamp + "; value = " + value);
            }
            count ++;
        }
        System.out.println(sql);
        System.out.println("total=" + count);
        rs.close();
        stmt.close();
    }

    private double[] generateSingleLineCPUDataWithSpike(int[] sValues) {
        double[] res = new double[total];
        int bounce = 6;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = random.nextInt(bounce) + avg - bounce;
        }
        for (int i = spikeStartPoints; i < spikeStartPoints + peakPoints; i ++) {
            res [i] = sValues[i- spikeStartPoints] + avg;
            //System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + peakPoints; i < total ; i ++) {
            res[i]= random.nextInt(bounce) + avg - bounce;
        }
        return res;
    }

    private double[] generateSingleLineInternalErrorDataWithSpike() {
        double normalValue=10;
        double[] res = new double[total];
        int bounce = 6;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = random.nextInt(bounce) + normalValue - bounce;
        }
        for (int i = spikeStartPoints; i < spikeStartPoints + peakPoints; i ++) {
            res [i] = spikeValues[i- spikeStartPoints] * 20 + normalValue;
            //System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + peakPoints; i < total ; i ++) {
            res[i]= random.nextInt(bounce) + normalValue - bounce;
        }
        return res;
    }

    private double[] generateSingleLineDataWithDrop() {
        double normalValue = 30000;
        double[] res = new double[total];
        int bounce = 5000;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = random.nextInt(bounce) + normalValue - bounce;
        }
        for (int i = spikeStartPoints; i < spikeStartPoints + peakPoints; i ++) {
            res [i] =  normalValue - dropValues[i- spikeStartPoints] * 200;
            //System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + peakPoints; i < total ; i ++) {
            res[i]= random.nextInt(bounce) + normalValue - bounce;
        }
        return res;
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

    private double[][] generateParentAndChildrenCPUDataWithSpike(int numOfChildren) {
        double[][] groupData = new double[numOfChildren+1][total];
        for (int i = 1; i <= numOfChildren; i ++) {
            groupData[i] = generateSingleLineCPUDataWithSpike(spikeCPUValues[i-1]);
        }

        for (int i = 0; i < total; i ++) {
            groupData[0][i] = 0;
            for (int j = 1; j<= numOfChildren ; j ++) {
                groupData[0][i] += groupData[j][i];
            }
        }

        return groupData;
    }
    private double[][] generateParentAndChildrenInternalDataWithSpike(int numOfChildren) {
        double[][] groupData = new double[numOfChildren+1][total];
        groupData[0] = generateSingleLineInternalErrorDataWithSpike();
        for (int i = 0; i < spikeStartPoints; i ++) {
            double[] subs = distributeDataBetweenChildren(groupData[0][i], numOfChildren);
            for (int j = 1 ; j <= numOfChildren; j ++) {
                groupData[j][i]= subs[j-1];
            }
        }

        for (int i = spikeStartPoints; i < spikeStartPoints + peakPoints; i++) {
            double[] subs = distributeDataBetweenChildrenWhenSpike(groupData[0][i], numOfChildren);
            for (int j = 1 ; j <= numOfChildren; j ++) {
                groupData[j][i]= subs[j-1];
            }
        }

        for (int i = spikeStartPoints + peakPoints; i < total ; i++) {
            double[] subs = distributeDataBetweenChildren(groupData[0][i], numOfChildren);
            for (int j = 1 ; j <= numOfChildren; j ++) {
                groupData[j][i]= subs[j-1];
            }
        }

        return groupData;
    }

    private double[] distributeDataBetweenChildrenWhenSpike(double sum, int numOfChildren) {
        double[] res = new double[numOfChildren];
        if (numOfChildren == 1) {
            res[0]=sum;
            return res;
        }
        res[0] = sum *0.35;
        if (numOfChildren == 2) {
            res[numOfChildren-1]=sum * 0.65;
            return res;
        } else {
            res[numOfChildren-1]= sum * 0.4;
        }

        double tgt = sum *0.25/(numOfChildren -2);

        if (numOfChildren % 2 == 1) {
            res[numOfChildren/2] = tgt;
        }
        double delta = 0.7 * tgt/(numOfChildren);

        for (int i = 1; i < numOfChildren/2; i ++) {
            res[i] = tgt - delta;
            res[numOfChildren -1 - i] = tgt + delta;
            delta += delta;
        }

        return res;
    }
}



