// TODO

var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");
var multer = require("multer");
var fs = require("fs");
let moreUpload = multer({ dest: "public/uploads/" }).array("file", 5); //dest是路径，后面的file是前端的参数名

router.post("/uploadImg", moreUpload, async (req, res, next) => {
  console.log("------------------------");
  if (req.files.length === 0) {
    res.render("error", { message: "上传文件不能为空！" });
  } else {
    let sql = `insert into image (img_url,user_id,img_name) values `;
    let sqlArr = [];
    for (var i in req.files) {
      res.set({
        "content-type": "application/json; charset=utf8",
      });
      let file = req.files[i];
      fs.renameSync(
        "./public/uploads/" + file.filename,
        "./public/uploads/" + file.originalname
      );
      let { user_id } = req.query;
      let file_name = file.originalname;
      let url = "/uploads/" + file.originalname;
      if (req.files.length - 1 == i) {
        sql += "(?)";
      } else {
        sql += "(?),";
      }
      console.log("语句", sql);
      sqlArr.push([url, user_id, file_name]);
    }
    //批量存储到数据库
    sqlHandle.sqlConnect(sql, sqlArr, (err, data) => {
      if (err) {
        console.log("错误", err);
      } else {
        console.log("成功", data.affectedRows);
        if (data.affectedRows > 0) {
          let img_list = sqlArr.map((item) => {
            return sqlHandle.main_url + item[0];
          });
          res.send({
            code: 200,
            affectedRows: data.affectedRows,
            data: {
              img_list,
              msg: "上传成功",
            },
          });
        } else {
          res.send({
            code: 400,
            msg: "上传失败",
          });
        }
      }
    });
  }
});

router.get("/getUserImg", async (req, res, next) => {
  let data = req.query;
  let sql = `select * from image where image.user_id = '${data.user_id}'`;
  const main_url = sqlHandle.main_url;
  let result = await sqlHandle.DB2(sql);
  if (result.length > 0) {
    let resultData = result.map((item) => {
      let { img_id, user_id, img_url, img_name } = item;
      return { img_url: main_url + img_url, user_id, img_id, img_name };
    });
    res.send(commonJS.outPut(200, resultData, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

router.get("/deleteUserImg", async (req, res, next) => {
  let data = req.query;
  let sql = `delete from image WHERE img_id = '${data.img_id}'`;
  let result = await sqlHandle.DB2(sql);
  if (result.affectedRows == 1) {
    let resultData = {};
    res.send(commonJS.outPut(200, resultData, "success"));
  } else {
    res.send(commonJS.outPut(500, result, "fail"));
  }
});

module.exports = router;
