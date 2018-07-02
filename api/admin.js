const SMSClient = require('@alicloud/sms-sdk')
const url = require('url')
function randomNum (){
    var num= '';
    for(var i=0;i<4;i++){
        num+=Math.floor(Math.random()*10)
    }
    return num;
}
module.exports = {
    defaultRoute : ( req, res, next ) => {
        res.send('user')
    },
    sendCode : (req, res, next) => {
        const { tel } = url.parse(req.url, true).query
        const accessKeyId = 'LTAIZQoVVoPuBjU9'
        const secretAccessKey = 'GfJuI2dLsCQh7Q56TmFxPTniXjkVnB'
        let smsClient = new SMSClient({accessKeyId, secretAccessKey})
        let code = randomNum();
        smsClient.sendSMS({
            PhoneNumbers: tel,
            SignName: '吴勋勋',
            TemplateCode: 'SMS_111785721',
            TemplateParam: '{"code":'+code+'}'
        }).then(function (result) {
            let {Code}=result
            if (Code === 'OK') {
                //处理返回参数
                console.log(result)
                res.send({
                    code,
                    state: 1
                })
            }
        }, function (err) {
            console.log(err)
            res.send({
                state: 0
            })
        })
    }
}