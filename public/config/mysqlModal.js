//mysqlModal.js
//初始化数据库配置
//test666
const mysql = require("mysql");

const mysqlConf = {
  db1: {
    host: "127.0.0.1",
    user: "root",
    password: "test",
    database: "test",
    port: 3306,
  },
  db2: {
    host: "localhost",
    user: "root",
    password: "123456",
    database: "living",
    port: 3306,
  },
};
function sqlConnect(sql, sqlArr, callBack) {
  try {
    var pool = mysql.createPool(mysqlConf.db2);
    pool.getConnection(function (err, conn) {
      console.log("123");
      if (err) {
        console.log("连接失败");
        return;
      }
      conn.query(sql, sqlArr, callBack);
      conn.release();
    });
  } catch (e) {
    console.log("错误", e);
  }
}

//封装数据库sql操作
async function DB1(sql) {
  var mysql = require("mysql");
  var pool = mysql.createPool(mysqlConf.db1);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log(err);
      } else {
        conn.query(sql, function (err, results, fields) {
          //事件驱动回调
          if (err) {
            resolve(err);
          } else {
            resolve(results);
          }
        });
        //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
        conn.release();
      }
    });
  });
}
async function DB2(sql) {
  var mysql = require("mysql");
  var pool = mysql.createPool(mysqlConf.db2);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log(err);
      } else {
        conn.query(sql, function (err, results, fields) {
          //事件驱动回调
          if (err) {
            resolve(err);
          } else {
            resolve(results);
          }
        });
        //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
        conn.release();
      }
    });
  });
}

const main_url = "http://localhost:8512";

module.exports = { DB1, DB2, sqlConnect, main_url };
