var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');

var checkLogin = require('./checkLogin.js');
var mongoUrl = 'mongodb://localhost:27017/movie';
module.exports = {
    defaultRoute : ( req,res,next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('films').find( {}, { _id: 0 }).toArray( ( err, data ) => {
                    if ( err ) throw err;
                    cb( null, {
                        data
                    } );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            var { data } = result;
            res.render('films', {
                result : data,
            }) 
        })
    },
    sortMovieRoute : ( req, res, next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { type, num } = url.parse( req.url, true ).query;
        num = num * 1;
        var sortObj = {};
        try {
            sortObj[type] = num; 
            // console.log(sortObj);  
        } catch (error) {
            throw error;
        };
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('films').find( {}, { _id: 0 }).sort(sortObj).toArray( ( err, res ) => {
                    if ( err ) throw err;
                    cb( null, {
                        res
                    } );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            res.render('films',{
                result : result.res
            });
        })
    },
    areaFindRoute : ( req, res, next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { type, min, max } = url.parse( req.url, true ).query;
        var whereObj = {};
        
        whereObj[type] = {
            $gte : min * 1,
            $lte : max * 1
        }
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('films').find( whereObj, { _id : 0 } ).toArray( ( err, res ) => {
                    if ( err ) throw err;
                    cb( null, {
                        res
                    } );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            res.render('films',{
                result : result.res
            });
        })
    },
    movieSearchRoute : ( req, res, next ) => {
        checkLogin.check( req, res );//检查是否是登录状态
        var { title } = url.parse( req.url, true ).query;
        // console.log(title);
        async.waterfall( [
            ( cb ) => {
                MongoClient.connect( mongoUrl, ( err, db) => {
                    if ( err ) throw err;
                    cb( null, db );
                })
            },
            ( db, cb ) => {
                db.collection('films').find( { title : eval('/' + title + '/')}, { _id: 0 }).toArray( ( err, res ) => {
                    if ( err ) throw err;
                    cb( null, {
                        res
                    } );
                    db.close();
                });
            }
        ], ( err, result ) => {
            if ( err ) throw err;
            res.render('films', {
                result : result.res
            }) 
        })
    }
}