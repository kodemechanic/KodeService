// Mocha Test for Users API

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var expect = require('expect');

describe('Regression Testing -', function() {
  var url = 'localhost:3001';
  var username = "mochatest";
  var password = "test";
  var username2 = "mochatest123";
  var password2 = "testing";
  var user_id = null;
  var user_id2 = null;
  var uTokenString = null;
  var uTokenID = null;
  
  var adminUsername = "admin";
  var adminPassword = "admin";
  var admin_id = null;
  var adminTokenString = null;
  var adminTokenID = null;
  
// App Vars
  var appname = "Test App 1";
  var appname2 = "secondUserApp";

// Client Vars
  var clientID = "12345";
  var tokenString = null;
  var tokenID = null;

// Collection Vars
  var collection = "myPeople";
  var collection2 = "yourPeople";
  var collectionUser2 = "secondCollection";

// Item Vars  
  var LucyItemID = null;
  var JackItemID = null;
  var BorkItemID = null;

// Authentication Vars
  var userLoginToken = null;
  var userLoginToken2 = null;
  var userAPIToken = null;
  var userAPIToken2 = null;
  var clientAPIToken = null;
  var adminToken = null;
  

// *********************   USER     ***************************************************
/*  describe('ADMIN USER', function(){

		it('Create Admin User', function(done){
			var profile = {
				username: adminUsername,
				password: adminPassword,
				email: 'admin@test.com'
			};
			
			request(url)
				.post('/admin')
				.send(profile)
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}

					admin_id = res.body._id;
					
					done();
				});
		});
  });   
*/


  describe('USER REGISTER AND LOGIN', function(){

		it('Create New User', function(done){
			var profile = {
				username: username,
				password: password,
				password2: password,
				email: 'test@test.com'
			};
			
			request(url)
				.post('/user')
				.send(profile)
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}

					user_id = res.body._id;
					
					done();
				});
		});   

		it('Create Second User', function(done){
			var profile = {
				username: username2,
				password: password2,
				password2: password2,
				email: 'test2@test.com'
			};
			
			request(url)
				.post('/user')
				.send(profile)
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}

					user_id2 = res.body._id;
					
					done();
				});
		});

    it('Invalid Login', function(done){
			
			var dPath = "/user/authenticate";
						
			request(url)
				.post(dPath)
				.auth('test','testas')
				.expect(401)				
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});

		it('Login and retrieve Token for User Access', function(done){
			var dPath = "/user/authenticate";						
			request(url)
				.post(dPath)
				.auth(username,password)
				.expect(200)				
				.end(function(err, res){
					if (err) {
						throw err;
					}
			        userLoginToken = "Bearer " + res.body.results.token;  
//console.log(res.body.results.token);
					done();
				});
		});   

		it('Login and retrieve Token for User2 Access', function(done){
			var dPath = "/user/authenticate";						
			request(url)
				.post(dPath)
				.auth(username2,password2)
				.expect(200)				
				.end(function(err, res){
				if (err) {
						throw err;
					}
			        userLoginToken2 = "Bearer " + res.body.results.token;  
					done();
				});
		});   
  });

	describe('USER TESTING - Token Auth Required', function(){	
	
		it('Return a specific user', function(done){
			
			var dPath = "/user/" + username;
		
//console.log(dPath);
//console.log(userLoginToken);
	
			request(url)
				.get(dPath)  
				.set('Authorization', userLoginToken)      
				.expect(200)        
				.expect('Content-Type', /json/)  
				.end(function(err, res){				
//		      		console.log(res.body.results);
				res.body.should.have.property('results');
					res.body.results.username.should.equal('mochatest');
					if (err) {
						throw err;
					}
					done();
				});
		});   

		it('Update username/pw/email', function(done) {
			
			var dPath = "/user/" + username;
			
			var profile = {
				username: 'test1',
				password: 'test1',
				email: 'test1@test.com'
			};
			
			request(url)
				.put(dPath)
				.set('Authorization', userLoginToken)      
				.send(profile)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res){
					if (err) { 
						throw err;
					}
					res.body.should.have.property('results');
					res.body.results.username.should.equal('mochatest')
					res.body.results.email.should.equal('test1@test.com')
        
          password = profile.password;
        
					done();
				});
		});

		it('Attempt to create duplicate user', function(done){
			var profile = {
				username: 'mochatest',
				password: 'test1',
				password2: 'test1',
				email: 'test1@test.com'
			};
						
			request(url)
				.post('/user')
				.send(profile)
				.expect(200)
				.end(function(err, res){
					if (err) {
						throw err;
					}
					res.body.should.have.property('success');
res.body.success.should.equal(false);	
					done();
				});
		});    
		
		it('Reset username/pw/email', function(done) {
			
			var dPath = "/user/" + username;
			
			var profile = {
				username: 'mochatest',
				password: 'test',
				email: 'test1@test.com'
			};
			
			request(url)
				.put(dPath)
				.set('Authorization', userLoginToken)      
				.send(profile)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, res){
					if (err) { 
						throw err;
					}
					res.body.should.have.property('results');
					res.body.results.username.should.equal('mochatest')
					res.body.results.email.should.equal('test1@test.com')
        
          password = profile.password;
        
					done();
				});
		}); 
		
		it('Attempt to Reset username/pw/email of another user.', function(done) {
			
			var dPath = "/user/" + username2;
			
			var profile = {
				username: 'mochatestingdone',
				password: 'testing',
				email: 'test1@testes.com'
			};
			
			request(url)
				.put(dPath)
				.set('Authorization', userLoginToken)      
				.send(profile)
				.expect(401)
				.end(function(err, res){
					if (err) { 
						throw err;
					}
					done();
				});
		}); 		

  });  
