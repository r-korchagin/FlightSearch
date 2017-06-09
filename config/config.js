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
          
          DBLINK:  "mongodb://db_user_name:db_user_pass@mongo_server:mongo_port/flightsearch", 
          
          // System Name
          
          SYSNAME: "Flight Search",
          
          // MAX time session LIVE
          
          SESSIONAGE: 14*24*3600*1000  // 14 days,
          
};
