$(document).ready(function() {
    $('section').hide();
    $('#home').show();

    $(window).resize(function()
    {
       if ($(window).width() >= 1024) {
            stickyNav();

            $(window).scroll(function() {
                stickyNav();
            });
        }
    });

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

function stickyNav(){
    var navPosition = $('#navbar').position();
    var scrollTop = $(window).scrollTop();
  
    if (scrollTop > navPosition.top) { 
        $('#navbar').addClass('sticky');
    } else {
        $('#navbar').removeClass('sticky'); 
    }
};


