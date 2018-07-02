var { MongoClient } = require('mongodb');
var async = require('async');
var fs = require('fs');
var checkLogin = require('./checkLogin.js');

var mongoUrl = 'mongodb://localhost:27017/movie';

module.exports = {
    defaultRoute : ( req, res, next ) => {
    	checkLogin.check( req, res );//检查是否是登录状态
    	async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('images').find( {}, { _id: 0 }).toArray( ( err, data ) => {
                    if ( err ) throw err;
                    cb( null, data );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            console.log(result);
            res.render('banner', {
                result
            }) 
        })
    },
    addbanner : ( req, res, next ) => {
    	checkLogin.check( req, res );//检查是否是登录状态
        res.render('addbanner');
    },
    addbannerAction :( req, res, next ) => {
    	checkLogin.check( req, res );//检查是否是登录状态
        var { bannerid, bannerurl } = req.body;
        var oldName = './uploads/' + req.file.filename;
        var endImgFlagArr = req.file.originalname.split('.');
        var endImgFlag = endImgFlagArr[endImgFlagArr.length-1];
        var newName = oldName + '.' + endImgFlag;
		
        async.waterfall([
        	( cb ) => {
        		fs.rename( oldName, newName, ( err, data ) => {
        			if (err) throw err;
        			var imgurl = req.file.filename + "." + endImgFlag; 
            		cb( null, imgurl);
        		})
        	},
        	( imgurl, cb ) => {
        		MongoClient.connect( mongoUrl, ( err, db ) => {
        			if (err) throw err;
        			cb( null, imgurl, db );
        		})
        	},
        	( imgurl, db, cb ) => {
        		db.collection('images').insert( { bannerid, bannerurl, imgurl }, ( err, res ) => {
        			if (err) throw err;
        			cb( null, 'ok' );
        			db.close();
        		})
        	}
        ],( err, result ) => {
        	if (err) throw err;
        	if(result == 'ok'){
        		console.log('添加轮播图成功！');
        		res.redirect('/banner');
        	}
        })
    }
}