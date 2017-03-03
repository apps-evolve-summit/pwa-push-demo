var reqInt = false;         // require interaction

function sendBasicPushMessage() {
// TO DO simple push done
// push with icon - done
// push with vibration
// push with actions
// pust to specified users

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

    const requireInteractionsCheckbox = document.querySelector('#chbRequireInteraction');
    requireInteractionsCheckbox.addEventListener('click', () => {
        reqInt = requireInteractionsCheckbox.checked;
    });
}

window.addEventListener('load', () => {
    initUI();
});