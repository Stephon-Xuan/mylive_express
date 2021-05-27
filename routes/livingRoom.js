var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");

/**
 * @description: 获取直播间列表，且支持搜索
 * @author: stephon
 * @param {type}
 * @return {type}
 */
router.get("/roomList", async (req, res, next) => {
  let data = req.query;
  let sql;
  // left join analysis on living_room.user_id = analysis.user_id
  if (!data.keyword) {
    sql = `select living_room.*,type.type_name,user.avatar,user.name,user.email,user.sex from living_room left join user on living_room.user_id = user.id  
      left join type on living_room.type = type.type_id
      where living_room.status != 0 ORDER BY living_room.id`;
  } else {
    sql = `select living_room.*,type.type_name,user.avatar,user.name,user.email,user.sex from living_room left join user on living_room.user_id = user.id 
      left join type on living_room.type = type.type_id
    where title like '%${data.keyword}%' or user.name like '%${data.keyword}%' and living_room.status !=0 limit 20`;
  }
  let result = await sqlHandle.DB2(sql);
  if (result.length >= 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 根据类型获取直播间列表  跟上面的接口可以弄成一份,前端做一下用户过滤吧
 * @author: stephon
 * @param {type}
 * @return {type}
 */
router.get("/roomListByType", async (req, res, next) => {
  let data = req.query;
  let sql;
  if (data.type) {
    sql = `select *,type.type_name from living_room left join user on living_room.user_id = user.id left join type on living_room.type = type.type_id  where type = '${data.type}' and living_room.status !=0 limit 20`;
  } else if (data.channel_type && data.user_id) {
    //用户类型与用户
    sql = `select *,type.type_name from living_room left join user on living_room.user_id = user.id left join type on living_room.type = type.type_id where channel_type = '${data.channel_type}' and living_room.user_id = '${data.user_id}' and living_room.status !=0 limit 20`;
  } else if (data.channel_type) {
    sql = `select *,type.type_name from living_room left join user on living_room.user_id = user.id left join type on living_room.type = type.type_id where channel_type = '${data.channel_type}' and living_room.status !=0 limit 20`;
  } else if (data.user_id) {
    //单纯是用户
    sql = `select *,type.type_name from living_room left join user on living_room.user_id = user.id left join type on living_room.type = type.type_id where living_room.user_id = '${data.user_id}' and living_room.status !=0 limit 20`;
  } else {
    sql = `select *,type.type_name from living_room left join user on living_room.user_id = user.id left join type on living_room.type = type.type_id where living_room.status != 0`;
  }
  let result = await sqlHandle.DB2(sql);
  if (result.length >= 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

// 获取直播间类型
router.get("/roomTypeList", async (req, res, next) => {
  let data = req.query;
  let sql = `select type.type_id , type.type_name from type`;
  let result = await sqlHandle.DB2(sql);
  console.log("直播间类型", result);
  if (result.length >= 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 新建房间
 * @author: stephon
 * @param {type}
 * @return {type}
 */
router.post("/addRoom", async (req, res, next) => {
  let data = req.body;
  let sql = `insert into living_room (id,title,user_id,image,type,live_url,description,channel_type,integral_fee) value ('${commonJS.getCode(
    32
  )}','${data.title}','${data.user_id}','${data.image}','${data.type}','${
    data.live_url
  }','${data.description}','${data.channel_type}','${data.integral_fee}')`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 编辑房间
 * @author: stephon
 * @param {type}
 * @return {type}
 */
router.post("/editRoom", async (req, res, next) => {
  let data = req.body;
  let sql = `update living_room set title='${data.title}',image='${data.image}',
  type='${data.type}',channel_type='${data.channel_type}',live_url='${data.live_url}',
  description='${data.description}',integral_fee='${data.integral_fee}' where id ='${data.id}' `;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    res.send(commonJS.outPut(200, data, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

/**
 * @description: 获取直播间详情
 * @author: stephon
 * @param {type}
 * @return {type}
 */
router.get("/roomDetail", async (req, res, next) => {
  let data = req.query;
  let sql = `select  examine.* , living_room.title,living_room.type,living_room.live_url,user.name,user.id,user.avatar,living_room.description 
    from living_room left join user on living_room.user_id = user.id  
    left join examine on living_room.id = examine.room_id 
    where living_room.id = '${data.id}' and living_room.status != 0`;
  let result = await sqlHandle.DB2(sql);
  if (result.length == 1) {
    let resultData = {
      ...result[0],
      room_id: data.id,
    };
    res.send(commonJS.outPut(200, resultData, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

router.get("/deleteRoom", async (req, res, next) => {
  let data = req.query;
  let sql = `delete from living_room WHERE id = '${data.id}'`;
  console.log("id", data.id);
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    let resultData = {};
    res.send(commonJS.outPut(200, resultData, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

module.exports = router;
