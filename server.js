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

    var allSubscriptions = getAllSubscriptions();

    allSubscriptions.forEach(subscriber => {
        webpush.sendNotification(
            subscriber,
            req.body.data,
            options
            ).then(() => {
                // res.status(200).send({success: true});
            }).catch((err) => {
                if (err.statusCode) {
                res.status(err.statusCode).send(err.body);
                } else {
                res.status(400).send(err.message);
                }
            });
    });
    res.status(200).send({success: true});
});

app.post('/registerSubscription', (req, res) => {
    var subscriptionObject = req.body.subscription;

    var allSubscriptions = getAllSubscriptions();

    allSubscriptions.push(subscriptionObject);
    file.writeFileSync('./subscriptions/subscriptions.json', JSON.stringify(allSubscriptions), {flag: 'w+' });
    res.status(200).send({success: true});
});

app.post('/unregisterSubscription', (req, res) => {
    var subscriptionObject = req.body.subscription,
        allSubscriptions = getAllSubscriptions().filter(el => el.endpoint !== subscriptionObject.endpoint);
    file.writeFileSync('./subscriptions/subscriptions.json', JSON.stringify(allSubscriptions), {flag: 'w+' });
    res.status(200).send({success: true});
});

function getAllSubscriptions() {
    var fileContent, allSubscriptions;
    const fileName = './subscriptions/subscriptions.json';

    if (!file.existsSync(fileName)) {
        return [];
    }
    fileContent = file.readFileSync(fileName, 'utf8');
    if (fileContent.length == 0) {
        return [];
    }
    allSubscriptions = JSON.parse(fileContent);
    return Array.isArray(allSubscriptions) ? allSubscriptions : [];
}

// start node.js server
const server = app.listen(process.env.PORT || '3000', () => {
    console.log('Listening port %s', server.address().port);
});
