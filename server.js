'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const file = require('fs');
const scheduler = require('./scheduler.js')(() => console.log('It\'s time for lunch!'));

const options = {
        vapidDetails: {
            subject: 'http://www.google.com',
            publicKey: 'BGLh-Zyk0vcAhjb1mpSmdyNRk9VnndafH0bHAksx8LhQCPAULzxI_DeuT6mU0MBpN4STMpzBQJ1eakM-TBi8VN8',
            privateKey: '6JNmGyPBbTUza1pIEAXueI39ChDxqZPD6S69gsygwjc'
        },
        TTL: 60 * 60
    };
const subscriptionsFileName = './subscriptions/subscriptions.json';

const app = express();
app.use(bodyParser.json());

// add static resources
app.use('/web_app', express.static('web_app'));
app.use('/', express.static('pwa_client'));

// generate public and private vapid keys
// console.log(webpush.generateVAPIDKeys());

// implementation of push notification method
app.post('/api/send-push', (req, res) => {
    var allSubscriptions = getAllSubscriptions();

    allSubscriptions.forEach(subscriber => {
        webpush.sendNotification(
            subscriber,
            req.body.data,
            options).catch((err) => {
                console.log('Error while pushing to [' + subscriber.endpoint + ']: ' + err.statusCode + ', ' + err.body);
            });
    });
    res.status(200).send({success: true});
});

app.post('/api/send-push-to-winner', (req, res) => {
    var allSubscriptions = getAllSubscriptions(),
        subscriber;
    if (allSubscriptions.length > 0){
        subscriber = allSubscriptions[JSON.parse(req.body.data).subscriberId];
        webpush.sendNotification(
            subscriber,
            req.body.data,
            options).catch((err) => {
                console.log('Error while pushing to [' + subscriber.endpoint + ']: ' + err.statusCode + ', ' + err.body);
            });
        res.status(200).send({success: true});
    }
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

app.get('/getSubsCount', function (req, res) {
    var allSubscriptions = getAllSubscriptions();
    res.status(200).send(allSubscriptions.length.toString());
});

var yesVotes = 0;
app.get('/voteYes', function (req, res) {
    yesVotes++;
    res.sendStatus(200);
});

var noVotes = 0;
app.get('/voteNo', function (req, res) {
    noVotes++;
    res.sendStatus(200);
});

app.get('/resetVotingResult', function (req, res) {
    yesVotes = 0;
    noVotes = 0;
    res.sendStatus(200);
});

app.get('/getResultVote', function (req, res) {
    if (yesVotes == 0 && noVotes == 0) {
        res.status(200).send('');
    } else {
        res.status(200).send('YES: ' + yesVotes + '\r\nNO: ' + noVotes);
    }
});

function getAllSubscriptions() {
    var fileContent, allSubscriptions;

    if (!file.existsSync(subscriptionsFileName)) {
        return [];
    }
    fileContent = file.readFileSync(subscriptionsFileName, 'utf8');
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
