const dbo = require("../db/conn");
const CategorySchema = require("./schema/Category.schema"); 
const conn = dbo.getDBConnection();

module.exports = conn.model("Category", CategorySchema, 'category');