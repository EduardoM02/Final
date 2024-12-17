
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    database: 'sistemafinal',
    user: 'root',
    password : ''


});
connection.connect(function(error){
    if (error) {
        throw error;
    } else {
       console.log('connected'); 
    }

});
module.exports = connection;