var monk = require("monk");
var wrap = require("co-monk");
var dbConnection = "mongodb://localhost/koa-workshop";
var db = monk(dbConnection);

module.exports.drones = wrap(db.get('drones'));