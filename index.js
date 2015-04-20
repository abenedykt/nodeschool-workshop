var koa = require("koa");
var app = koa();
var router = require("koa-router")();
var db = require("./lib/db");
var parse = require("co-body");
var serve = require('koa-static');

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
    
    var existing = yield db.drones.find({name: newDrone.name});
    
    if(existing.length ==0){
        this.body = yield db.drones.insert(newDrone);
        this.status = 201;
    } else {
        this.body = {message:'dron o takiej nazwie juz istnieje'};
        this.status = 422;
    }
}

function* deleteDrones(){
    var droneId = this.params.id;
    yield db.drones.remove({_id:droneId})
    this.status = 200;
}

router.get('/drones',getDrones);
router.post('/drones',postDrones);
router.del('/drones/:id',deleteDrones);

app.use(serve(__dirname + '/public'));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 3000);
console.log('listening')
module.exports = app;