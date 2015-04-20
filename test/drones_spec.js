var expect = require("chai").expect;
var app = require("../index");
var request =require("supertest").agent(app.listen());
var co = require("co");
var db = require("../lib/db");



describe('/drones', function(){
    
        it('test environment',function(){
            expect(true).to.be.ok;
        });
    
    var testDrone1 = {
        name : "drone1",
        time : 200
    };

    var testDrone2 = {
        name : "drone2",
        time : 220
    };


    describe('get', function(){
    
        beforeEach(function(done){
           co(function*(){
               yield db.drones.remove({});
               yield db.drones.insert(testDrone1);
               yield db.drones.insert(testDrone2);
           }).then(done,done);
        });
        
        it('returns a list of drones',function(done){
            request.get('/drones')
                .expect(200)
                .end(function(err, response){
                    var drones = response.body;
                    
                    expect(drones).to.have.length(2);
                    done();
                });
        });

    });
    
     describe('post', function(){
    
        beforeEach(function(done){
           co(function*(){
               yield db.drones.remove({});
           }).then(done,done);
        });
        
        
        it('adds an item to database',function(done){
            request.post('/drones')
                .send(testDrone1)
                .expect(201)
                .end(function(err, response){
                    var drone = response.body;
                    
                    expect(drone._id).to.be.ok;
                    
                    expect(drone.name).to.equal(testDrone1.name);
                    expect(drone.time).to.equal(testDrone1.time);
     
                    done();
                });
        });
    });
    
     describe('delete', function(){
    
        var droneId;
    
        beforeEach(function(done){
           co(function*(){
               yield db.drones.remove({});
               var drone = yield db.drones.insert(testDrone1);
               droneId = drone._id;
           }).then(done,done);
        });
        
        it('removes a drone from db',function(done){
            request.delete('/drones/' + droneId)
                .expect(200)
                .end(function(err, response){
                    co(function*(){
                        var drones = yield db.drones.find({});
                        expect(drones).to.be.length(0);
                      
                    }).then(done,done);
                });
        });
    });
});