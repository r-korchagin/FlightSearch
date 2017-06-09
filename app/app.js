/**************************************************************
 *                                                            *
 *              Routing of application endpoints              *
 *                                                            *
 *                                                            *
 **************************************************************/
const path = require('path');
const express = require("express");
const http = require('http');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);

// Local modules
const config = require("../config/config");
const requestHandler = require("./requestHandler");
const route = require("./routes");
const logger = require("./loggerHandler").logger;
// const db = require("./db");

var app = express();


var runServer = function (port,IP){
  
          // SET BODY PARSER
          app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
            extended: true,
            limit: '10mb'
          }));
          
          
          // SET COOKIE PARSER
          app.use(cookieParser());
          
          
          // SET SESSION
          app.use(session({
                    secret: 'Secret key for flight search',
                    resave: false, // don't save session if unmodified
                    saveUninitialized: false, // don't create session until something stored
                    cookie: { maxAge: config.SESSIONAGE }, // session life in ms
                    store: new MongoStore({
                        url : config.DBLINK
                    })
          }));

          // SET STATIC LINK
          app.use('/img',express.static(path.resolve(__dirname,'../static/img')));
          app.use('/style',express.static(path.resolve(__dirname,'../static/style')));
          app.use('/fonts',express.static(path.resolve(__dirname,'../static/fonts')));
          app.use('/js',express.static(path.resolve(__dirname,'../static/js')));
          
          // SET FAVICON
          app.use(favicon(path.resolve(__dirname,'../static/img/favicon.ico')));
          
          // SET log handler for href request  
          app.use('*', requestHandler.onMidlware);
          
          
          // ENDPOINTS

          app.get("/",route.getMainPage);
           
          app.get("/airlines",route.getAirlines);
           
          app.get("/airports",route.getAirports);
           
          app.get("/flight_search/:airline_code",route.getFlightSearch);
          
          // Not necessary. Endpoint for alternative search
          app.get("/flight_search",route.getFlightSearch);
           
           
          // NOT FOUND(404) ENDPOINT
          app.get('*', function(req, res){
                    res.status(404).send("Not found");
                    logger.info("'"+ req._parsedUrl.href + "' Not Found");
          });
          
          
          // ERROR HANDLER
          app.use(errorHandler);
          
          // START SERVER AT PORT
          http.createServer(app).listen(port);
          
};

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err);
  res.status(500);
  res.render('error', { error: err });
}

module.exports.runServer = runServer;