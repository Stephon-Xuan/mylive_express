var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var expressJwt = require("express-jwt");
var compression = require("compression");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var roomRouter = require("./routes/livingRoom");
var carouselRouter = require("./routes/carousel");
var channelRouter = require("./routes/channel");
var uploadRouter = require("./routes/upload");
var analysisRouter = require("./routes/analysis");
var examineRouter = require("./routes/examine");
var traineesRouter = require("./routes/trainees");
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 8511;

var app = express();

//开启gzip
app.use(compression());

//设置跨域头
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type,Content-Length, Authorization,Origin,Accept,X-Requested-With"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//使用中间件
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(expressJwt({
//   secret:"living_xiaoyu",
//   algorithms:['HS256'],
//   credentialsRequired:true, //是否校验
// }).unless({
//   path:['/users/login','/livingRoom/roomList','/livingRoom/roomListByType']
// }))

//路由相关
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/livingRoom", roomRouter);
app.use("/carousel", carouselRouter);
app.use("/channel", channelRouter);
try {
  app.use("/upload", uploadRouter);
} catch (e) {
  console.log("错误", e);
}
app.use("/analysis", analysisRouter);
app.use("/examine", examineRouter);
app.use("/trainees", traineesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//rtmp服务
const NodeMediaServer = require("node-media-server");
const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: "*",
  },
};
var nms = new NodeMediaServer(config);
nms.run();

//socket服务
require("events").EventEmitter.prototype._maxListeners = 1000;
// 匹配一下路径
let namespaceList = [{ name: "barrage", description: "弹幕模块" }];
for (let i in namespaceList) {
  if (namespaceList[i].name) {
    newNamespace(namespaceList[i].name);
  }
}
//监听新的命名空间
function newNamespace(space) {
  io.of(space).on("connection", (socket) => {
    console.log("服务器端连接成功");
    socket.on("chat message", (data) => {
      console.log("chat中....");
      socket.emit("chat message", data);
    });
    socket.on("connect", (data) => {
      socket.emit("服务器连接成功", data);
    });
    //加入房间
    socket.on("JOINROOM", (name) => {
      socket.join(name);
      socket.emit("用户加入直播间,name");
      console.log("加入房间", name);
    });
    //离开房间
    socket.on("LEAVEROOM", (name) => {
      socket.leave(name);
    });
    //发送房间聊天
    socket.on("ROOMCHAT", (data) => {
      // to方法给特定的用户发送特定的消息，跟加入直播间的name有关
      io.of(space).to(data.room).emit(data.func, data.data);
      // console.log("聊天记录",{ space,data })
    });
    //加入自己的房间
    socket.on("JOINUSER", (id) => {
      socket.join(id);
    });
    //发送用户私聊
    socket.on("USETCHAT", (data) => {
      io.of(space).to(data.id).emit(data.func, data.data);
    });
    //发送公聊
    socket.on("COMMONCHAT", (data) => {
      socket.emit(data.func, data.data);
    });
  });
}
http.listen(port, function () {
  console.log("端口", port);
  console.log("listening on *:" + port);
});

module.exports = app;
