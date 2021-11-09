const dbo = require("../db/conn");
//category model
const Category = require("./Category"); 
const ProductSchema = require("./schema/Product.schema"); 
const conn = dbo.getDBConnection();
module.exports = conn.model("Product", ProductSchema, 'products');