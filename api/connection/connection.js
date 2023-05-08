const mysql = require('mysql');
const { promisify } = require('util');
const fs = require('fs');

let connEnv = {};

if (process.env.NODE_ENV === 'development') {
  connEnv = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME
  }
}

if (process.env.NODE_ENV === 'production') {
  connEnv = {
    host: process.env.PROD_DATABASE_HOST,
    user: process.env.PROD_DATABASE_USER,
    port: process.env.PROD_DATABASE_PORT,
    password: process.env.PROD_DATABASE_PASS,
    database: process.env.PROD_DATABASE_NAME
  }
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
    connection.release(); console.log('DB is Connected -> ',connEnv.host);
  } else {
    console.log('Not possible');
  }

  return;
});

mysqlConnection.query = promisify(mysqlConnection.query);


module.exports = mysqlConnection;
