$(document).ready(function() {

    $('section').hide();
    $('#home').show();

    $(window).resize(function()
    {
       if ($(window).width() >= 768) {
            stickyNav();

            $(window).scroll(function() {
                stickyNav();
            });
        }
    });

    // TODO Maybe it is already signed in.
    $('#alreadySignedIn').hide();

    // var auth2 = gapi.auth2.getAuthInstance();
    // if (auth2.isSignedIn.get()) {
    //     console.log("haha");
    //     $('#unSignedIn').hide();
    // }

    // hamburgerMenu();
    // displayMenu();


    // $(window).resize(function() {
    //     displayMenu();
    //     hamburgerMenu();
    //     showMenu();
    // });

});

// function hamburgerMenu() {
//     if ($(window).width() <= 480){

//         if ($("nav.navbar button#hamburger-menu").length === 0){
//             var $button = $("<button>", {
//                 id: 'hamburger-menu',
//                 text: 'Menu',
//                 display: 'block'
//             }).click(function(){
//                 $("nav.navbar ul").toggleClass("open");
//             }).appendTo('nav.navbar');
//         }

//         $("nav.navbar").attr('id', "hamburgerMenu");
//     } else {
//         $("nav.navbar").attr('id', "hamburgerMenu");

//         if ($("nav.navbar button#hamburger-menu").length > 0) {
//             $("nav.navbar button#hamburger-menu").remove();
//         }
//     }
// }

// function displayHamburger() {
//     if ($(window).width() <= 480){
//         $("nav.navbar ul").hide();
//     }
// }

// function displayMenu() {
//     if ($(window).width() <= 480){
//         $('nav.navbar button#hamburger-menu').click(function() {
//             $("nav.navbar ul").show();
//         })
//     }
// }

// function showMenu() {
//     if ($(window).width() > 480){
//         $("nav.navbar ul").show();
//     }
// }

$('#btn-home').click(function() {
    $('section').hide();
    $('#home').show();
    $('#profile').show();
});

$('#btn-books').click(function() {
    $('section').hide();
    $('#search-books').show();
    $('#profile').show();
});

$('#btn-courses').click(function() {
    $('section').hide();
    $('#search-courses').show();
    $('#profile').show();
});

$('#btn-feedback').click(function() {
    $('section').hide();
    $('#feedback').show();
    $('#profile').show();
});

$('#btn-contact').click(function() {
    $('section').hide();
    $('#contact').show();
    $('#profile').show();
});

$('#btn-signup').click(function() {
    $('section').hide();
    $('#profile').hide();
    $('#signup').show();
});

$('#btn-profile').click(function() {
    $('section').hide();
    $('#userProfile').show();
});

function stickyNav(){
    var navPosition = $('#navbar').position();
    var scrollTop = $(window).scrollTop();

    if (scrollTop > navPosition.top) {
        $('#navbar').addClass('sticky');
    } else {
        $('#navbar').removeClass('sticky');
    }
};

// Google Login:
// Source: https://developers.google.com/identity/sign-in/web/sign-in
// The following code is used to check
// if the user has signed in for Google
// var auth2 = gapi.auth2.getAuthInstance();
// if (auth2.isSignedIn.get()) {
//     // Statements
// }

// Google SignIn
function onSignIn(googleUser) {
    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2.isSignedIn.get()) {
        $('#alreadySignedIn').show();
        $('#unSignedIn').hide();
        var profile = auth2.currentUser.get().getBasicProfile();
        $('#greeting').html("Hi, " + profile.getEmail());

        $("#email").html("Email: " + profile.getEmail());
        $("#phone").html("Phone: " + ""); // Empty for now
        $("#year_of_study").html("");
        $("#major").html();
        $("#is_admin").html();
        console.log('ID: ' + profile.getId());
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
    }
}
// Google SignOut
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      $('#alreadySignedIn').hide();
      $('#unSignedIn').show();
    });
}
