package util;



import java.sql.*;
import java.text.ParseException;
import java.util.Random;

public class SimpleGenerator {
    static Random random = new Random();

    static int[] overAllSpikeErrors = {
            10, 25, 35, 45, 55,
            65, 75, 85, 95, 105,
            115, 125, 145, 165, 185,
            200, 210, 225, 250, 300};
    static int[] spikeErrors_40 = {
            4,10,14,18,22,
            26,30,34,38,42,
            46,50,58,66,74,
            80,84,90,100,120};
    static int[] spikeErrors_50 = {
            5,12,17,22,27,
            32,37,42,47,52,
            57,62,72,82,92,
            100,105,112,125,150};

    static int[] dropValues = {
            8, 10, 12, 13, 14,
            15, 16, 17, 18, 20,
            22, 24, 25, 26, 27,
            30, 35, 40, 46, 50};

    static int total = 60 * 24 * 14;   // two week data, 1 entry per minute
    static int spikeStartPoints = 60 * 24 * 13 + 60 * 12; // spike start 13th day

    static String createTable = "create Table metrics (metricpath TEXT not null, timestamp BIGINT not null, value double not null)";

    static String insertSql = "INSERT INTO metrics values(?,?,?)";
    static Connection conn;

    public static void main(String[] args) throws ParseException {
        SimpleGenerator generator = new SimpleGenerator();

        long startTime = total * 60 * 1000 - 60000;
//        for (int i =0 ; i < overAllSpikeErrors.length; i++) {
//            System.out.print((int) (overAllSpikeErrors[i]* 0.50) +",");
//        }
        try {
            generator.setConnection();
            generator.dropTable();
            generator.createTable();

            // create revenue data
            generator.putRevenueData(startTime);
            generator.putRevenueFutureData(startTime);
            // response time
            generator.putResponseData(startTime);
             // insert internal error
            generator.putInternalErrorData(startTime);
            generator.putInternalErrorFutureData(startTime);
//            // create cpu data
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
                "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|Overall",
                "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|By Error Code|INVENTORY_CHECK_FAILED|Overall",
                "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|By Error Code|INVENTORY_SUBMIT_FAILED|Overall",
                "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|By Error Code|UNKNOWN_ITEM|Overall",
                "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|By Error Code|PAYMENT_CHECK_FAILED|Overall",
                "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|By Error Code|ORDER_SUBMIT_FAILED|Overall",
                "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|By Error Code|FREIGHT_SUBMIT_FAILED|Overall"};
        double[][] values = generateInternalData(names.length -1);
        for (int i = 0; i < names.length; i++) {
            insertMetricsData(startTime, values[i], names[i]);
        }
    }

    private void putInternalErrorFutureData(long startTime) throws SQLException {
        double[] values = generateOverallInternalErrorFuture();
        insertMetricsData(startTime, values, "Application Infrastructure Performance|E-Commerce|Custom Metrics|Checkout|INTERNAL_ERRORs|Overall_FUTURE");
    }

