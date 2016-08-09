var express    = require('express');
var app        = express();
var multer     = require('multer');
var upload     = multer();
var bodyParser = require('body-parser');
var session    = require('express-session');

var instance_db = require(__dirname + '/database/instance_db.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.send('Welcome to remote_db!');
});

app.route('/db')
    .get(function(req, res) {
        instance_db.get_dbs(function (err, dbs) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                console.log(res);
                res.status(200).send(dbs);
            }
        })
    })
    .post(upload.single(), function(req, res) {
        instance_db.create_db(req.body.name, function (err, created) {
            if (err) {
                if (err.code === 'ER_DB_CREATE_EXISTS') {
                    res.status(400).send('Sorry, database "' + req.body.name + '" already exists!');
                }
                else {
                    res.status(500).send(err);
                }
            }
            else {
                console.log(res);
                res.status(200).send('Success! Created database "' + req.body.name + '"');
            }
        });
    });

var server = app.listen(3000, '159.203.99.200', function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('app listening at http://' + host + ':' + port);
});
