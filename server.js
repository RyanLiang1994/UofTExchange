var http = require("http");
var fs = require("fs");
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

	}
}));

app.get(url_list[0] || url_list[1], function(req, res) {
    res.render('index', {  // Note that .html is assumed.
        "errors": ''
    });


//	res.sendFile(__dirname + '/index.html');
});



app.post('/signup', function(req, res)
{
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
        console.log("1");
        var username = req.body.email;
        var password = req.body.pword;
        var dob = req.body.birth;
        var result = create_user(username, password, dob, function (err) {
            if (err) {
                var msgs = { "errors": err }
                res.render('index.html', msgs);
            } else {
                req.session.username = username;
                res.redirect('/');
            }
        });
	}
});


function create_user(username, password, dob, callback) {

    db.all('SELECT email FROM users WHERE email = ?', [username], function(err, rows) {
        var result;
        if (err) {
            console.log(err);
            return;
        }

        if (rows.length > 0) {
            // user already exist
            console.log("insert err");
            callback('Already exists')
            return;

        } else {
            db.run('INSERT INTO users (email, password, birthday, is_admin) VALUES (?, ?, ?, ?)', [username, password, dob, 0], function (err) {
                callback(err);
            });
        }
    });
}


app.post('/search_books', function(req, res) {
	req.assert('title', '').notEmpty();
	req.assert('author', '').notEmpty();
	req.assert('publisher', '').notEmpty();
	req.assert('dept', '').notEmpty();
	req.assert('num', '').notEmpty();

	var mappedErrors = req.validationErrors(true);

	var msgs = {"errors": {}};

	if (mappedErrors.title && mappedErrors.author && mappedErrors.publisher &&
		mappedErrors.dept && mappedErrors.num) {
		msgs.errors.error_empty = "Please enter in at least 1 field";
		res.render('index', msgs);
	} else {
		var offers_book = '';
		if (req.body.title.length > 0) {
			if (offers_book.length > 0) {
				offers_book += ' and ';
			}
			offers_book = offers_book + "lower(title) like '%" + req.body.title + "%'";
		}

		if (req.body.author.length > 0) {
			if (offers_book.length > 0) {
				offers_book += ' and ';
			}
			offers_book = offers_book + "lower(author) like '%" + req.body.author + "%'";
		}

		if (req.body.publisher.length > 0) {
			if (offers_book.length > 0) {
				offers_book += ' and ';
			}
			offers_book = offers_book + "lower(publisher) like '%" + req.body.publisher + "%'";
		}

		var course_textbook = '';
		if (req.body.dept.length > 0 && req.body.num.length == 0) {
			course_textbook = "lower(dept) like '%" + req.body.dept + "%'";
		} else if (req.body.dept.length == 0 && req.body.num.length > 0) {
			course_textbook = "num = " + req.body.num;
		} else if (req.body.dept.length > 0 && req.body.num.length > 0){
			course_textbook = "lower(dept) like '%" + req.body.dept + "%' and num = " + req.body.num;
		}

		var query_offers_book = "SELECT * FROM offers_book WHERE " + offers_book.toLowerCase();
		var query_course_textbook = "SELECT title, author FROM course_textbook WHERE " + course_textbook.toLowerCase();
		var query_join_offer_textbook = "SELECT o.email, o.title, o.author, o.publisher FROM offers_book o, (" + query_course_textbook + ") c WHERE o.title = c.title and o.author = c.author";
		var result;
		if (offers_book.length > 0 && course_textbook.length == 0) {
			result = query_offers_book;
		} else if (offers_book.length == 0 && course_textbook.length > 0) {
			result = query_course_textbook;
		} else if (offers_book.length > 0 && course_textbook.length > 0) {
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



app.post('/signin', function(req, res)
{
	req.assert('email', 'Username is required').notEmpty();
	req.assert('password', 'Password is required').notEmpty();


	req.checkBody('email', 'Username is not valid').isEmail();
	req.checkBody('password', 'Password is not valid').isPassword();


	var err = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    if (err) // If errors exist, send them back to the form:
    {
        var msgs = { "errors": {} };


        if ( mappedErrors.email )
            msgs.errors.error_email = mappedErrors.email.msg;

        if ( mappedErrors.password )
            msgs.errors.error_password = mappedErrors.password.msg;


        // res.sendFile(__dirname + '/index.html');
        res.render('index', msgs);

    } else {
		//submit the data to database
        var username = req.body.email;
        db.all("SELECT email, password, birthday, is_admin FROM users WHERE email = '" + username + "'", function(err, rows) {
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

var server = app.listen(3000, function()
{
  var port = server.address().port;
  console.log('Running on 127.0.0.1:%s', port);
});


app.get('/googlelogin', function(req, res) {
    req.session.username = "Ryan";
    res.render('index.html');
});

app.get("/googlelogout", function(req, res) {
    req.session.destroy();
    res.redirect('/');
})