// *********************   USERINFO   ******************************************
  describe('User', function(){
    it('Create USERINFO fields', function(done){
    
      dPath = "/user/" + username + "/info";
      
      var info = {
        firstName: "Test",
        lastName: "User",
        address: "1234 Test",
        city: "Wentzville",
        state: "MO",
        zip: "63385",
        country: "USA",
        phone: "1-234-567-8910",
        website: "www.test.com",
        notes: "No notes to be seen here."
      };

      request(url)
        .put(dPath)
        .set('authorization', userLoginToken)
        .send(info)					      
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });
    });		
        
    it('Update USERINFO fields', function(done){
      
      dPath = "/user/" + username + "/info";
      
      var info = {
        firstName: "Updated Test",
        lastName: "Updated User",
        address: "Updated 1234 Test",
        city: "Updated Wentzville",
        state: "MO",
        zip: "63385-1234",
        country: "USAd",
        phone: "1-234-567-8910 Updated ",
        website: "www.Updated.com",
        notes: "No Updated notes to be seen here."
      };
      
      request(url)
        .put(dPath)
        .send(info)
        .set('Authorization', userLoginToken)      
        .expect(200)        
        .end(function(err, res){

          if (err) {
            throw err;
          }
          
          done();
        });
    });     
     
    it('Update USERINFO fields  for Non-Existing User', function(done){
      
      dPath = "/user/randomNOuserPPL/info";
      
      var info = {
        firstName: "Updated Test",
        lastName: "Updated User",
        address: "Updated 1234 Test",
        city: "Updated Wentzville",
        state: "MO",
        zip: "63385-1234",
        country: "USAd",
        phone: "1-234-567-8910 Updated ",
        website: "www.Updated.com",
        notes: "No Updated notes to be seen here."
      };
      
      request(url)
        .put(dPath)
        .send(info)
        .set('Authorization', userLoginToken)      
        .expect(401)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });
    });    		    
  

    it('Attempt to update user info for another user', function(done){
      
      dPath = "/user/" + username2 + "/info";
      
      var info = {
        firstName: "Updated Test",
        lastName: "Updated User",
        address: "Updated 1234 Test",
        city: "Updated Wentzville",
        state: "MO",
        zip: "63385-1234",
        country: "USAd",
        phone: "1-234-567-8910 Updated ",
        website: "www.Updated.com",
        notes: "No Updated notes to be seen here."
      };
      
      request(url)
        .put(dPath)
        .send(info)
        .set('Authorization', userLoginToken)      
        .expect(401)        
        .end(function(err, res){

          if (err) {
            throw err;
          }
          
          done();
        });
    });     
  });