    private double[] generateOverallInternalErrorFuture() {
        double normalValue=20;
        double[] res = new double[total];
        int bounce = 6;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = normalValue +random.nextInt(bounce);
        }
        for (int i = spikeStartPoints; i < spikeStartPoints + 20; i ++) {
            res [i] = overAllSpikeErrors[i- spikeStartPoints] + normalValue;
            //System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + 20; i < total -20 ; i ++) {
            res[i]= res[spikeStartPoints + 20 -1] + random.nextInt(bounce) * 2 ;
        }
        int top = 260;
        int count = 0;
        for (int i = total-20; i < total -15; i ++) {
            res[i] = top - count * 25 * 2 +random.nextInt(bounce) * 1.5;
            count ++;
        }
        for (int i = total-15; i < total; i ++) {
            res[i] = normalValue + random.nextInt(bounce/2);;
        }
        return res;


    }


    private void putCPUData(long startTime) throws SQLException {
        String[] names = {
            "Application Infrastructure Performance|Inventory|Hardware Resources|MAX_CPU|%Busy",
            "Application Infrastructure Performance|Inventory|Individual Nodes|node-1|Hardware Resources|MAX_CPU|%Busy",
            "Application Infrastructure Performance|Inventory|Individual Nodes|node-2|Hardware Resources|MAX_CPU|%Busy"};
            // ,
            // "Application Infrastructure Performance|Inventory|Individual Nodes|node-3|Hardware Resources|MAX_CPU|%Busy",
            // "Application Infrastructure Performance|Inventory|Individual Nodes|node-4|Hardware Resources|MAX_CPU|%Busy"
        double[][] cPUs = generateCPUDatas(names.length -1);

        for (int i = 0; i < names.length; i ++) {
            insertMetricsData(startTime, cPUs[i], names[i]);
        }

    }

    private void putRevenueData(long startTime) throws  SQLException {
        double[] values = generateCheckoutPurchase();
        insertMetricsData(startTime, values, "Information Points|Checkout|Purchase £");
    }

    private void putRevenueFutureData(long startTime) throws  SQLException {
        double[] values = generateCheckoutPurchaseFuture();
        insertMetricsData(startTime, values, "Information Points|Checkout|Purchase £_FUTURE");
    }

    private void putResponseData(long startTime) throws  SQLException {
        double[] values = generateResponse();
        insertMetricsData(startTime, values, "Transactions|E-Commerce|Checkout|Average Response Time (ms)");
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
            count ++;
        }
        System.out.println(sql);
        System.out.println("total=" + count);
        rs.close();
        stmt.close();
    }

    private double[] generateInternalErrorData(int[] spikeValues, boolean isOverAll) {
        double normalValue= isOverAll? 15 : 0;
        double[] res = new double[total];
        int bounce = 6;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = normalValue + random.nextInt(bounce);
        }
        for (int i = spikeStartPoints; i < spikeStartPoints + 20; i ++) {
            res [i] = spikeValues[i- spikeStartPoints];
            //System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + 20; i < total ; i ++) {
            res[i]= res[spikeStartPoints + 20 -1] + random.nextInt(bounce) * 3;
        }
        return res;
    }

    private double[] generateResponse() {
        double normalValue = 50;
        double[] res = new double[total];
        int bounce = 20;
        for (int i = 0; i< total; i ++) {
            res[i] = random.nextInt(bounce) + normalValue + random.nextInt(bounce);
        }
//        for (int i = spikeStartPoints; i < spikeStartPoints + 20; i ++) {
//            res [i] = normalValue + dropValues[i- spikeStartPoints] * 10;
//            //     System.out.println(i +"==>" + res[i]);
//        }
//
//        for (int i = spikeStartPoints + 20; i < total ; i ++) {
//            res[i]= random.nextInt(bounce) + res[spikeStartPoints + 20 -1];
//        }
        return res;
    }

    private double[] generateCheckoutPurchase() {
        double normalValue = 560;
        double[] res = new double[total];
        int bounce = 50;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = random.nextInt(bounce) * 1.5 + normalValue;
        }
        for (int i = spikeStartPoints; i < spikeStartPoints + 20; i ++) {
            res [i] = normalValue - dropValues[i- spikeStartPoints] * 8;
       //     System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + 20; i < total ; i ++) {
            res[i]= random.nextInt(bounce) + res [spikeStartPoints + 20 -1];
        }
        return res;
    }

    private double[] generateCheckoutPurchaseFuture() {
        double normalValue = 560;
        double[] res = new double[total];
        int bounce = 60;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = random.nextInt(bounce) *1.5+ normalValue;
        }
        for (int i = spikeStartPoints; i < spikeStartPoints + 20; i ++) {
            res [i] = normalValue - dropValues[i- spikeStartPoints] * 8;
      //      System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + 20; i < total -20; i ++) {
            res[i]= random.nextInt(bounce) + res [spikeStartPoints + 20 -1];
        }
        int lost = 400;
        int count = 0;
        for (int i = total-20; i < total-10; i ++) {
            res[i]= random.nextInt(bounce) + normalValue - lost + count * 40 ;
            count ++;
        }

        for (int i = total-10; i < total; i ++) {
            res[i]= random.nextInt(bounce) + normalValue;
        }
        return res;
    }

    private double[][] generateCPUDatas(int numOfChildren) {
        double[][] groupData = new double[numOfChildren+1][total];
        groupData[0] = generateCPUData(90, 194);
        groupData[1] = generateCPUData(48, 95);
        groupData[2] = generateCPUData(52, 93);
        // groupData[3] = generateCPUData(50, 60);
        // groupData[4] = generateCPUData(55, 65);

        return groupData;
    }

    private double[] generateCPUData(int lowValue, int peakValue) {
        double normalValue = lowValue;
        double[] res = new double[total];
        int bounce = 10;
        for (int i = 0; i< spikeStartPoints; i ++) {
            res[i] = random.nextInt(bounce) + normalValue;
        }
        int count = 0;
        for (int i = spikeStartPoints; i < spikeStartPoints + 20; i ++) {
            res [i] = lowValue + count * (peakValue - lowValue)/20;
            count ++;
            //     System.out.println(i +"==>" + res[i]);
        }

        for (int i = spikeStartPoints + 20; i < total ; i ++) {
            res[i]= random.nextInt(bounce) + res [spikeStartPoints + 20 -1];
            res[i] = res[i] > 200 ? 200 : res[i];
        }
        return res;
    }

    private double[][] generateInternalData(int numOfChildren) {
        double[][] groupData = new double[numOfChildren+1][total];
        groupData[0] = generateInternalErrorData(overAllSpikeErrors, true);
        groupData[1] = generateInternalErrorData(spikeErrors_40, false );
        groupData[2] = generateInternalErrorData(spikeErrors_50, false);
        for (int i = 0; i < total; i ++) {
            groupData[3][i]= random.nextInt(10) ;
            groupData[4][i]= 15 - groupData[3][i];
        }

        return groupData;
    }


}
