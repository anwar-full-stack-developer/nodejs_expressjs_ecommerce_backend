const mongoose = require("mongoose");

// require("dotenv").config({ path: "./config.env" });
const dbName = "express_commerce";
var connectionString = process.env.DATABASE_DEFAULT_CONNECTION_STRING;

let conn;
module.exports = {
  createDBConnection: function (){
    conn = mongoose.createConnection(
      process.env.DATABASE_DEFAULT_CONNECTION_STRING,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    return conn;
  },
  getDBConnection: function (){
    if(!conn)
    conn = this.createDBConnection();
    return conn;
  },
};