// *********************   APP   ******************************************
  
  describe('App', function(){
  
    it('Create New App for User', function(done){
			
			dPath = "/user/" + username + "/service";
						
			var newApp = {
				appname: appname,
				apptype: 'API',
				secret: 'test Secret'				 
			};
			
			request(url)
				.post(dPath)				
				.set('Authorization', userLoginToken)  
				.send(newApp)				
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});   
		
		it('Create Duplicate App', function(done){
			
			dPath = "/user/" + username + "/service";
			
			var newApp = {
				appname: appname,
				apptype: 'API',
				secret: 'test Secret'				 
			};
			
			request(url)
				.post(dPath)
				.send(newApp)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(400)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});   
		
		it('Create Second App', function(done){
			
			dPath = "/user/" + username + "/service";
			
			var newApp = {
				appname: 'Test App 2',
				apptype: 'API',
				secret: 'test Secret'				 
			};
			
			request(url)
				.post(dPath)
				.send(newApp)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});   
		
		it('Update App', function(done){
			
			dPath = "/user/" + username + "/service/" + appname;
			
			var newApp = {
				appname: 'UPDATED Test App',
				apptype: 'UPDATED API',
				secret: 'UDPATED Secret'				 
			};
			
			request(url)
				.put(dPath)
				.send(newApp)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					
					done();
				});				
		});
		
		it('Get app list from /user/:user/service', function(done){
			
			var dPath = "/user/" + username + "/service";
			
			request(url)
				.get(dPath)  
				.set('Authorization', userLoginToken)      
				.expect(200)        
				.expect('Content-Type', /json/)  
				.end(function(err, res){				
					if (err) {
						throw err;
					}
					done();
				});
		});
		
		it('Delete app', function(done){
			
			dPath = "/user/" + username + "/service/" + appname;
			
			var newApp = {
				appname: 'Test App 2',
				apptype: 'API',
				secret: 'test Secret'				 
			};
			
			request(url)
				.delete(dPath)
				.send(newApp)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});
		
		it('Delete non existing app', function(done){
			
			dPath = "/user/" + username + "/service/" + appname;
			
			var newApp = {
				appname: 'Test App 2',
				apptype: 'API',
				secret: 'test Secret'				 
			};
			
			request(url)
				.delete(dPath)
				.send(newApp)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});
  });


// *********************   CLIENT     ***************  DO WE EVEN NEED CLIENT WITHIN THIS APP????************************************
/* REMOVED UNTIL CLIENT IS WORKING AGIN...
 describe('CLIENT TESTING', function(){
  
    it('Create New Client for User', function(done){
			
			dPath = "/user/" + username + "/client";
						
			var newClient = {
        clientID: "12345",
        clientName: "my Client",
        clientContact: "foo foo bean",
        email: "ffb@client.com",
        phone: "1-234-567-8910",
        website: "www.clientme.com",
        clientNotes: "just some notes here",
        secret: "client Secret"				 
			};
			
			request(url)
				.post(dPath)
				.send(newClient)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});   
		
		it('Create Duplicate Client', function(done){
			
			dPath = "/user/" + username + "/client";
			
			var newClient = {
        clientID: "12345",
        clientName: "my Client",
        clientContact: "foo foo bean",
        email: "ffb@client.com",
        phone: "1-234-567-8910",
        website: "www.clientme.com",
        clientNotes: "just some notes here",
        secret: "client Secret"				 
			};
			
			request(url)
				.post(dPath)
				.send(newClient)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(400)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});   
		
		it('Create Second Client', function(done){
			
			dPath = "/user/" + username + "/client";
			
			var newClient = {
        clientID: "12345a",
        clientName: "myssssssssssient",
        clientContact: "fosssssssso foo bean",
        email: "ffb@clssssssssssient.com",
        phone: "1-234-5sssssssss67-8910",
        website: "www.clissssssssssssentme.com",
        clientNotes: "just somssssssssssssse notes here",
        secret: "client Sssssssssssssssecret"				 
			};
			
			request(url)
				.post(dPath)
				.send(newClient)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});   
		
		it('Update Client', function(done){			
			dPath = "/user/" + username + "/client/" + clientID;
			
			var newClient = {
        clientID: "12345a",
        clientName: "my111111111111nt",
        clientContact: "fo11111111111111foo bean",
        email: "ffb@cls1111111111111111nt.com",
        phone: "1-234-511111111167-8910",
        website: "www.cli11111111111tme.com",
        clientNotes: "just soms111111111111111e notes here",
        secret: "client S111111111111111111111111111cret"				 
			};
			
			request(url)
				.put(dPath)
				.send(newClient)
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});
		
		// CREATE RENEW DELETE TOKENS FOR CLIENT.
		
		
		
		it('Delete client', function(done){
			
			dPath = "/user/" + username + "/client/" + clientID;
			
			request(url)
				.delete(dPath)
				.send()
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});
		
		it('Delete non existing Client', function(done){
			
			dPath = "/user/" + username + "/client/" + appname;
			
			request(url)
				.delete(dPath)
				.send()
				.set('Authorization', userLoginToken)      
				.expect('Content-Type', /json/)
				.expect(200)        
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});
  });
*/  //END REMOVE for client working again



