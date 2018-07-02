var { MongoClient } = require('mongodb');
var async = require('async');
var md5 = require('md5');

var mongoUrl = 'mongodb://localhost:27017/login';

module.exports = {
    defaultRoute : ( req, res, next ) => {
        res.render('login');
    },
    adminLoginAction : ( req, res, next ) => {
        var { name, pwd } = req.body;
        pwd = md5(pwd);
        // console.log(pwd);
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('admin').find( {}, { _id:0,name:name, pwd: pwd }).toArray( ( err, data ) => {
                    if ( err ) throw err;
                    cb( null, data );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            result[0].name === name && result[0].pwd === pwd ? res.cookie('loginState', '200') : res.cookie('loginState', '404');
            res.redirect('/');
        })
    },
    LagoutAction : ( req, res, next ) => {
        res.clearCookie('loginState',{path:'/'});
        res.redirect('/');
    }
 }