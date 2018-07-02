var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
    dest : 'uploads/'
});

var users = require('./users.js');
var films = require('./films.js');
var dirctors = require('./dirctors.js');
var admin = require('./admin.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
  });
//演员相关路由
router.get('/users',users.defaultRoute);//默认路由，调用形式为 /users
router.get('/usersPage',users.usersPage);//分页路由，调用形式为 /usersPage?listNum=5&skipNum=1
router.get('/user_delete',users.user_delete);//电影演员删除路由
router.get('/addUserRoute',users.addUserRoute);//添加电影演员跳转路由
router.post('/addUserAction',users.addUserAction);//添加提交演员路由
router.get('/updateUser',users.updateUser);//编辑电影演员跳转路由
router.post('/updateUserAction',users.updateUserAction);//添加编辑演员路由
//电影相关路由
router.get('/films',films.defaultRoute);//默认路由
router.get('/sortMovieRoute',films.sortMovieRoute);//电影排序路由
router.get('/areaFindRoute',films.areaFindRoute);//电影区间查找路由
router.get('/movieSearchRoute',films.movieSearchRoute);//电影搜索路由
//导演相关路由
router.get('/dirctors',dirctors.defaultRoute);
//用户中心验证相关路由
router.get('/admin',admin.defaultRoute);
router.get('/sendCode',admin.sendCode);

module.exports = router;
