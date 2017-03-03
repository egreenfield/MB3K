curl -X POST \
 "http://localhost:8080/api/events/query" \
 -H"X-Events-API-AccountName:customer1_23efd6e2-df72-4833-9e06-3ec32e9c951f" \
 -H"X-Events-API-Key:52dfcafc-5672-44ac-94a6-8dc78027ec3f" \
 -H"Content-type: application/vnd.appd.events+text;v=1" \
 -d'SELECT transactionName AS "Business Transaction", count(segments.errorList.errorCode) AS "Error Code (Count)" FROM transactions' \
 | python -m json.tool


