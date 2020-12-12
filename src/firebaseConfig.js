import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCEDYCa9qVIaQihxh_ROLrJ05dyax1aqoI",
    authDomain: "react-crud-contact.firebaseapp.com",
    databaseURL: "https://react-crud-contact-default-rtdb.firebaseio.com",
    projectId: "react-crud-contact",
    storageBucket: "react-crud-contact.appspot.com",
    messagingSenderId: "94828438282",
    appId: "1:94828438282:web:d94f6a6062a4ac81e790f3"
};

var app = firebase.initializeApp(firebaseConfig);
export default app.database().ref();