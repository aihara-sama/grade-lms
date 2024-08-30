importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB_UiCueVhjXMplkBcQbUGjoG9euM-0EX8",
  authDomain: "grade-lms-415115.firebaseapp.com",
  projectId: "grade-lms-415115",
  storageBucket: "grade-lms-415115.appspot.com",
  messagingSenderId: "476423134346",
  appId: "1:476423134346:web:a1d35ad25d05cfb5b46173",
  measurementId: "G-QQ0Q44V5ZB",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log({ permission: Notification.permission });

  if (Notification.permission === "granted") {
    if (navigator.serviceWorker)
      navigator.serviceWorker.getRegistration().then(async function (reg) {
        if (reg)
          await reg.showNotification(payload.notification.title, {
            body: payload.notification.body,
          });
      });
  }
});
