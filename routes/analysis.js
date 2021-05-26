var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");

//修改访问记录、积分（）、课程数量、专栏数量、被访问记录

//获取数据分析数据
router.get("/analysisList", async (req, res, next) => {
  let data = req.query;
  let sql;
  if (!data.user_id) {
    sql = `select * from analysis left join user on analysis.user_id = user.id`;
  } else {
    sql = `select * from analysis left join user on analysis.user_id = user.id where analysis.user_id ='${data.user_id}'`;
    lecture_sql = `select * from living_room where living_room.user_id = '${data.user_id}'`;
    channel_sql = `select * from channel where channel.user_id = '${data.user_id}'`;
  }
  let result = await sqlHandle.DB2(sql);
  let lecture_num = await sqlHandle.DB2(lecture_sql);
  let channel_num = await sqlHandle.DB2(channel_sql);

  if (result.length >= 0) {
    (result[0].lecture_num =
      lecture_num && lecture_num.length > 0 ? lecture_num.length : 0),
      (result[0].channel_num =
        channel_num && channel_num.length > 0 ? channel_num.length : 0),
      res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

//添加数据分析----历史记录
router.post("/addAnalysis", async (req, res, next) => {
  let data = req.body;
  const { visit_history, room_list, integral_surplus } = data;
  let sql = `select analysis.user_id from analysis where user_id = '${data.user_id}'`;
  let result = await sqlHandle.DB2(sql);
  console.log("语句", result, data);
  if (result.length > 0) {
    //修改记录
    let sql1 = "";
    if (visit_history) {
      sql1 = `update analysis set visit_history='${data.visit_history}' where user_id ='${data.user_id}' `;
    }
    if (room_list && integral_surplus) {
      sql1 = `update analysis set room_list='${data.room_list}',integral_surplus='${data.integral_surplus}' where user_id ='${data.user_id}' `;
    }

    let result1 = await sqlHandle.DB2(sql1);
    if (result1.affectedRows === 1) {
      res.send(commonJS.outPut(200, data, "success"));
    } else {
      res.send(commonJS.outPut(500, result1, "fail"));
    }
  } else {
    //插入记录
    let sql2 = "";
    if (visit_history) {
      sql2 = `insert into analysis (user_id,visit_history) value ('${data.user_id}','${data.visit_history}')`;
    }
    if (room_list && integral_surplus) {
      sql2 = `insert into analysis (user_id,room_list,integral_surplus) value ('${data.user_id}','${data.room_list}','${data.integral_surplus}')`;
    }
    console.log("语句", sql2);
    let result2 = await sqlHandle.DB2(sql2);
    if (result2.affectedRows === 1) {
      res.send(commonJS.outPut(200, data, "success"));
    } else {
      res.send(commonJS.outPut(500, result2, "fail"));
    }
  }
});

/**
 * @description: 编辑房间
 * @author: stephon
 * @param {type}
 * @return {type}
 */
router.post("/editAnalysis", async (req, res, next) => {
  let data = req.body;
  let sql = `update living_room set title='${data.title}',status='${data.status}',user_id='${data.user_id}' where id ='${data.id}' `;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

module.exports = router;
