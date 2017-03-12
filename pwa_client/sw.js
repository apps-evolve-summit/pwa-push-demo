// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
    console.log('Received a push message', event);
  
  var  data = event.data.json();
  console.log(JSON.stringify(data));

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      vibrate: data.vibrate,
      actions: data.actions,
      requireInteraction: data.requireInteraction
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action == 'yes' || event.action == 'no') {
    fetch('/vote' + event.action, {
      method: 'GET'                    
    }).then(() => {});
    event.waitUntil(
        self.clients.openWindow('./index.html'));
    }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Closed');
});