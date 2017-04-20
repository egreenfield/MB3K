var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('../util/demo.db');

db.serialize(function() {
   db.each("SELECT count(*) from metrics", function(err, row) {
       console.log(row);
    });

});
db.close();
