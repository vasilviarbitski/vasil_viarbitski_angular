var express = require ('express');
var session = require('express-session');
var timeout = require('connect-timeout');

var app = express ();
app.use(express.static('./'));
app.use(timeout(120000));

app.use(session({
  secret: 'keyboard cat',
  rolling:true,
  saveUninitialized: true,
  cookie: {
    maxAge:10*10000
  },
  resave: true
}));

app.post('/login', function(req, res){
    console.log(req.session.loginId);
    if (req.session.loginId === undefined) {
        var users = require('./data/users.json');
        var loginned = false;
        users.map(function (user) {
            if (user.login === req.body.creds.login &&
                user.password === req.body.creds.password) {
                req.session.loginId = user.id;
                loginned = true;
            }
        });

        res.send({success: loginned, userId: req.session.loginId});
    } else {
        req.session.touch(req.session.id, req.session);
        res.send({success: true, userId: req.session.loginId});
    }
});

app.listen(3000, function () {
  console.log('localhost:3000');
});
