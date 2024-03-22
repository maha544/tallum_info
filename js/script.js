$(document).ready(function() {
    'use strict';

    // Sticky Menu
    $(window).scroll(function() {
        var height = $('.top-header').innerHeight();
        if ($('header').offset().top > 10) {
            $('.top-header').addClass('hide');
            $('.navigation').addClass('nav-bg');
            $('.navigation').css('margin-top', '-' + height + 'px');
        } else {
            $('.top-header').removeClass('hide');
            $('.navigation').removeClass('nav-bg');
            $('.navigation').css('margin-top', '-' + 0 + 'px');
        }
    });

    // navbarDropdown
    if ($(window).width() < 992) {
        $('.navigation .dropdown-toggle').on('click', function() {
            $(this).siblings('.dropdown-menu').animate({
                height: 'toggle'
            }, 300);
        });
    }

    // Background-images
    $('[data-background]').each(function() {
        $(this).css({
            'background-image': 'url(' + $(this).data('background') + ')'
        });
    });

    //Hero Slider
    $('.hero-slider').slick({
        autoplay: true,
        autoplaySpeed: 7500,
        pauseOnFocus: false,
        pauseOnHover: false,
        infinite: true,
        arrows: true,
        fade: true,
        prevArrow: '<button type=\'button\' class=\'prevArrow\'><i class=\'fa-solid fa-angle-left\'></i></button>',
        nextArrow: '<button type=\'button\' class=\'nextArrow\'><i class=\'fa-solid fa-angle-right\'></i></button>',
        dots: true
    });
    $('.hero-slider').slickAnimation();

    // venobox popup
    $('.venobox').venobox();

    // filter
    var containerEl = document.querySelector('.filtr-container');
    var filterizd;
    if (containerEl) {
        filterizd = $('.filtr-container').filterizr({});
    }
    // Active changer
    $('.filter-controls li').on('click', function() {
        $('.filter-controls li').removeClass('active');
        $(this).addClass('active');
    });

    //  Count Up
    function counter() {
        var oTop;
        if ($('.count').length !== 0) {
            oTop = $('.count').offset().top - window.innerHeight;
        }
        if ($(window).scrollTop() > oTop) {
            $('.count').each(function() {
                var $this = $(this),
                    countTo = $this.attr('data-count');
                $({
                    countNum: $this.text()
                }).animate({
                    countNum: countTo
                }, {
                    duration: 1000,
                    easing: 'swing',
                    step: function() {
                        $this.text(Math.floor(this.countNum));
                    },
                    complete: function() {
                        $this.text(this.countNum);
                    }
                });
            });
        }
    }
    $(window).on('scroll', function() {
        counter();
    });

});
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { 
    ref,
    set,
    getDatabase,
    push,
    onValue,
 } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCX9DZounMEmmxyu_7k43UQwF6wGIn-Jzc",
  authDomain: "tallum.firebaseapp.com",
  databaseURL: "https://tallum-default-rtdb.firebaseio.com",
  projectId: "tallum",
  storageBucket: "tallum.appspot.com",
  messagingSenderId: "882148895580",
  appId: "1:882148895580:web:1c8c5238f8f1d4fbde2f99",
  measurementId: "G-760KEPZ4EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase();
const auth = getAuth();

//For Sign Up
var model = {};
var phone = document.getElementById("signupPhone");
var userName = document.getElementById("signupName");
var email = document.getElementById("signupEmail");
var password = document.getElementById("signupPassword");
window.signUp = function (e) {
    e.preventDefault();
    model.userName = userName.value;
    model.phone = phone.value;
    model.email = email.value;
    model.password = password.value;
    console.log(model);

    createUserWithEmailAndPassword(auth, model.email, model.password)
        .then(function (res) {
            console.log(res.user.uid, "success response")
            model.id = res.user.uid;
            var reference = ref(database, `users/${model.id}`);
            set(reference, model)
                .then(function (dbRes) {
                    alert("user created successfully");
                })
                .catch(function (dbErr) {
                    alert(dbErr.message);
                });
            userName.value = "";
            phone.value = "";
            email.value = "";
            password.value = "";
        })
        .catch(function (err) {
            console.log(err, "error response");
            alert(err.message);
        });

}

//For LogIn
var loginModel = {};
var loginEmail = document.getElementById("loginEmail");
var loginName = document.getElementById("loginName");
var loginPassword = document.getElementById("loginPassword");
var loginInProgress = false;

window.logIn = function(e) {
    e.preventDefault();
    loginModel.loginEmail = loginEmail.value;
    loginModel.loginName = loginName.value;
    loginModel.loginPassword = loginPassword.value;
    console.log(model);

    // Check if the login process is already in progress
    if (!loginInProgress) {
        loginInProgress = true; // Set flag to indicate login process is in progress

        signInWithEmailAndPassword(auth, loginModel.loginEmail , loginModel.loginPassword)
            .then(function (res) {
                console.log(res.user.uid, "success response")
                loginModel.id = res.user.uid;
                var reference = ref(database, `users/${loginModel.id}`);
                onValue(reference, function(user){
                    console.log(user.val())
                });
                loginEmail.value = "";
                loginName.value = "";
                loginPassword.value = "";

                loginInProgress = false; // Reset the flag after successful login
            })
            .catch(function (err) {
                console.log(err, "error response");
                alert(err.message);

                loginInProgress = false; // Reset the flag on login error
            });
    } else {
        // Display a message indicating that login is already in progress
        alert("Login is already in progress. Please wait...");
    }
}