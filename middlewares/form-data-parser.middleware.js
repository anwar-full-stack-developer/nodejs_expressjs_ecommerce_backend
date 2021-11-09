const formidable = require("formidable");

const formDataParserMiddleware = {
  parseFormData: async (req, res, next) => {
    if (req.method === "POST" || req.method === "PUT") {
      const form = formidable({
        multiples: true
      });

      let fd = {};
      await form.parse(req, (err, fields, files) => {
        // if (err) {
        //   next(err);
        //   return;
        // }
        req.files = files;
        req.body = fields;
        fd = fields;
        // console.log(fields);
        next();
      });
    } else {
      next();
    }
  },
};

module.exports = formDataParserMiddleware;
