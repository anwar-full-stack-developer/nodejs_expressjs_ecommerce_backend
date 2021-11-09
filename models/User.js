const dbo = require("../db/conn");
const UserSchema = require("./schema/User.schema"); 
const conn = dbo.getDBConnection();
module.exports = conn.model("User", UserSchema, 'users');
// const User = conn.model("User", UserSchema, 'users');
// module.exports = User;