// **********************  API Testing  **************************************************
  describe('API TESTING', function(){
// ************ Collection  *************
	
    it('User Login for API Access', function(done){
      dPath = "/api/authenticate";
            
      request(url)
        .post(dPath)
        .auth(username,password)        
        .expect(200)        
        .end(function(err, res){
          if (err) {            
            throw err;
          }          
          userAPIToken = "Bearer " + res.body.results.token;          
          done();
        });      
    });

    it('User2 Login for API Access', function(done){
      dPath = "/api/authenticate";
            
      request(url)
        .post(dPath)
        .auth(username2,password2)        
        .expect(200)        
        .end(function(err, res){
          if (err) {            
            throw err;
          }          
          userAPIToken2 = "Bearer " + res.body.results.token;          
          done();
        });      
    });
	
	
    it('Create Item via API - Lucy', function(done){
      dPath = "/api/" + username + "/" + appname + "/" + collection;
            
      var data = {
        user : "Lucy",
        age : "21"		 
      };
      
      request(url)
        .post(dPath)
        .set('Authorization', userAPIToken)      
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;            
          }

//console.log(res.body);
          
          LucyItemID = res.body.result.insertedIds;
          
          done();
        });
    });
      
    it('Create Item via API - Jack', function(done){
        dPath = "/api/" + username + "/" + appname + "/" + collection2;
              
        var data = {
          user : "Jack",
          age : "4"		 
        };
        
        request(url)
          .post(dPath)
          .set('Authorization', userAPIToken)      
          .send(data)
          .expect('Content-Type', /json/)
          .expect(200)        
          .end(function(err, res){
            if (err) {
              throw err;
            }
            
            JackItemID = res.body.result.insertedIds;
            
            done();
          });
    });
      
    it('Create User2 Item via API - Bork', function(done){
      dPath = "/api/" + username2 + "/" + appname2 + "/" + collectionUser2;
            
      var data = {
        user : "Bork",
        age : "141"		 
      };
      
      request(url)
        .post(dPath)
        .set('Authorization', userAPIToken2)      
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;            
          }
          
          BorkItemID = res.body.result.insertedIds;
          
          done();
        });
    });
          
    it('Get list of services', function(done){
			
			var dPath = "/api/" + username;
			
			request(url)
				.get(dPath)  
				.set('Authorization', userAPIToken)      
				.expect(200)        
				.expect('Content-Type', /json/)  
				.end(function(err, res){				
					if (err) {
						throw err;
					}
					done();
				});
		});
		  
    it('Read Collection (Lucy)', function(done){
        dPath = "/api/" + username + "/" + appname + "/" + collection;
       
        request(url)
          .get(dPath)
          .set('Authorization', userAPIToken)      
          .send()
          .expect('Content-Type', /json/)
          .expect(200)        
          .end(function(err, res){
            if (err) {
              throw err;
            }
            done();
          });		
    });

      
    it('Attempt to drop another users collection - Jack', function(done){
      dPath = "/api/" + username + "/" + appname + "/" + collection2 + "?_drop_collection=true";
    
      request(url)
        .delete(dPath)
        .set('Authorization', userAPIToken2)      
        .send()        
        .expect(401)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });		
		});
		
		it('Drop Collection - Jack', function(done){
      dPath = "/api/" + username + "/" + appname + "/" + collection2 + "?_drop_collection=true";
    
      request(url)
        .delete(dPath)
        .set('Authorization', userAPIToken)      
        .send()
        .expect('Content-Type', /json/)
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });		
		});
		
		it('Read Item - Lucy', function(done){
      dPath = "/api/" + username + "/" + appname + "/" + collection + "/" + LucyItemID;
    
      request(url)
        .get(dPath)
        .set('Authorization', userAPIToken)      
        .send()
        .expect('Content-Type', /json/)
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });		
		});
		
		it('Update Item - Lucy', function(done){
      dPath = "/api/" + username + "/" + appname + "/" + collection + "/" + LucyItemID;
      
      var data = {
        username : "Updated",
        age: 199
      };
      
      request(url)
        .put(dPath)
        .set('Authorization', userAPIToken)      
        .send(data)
        .expect('Content-Type', /json/)
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });		
		});
		
		it('Delete Item - Lucy', function(done){
      dPath = "/api/" + username + "/" + appname + "/" + collection + "/" + LucyItemID;
    
      request(url)
        .delete(dPath)
        .set('Authorization', userAPIToken)      
        .send()
        .expect('Content-Type', /json/)
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });		
		});		
		
  });
  
