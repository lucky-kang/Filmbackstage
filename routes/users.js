var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');

var checkLogin = require('./checkLogin.js');
var mongoUrl = 'mongodb://localhost:27017/movie';
module.exports = {
    defaultRoute: ( req, res, next ) => {
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('users').find( {}, { _id: 0 }).toArray( ( err, data ) => {
                    if ( err ) throw err;
                    cb( null, data );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            res.render('users', {
                result
            }) 
        })
    },
    usersPage : ( req, res, next) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { limitNum, skipNum, totalPage } = url.parse( req.url, true ).query;
        limitNum = limitNum * 1 || 5;
        skipNum = skipNum * 1 || 1;
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('users').find( {}, { _id: 0 }).toArray( ( err, res ) => {
                    if ( err ) throw err;
                    var listLen = res.length;//len代表所有数据的总个数
                    var data = res.splice( (skipNum-1) * limitNum, limitNum );//当前页面所对应的数据列表
                    cb( null, {
                        listLen,
                        data
                    } );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            var { listLen, data } = result;
            var len = data.length;//当前页面所对应的数据总个数
            var totalPage = Math.ceil(listLen / limitNum);//当前页的总页数
            res.render('users', {
                result : data,
                len,
                totalPage,
                limitNum,
                skipNum
            }) 
        })  
    },
    user_delete : ( req, res, next) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { limitNum, skipNum, id, totalPage } = url.parse( req.url, true).query;
        limitNum = limitNum * 1;
        totalPage = totalPage * 1;
        async.waterfall([
            (cb) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if (err) throw err;
                    cb( null, db);
                })
            },
            ( db, cb ) => {
                db.collection('users').deleteOne({id:id},( err, res ) => {
                    if (err) throw err;
                    cb( null, 'ok');
                    db.close();
                });
            }  
        ],(err,result) => {
            if (err) throw err;
            if(result == 'ok'){
                console.log('删除OK!');
            }
            res.redirect('/usersPage?limitNum=' + limitNum + '&skipNum=' + skipNum + '&totalPage=' + totalPage);
        })
    },
    addUserRoute : ( req, res, next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { limitNum, skipNum, totalPage } = url.parse( req.url, true ).query;
        res.render('addUser', { limitNum, skipNum, totalPage });
    },
    addUserAction : ( req, res, next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { limitNum, skipNum, totalPage } = url.parse( req.url, true ).query;
        var { usersId, usersName, usersAlt, usersImg } = req.body;
        if(usersId !== ''){
            var insertObj = {
                alt : usersAlt,
                avatars : {
                    "small" : usersImg,
                    "large" : usersImg,
                    "medium" : usersImg
                },
                name : usersName,
                id : usersId
            };
            async.waterfall([
                (cb) => {
                    MongoClient.connect( mongoUrl, ( err, db) => {
                        if (err) throw err;
                        cb( null, db);
                    })
                },
                ( db, cb ) => {
                    db.collection('users').insert(insertObj,( err, res ) => {
                        if (err) throw err;
                        cb( null, 'ok');
                        db.close();
                    });
                }  
            ],(err,result) => {
                if (err) throw err;
                if(result == 'ok'){
                    console.log('添加OK!');
                    res.redirect('/usersPage?limitNum=' + limitNum + '&skipNum=' + totalPage + '&totalPage=' + totalPage);
                }
            });
            return;
        }
        res.render('addUser',{ limitNum, skipNum });
    },
    updateUser : ( req, res, next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { id, limitNum, skipNum } = url.parse( req.url, true ).query;
        async.waterfall([
            (cb) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if (err) throw err;
                    cb( null, db);
                })
            },
            ( db, cb ) => {
                db.collection('users').find({id:id},{_id:0}).toArray(( err, res ) => {
                    if (err) throw err;
                    cb( null, res );
                    db.close();
                });
            }  
        ],(err,result) => {
            var { id, name, alt } = result[0];
            var img = result[0].avatars.small; 
            // console.log(result[0]);
            if (err) throw err;
            res.render('updateUser',{
                id,
                name,
                alt,
                img,
                limitNum,
                skipNum,
                result
            });
        })
    },
    updateUserAction : ( req, res, next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { id, name, alt, img, limitNum, skipNum } = req.body;
        console.log(req.body);
        var whereObj = { id : id };
        var updateObj = {
            $set : {
                alt : alt,
                avatars : {
                    "small" : img,
                    "large" : img,
                    "medium" : img
                },
                name : name
            }
        };
        async.waterfall([
            (cb) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if (err) throw err;
                    cb( null, db);
                })
            },
            ( db, cb ) => {
                db.collection('users').update(whereObj,updateObj,( err, res ) => {
                    if (err) throw err;
                    cb( null, 'ok');
                    db.close();
                });
            }  
        ],(err,result) => {
            if (err) throw err;
            if(result == 'ok'){
                console.log('编辑OK!');
                res.redirect('/usersPage?limitNum='+limitNum+'&skipNum='+skipNum);
            }
        })
    }
}