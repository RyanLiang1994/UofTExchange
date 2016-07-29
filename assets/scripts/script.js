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

});

$('#btn-home').click(function() {
    $('section').hide();
    $('#home').show();
    $('#profile').show();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-books').click(function() {
    $('section').hide();
    $('#search-books').show();
    $('#profile').show();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-courses').click(function() {
    $('section').hide();
    $('#search-courses').show();
    $('#profile').show();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-feedback').click(function() {
    $('section').hide();
    $('#feedback').show();
    $('#profile').show();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-contact').click(function() {
    $('section').hide();
    $('#contact').show();
    $('#profile').show();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-signup').click(function() {
    $('section').hide();
    $('#profile').hide();
    $('#signup').show();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-add').click(function() {
    removeLoggedInSection();
    $('section').hide();
    getAddingForms();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-changeUser').click(function() {
    removeLoggedInSection();
    $('section').hide();
    displayUsers();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-profile').click(function() {
    removeLoggedInSection();
    $('section').hide();
    getProfile();
    $('.errmsg').remove();
    $('.msg').remove();
});

$('#btn-message').click(function() {
    removeLoggedInSection();
    $('section').hide();
    $('.errmsg').remove();
    $('.msg').remove();
    getMessage();

});

$('#btn-send').click(function() {
    removeLoggedInSection();
    $('section').hide();
    $('.errmsg').remove();
    $('.msg').remove();
    sendMessage();
});

$('#btn-follow').click(function() {
    removeLoggedInSection();
    $('section').hide();
    $('.errmsg').remove();
    $('.msg').remove();
    followFriend();
});

$('#btn-follows').click(function() {
    removeLoggedInSection();
    $('section').hide();
    $('.errmsg').remove();
    $('.msg').remove();
    getFollows();
});



$('nav#navbar').click(function() {
    $('#container').remove();
});

