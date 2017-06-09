/**************************************************************
 *                                                            *
 *              Define DB Schema and Model                    *
 *                                                            *
 **************************************************************/



const mongoose    = require('mongoose');
const config = require('../config/config');
const logger = require("./loggerHandler").logger;


mongoose.Promise = global.Promise;
mongoose.connect(config.DBLINK);

var db = mongoose.connection;

// Show ERROR if DB connection was unsuccessful
db.on('error', function (err) {
    logger.error('connection error: ' + err.message);
});

// Show info if DB connection was successful
db.once('open', function callback () {
    logger.info("Connected to DB " + config.DBLINK);
});

// Define Airlines schema 
var AirlinesSchema = new mongoose.Schema({
    code:        { type: String, unique : true, dropDups: true, index: true},
    name:        String
});

// Define Airports schema 
var AirportsSchema = new mongoose.Schema({
    airportCode:  String,
    airportName:  String,
    cityCode:     String,
    cityName:     String,
    countryCode:  String,
    countryName:  String,
    // For use geoindex prefer store location data in array [ <longitude> , <latitude> ] like { type: [Number], index: '2dsphere'},
    latitude:   	Number,
    longitude:  	Number,   
    stateCode:    String,
    timeZone:     String,
});

// SET text based search index
AirportsSchema.index({ "$**": "text" });


var FlightSchema = new mongoose.Schema({
        key	:       mongoose.Schema.Types.ObjectId,
        airline:    {	
                        code:	        String,
                        name:	        String
        },
        flightNum:	                    Number,
        start:      {	
                        dateTime:	    Date,
                        airportCode:	String,
                        airportName:	String,
                        cityCode:   	String,
                        cityName:   	String,
                        countryCode:	String,
                        countryName:	String,
                        latitude:   	Number,
                        longitude:  	Number,
                        stateCode:  	String,
                        timeZone:   	String
        },
        finish:     {	
                        dateTime:	    Date,
                        airportCode:	String,
                        airportName:	String,
                        cityCode:	    String,
                        cityName:	    String,
                        countryCode:	String,
                        countryName:	String,
                        latitude:   	Number,
                        longitude:  	Number,
                        stateCode:  	String,
                        timeZone:	    String
        },
        plane:       {
                        code:	        String,
                        shortName:	    String,
                        fullName:	    String,
                        manufacturer:	String,
                        model:      	String
        },
        distance:	                    Number,
        durationMin:                	Number,
        price:                      	Number
});


var airlines = mongoose.model('airlines', AirlinesSchema);
var airport  = mongoose.model('airports', AirportsSchema);
var flight   = mongoose.model('flights', FlightSchema);


exports.airlines = airlines;
exports.airport  = airport;
exports.flight   = flight;

