var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('/Users/meili.wang/projects/hackathon/MB3K/server/demo');

db.serialize(function() {
   db.each("SELECT * from cpu_total", function(err, row) {
       console.log(row);
    });

});
db.close();
