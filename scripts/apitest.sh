
curl -s -X GET \
	--user 'e2eadmin@customer1:welcome' \
	"http://patch-saas-controller.e2e.appd-test.com:8090/controller/rest/applications/ECommerce-E2E-Demo/metric-data?metric-path=Overall%20Application%20Performance%7CAverage%20Response%20Time%20%28ms%29&time-range-type=BEFORE_NOW&duration-in-mins=15&output=json&rollup=false"
