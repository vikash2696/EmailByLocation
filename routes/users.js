var express = require('express');
var router = express.Router();
var connection = require('../connection');
var moment = require('moment-timezone');


var nodemailer = require("../node_modules/nodemailer");


var queryString = 'SELECT * FROM users';
var timeZones = [];

connection.query(queryString, function(err, result, fields) {
	
	Object.keys(result).forEach(function(key) {
		timeZones.push(result[key].timezone);
	});

	
});


/* GET users listing. */
router.get('/', function(req, res) {
	setTimeInterval(timeZones);

});

const setTimeInterval = function(timeZones) {
	setInterval(function() {
		var userList = [];
			var now = new Date();
			var utcDateTime = moment(now);

			timeZones.forEach(function(element) {
				console.log(element);
				//get time according to timezones
			  var curTime = utcDateTime.tz(element).format('ha');
			  console.log(curTime);
			  if(curTime == "8am") { 
			  	
			  	var getuserQuery = `SELECT * FROM users where timezone ="${element}"`;
				
			  	connection.query(getuserQuery, function(err, users, fields) {
			  		users.forEach(function(element1) {
			  			var err = "";
			  			nodemailer.createTestAccount(sendmail(err,element1.email));
			  		});
				});
			  }
			});
		}, 10000)
};

const sendmail = function (err, userEmail) {
    // create reusable transporter object using the default SMTP transport
console.log(userEmail);
	var transporter = nodemailer.createTransport({
		  service: 'gmail',
		  auth: {
		    user: 'vikash2696@gmail.com', //owner email address
		    pass: '***************' //owner email password
		  }
	});
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'vikash2696@gmail.com', // sender address
        to: userEmail, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Good Morning?</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent');
    });
};
module.exports = router;