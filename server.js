/**************************************************************
 *                                                            *
 *              This is the test Project                      *
 *                  for Flight Search                         *
 *                                                            *
 **************************************************************/


const apl = require("./app/app");
const config = require("./config/config");

console.log("Start Server at Port:"+config.PORT+" and IP:"+config.IP);

apl.runServer(config.PORT, config.IP);