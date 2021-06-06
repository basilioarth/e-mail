const url = require('url');
const emails = require('./emails.json');

exports.getUser = function(req, res) {
    const reqUrl = url.parse(req.url, true);

    if(reqUrl.query.name){
        var response = emails.users.filter((user) => {
            return user.name == reqUrl.query.name.toLowerCase()
        })
        
        if(response.length === 0) {
            res.statusCode = 404;
        } else {
            res.statusCode = 200;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end('Invalid-Request');
    }
};

exports.getAllUserEmails = function(req, res) {
    const reqUrl = url.parse(req.url, true);

    if(reqUrl.query.name){
        var response = emails[reqUrl.query.name.toLowerCase()]

        if(response === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({}));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        }
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end('Invalid-Request');
    }
};

exports.getAllSendedEmails = function(req, res) {
    const reqUrl = url.parse(req.url, true);

    if(reqUrl.query.name){
        var response = emails[reqUrl.query.name.toLowerCase()]

        if(response === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({}));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response["sent"]));
        }
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end('Invalid-Request');
    }
};

exports.getAllRecievedEmails = function(req, res) {
    const reqUrl = url.parse(req.url, true);

    if(reqUrl.query.name){
        var response = emails[reqUrl.query.name.toLowerCase()]

        if(response === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({}));
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response["inbox"]));
        }
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end('Invalid-Request');
    }
};

exports.getUserEmail = function(req, res) {
    const reqUrl = url.parse(req.url, true);

    if(reqUrl.query.name && reqUrl.query.id && reqUrl.query.class){
        var response = emails[reqUrl.query.name.toLowerCase()]

        if(response === undefined) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({}));
        } else if(response[reqUrl.query.class] === undefined){
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({}));
        } else {
            response = response[reqUrl.query.class].filter((email) => {
                return email.id == reqUrl.query.id
            })
            
            if(response.length === 0) {
                res.statusCode = 404;
            } else {
                res.statusCode = 200;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(response));
        }
    } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end('Invalid-Request');
    }
};

exports.sendEmail = function(req, res) {
    body = '';

    req.on('data', function(chunk){
        body += chunk;
    });

    req.on('end', function(){
        postBody = JSON.parse(body);

        length = emails[postBody.sender.toLowerCase()]["sent"].length
        emails[postBody.sender.toLowerCase()]["sent"][length] = {
            "id": length + 1,
            "sender": postBody.sender,
            "addressee": postBody.addressee,
            "subject": postBody.subject,
            "body": postBody.body,
            "type": postBody.type
        };

        length = emails[postBody.addressee.toLowerCase()]["inbox"].length
        emails[postBody.addressee.toLowerCase()]["inbox"][length] = {
            "id": length + 1,
            "sender": postBody.sender,
            "addressee": postBody.addressee,
            "subject": postBody.subject,
            "body": postBody.body,
            "type": postBody.type
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(emails));
    });
};

exports.invalidRequest = function(req, res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end('Invalid-Request');
};