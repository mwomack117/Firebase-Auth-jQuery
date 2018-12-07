var config = {
    apiKey: "AIzaSyDf0VV-3LMyVe2JUMeytzlp7SGv3g27WRw",
    authDomain: "fir-auth-jquery-c4e6e.firebaseapp.com",
    databaseURL: "https://fir-auth-jquery-c4e6e.firebaseio.com",
    projectId: "fir-auth-jquery-c4e6e",
    storageBucket: "fir-auth-jquery-c4e6e.appspot.com",
    messagingSenderId: "499383948286"
};

firebase.initializeApp(config);

var database = firebase.database();
var auth = firebase.auth();

// These select DOM elements
const signUpForm = $('#sign-up-form');
const signUpEmail = $('#sign-up-email');
const signUpPassword = $('#sign-up-password');
const signUpButton = $('#sign-up-button');

const loginForm = $('#login-form')
const loginEmail = $('#login-email');
const loginPassword = $('#login-password');
const loginButton = $('#login-button');

const logOutButton = $('#log-out-button');

const status = $('#status');
const errors = $('#errors');

const addItemForm = $('#add-item-form');

// This event listener handles the sign up form
signUpForm.on('submit', e => {
    e.preventDefault();
    const email = signUpEmail.val();
    const password = signUpPassword.val();
    const promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => displayError(e.message));
    signUpForm[0].reset();
})

// This event listener handles the sign in form
loginForm.on('submit', e => {
    e.preventDefault();
    const email = loginEmail.val();
    const password = loginPassword.val();
    const promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => displayError(e.message));
    loginForm[0].reset();
})

var uid = "";

// This listens to the firebase auth and knows if you are logged in or not 
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        // User is signed in.
        console.log(firebaseUser);
        addItemForm.show();
        signUpForm.hide();
        loginForm.hide();
        logOutButton.show();
        status.html('Status: <span style="color: green; font-size: 1.5em; vertical-align: middle">Logged in</span>');
        uid = firebaseUser.uid;
        database.ref('/to-do-list').orderByChild('uid').equalTo(uid).on('value', (snapshot) => {
            $('#to-do-list-items').empty();
            snapshot.forEach(data => {
                var p = $('<p>');
                p.text(data.val().item);
                var deleteButton = $('<button>');
                deleteButton.text('X');
                deleteButton.addClass('delete-button');
                deleteButton.attr('data', data.key);
                p.append(deleteButton);
                $('#to-do-list-items').append(p);
            })
        })
    } else {
        // User is signe out.
        console.log('not logged in');
        addItemForm.hide();
        signUpForm.show();
        loginForm.show();
        logOutButton.hide();
        status.html('Status: <span style="color: red; font-size: 1.5em; vertical-align: middle">Not logged in</span>')
    }
});


// Log out button event listener
logOutButton.on('click', () => {
    auth.signOut();
});

// Function for error handling
var displayError = (message) => {
    errors.text(message);
    setTimeout(() => {
        errors.empty();
    }, 3000)
};

// Event that adds items to your to do list
$(document).on('submit', '#add-item-form', function (e) {
    e.preventDefault();
    const item = $('#item').val();
    database.ref('/to-do-list').push({
        item: item,
        uid: uid
    })
    addItemForm[0].reset();
});

// event that removes items from your to do list 
$(document).on('click', '.delete-button', function () {
    key = $(this).attr('data');
    database.ref('/to-do-list').child(key).remove();
})