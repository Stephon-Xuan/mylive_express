var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");

/**
 * @description: 获取轮播图信息
 * @author: stephon
 * @param {type}
 * @return {type}
 */
router.get("/carouselList", async (req, res, next) => {
  let data = req.query;
  let sql;
  if (!data.keyword) {
    sql = `select carousel.id,carousel.user_id,carousel.live_url,carousel.title,user.name,carousel.image,user.avatar,carousel.type,carousel.description from carousel left join user on carousel.user_id = user.id  where carousel.status != 0`;
  } else {
    sql = `select carousel.id,carousel.user_id,carousel.live_url,carousel.title,user.name,carousel.image,user.avatar,carousel.type,carousel.description from carousel left join user on carousel.user_id = user.id where title like '%${data.keyword}%' or user.name like '%${data.keyword}%' and carousel.status !=0 limit 20`;
  }
  let result = await sqlHandle.DB2(sql);
  if (result.length >= 0) {
    res.send(commonJS.outPut(200, result, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

module.exports = router;
