/**************************************************************
 *                                                            *
 *              Return Airlines JSON                          *
 *                                                            *
 **************************************************************/
 
 // GET              "/airlines"
 
const db     = require("../db");
const logger = require("../loggerHandler").logger;
 
 var getAirlines = function (req, res) {
     
     db.airlines
      .find({})
      .select('-_id code name')
      .exec(function(err,airlinesList){
        
        if (err){
          logger.error(err);
          res.json([]); 
          return;
        }
        
        res.json(airlinesList);
        
      });
     
 };
 
 
 
 exports.getAirlines = getAirlines;