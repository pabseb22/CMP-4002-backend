const mysql = require('mysql');
const { promisify } = require('util');


let connEnv = {};

connEnv = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME
}


const mysqlConnection = mysql.createPool(connEnv);

mysqlConnection.getConnection((err, connection) => {
  if (err) {
    if (err.code == 'PROTOCOL_CONNECTION_LOST') {
      console.log('DATABASE CONNECTION WAS CLOSED');
    }
    if (err.code == 'ER_CON_COUNT-ERROR') {
      console.log('DATABASE HAS TO MANY CONNECTIONS');
    }
    if (err.code == 'ECONNREFUSED') {
      console.log('DATABASE CONNECTION WAS REFUSED');
    }
  }
  if (connection) {
    connection.release(); console.log('DATABASE CONNECTION SUCCESSFUL -> ', connEnv.host);
  } else {
    console.log('CONNECTION FAILED');
  }

  return;
});

mysqlConnection.query = promisify(mysqlConnection.query);


module.exports = mysqlConnection;
