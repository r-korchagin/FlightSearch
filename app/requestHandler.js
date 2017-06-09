/**************************************************************
 *                                                            *
 *              Midlware request  logging                     *
 *                                                            *
 *                                                            *
 **************************************************************/


const logger = require("./loggerHandler").logger;

// Show in Console all request to server
var onMidlware = function(req,res,next){
          var pathname = req._parsedUrl.href; 
          logger.info(req.ip+" href='"+pathname+"'"); 
          next();
};

module.exports.onMidlware = onMidlware;