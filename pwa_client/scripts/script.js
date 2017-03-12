// variables
var swRegistration;
var isSubscribed;
const publicServerKey = 'BGLh-Zyk0vcAhjb1mpSmdyNRk9VnndafH0bHAksx8LhQCPAULzxI_DeuT6mU0MBpN4STMpzBQJ1eakM-TBi8VN8';
const subscribeButton = document.querySelector('#btnSubscribe');

// register service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Push notification supported!');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg){
    console.log('Service worker registered successfully!');
    swRegistration = swReg;
    initUI();
  }).catch(function(err) {
    console.error('Service Worker not registered ' + err);
  });
} else {
  console.error('Push notification NOT supported!')
}

// initialize UI and get subscription details
function initUI() {
  subscribeButton.addEventListener('click', function() {
    subscribeButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // tries to get details of active subscription
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    if (isSubscribed) {
      console.log('User\'s subscription is active!');
      // write to output subscription details
      console.log(JSON.stringify(subscription));
    } else {
      console.log('User is not subscribed!');
    }

    updateSubscriptionButton();

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('voted')) {
      fetch('/getResultVote', {
        method: 'GET'                    
      }).then((res) => {
          return res.text();
      }).then((text) => {
          document.querySelector('#txtVoteResult').value = text;
      });
    }
  });
}

// refreshes the state of the "Subscribe / unsubscribe" button
function updateSubscriptionButton() {
  if (isSubscribed) {
    subscribeButton.textContent = 'Unsubscribe';
  } else {
    subscribeButton.textContent = 'Subscribe';
  }

  subscribeButton.disabled = false;
}

// subscribe user
function subscribeUser() {
  var publicKey = urlB64ToUint8Array(publicServerKey);

  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: publicKey
  }).then(function(subscription){
    isSubscribed = true;
    console.log('User successfully subscribed');
    console.log(JSON.stringify(subscription));
    updateSubscriptionButton();
    registerSubscriptionOnServer(subscription);
    
  }).catch(function(err) {
    console.log('Unable to subscribe user ', err);
  });
}

// unsubscribe user
function unsubscribeUser() {
  var subscriptionObject;
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      subscriptionObject = subscription;
      return subscription.unsubscribe();
    }
  }).catch(function(err) {
    console.error('Cannot unsubscribe user ', err);
  }).then(function() {
    // unsegister user on server
    console.log("User successfully unsubscribed");
    isSubscribed = false;
    unregisterSubscriptionOnServer(subscriptionObject);
    updateSubscriptionButton();
  });
}

function registerSubscriptionOnServer(subscription) {
  fetch('/registerSubscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subscription: subscription,          
            })            
        });
}

function unregisterSubscriptionOnServer(subscription) {
  fetch('/unregisterSubscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            subscription: subscription,          
            })            
        });
}

// converts VAPID public key to UInt 8 bit array required to subscribe user
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}