var reqInt = false;         // require interaction

function getNumberOfSubscribers() {
    return fetch('/getSubsCount', {
        method: 'GET'
    }).then((res) => {
         return res.text();
    }).then((text) => {
        document.querySelector('#txtSubsCount').value = text;
    });
}

function sendBasicPushMessage() {
    fetch('/api/send-push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify({title: 'Simple push notification',
                    body: 'This is what a basic push notification looks like.',
                    requireInteraction: reqInt
            })
        })
    }).then((response) => {
        console.log(response);
    });
}

function sendPushMessageWithIcon() {
    fetch('/api/send-push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify({title: 'Push notification with icon',
                    body: 'This is what a push notification with icon looks like.',
                    icon: './web_app/images/notification.png',
                    requireInteraction: reqInt
            })
        })
    }).then((response) => {
        console.log(response);
    });
}

function sendPushMessageWithVibrating() {
    fetch('/api/send-push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify({title: 'Push notification with vibrating',
                    body: 'This is what a push notification with vibrating.',
                    icon: './web_app/images/vibrating.png',
                    vibrate: [200, 100, 200, 100, 200, 100, 200],
                    requireInteraction: reqInt
            })
        })
    }).then((response) => {
        console.log(response);
    });
}

function sendPushMessageWithAction() {
    fetch('/resetVotingResult', {
        method: 'GET'
    });
    fetch('/api/send-push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify({title: 'Push notification with Action',
                    body: 'This is what a push notification with Action',
                    icon: './web_app/images/like_demo.png',
                    vibrate: [200, 100, 300, 100, 200, 100, 400],
                    actions: [{ "action": "yes", "title": "Yes!!!", "icon": "./web_app/images/yes.png" },
                            { "action": "no", "title": "No!!!", "icon": "./web_app/images/no.png" }],
                    requireInteraction: reqInt
            })
        })
    }).then((response) => {
        console.log(response);
    });
}

function sendCustomMessage(pushTitle, message) {
    fetch('/api/send-push', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify({title: pushTitle,
                    body: message,
                    icon: './web_app/images/coffee.png',
                    badge: './web_app/images/coffee-beans.png',
                    vibrate: [200, 100, 300, 100, 200, 100, 400],
                    requireInteraction: reqInt
            })
        })
    }).then((response) => {
        console.log(response);
    });
}

function pickUpwinners() {
    getNumberOfSubscribers();
    var allSubs = document.querySelector('#txtSubsCount').value;
    var random = Math.random();
    var firstWinner = parseInt(random * allSubs);
    var secondWinner = firstWinner;
    while (allSubs > 1 && firstWinner === secondWinner) {
        random = Math.random();
        secondWinner = parseInt(random * allSubs);
    }

    sendMessageToWinner(firstWinner);
    sendMessageToWinner(secondWinner);
}

function sendMessageToWinner(id) {
    fetch('/api/send-push-to-winner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: JSON.stringify({title: 'Congratulations!',
                    body: 'You\'re the winner',
                    icon: './web_app/images/notification.png',
                    subscriberId    : id,
                    requireInteraction: reqInt
            })
        })
    }).then((response) => {
        console.log(response);
    });
}

function initUI() {
    const basicPushNotificationBtn = document.querySelector('#btnSimplePush');
    basicPushNotificationBtn.addEventListener('click', () => {
        sendBasicPushMessage();
    });

    const pushNotificationWithIconBtn = document.querySelector('#btnPushWithIcon');
    pushNotificationWithIconBtn.addEventListener('click', () => {
        sendPushMessageWithIcon();
    });

    const pushNotificationWithVibratingBtn = document.querySelector('#btnPushWithVibrating');
    pushNotificationWithVibratingBtn.addEventListener('click', () => {
        sendPushMessageWithVibrating();
    });

    const pushNotificationWithActionBtn = document.querySelector('#btnPushNotificationWithAction');
    pushNotificationWithActionBtn.addEventListener('click', () => {
        sendPushMessageWithAction();
    });

    const sendCustomPushBtn = document.querySelector('#btnSendCustomPush');
    sendCustomPushBtn.addEventListener('click', () => {
        sendCustomMessage(document.querySelector('#txtPushTitle').value, document.querySelector('#txtPushMessage').value);
    });

    const pickUpwinnersBtn = document.querySelector('#btnPickUpWinners');
    pickUpwinnersBtn.addEventListener('click', () => {
        pickUpwinners();
    });
}

window.addEventListener('WebComponentsReady', initUI);
