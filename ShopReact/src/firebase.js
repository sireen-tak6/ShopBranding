// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB-n7VS0gHX9o8GHScRworKkW_vYqW_L10",
    authDomain: "shopbrandinginfinix.firebaseapp.com",
    projectId: "shopbrandinginfinix",
    storageBucket: "shopbrandinginfinix.firebasestorage.app",
    messagingSenderId: "505950152513",
    appId: "1:505950152513:web:e7777d5bb58cbd1c0a63c0",
    measurementId: "G-23RYT1BX80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    console.log('Requesting permission...');
    Notification.requestPermission().then(async (permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const token=await getToken(messaging,{vapidKey:"BMUJD3a8-6XhoycylyO41PeMN5B3cKhuDR4C1JmrWFuyOmUnUEt4QZQBtoGda--YBW1lBrQvvtrorvCe-kaXHTQ"})
            console.log(token)
        }
    })
}