// ********************  ADMIN AUTHENTICATION TESTING  **********************************
/*  removed until working
  describe('Admin Authentication Testing', function(){
 
    it('Admin Login', function(done){
      var dPath = "/admin/authenticate";
    	request(url)
				.post(dPath)
				.auth(adminUsername,adminPassword)
				.expect(200)				
				.end(function(err, res){
					if (err) {
						throw err;
					}
					
					adminToken = "Bearer " + res.body.token;
					done();
				});
		}); 
		
    it('List Users', function(done){
			
			var dPath = "/user/";
						
			request(url)
				.get(dPath)
				.set('Authorization', adminToken)              
				.expect(200)        
				.end(function(err, res){
					if (err) {
            console.log("response.body:   " + JSON.stringify(res.body));
            throw err;
					}
					done();
				});
		}); 
  });  
*/  // end reomved until working


// *********************   CLEANUP     ***************************************************
  describe('API CLEANUP', function(){
    
		it('Drop Collection - Lucy', function(done){
      dPath = "/api/" + username + "/" + appname + "/" + collection + "?_drop_collection=true";
    
      request(url)
        .delete(dPath)
        .set('Authorization', userAPIToken)      
        .send()
        .expect('Content-Type', /json/)
        .expect(200)        
        .end(function(err, res){
          if (err) {
            throw err;
          }
          done();
        });		
		});
  });
  
  describe('USER CLEANUP', function(){
 
/*    it('Admin Login', function(done){
      var dPath = "/admin/authenticate";
    	request(url)
				.post(dPath)
				.auth(adminUsername,adminPassword)
				.expect(200)				
				.end(function(err, res){
					if (err) {
						throw err;
					}
					
					adminToken = "Bearer " + res.body.token;
					done();
				});
		});  
*/
 
// **** TODO
    // Ensure user deletion also cleans up collections and tokens.

		it('Delete User 1', function(done){
			
			var dPath = "/user/" + username;
						
			request(url)
				.delete(dPath)
				.set('Authorization', userLoginToken) 
				.expect(200)        
				.end(function(err, res){
					if (err) {
            			throw err;
					}
					done();
				});
		});     

		it('Delete User 2', function(done){
			
			var dPath = "/user/" + username2;
						
			request(url)
				.delete(dPath)
				.set('Authorization', userLoginToken2) 
				.expect(200)        
				.end(function(err, res){
					if (err) {
            			throw err;
					}
					done();
				});
		});     
		
		it('FAIL to retrieve a non-existing user', function(done){
			
// ****  TODO			
			// currently successful call because logout on user delete is not implemented.
			// need to delete all tokens on user logout and/or delete.
			
			// NOT CORRECT test.  User token being used and should be Admin to confirm failure to get non existing user.
			
			var dPath = "/user/" + username;
			
			request(url)
				.get(dPath)		
				.set('Authorization', userLoginToken) 		
				.expect(400)               
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});


    // should get 401 because token /user not available????
		it('FAIL to delete a non-existing user', function(done){
        
			var dPath = "/user/" + username;
						
			request(url)
				.delete(dPath)
				.set('Authorization', userLoginToken)  				
				.expect(400)        
				.end(function(err, res){
					if (err) {
            throw err;
					}
					done();
				});
		});

    it('FAIL to use token of deleted user', function(done){
			var dPath = "/user/" + username;
			
			request(url)
				.get(dPath)
				.set('Authorization', userLoginToken) 				
				.expect(400)               
				.end(function(err, res){
					if (err) {
						throw err;
					}
					done();
				});
		});
   

  });
});
