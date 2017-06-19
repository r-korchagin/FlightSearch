/**************************************************************
 *                                                            *
 *              Return Flight Search JSON                     *
 *                                                            *
 **************************************************************/
 

 
 const db     = require("../db");
 const logger = require("../loggerHandler").logger;
 const moment = require("moment");
 const searchDayDeviation = 2;
 
 // GET    "/flight_search/QF?date=2018-09-02&from=SYD&to=JFK"
 
 var getFlightSearch = function (req, res) {
     
     var query = db.flight.find({});
     
     // If airline_code exist, append to query
     if (req.params.airline_code){
         query.where("airline.code").equals(req.params.airline_code);
     }
     
     // If query date exist, append "from_date" - 2 days and "to_date" + 2 days
     if (req.query.date){
         var request_date = getFormatedDate(req.query.date); 
         
         // Check if date exist
         if (request_date !== undefined){
             var from_date = new Date(request_date);  from_date.setDate(from_date.getDate() - searchDayDeviation);
             var to_date = new Date(request_date);  to_date.setDate(to_date.getDate() + searchDayDeviation);
             
             query.where("start.dateTime").gt(from_date);
             query.where("start.dateTime").lt(to_date);
         }
     }
     
     // If "from" query exist
     if (req.query.from){
         query.where("start.airportCode").equals(req.query.from);
     }
     
     // If "to" query exist
     if (req.query.to){
         query.where("finish.airportCode").equals(req.query.to);
     }
     // Search in DB
    db.flight
      .find(query)
      .select('-_id key airline flightNum start finish plane distance durationMin price')
      .sort("price")
      .exec(function(err,flightList){
        
        // If get Error, return empty arr
        if (err){
          logger.error(err);
          res.json([]); 
          return;
        }
        res.json(flightList);
        
      });
 };
 
/*
function convert from String("YYYY-MM-DD") to Date  
*/
 function getFormatedDate(StringDate) {
     var m = moment(StringDate, "YYYY-MM-DD");
     if (m.isValid()) return m.toDate();
 }
 
 
 exports.getFlightSearch = getFlightSearch;