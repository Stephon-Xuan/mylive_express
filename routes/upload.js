// TODO

var express = require("express");
var router = express.Router();
var commonJS = require("../public/js/common");
var sqlHandle = require("../public/config/mysqlModal");
let multer = require("multer");
let upload = multer({dest:'../public/uploads/'}).single("file");
let moreUpload = multer({dest:'./public/uploads/'}).array("file",5);
let fs = require('fs');

console.log({multer})

console.log("触发")
// router.post('/uploadImg',upload,async (res,req,next)=>{
//     console.log("图片",req)
//     if (req.file.length === 0) {
//         res.render('error', { message: '上传文件不能为空！' });
//     } else {
//         let file = req.file;
//         console.log(file);
//         fs.renameSync('./public/uploads/' + file.filename, './public/uploads/' + file.originalname);
//         res.set({
//             'content-type': 'application/JSON; charset=utf-8'
//         })
//         let { user_id } = req.query;
//         let imgUrl = 'http://localhost:3000/public/uploads/' + file.originalname;
//         let sql = `update user set userpic=? where id=?`;
//         let sqlArr = [imgUrl, user_id];
//         await sqlHandle.sqlConnect(sql, sqlArr, (err, data) => {
//             if (err) {
//                 console.log(err);
//                 throw '出错了';
//             } else {
//                 if (data.affectedRows == 1) {
//                     res.send({
//                         code: 200,
//                         msg: '修改成功',
//                         url: imgUrl
//                     })
//                 } else {
//                     res.send({
//                         code: 400,
//                         msg: '修改失败'
//                     })
//                 }
//             }
//         })
//     }
// })


router.post('/uploadImg',moreUpload,async (req, res, next)=>{
    try{
        if (err instanceof multer.MulterError) {
      // 发生错误
            console.log("发生错误")
        } else if (err) {
      // 发生错误
            console.log("发生错误")
        }
        console.log("req",req.files)
    if (req.files.length === 0) {
        res.render('error', { message: '上传文件不能为空！' });
    } else {
        let sql = `insert into image (img_url) values`;
        let sqlArr = [];
        for (var i in req.files) {
            res.set({
                'content-type': 'application/json; charset=utf8'
            });
            let file = req.files[i];
            fs.renameSync('./public/uploads/' + file.filename, './public/uploads/' + file.originalname);
            let { user_id } = req.query;
            let url = 'http://localhost:3000/uploads/' + file.originalname;
            if (req.files.length - 1 == i) {
                sql += '(?)'
            } else {
                sql += '(?),'
            }
            console.log(sql);
            sqlArr.push([url, (new Date().valueOf()), user_id])
        }
        //批量存储到数据库
        await sqlHandle.DB2(sql, sqlArr, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(data.affectedRows);
                if (data.affectedRows > 0) {
                    res.send({
                        code: 200,
                        affectedRows: data.affectedRows,
                        msg: '上传成功'
                    });
                } else {
                    res.send({
                        code: 400,
                        msg: '上传失败'
                    });
                }
            }
        })
    }
    }catch(e){
        console.log("错误",e)
    }
    
})



module.exports = router;