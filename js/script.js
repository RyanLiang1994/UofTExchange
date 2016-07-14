$(document).ready(function() {
    $('section').hide();
    $('#home').show();

    hamburgerMenu();
    displayMenu();

    $(window).resize(function() {
        hamburgerMenu();
    });

});

function hamburgerMenu() {
    if ($(window).width() <= 480){

        if ($("nav.navbar button#hamburger-menu").length === 0){
            var $button = $("<button>", {
                id: 'hamburger-menu',
                text: 'Menu',
                display: 'block'
            }).click(function(){
                $("nav.navbar ul").toggleClass("open");
            }).appendTo('nav.navbar');
        }

        $("nav.navbar").attr('id', "hamburgerMenu");
    } else {
        $("nav.navbar").attr('id', "hamburgerMenu");
        
        if ($("nav.navbar button#hamburger-menu").length > 0) {
            $("nav.navbar button#hamburger-menu").remove();
        }
    }
}

function displayHamburger() {
    if ($(window).width() <= 480){
        $("nav.navbar ul").hide();
    }
}

function displayMenu() {
    if ($(window).width() <= 480){
        $('nav.navbar button#hamburger-menu').click(function() {
            $("nav.navbar ul").show();
        })
    }
}

$('#btnHome').click(function() {
    $('section').hide();
    $('#home').show();
    displayHamburger();
});

$('#btnSignup').click(function() {
    $('section').hide();
    $('#signup').show();
    displayHamburger();
});

$('#btnSignout').click(function() {
    $('section').hide();
    $('#signout').show();
    displayHamburger();
});

$('#btnMyprofile').click(function() {
    $('section').hide();
    $('#myprofile').show();
    displayHamburger();
});

$('#btnSearch').click(function() {
    $('section').hide();
    $('#search').show();
    displayHamburger();
});

$('#btnExchangeCourse').click(function() {
    $('section').hide();
    $('#exchangecourse').show();
    displayHamburger();
});

$('#btnHelp').click(function() {
    $('section').hide();
    $('#help').show();
    displayHamburger();
});

$('#btnFeedback').click(function() {
    $('section').hide();
    $('#feedback').show();
    displayHamburger();
});
