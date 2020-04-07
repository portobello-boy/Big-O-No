var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var evaluator = require('./assignment');
var circuit = require('./circuit');
var error = require('./error');
var errorList = require('./errorFile.json');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// POST endpoint test for boolean expression
app.post('/exp', function(req, res) {
  const body = req.body;
  const exp = body.expression;

  try {
    const table = evaluator.evalExpression(exp);
    console.log(table);
    res.set('Content-Type', 'text/json');
    res.status(200);
    res.json(table);
  } catch (err) {
    console.log(err);
    console.log(errorList[err.val].message);
    res.status(400);
    let msg;
    if (err.val)
      msg = errorList[err.val-1];
    else
      msg = "There was an error parsing your boolean expression.\n";
    // msg += "Make sure that your expressions are well formed, and that each connective is wrapped in parantheses with exactly two expressions on both sides.\n";
    res.send(msg);
    res.end()
  }
});

// POST endpoint for circuitry
app.post('/circuit', function(req, res) {
  const body = req.body;
  try {
    const evaluation = circuit.evaluateCircuit(body);
    res.set('Content-Type', 'text/json');
    res.status(200);
    res.json(evaluation);
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(400);
    let msg = "There was an error parsing your circuit.\n";
    msg += "Make sure that you follow the specified format, and check the testing files for examples.\n";
    res.send(msg);
    res.end()
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
