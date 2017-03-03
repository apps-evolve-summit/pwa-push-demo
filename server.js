'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const file = require('fs');

const app = express();
app.use(bodyParser.json());

// add static resources
app.use('/web_app', express.static('web_app'));
app.use('/', express.static('pwa_client'));

// generate public and private vapid keys
// console.log(webpush.generateVAPIDKeys());

let subscriptionObject = null;

// implementation of push notification method
app.post('/api/send-push', (req, res) => {
    const options = {
        vapidDetails: {
            subject: 'http://www.google.com',
            publicKey: 'BGLh-Zyk0vcAhjb1mpSmdyNRk9VnndafH0bHAksx8LhQCPAULzxI_DeuT6mU0MBpN4STMpzBQJ1eakM-TBi8VN8',
            privateKey: '6JNmGyPBbTUza1pIEAXueI39ChDxqZPD6S69gsygwjc'
        },
        TTL: 60 * 60
    };

    console.log(req.body);

    webpush.sendNotification(
        //req.body.subscription,
        subscriptionObject,
        req.body.data,
        options
    ).then(() => {
        res.status(200).send({success: true});
    }).catch((err) => {
        if (err.statusCode) {
        res.status(err.statusCode).send(err.body);
        } else {
        res.status(400).send(err.message);
        }
    });
});

app.post('/registerSubscription', (req, res) => {
    subscriptionObject = req.body.subscription;
    console.log(JSON.stringify(subscriptionObject));
    res.status(200).send({success: true});
});

// only for test
app.post('/test', (req, res) => {
    var a = req.body.a;
    var b = req.body.b;

    var result = parseInt(a) + parseInt(b);
    console.log(result.toString());  
});

// save to file
app.post('/save', (req, res) => {
    file.appendFileSync('test.txt', 'Hello world!');

     res.status(200).send({success: true});
});

// start node.js server
const server = app.listen(process.env.PORT || '3000', () => {
    console.log('Listening port %s', server.address().port);
});