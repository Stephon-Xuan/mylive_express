var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");

// sql2 = `update trainees set watch_time='${data.watch_time}'`;
// 编辑考核
router.post("/addExamine", async (req, res, next) => {
  let data = req.body;
  if (data.examine_id) {
    let sql = `update examine set examine_list='${data.examine_list}' where examine_id = '${data.examine_id}'`;
    let result = await sqlHandle.DB2(sql);
    if (result.affectedRows == 1) {
      res.send(commonJS.outPut(200, data, "success"));
    } else {
      res.send(commonJS.outPut(500, result, "fail"));
    }
  } else {
    let sql = `insert into examine (room_id,examine_list) values ('${data.room_id}','${data.examine_list}')`;
    let result = await sqlHandle.DB2(sql);
    if (result.affectedRows == 1) {
      res.send(commonJS.outPut(200, data, "success"));
    } else {
      res.send(commonJS.outPut(500, result, "fail"));
    }
  }
});

//查看考核信息
router.get("/getExamineInfo", async (req, res, next) => {
  let data = req.query;
  let sql = `select * from examine where room_id = '${data.room_id}' limit 1`;
  let result = await sqlHandle.DB2(sql);
  if (result.length == 1) {
    res.send(commonJS.outPut(200, result[0], "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

// 删除与直播间绑定的考核题目
router.get("/deleteExamine", async (req, res, next) => {
  let data = req.query;
  let sql = `delete from examine WHERE examine_id = '${data.examine_id}'`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, "删除成功", "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

module.exports = router;
