var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");

//新建专栏
router.post("/addChannel", async (req, res, next) => {
  let data = req.body;
  let sql = `insert into channel (channel_name,user_id) value ('${data.channel_name}','${data.user_id}')`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

//编辑专栏
router.post("/editChannel", async (req, res, next) => {
  let data = req.body;
  let sql = `update channel set channel_name='${data.channel_name}' where channel_id ='${data.channel_id}' `;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

// 获取专栏列表
router.get("/channelList", async (req, res, next) => {
  let data = req.query;
  let sql = `select channel.channel_id , channel.channel_name , channel.user_id , channel.room_id from channel left join living_room on channel.room_id = living_room.id where channel.user_id = '${data.user_id}' `;
  let result = await sqlHandle.DB2(sql);
  if (result.length >= 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

router.get("/deleteChannel", async (req, res, next) => {
  let data = req.query;
  console.log("获取的专栏id", data.channel_id);
  //删除专栏下的直播间（TODO）

  //删除专栏
  let sql = `delete from channel WHERE channel_id = '${data.channel_id}'`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    let resultData = {};
    res.send(commonJS.outPut(200, resultData, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

// 获取专栏信息
router.get("/channelDetail", async (req, res, next) => {
  let data = req.query;
  let sql = `select channel.channel_id,channel.channel_name, channel.user_id, user.name,user.avatar,user.email from channel left join user on channel.user_id = user.id  where channel_id = '${data.channel_type}' and user_id = '${data.user_id}'`;
  let result = await sqlHandle.DB2(sql);
  if (result.length == 1) {
    // let resultData = {
    //   ...result[0],
    //   room_id: data.id,
    // };
    res.send(commonJS.outPut(200, { ...result[0] }, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});
module.exports = router;
