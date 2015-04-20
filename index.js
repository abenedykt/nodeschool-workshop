var koa = require("koa");
var app = koa();
var router = require("koa-router")();
var db = require("./lib/db");
var parse = require("co-body");

function* getDrones(){
    
    this.status = 200;
    this.body = yield db.drones.find({});
}

function* postDrones(){

    var droneParams = yield parse(this);
    var newDrone = {
        name : droneParams.name,
        time : droneParams.time
    };
    
    this.body = yield db.drones.insert(newDrone);
    this.status = 201;
    
    
}

router.get('/drones',getDrones);
router.post('/drones',postDrones);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
console.log('listening')
module.exports = app;