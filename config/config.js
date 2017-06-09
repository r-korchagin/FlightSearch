/**************************************************************
*                                                             *
*                Configuration File                           *            
*                                                             *
***************************************************************/


module.exports = {
          
          // SITE IP
          
          IP: process.env.IP ||"0.0.0.0",
          
          // SITE PORT
          
          PORT: process.env.PORT || 3000,
          
          // DB Link
          
          DBLINK:  "mongodb://flight:flightsearch3485@ds163681.mlab.com:63681/flightsearch", 
          
          // System Name
          
          SYSNAME: "Flight Search",
          
          // MAX time session LIVE
          
          SESSIONAGE: 14*24*3600*1000  // 14 days,
          
};