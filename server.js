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
	req.assert('mail', 'Username is required').notEmpty();
	req.assert('pword', 'Password is required').notEmpty();

	req.checkBody('mail', 'Username is not valid').isEmail();
	req.checkBody('pword', 'Password is not valid').isPassword();
    req.check('confirm', 'password is not matched').equals(req.body.pword);

	var err = req.validationErrors();
    var mappedErrors = req.validationErrors(true);

    if (err) // If errors exist, send them back to the form:
    {
        var msgs = { "errors": {} };


        if ( mappedErrors.mail )
            msgs.errors.error_mail = mappedErrors.mail.msg;

        if ( mappedErrors.pword )
            msgs.errors.error_pword = mappedErrors.pword.msg;

        if ( mappedErrors.confirm)
            msgs.errors.error_confirm = mappedErrors.confirm.msg;

        // res.sendFile(__dirname + '/index.html');
        res.render('index', msgs);
        res.redirect(__dirname + '/signup');

    } else {
		//submit the data to database
		console.log("signup");
	}
});

app.post('/search_books', function(req, res) {
	req.assert('title', '').notEmpty();
	req.assert('author', '').notEmpty();
	req.assert('publisher', '').notEmpty();
	req.assert('isbn', '').notEmpty();
	req.assert('course', '').notEmpty();

	var mappedErrors = req.validationErrors(true);

	var msgs = {"errors": {}};

	if (mappedErrors.title && mappedErrors.author && mappedErrors.publisher
		&& mappedErrors.isbn && mappedErrors.course) {
		msgs.errors.error_empty = "Please enter in at least 1 field";
		res.render('index', msgs);
	} else {
		var where = '';
		if (req.body.title.length > 0) {
			if (where.length > 0) {
				where += ' and '
			}
			where = where + "lower(title) like '%" + req.body.title + "%'";
		}

		if (req.body.author.length > 0) {
			if (where.length > 0) {
				where += ' and '
			}
			where = where + "lower(author) like '%" + req.body.author + "%'";
		}

		if (req.body.publisher.length > 0) {
			if (where.length > 0) {
				where += ' and '
			}
			where = where + "lower(publisher) like '%" + req.body.publisher + "%'";
		}

		if (req.body.isbn.length > 0) {
			if (where.length > 0) {
				where += ' and '
			}
			where = where + "isbn = " + req.body.isbn;
		}

		db.all("SELECT * FROM books WHERE " + where.toLowerCase(), function(err, rows) {
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
        console.log("blahblah");
        var username = req.body.email;
        db.all("SELECT email, password, is_admin FROM users WHERE email = '" + username + "'", function(err, rows) {
            if (err) {
                throw err;
            }
            if(!rows || rows.length > 1) {
                throw "this shouldn't happen";
            }

            if (rows.length === 1 && req.body.password === rows[0].password) {
                console.log("do something");
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
