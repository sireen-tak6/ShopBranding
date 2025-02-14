importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyB-n7VS0gHX9o8GHScRworKkW_vYqW_L10",
    authDomain: "shopbrandinginfinix.firebaseapp.com",
    projectId: "shopbrandinginfinix",
    storageBucket: "shopbrandinginfinix.firebasestorage.app",
    messagingSenderId: "505950152513",
    appId: "1:505950152513:web:e7777d5bb58cbd1c0a63c0",
    measurementId: "G-23RYT1BX80"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage( (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});