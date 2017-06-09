/**************************************************************
 *                                                            *
 *              Return Airports JSON                          *
 *                                                            *
 **************************************************************/
 
 
 const db     = require("../db");
 const logger = require("../loggerHandler").logger;
 
 
 // GET    /airports?q=Melbourne
 
 var getAirports = function (req, res) {
     
     var query = (req.query.q)? { $text: { $search : req.query.q } } : {};
     
     db.airport
      .find(query)
      .sort("airportCode")
      .select('-_id airportCode airportName cityCode cityName countryCode countryName latitude longitude stateCode timeZone')
      .exec(function(err,airportsList){
        
        if (err){
          logger.error(err);
          res.json([]); 
          return;
        }
        
        res.json(airportsList);
        
      });
     
 };
 
 
 
 exports.getAirports = getAirports;