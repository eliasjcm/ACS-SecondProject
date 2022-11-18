import mysql from 'mysql'

const dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "bd2_tp1"
});

dbConn.connect((err)=>{
    if(err) {
        console.log("Error Connecting Database!", err);
    } else {
        console.log("Database Connected Successfully!!!");
    }
});

//module.exports = dbConn;

export default dbConn