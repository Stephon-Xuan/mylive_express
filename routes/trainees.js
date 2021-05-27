var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");

router.post("/editTrainees", async (req, res, next) => {
  let data = req.body;

  let sql2 = "";

  //room_id和user_id都有
  if (data.watch_time) {
    sql2 = `update trainees set watch_time='${data.watch_time}'`;
  }

  if (data.stu_answer) {
    sql2 = `update trainees set stu_answer='${data.stu_answer}'`;
  }

  if (data.score) {
    sql2 = `update trainees set score='${data.score}'`;
  }

  //假设都绑定了，则插入信息
  let sql =
    sql2 +
    `where trainees.room_id='${data.room_id}' and trainees.user_id='${data.user_id}'`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

//获取学员信息
router.get("/getTraineesInfo", async (req, res, next) => {
  let data = req.query;
  let sql = `select * from trainees left join user on trainees.user_id = user.id where room_id = '${data.room_id}'`;
  let result = await sqlHandle.DB2(sql);
  if (result.length > 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

//学员获取学员信息
router.get("/getUserTraineesInfo", async (req, res, next) => {
  let data = req.query;
  let sql = `select * from trainees left join user on trainees.user_id = user.id where room_id = '${data.room_id}' and user_id = '${data.user_id}'`;
  let result = await sqlHandle.DB2(sql);
  if (result.length > 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

// 直播间与学员绑定
router.post("/bindTraninees", async (req, res, next) => {
  let data = req.body;
  //如果绑定了，则插入信息
  let sql = `select * from trainees where room_id = '${data.room_id}' and user_id = '${data.user_id}' limit 1`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, result, "success"));
    return;
  }
  let is_sql = `insert into trainees (room_id,user_id) values ('${data.room_id}','${data.user_id}')`;
  let result2 = await sqlHandle.DB2(is_sql);
  if (result2.affectedRows == 1) {
    let sql = `select * from trainees where room_id = '${data.room_id}' and user_id = '${data.user_id}' limit 1`;
    let result3 = await sqlHandle.DB2(sql);
    res.send(commonJS.outPut(200, result3, "success"));
    return;
  }
  res.send(commonJS.outPut(500, result, "fail"));
});

module.exports = router;
