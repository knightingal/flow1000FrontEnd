var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var postMsg = require('./routes/postMsg');
var picDirs = require('./routes/picDirs');
picDirs.dirStat = [];
var app = express();
var fs = require('fs');
var RootDirString = '/home/knightingal/Downloads/.mix/1000/';
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(function () {
    var dirs = fs.readdirSync(RootDirString); 

    for (i = 0; i < dirs.length; i++) {
        var stat = fs.statSync(RootDirString + dirs[i]);
        var mtime = stat.mtime;
        picDirs.dirStat[i] = {
            "name": dirs[i],
            "mtime": mtime
        };
    }
    picDirs.dirStat.sort(function(a, b) {
        return a.mtime.getTime() - b.mtime.getTime();
    });
    for (i = 0; i < dirs.length; i++) {
        picDirs.dirStat[i]['index'] = i;
    }
})();

app.use('/', routes);
app.use('/users', users);
app.use('/startDownload', postMsg);
app.use('/picDirs', picDirs);

app.post('/testExist', function(req, res){
    console.log(req.body);
    var dirName = req.body[0];
    if (fs.existsSync(RootDirString + dirName) == true) {
        res.send('False');
    }
    else {
        res.send('True');
    }
});
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
