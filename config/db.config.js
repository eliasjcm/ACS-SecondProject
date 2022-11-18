import mysql from 'mysql'

const dbConn = mysql.createConnection({
    host: "general.mysql.database.azure.com",
    user: "acs",
    password: "acs1234",
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