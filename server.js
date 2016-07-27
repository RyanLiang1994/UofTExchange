var http = require("http");
var fs = require("fs");
var cool = require('cool-ascii-faces');
var express = require("express");
var app = express();
var expressValidator = require("express-validator");
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var bcrypt = require('bcryptjs');
var path = require('path');
var nunjucks = require('nunjucks');
var session = require('express-session');
var sequelize = require('sequelize');

// Code for Heroku, need to change to fit in our app
// app.set('port', (process.env.PORT || 3000));
// // app.use(express.static(__dirname + '/public'));
// // views is directory for all template files
// app.set('views', __dirname + '/views');
// app.set('view engine', 'nunjucks');
// app.get('/', function(request, response) {
//   response.render('pages/index')
// });
// app.get('/cool', function(request, response) {
//   response.send(cool());
// });
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });

/*
	this is a list of url to save url which we
	might receive request later
*/
var url_list = ['/', '/index.html'];
var db = new sqlite3.Database('db.sqlite');
db.serialize();
nunjucks.configure('views', { autoescape: true, express: app });

app.use(express.static(__dirname + '/assets'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'html');
app.use(session({ secret: 'Who is Ryan', resave: false, saveUninitialized: false }));
// Expose session variables to views
app.use(function(req, res, next) {
  res.locals.session = req.session;
  next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(expressValidator({
	customValidators: {
		// isUserName: function(value) {
		// 	var reg = /^[0-9A-Za-z_]{1,32}$/;
        //
		// 	return String(value).search(reg) >= 0;
		// },

		isPassword: function(value) {
			var reg = /^[a-zA-Z0-9]{8,32}$/;
			return String(value).search(reg) >= 0;


		},

        isBirthday: function(value) {
            var reg = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
            return String(value).search(reg) >= 0;
        }

	}


}));

app.get(url_list[0] || url_list[1], function(req, res) {
    res.render('index', {  // Note that .html is assumed.
        "errors": ''
    });


//	res.sendFile(__dirname + '/index.html');
});



app.post('/signup', function(req, res) {
	req.assert('email', 'Username is required').notEmpty();
	req.assert('pword', 'Password is required').notEmpty();
    req.assert('birth', 'Birthday is required').notEmpty();

	req.checkBody('email', 'Username is not valid').isEmail();
	req.checkBody('pword', 'Password is not valid').isPassword();
    req.checkBody('birth', 'Birthday is not valid').isBirthday();

    req.check('confirm', 'password is not matched').equals(req.body.pword);

	var err = req.validationErrors();
    var mappedErrors = req.validationErrors(true);
    console.log("0");
    if (err) // If errors exist, send them back to the form:
    {
        console.log(err);
        console.log(req.body.email);
        console.log(req.body.confirm);
        console.log(req.body.birth);
        var msgs = { "errors": {} };



        if ( mappedErrors.email )
            msgs.errors.error_email = mappedErrors.email.msg;

        if ( mappedErrors.pword )
            msgs.errors.error_pword = mappedErrors.pword.msg;

        if ( mappedErrors.confirm)
            msgs.errors.error_confirm = mappedErrors.confirm.msg;

        if ( mappedErrors.birth )
            msgs.errors.error_birth = mappedErrors.birth.msg;

        // res.sendFile(__dirname + '/index.html');
        res.render('index.html', msgs);


    } else {
		//submit the data to database
        var username = req.body.email;
        var password = req.body.pword;
        var dob = req.body.birth;
        var result = create_user(username, password, dob, function (err) {
            if (err) {
                req.session.errmsg = err;
                res.render('index.html');
                req.session.errmsg = "";
            } else {
                req.session.username = username;
                req.session.errmsg = "Signup successfully!";
                res.redirect('/');
                req.session.errmsg = "";
            }
        });
	}
});


function create_user(username, password, dob, callback) {

    db.all('SELECT email FROM users WHERE email = ?', [username], function(err, rows) {
        var result;
        if (err) {
            callback(err);
            return;
        }

        if (rows.length > 0) {
            // user already exist
            console.log("insert err");
            callback('This username has already existed')
            return;

        } else {
            db.run('INSERT INTO users (email, password, birthday, is_admin) VALUES (?, ?, ?, ?)', [username, password, dob, 0], function (err) {
                callback(err);
            });
        }
    });
}

app.post('/search_courses', function(req, res) {
	var lenDept = req.body.department.trim().length,
		lenNum = req.body.code.trim().length,
		lenSect = req.body.section.trim().length;

	var msgs = {"errors": {}};

	if (!lenDept && !lenNum && !lenSect) {
		msgs.errors.course_empty = "Please enter in at least 1 field";
		res.render('index', msgs);
	} else {
		var offers_course = "";
		if (lenDept) {
			if (offers_course.length) {
				offers_course += ' and ';
			}
			offers_course = offers_course + "lower(dept) like '%" + req.sanitize('department').escape().trim() + "%'";
		}

		if (lenNum) {
			if (offers_course.length) {
				offers_course += ' and ';
			}
			offers_course = offers_course + "num = " + req.sanitize('code').escape().trim();
		}

		if (lenSect) {
			if (offers_course.length) {
				offers_course += ' and ';
			}
			offers_course = offers_course + "lower(sect) like '%" + req.sanitize('section').escape().trim() + "%'";
		}

		var query_offers_course = "SELECT * FROM offers_course WHERE " + offers_course.toLowerCase();

		db.all(query_offers_course, function(err, rows) {
			if (err) throw err;
			console.log(rows);
			res.end();
		});
	}

});


app.post('/search_books', function(req, res) {

	var lenTitle = req.body.title.trim().length,
		lenAuthor = req.body.author.trim().length,
		lenPublisher = req.body.publisher.trim().length,
		lenDept = req.body.dept.trim().length,
		lenNum = req.body.num.trim().length;

	var msgs = {"errors": {}};

	if (!lenTitle && !lenAuthor && !lenPublisher && !lenDept && !lenNum) {

	} else {

		var offers_book = "";
		if (lenTitle) {
			if (offers_book.length) {
				offers_book += ' and ';
			}
			offers_book = offers_book + "lower(title) like '%" + req.sanitize('title').escape().trim() + "%'";
		}

		if (lenAuthor) {
			if (offers_book.length) {
				offers_book += ' and ';
			}
			offers_book = offers_book + "lower(author) like '%" + req.sanitize('author').escape().trim() + "%'";
		}

		if (lenPublisher) {
			if (offers_book.length) {
				offers_book += ' and ';
			}
			offers_book = offers_book + "lower(publisher) like '%" + req.sanitize('publisher').escape().trim() + "%'";
		}

		var course_textbook = "";
		if (lenDept && !lenNum) {
			course_textbook = "lower(dept) like '%" + req.sanitize('dept').escape().trim() + "%'";
		} else if (!lenDept&& lenNum) {
			course_textbook = "num = " + req.sanitize('num').escape().trim();
		} else if (lenDept && lenNum) {
			course_textbook = "lower(dept) like '%" + req.sanitize('dept').escape().trim() + "%' and num = " + req.sanitize('num').escape().trim();
		}

		var query_offers_book = "SELECT * FROM offers_book WHERE " + offers_book.toLowerCase();
		var query_course_textbook = "SELECT title, author FROM course_textbook WHERE " + course_textbook.toLowerCase();
		var query_join_offer_textbook = "SELECT o.email as email, o.title as title, o.author as author, o.publisher as publisher FROM offers_book o, (" + query_course_textbook + ") c WHERE o.title = c.title and o.author = c.author";
		var result;
		if (offers_book.length && !course_textbook.length) {
			result = query_offers_book;
		} else if (!offers_book.length && course_textbook.length) {
			result = query_course_textbook;
		} else if (offers_book.length && course_textbook.length) {
			result = query_offers_book + " intersect " + query_join_offer_textbook;
		}

		db.all(result, function(err, rows) {
			if (err) {
                throw err;
            }
            console.log(rows);
            res.end();
		});
	}

});



app.post('/signin', function(req, res) {
	req.assert('mail', 'Username is required').notEmpty();
	req.assert('password', 'Password is required').notEmpty();


	req.checkBody('mail', 'Username is not valid').isEmail();
	req.checkBody('password', 'Password is not valid').isPassword();


	var err = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    if (err) // If errors exist, send them back to the form:
    {
        var msgs = { "errors": {} };


        if ( mappedErrors.mail )
            msgs.errors.error_mail = mappedErrors.mail.msg;

        if ( mappedErrors.password )
            msgs.errors.error_password = mappedErrors.password.msg;


        // res.sendFile(__dirname + '/index.html');
        res.render('index', msgs);

    } else {
		//submit the data to database
        var username = req.body.mail;
        db.all("SELECT email, password, birthday, is_admin FROM users WHERE email = ?",  [ username ], function(err, rows) {
            if (err) {
                throw err;
            }
            if(!rows || rows.length > 1) {
                throw "this shouldn't happen";
            }

            if (rows.length === 1 && req.body.password === rows[0].password && req.body.dob === rows[0].birthday) {
                req.session.username = username;
                res.redirect('/');
            } else {
                var err = req.validationErrors();
                var msgs = { "errors": {} };
                msgs.errors.error_password = "Password is not correct!";
                res.render('index', msgs);
            }
        })
	}
});



app.get('/signout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

app.post('/feedback', function(req, res) {
    var feedback = req.body.feedback.substring(0, 200);
    console.log("ssss" +feedback);
    if (feedback) {
        db.run('INSERT INTO feedbacks (feedback) VALUES (?)', [ feedback ], function (err){
            if (err) {
                req.session.errmsg = "Feedback submit err";

                res.redirect('/');
                req.session.errmsg = "";
            } else {
                req.session.msg = "Feedback submit success! Thank you for your feedback.";

                res.redirect('/');
                req.session.msg = "";
            }
        });
    }
});

app.get('/profile', function(req, res) {
    console.log(req.session.username);
    if (!req.session.username) {
        // hasn't login yet
        res.end(JSON.stringify([]));
    } else {
        var result = [];
        var username = req.session.username;

        db.all("SELECT email, phone, year_of_study, major FROM users WHERE email = ?",  [ username ], function(err, rows) {
            result.push(rows);
        });

        db.all("SELECT email, dept, num, title, sect FROM offers_course WHERE email = ?",  [ username ], function(err, rows) {
            result.push(rows);

        });

        db.all("SELECT email, title, author, publisher FROM offers_book WHERE email = ?",  [ username ], function(err, rows) {
            result.push(rows);
            res.end(JSON.stringify(result));

        });

    }
});

app.post('/message', function(req, res) {
    if (!req.session.username) {
        res.end(JSON.stringify([]));
    } else {
        var result = [];
        var username = req.session.username;
        db.all("SELECT user1, user2, message FROM messages WHERE user2 = ?",  [ username ], function(err, rows) {
            result.push(rows);
            res.end(JSON.stringify(result));
        });
    }
});

app.post('/sendmsg', function(req, res) {
    if (!req.session.username) {
        res.end(JSON.stringify([]));
    } else {
        var receiver = req.body.receiver;
        var username = req.session.username;
        var message = req.body.mymessage;
        db.all("SELECT email, is_admin FROM users WHERE email = ?",  [ receiver ], function(err, rows) {
            if (rows.length > 0) {
                var result = [];
                db.run('INSERT INTO messages (user1, user2, message) VALUES (?, ?, ?)', [ username, receiver, message], function (err){
                    if (err) {
                        req.session.errmsg = "Send message failed";

                        res.redirect('/');
                        req.session.errmsg = "";
                    } else {
                        req.session.msg = "Send successfully!";

                        res.redirect('/');
                        req.session.msg = "";
                    }
                });
            } else {
                // cannot find this user
                req.session.errmsg = "Send message failed, cannot find this receiver.";

                res.redirect('/');
                req.session.errmsg = "";
            }
        });
    }
});

var server = app.listen(3000, function()
{
  var port = server.address().port;
  console.log('Running on 127.0.0.1:%s', port);
});

//
// app.get('/googlelogin', function(req, res) {
//     req.session.username = "Ryan";
//     res.render('index.html');
// });
//
// app.get("/googlelogout", function(req, res) {
//     req.session.destroy();
//     res.redirect('/');
// })
