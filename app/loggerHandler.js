/**************************************************************
 *                                                            *
 *              LOG HANDLING                                  *
 *                                                            *
 *                                                            *
 **************************************************************/


 const winston = require('winston');
 const moment = require('moment');
 
 var logger = new (winston.Logger)({
   transports: [
     new (winston.transports.Console)({
       level: 'info',
       colorize: true,
       timestamp: function() {
         return moment().format('LLLL');
       },
       json: false,
       prettyPrint: true,
       humanReadableUnhandledException: true,
     })
   ]
 });
 
 
 module.exports.logger = logger;