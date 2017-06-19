/**************************************************************
 *                                                            *
 *              Return Airports JSON                          *
 *                                                            *
 **************************************************************/
 
 
 const db     = require("../db");
 const logger = require("../loggerHandler").logger;
 
 
 // GET    /airports?q=Melbourne
 
 var getAirports = function (req, res) {
     
     var query = db.airport.find({});
     
     if (req.query.q){
        try {
            var containReg = new RegExp(req.query.q,"ig");
            query.where("airportName").regex(containReg);
        } catch(e){
            logger.error("RegExp Error. Query string:"
            +req.query.q+" e:"+e);
        }
     }
    //     var query = (req.query.q)? { $text: { $search : req.query.q } } : {};
     
     
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