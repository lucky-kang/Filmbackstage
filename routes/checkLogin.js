module.exports = {
    check ( req, res ){
        if(req.cookies.loginState !== '200'){
            res.render('login');
            return;
        }
    }
}