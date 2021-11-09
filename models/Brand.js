const dbo = require("../db/conn");
const BrandSchema = require("./schema/Brand.schema"); 
const conn = dbo.getDBConnection();
module.exports = conn.model("Brand", BrandSchema, 'brands');