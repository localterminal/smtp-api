'use strict';

require('dotenv').config();
var library = require('./library'),
    response = require('./res');

exports.index = async (req, res) => {
    var apikey = (req.body.apikey) ? req.body.apikey : req.query.apikey;
    if (apikey === process.env.APIKEY) {
        var from = (req.body.from) ? req.body.from : req.query.from,
            to = (req.body.to) ? req.body.to : req.query.to,
            subject = (req.body.subject) ? req.body.subject : req.query.subject,
            text = (req.body.text) ? req.body.text : req.query.text,
            html = (req.body.html) ? req.body.html : req.query.html,
            filename = (req.body.filename) ? req.body.filename : req.query.filename,
            fileurl = (req.body.fileurl) ? req.body.fileurl : req.query.fileurl,
            attachment = {};

        if (filename && fileurl) {
            attachment = {
                filename: filename,
                fileurl: fileurl,
            };
        }

        if (from && to && subject && (text || html)) {
            await library.smtp(from, to, subject, text, html, attachment)
                .then((results) => {
                    response.approve(results, res);
                })
                .catch((error) => {
                    response.disapprove(error, res);
                });
        } else {
            response.disapprove("Invalid request. Missing the 'from', 'to', 'subject', 'text' or 'html' parameter.", res);
        }
    } else {
        response.disapprove('You must use an API key to authenticate each request to the Private SMTP API. For additional information, please refer to https://github.com/sProDev/smtp-api', res);
    }
};
