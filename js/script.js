$(document).ready(function() {
    // $('#signup').hide();
    // $('#signout').hide();
    // $('#myprofile').hide();
    // $('#search').hide();
    // $('#recommend').hide();
    // $('#help').hide();
    // $('#feedback').hide();
    $('section').hide();
    $('#home').show();
});

$('#btnHome').click(function() {
    $('section').hide();
    $('#home').show();
});

$('#btnSignup').click(function() {
    $('section').hide();
    $('#signup').show();
});

$('#btnSignout').click(function() {
    $('section').hide();
    $('#signout').show();
});

$('#btnMyprofile').click(function() {
    $('section').hide();
    $('#myprofile').show();
});

$('#btnSearch').click(function() {
    $('section').hide();
    $('#search').show();
});

$('#btnRecommend').click(function() {
    $('section').hide();
    $('#recommend').show();
});

$('#btnHelp').click(function() {
    $('section').hide();
    $('#help').show();
});

$('#btnFeedback').click(function() {
    $('section').hide();
    $('#feedback').show();
});
