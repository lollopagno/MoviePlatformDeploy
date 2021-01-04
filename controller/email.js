const KEY_PRIVATE = require('../utils/env').emailKeyPrivate
const KEY_PUBLIC = require('../utils/env').emailKeyPublic
const mailjet = require('node-mailjet').connect(KEY_PUBLIC, KEY_PRIVATE)
const validator = require('deep-email-validator');

/**
 * Use API mailjet to send email
 **/
sendEmail = (email, name, token) => mailjet
    .post("send", {'version': 'v3.1'})
    .request({
        "Messages": [
            {
                "From": {
                    "Email": "lorenzopagnini97@gmail.com",
                    "Name": "Movie Platform"
                },
                "To": [
                    {
                        "Email": email,
                        "Name": name
                    }
                ],
                "Subject": "Account Verification Code - Movie Platform",
                "TextPart": 'Hello ' + name + ',\n\nwelcome to movie platform!\n\nTo activate your account click the following link: \nhttps:\/\/movieplatform.herokuapp.com\/confirmation\/' + token + '.\n\n' +
                    'Attention the code will expired in 12 hours!\n\nMovie platform staff',
                "HTMLPart": "Hello " + name + ",<br/><br/>welcome to movie platform!<br/><br/>To activate your account click the following link: <a href='https://movieplatform.herokuapp.com/confirmation'>" +
                    "<strong>" + token + "</strong></a>!<br/><h3>Attention the code will expired in 12 hours!</h3><br/><br/>Movie platform staff",
                "CustomID": "AppGettingStartedTest"
            }
        ]
    })

/**
 * Check if the email is correct (format and validity)
 **/
validationEmail = (req, res) => {

    if (!req.query.email)
        return res.status(401).json({
        success: false,
        message: 'You must provide an email!'
    })

    const param = req.query

    validator.validate(param.email.trim()).then((validEmail) => {
        if (!validEmail.valid) {
            const err = +!validEmail.validators.regex.valid ? validEmail.validators.regex.reason : ''
            return res.status(200).json({
                success: true,
                message: `Email invalid. ${err}`,
                email: false
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Valid email',
            email: true
        })
    })
}

module.exports = {
    sendEmail, validationEmail
}