$('#search-course').click(function(event) {
    event.preventDefault();
    removeLoggedInSection();
    $('section').hide();
    $('.errmsg').remove();
    $('.msg').remove();
    getCourse();
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

function getProfile() {
    $.ajax(
    {
        url: "profile",
        method: "GET",
        dataType: "json",
        success: function(data) {
            console.log(data);
            if (data.length > 0) {
                var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
                var $title1 = $("<h2>", {id: "info"});
                $title1.text("User Imformation: ");
                var $title2 = $("<h2>", {id: "offercourse"});
                $title2.text("Offer Course: ");
                var $title3 = $("<h2>", {id: "offerBook"});
                $title3.text("Offer Book: ");
                var $paragraph1 = $("<p>", {id: "profileparagraph"});
                var $linebreak = $("<br>");
                $container.append($title1);

                var $form = $("<form>", {id: "infoform", action: "/changeInfo", method: "post"});
                var $email = $("<label>");
                $email.text("Email: ");
                var $email_input = $("<input>", {name: "user_email", value: checkNull(data[0][0].email), readonly: "readonly"});
                $email.append($email_input);
                $form.append($email);
                $form.append("<br>");
                var $password = $("<label>");
                $password.text("Password: ");
                var $password_input = $("<input>", {name: "user_password", type: "password", value: checkNull(data[0][0].password)});
                $password.append($password_input);
                $form.append($password);
                $form.append("<br>")

                var $birthday = $("<label>");
                $birthday.text("Birthday: ");
                var $birthday_input = $("<input>", {name: "user_birthday", value: checkNull(data[0][0].birthday)});
                $birthday.append($birthday_input);
                $form.append($birthday);
                $form.append("<br>")

                var $phone = $("<label>");
                $phone.text("Phone: ");
                var $phone_input = $("<input>", {name: "user_phone", value: checkNull(data[0][0].phone)});
                $phone.append($phone_input);
                $form.append($phone);
                $form.append("<br>")

                var $year_of_study = $("<label>");
                $year_of_study.text("Year of Study: ");
                var $year_of_study_input = $("<input>", {name: "user_year_of_study", value: checkNull(data[0][0].year_of_study)});
                $year_of_study.append($year_of_study_input);
                $form.append($year_of_study);
                $form.append("<br>")

                var $major = $("<label>");
                $major.text("Major: ");
                var $major_input = $("<input>", {name: "user_major", value: checkNull(data[0][0].major)});
                $major.append($major_input);
                $form.append($major);
                $form.append("<br>")

                var $button = $("<button>", {type: "submit"}).text("Save Information");
                $form.append($button);


                $paragraph1.append($form);

                $container.append($paragraph1);
                $container.append("<hr>");

                $container.append($title2);
                if (data.length > 1) {
                    var $paragraph2 = $("<p>", {id: "profileparagraph"});
                    for (var i = 0; i < data[1].length; i++) {
                        $paragraph2.append("Course: " + checkNull(data[1][i].title) + "<br>" +
                                            "Section: " + checkNull(data[1][i].sect) + "<br>" +
                                            "Department: " + checkNull(data[1][i].dept) + "<br>" +
                                            "Code: " + checkNull(data[1][i].num));
                        $paragraph2.append("<hr>");
                    }
                    $container.append($paragraph2);
                }
                $container.append("<hr>");
                $container.append($title3);
                if (data.length > 2) {
                    var $paragraph3 = $("<p>", {id: "profileparagraph"});
                    for (var j = 0; j < data[2].length; j++) {
                        $paragraph3.append("Title: " + checkNull(data[2][j].title) + "<br>" +
                                            "Author: " + checkNull(data[2][j].author) + "<br>" +
                                            "Publisher: " + checkNull(data[2][j].publisher) + "<br>"
                                            );
                        $paragraph3.append("<hr>");
                    }
                    $container.append($paragraph3);
                }
                $container.append("<hr>");
                $container.insertBefore($("footer"));

            } else {
                var $paragraph =  $("<p></p>", {id: "404"});
                $paragraph.text("404 Not Found!")
                $('body').append($paragraph);
            }
        }
    });
}


function getAddingForms() {
    var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
    var $title1 = $("<h2>", {class: "sectiontitle"});
    var $title2 = $("<h2>", {class: "sectiontitle"});
    $title1.text("Add Offer Books");
    $title2.text("Add Offer Courses");
    var $bookform = $("#searchBookForm").clone().prop("id", "addBookForm");
    var $courseform = $("#searchCourseForm").clone().prop("id", "addCourseForm");
    $bookform.attr("action","add_book");
    $courseform.attr("action", "add_course");
    $courseform.attr("method", "post");
    $bookform.find("#search-book").text("Add Book!");
    $courseform.find("#search-course").text("Add Course!");
    $container.append($title1);
    $container.append($bookform);
    $container.append("<hr>");
    $container.append($title2);
    $container.append($courseform);
    $container.insertBefore($("footer"));


}

function getFollows() {
    $.ajax({
        url: "follows",
        method: "POST",
        dataType: "json",
        success: function(data) {
            if (data.length > 0) {
                console.log(JSON.stringify(data));
                var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
                var $title = $("<h2>", {class: "sectiontitle"});
                var $following_list = $("<ul>", {id: "following_list"});
                $title.text("Following");
                $container.append($title);
                for (var i = 0; i < data[0].length; i++) {
                    var $following_user = $("<li>", {class: "following_user"});
                    $following_user.text(data[0][i].user2);
                    $following_list.append($following_user);
                }
                $container.append($following_list);
                $container.append("<hr>");
                var $title = $("<h2>", {class: "sectiontitle", text: "Followers"});
                $container.append($title);
                var $follower_list = $("<ul>", {id: "follower_list"});
                for (var i = 0; i < data[1].length; i++) {
                    var $follower_user = $("<li>", {class: "follower_user"});
                    $follower_user.text(data[1][i].user1);
                    $follower_list.append($follower_user);
                }
                $container.append($follower_list);
                $container.insertBefore($("footer"));

            } else {
                var $paragraph =  $("<p></p>", {id: "404"});
                $paragraph.text("404 Not Found!")
                $('body').append($paragraph);
            }
        }
    });
}

function getMessage() {
    $.ajax(
    {
        url: "message",
        method: "POST",
        dataType: "json",
        success: function(data) {
            if (data.length > 0) {
                console.log(JSON.stringify(data));
                var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
                var $title = $("<h2>", {class: "sectiontitle"});
                $title.text("My Message");
                $container.append($title);
                for (var i = 0; i < data[0].length; i++) {
                    var $msgwindows = $("<dl>", {class: "msgwindows"});
                    var $sender = $("<dt>", {class: "sender"});
                    var $msg = $("<dd>", {class: "message"});
                    $sender.text("From: " + data[0][i].user1);
                    $msg.text("Text: " + data[0][i].message);
                    $msgwindows.append($sender);
                    $msgwindows.append($msg);
                    $msgwindows.append("<br>");
                    $container.append($msgwindows);
                    $container.append("<hr>");
                }
                $container.insertBefore($("footer"));

            } else {
                var $paragraph =  $("<p></p>", {id: "404"});
                $paragraph.text("404 Not Found!")
                $('body').append($paragraph);
            }
        }
    });
}

function sendMessage() {
    var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
    var $title = $("<h2>", {class: "sectiontitle"});
    $title.text("Send Message");
    var $lable = $("<lable>", {class: "label"});
    var $receiver = $("<input>", {name: "receiver", id: "receiver", placeholder: "receiver"});
    var $textbox = $("<textarea>", {name: "mymessage", row: "15", cols: "79", id: "msgbox"});
    var $button = $("<button>", {type: "submit", id: "submitmsg"});
    var $form = $("<form>", {action: "/sendmsg", method: "post"});
    $button.text("Send");
    $lable.text("Receiver: ");
    $form.append($lable);
    $form.append($receiver);
    $form.append($textbox);
    $form.append($button);
    $container.append($title);
    $container.append($form);
    $container.insertBefore($("footer"));
}

function followFriend() {
    var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
    var $title = $("<h2>", {class: "sectiontitle"});
    $title.text("Follow Friend");
    var $lable = $("<lable>", {class: "label"});
    var $receiver = $("<input>", {name: "friend", id: "receiver", placeholder: "Email"});
    var $button = $("<button>", {type: "submit", id: "submitmsg"});
    var $form = $("<form>", {action: "/follow", method: "post"});
    $button.text("Follow!");
    $lable.text("Target Email: ");
    $form.append($lable);
    $form.append($receiver);
    $form.append($button);
    $container.append($title);
    $container.append($form);
    $container.insertBefore($("footer"));
}

function getCourse() {

    $.ajax({
        url: "search_courses",
        method: "POST",
        dataType: "json",
        data: {
            department: $("#department").val(),
            code: $("#code").val(),
            section: $("#section").val()
        },
        success: function(data) {
            var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
            var $title = $("<h2>", {class: "sectiontitle", text: "Offering Courses"});
            $container.append($title);
            if (data[0].length > 0) {
                console.log(data);
                for (var i = 0; i < data[0].length; i++) {
                    $course_code = $("<h3>", {
                        class: "query_courses",
                        text: data[0][i].dept.toUpperCase() + data[0][i].num
                    });

                    $course_title = $("<h4>", {
                        class: "query_courses",
                        text: "Course Title: " + checkNull(data[0][i].sect)
                    });
                    $lecture_section = $("<h4>", {
                        class: "query_courses",
                        text: "Lecture Section: " + checkNull(data[0][i].title)
                    });

                    $contact_info = $("<p>", {
                        class: "query_courses",
                        text: "Contact Information: " + data[0][i].email
                    });

                    $container.append($course_code);
                    $container.append($course_title);
                    $container.append($lecture_section);
                    $container.append($contact_info);
                    $container.append("<hr>");

                }
            } else {
                    $no_result = $("<p>", {
                        text: "Sorry! Nothing was found. Please try a different query"
                    });
                    $container.append($no_result);
                    $container.append("<hr>");
            }

            var $title = $("<h2>", {class: "sectiontitle", text: "Recommendations"});
            $container.append($title);
            if (data[1].lengt > 0) {
                for (var i = 0; i < data[1].length; i++) {
                    $course_code = $("<h3>", {
                        class: "query_courses",
                        text: data[1][i].dept.toUpperCase() + data[1][i].num
                    });

                    $course_title = $("<h4>", {
                        class: "query_courses",
                        text: "Course Title: " + checkNull(data[1][i].sect)
                    });
                    $lecture_section = $("<h4>", {
                        class: "query_courses",
                        text: "Lecture Section: " + checkNull(data[1][i].title)
                    });

                    $contact_info = $("<p>", {
                        class: "query_courses",
                        text: "Contact Information: " + data[1][i].email
                    });

                    $container.append($course_code);
                    $container.append($course_title);
                    $container.append($lecture_section);
                    $container.append($contact_info);
                    $container.append("<hr>");
                }
            } else {
                $no_result = $("<p>", {
                        text: "Please provide more information to optimize your experience."
                });
                $container.append($no_result);
                $container.append("<hr>");
            }
            $container.insertBefore($("footer"));
        },
    });

}

function getBooks() {
    $.ajax({
        url: "search_books",
        method: "POST",
        dataType: "json",
        data: {
            department: $("#department").val(),
            code: $("#code").val(),
            section: $("#section").val()
        },
        success: function(data) {

        }
    });
}

function displayUsers(){
    $.ajax({
        url: "userList",
        method: "POST",
        dataType: "json",
        success: function(data) {
            var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
            var $title = $("<h2>");
            $title.text("User List");
            $container.append($title);
            console.log(data.length);
            console.log(data);
            for (var i=0; i < data.length; i++) {

                var $paragraph = $("<p>", {id: "user_" + (i+1), class: "user"});
                var $button = $("<button>", {id: "" + data[i].email, class: "selectUser"});

                $button.text("More Info");
                $paragraph.text("User " + (i+1) + ": "+ data[i].email);
                $paragraph.append($button);
                $paragraph.css({"border": "solid","border-width" : "1px"});
                $container.append($paragraph);
            }
            $container.insertBefore($("footer"));

            // make the button works
            $(".selectUser").click(function() {
                removeLoggedInSection();
                $('section').hide();
                $('.errmsg').remove();
                $('.msg').remove();
                changeUser(this.id);
            });
        }
    });
}

function removeLoggedInSection() {
    $(".logged-in-menu-item").remove();
}

function changeUser(username) {
    $.ajax({
        url: "userInfo",
        method: "POST",
        dataType: "json",
        data: {
            target: username
        },
        success: function(data) {

            var $container = $("<section>", {id: "container", class: "logged-in-menu-item"});
            var $title = $("<h2>", {class: "sectiontitle"});
            $title.text("Change User Information");
            var $form = $("<form>", {id: "infoform", action: "/changeInfo", method: "post"});
            $form.append($title);
            var $email = $("<label>");
            $email.text("Email: ");
            var $email_input = $("<input>", {name: "user_email", value: checkNull(data[0].email), readonly: "readonly"});
            $email.append($email_input);
            $form.append($email);
            $form.append("<br>");

            var $password = $("<label>");
            $password.text("Password: ");
            var $password_input = $("<input>", {name: "user_password", value: checkNull(data[0].password)});
            $password.append($password_input);
            $form.append($password);
            $form.append("<br>")

            var $birthday = $("<label>");
            $birthday.text("Birthday: ");
            var $birthday_input = $("<input>", {name: "user_birthday", value: checkNull(data[0].birthday)});
            $birthday.append($birthday_input);
            $form.append($birthday);
            $form.append("<br>")

            var $phone = $("<label>");
            $phone.text("Phone: ");
            var $phone_input = $("<input>", {name: "user_phone", value: checkNull(data[0].phone)});
            $phone.append($phone_input);
            $form.append($phone);
            $form.append("<br>")

            var $year_of_study = $("<label>");
            $year_of_study.text("Year of Study: ");
            var $year_of_study_input = $("<input>", {name: "user_year_of_study", value: checkNull(data[0].year_of_study)});
            $year_of_study.append($year_of_study_input);
            $form.append($year_of_study);
            $form.append("<br>")

            var $major = $("<label>");
            $major.text("Major: ");
            var $major_input = $("<input>", {name: "user_major", value: checkNull(data[0].major)});
            $major.append($major_input);
            $form.append($major);
            $form.append("<br>")

            var $button = $("<button>", {type: "submit"}).text("Save Information");
            $form.append($button);
            $container.append($form);
            $container.insertBefore($("footer"));
        }
    });
}

function checkNull(value) {
    if (value === null) {
        return "";
    } else {
        return value;
    }
}
