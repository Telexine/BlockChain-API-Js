const SHA256 = require("crypto-js/sha256");
const port = 3000;
const jwt = require('jsonwebtoken');//wee-auth
json = require('json-simple');
firebase = require('firebase');
var admin = require("firebase-admin");

//##########  INIT FBase Database  
var config = {
    apiKey: "AIzaSyDZ8RandVyq9fv-VE4Ugg49eqfl4c2U49k",
    authDomain: "couponchaintx.firebaseapp.com",
    databaseURL: "https://couponchaintx.firebaseio.com"
  };
  
  firebase.initializeApp(config);
  
  var ref = firebase.database().ref();

  
// Firebase Admin 
 
var admin = require("firebase-admin");

var serviceAccount = require("./couponchaintx.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://couponchaintx.firebaseio.com"
});


// Get a database reference to our blog
var db = admin.database();
var ref = db.ref("server/saving-data/");
let keyRef = ref.child("/userskey");
let couponRef = ref.child("/couponcode");
 
function CreateUser(Token,Username){
    var  Ref = keyRef.child("/"+Token);
    Ref.set({
        username:Username
      });
}


//FUNCTION getToken Key
let getToken =function(UID){
    getTokenPromise = new Promise (function(resolve,reject){

    var  Ref = keyRef.child("/"+UID+"/token");
    Ref.once("value", function(snapshot) {
        resolve(snapshot.val());

      });
    });
    return getTokenPromise;
}

//FUNCTION getToken Key
let isToken =function(Token){
    getTokenPromise = new Promise (function(resolve,reject){

    var  Ref = keyRef.child("/"+Token);
    Ref.once("value", function(snapshot) {
        resolve(snapshot.val());

      });
    });
    return getTokenPromise;
}


//FUNCTION getCoupondata
let getCoupon =function(couponID){
    getCouponPromise = new Promise (function(resolve,reject){

    var  Ref = couponRef.child("/"+couponID);
    Ref.once("value", function(snapshot) {
        data = snapshot.val();
        if(data==null){
            console.log("code "+couponID+ " not found.");
            return;
        }
        resolve(snapshot.val());
      });
   
    });
    return getCouponPromise;
}

//FUNCTION register Coupon to firebase
function registercoupon(couponCode,description,vendor,timestamp,Expiredate,allowance){
    var  Ref = couponRef.child("/"+couponCode);
    Ref.set({
        Description:description,
        VendorID:vendor,
        CreateDate:timestamp,
        Exp:Expiredate,
        Allowance:allowance
      });
}

//##########  END Firebase Function 






// ######### 
// ######### 
// ######### 
// #########                  Express 

// ######### 
// ######### 
// ######### 
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
json = require('json-simple');


// Send  HTML page to client
app.get('/debug101', function(req, res){
    var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress;
    console.log("["+ip.replace("::ffff:","")+svrts()+' ~] "GET /debug101.html:3000"')

    //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    var html = fs.readFileSync('index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
 
app.use(express.static('public'));

// Send  HTML page to client
app.get('/', function(req, res){
    var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress;
    console.log("["+ip.replace("::ffff:","")+svrts()+' ~] "GET /code/index.html"')

    //var html = '<html><body><form method="post" action="http://localhost:3000">Name: <input type="text" name="name" /><input type="submit" value="Submit" /></form></body>';
    var html = fs.readFileSync('code/index.html');
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(html);
});



// User request the coupon
app.post('/getCoupon', function(req, res){



    token = req.body.data.token;
    vendor = req.body.data.VendorID;
    couponCode = req.body.data.couponCode;
 
// notification 
var ip = req.headers['x-forwarded-for'] ||
req.connection.remoteAddress;
 
console.log("["+ip.replace("::ffff:","")+ svrts()+' ~] "POST / Request Coupon '+couponCode+' by token '+ token+'"');
//end notifiocation 
 
 
    
    //Vaildate done here 
        /*
        1. Check validate digital signature 
        2. Count Coupon and check it's is still usable 
        */
    //End validate
    
    getCoupon(couponCode).then(function(coupon) {
        console.log(coupon) //will log results.
        if(coupon.Allowance>0){// coupon exist 
          
            isToken(token).then(function(tokenresult) {
                console.log(tokenresult) //will log results.
                if(tokenresult){// token exist 
                    
/*
       
                            Do Chain ^^^^^
        
*/

                }else { // token not found
        
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end("ERROR: Token not found");    return;  

                }
        
             });




        }else { // coupon not found
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end("ERROR: Coupon not found");   return;  
        }

     });
    
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Got Coupon'); 
});


// fb front ->

 

// wee authen
app.post('/login', (req, res) => {
    // Mock user
 
    // แยกส่วน body
    //Token = req.body.data.Token;

    /*
    1. search in db if exist 
       - exist is login
       - else create new user
    */

    token = req.body.data.token;
    username= req.body.data.username;
   // token="test";
   // username = "AA";
    getToken(token).then(function(result) {
        console.log(result) //will log results.
        if(result){//exist
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('Logged');
        }else{//non-exist

            CreateUser(token,username);

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end('Created new User');
            //   redirect 
            var html = fs.readFileSync('index.html');
            res.end(html);
            
        }
     })


  });


// #####
//### CORE FUNCTION 
//#$###
//*** */

app.post('/usecoupon', (req, res) => {
    token = req.body.data.token;
    allowance= req.body.data.allowance;
    couponCode= req.body.data.couponCode;
// notification 
var ip = req.headers['x-forwarded-for'] ||
req.connection.remoteAddress;
console.log("["+ip.replace("::ffff:","")+ svrts()+' ~] "POST /usecoupon '+couponCode+' by token '+ token+" count ="+allowance  );
//end notifiocation 


getCoupon(couponCode).then(function(coupon) {
    console.log(coupon) //will log results.
    if(coupon.Allowance>0){// coupon exist 
      
        isToken(token).then(function(tokenresult) {
            console.log(tokenresult) //will log results.
            if(tokenresult){// token exist 
                
/*
   
                        Do Chain ^^^^^
    
*/

            }else { // token not found
    
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end("ERROR: Token not found");

            }
    
         });




    }else { // coupon not found
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ERROR: Coupon not found");
    }

 });

res.writeHead(200, {'Content-Type': 'text/html'});
res.end('thanks'+" " +req.body.data.couponID); 

});
app.post('/transfer', (req, res) => {




});
// fetch userdata 
app.post('/fetch', (req, res) => {
 // do at node pool not at firebase
}); 
app.listen(port);
console.log('Listening at http://localhost:' + port)

 









/** 
 *        BLOCK 
*/


const  TX = { //Transaction Type
    CREATE : {value:0},
    UPDATE : {value:1},
    DELETE : {value:2},
};



class Block {
    constructor(index, previousHash = '',TX,signature,VendorAddress,amount,couponCode) {
      this.index = index;
      this.previousHash = previousHash;
      this.timestamp = Date.now();
      this.data = data;
      this.hash = this.calculateHash();



        // Transaction Data 

        this.TX = TX;
        this.signature = signature;// client pubkey
        this.VendorAddress = VendorAddress;
        this.couponCode = couponCode
        this.amount = amount;
    }
  
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
  }
  
  
  class Blockchain{
      constructor() {
          this.chain = [this.createGenesisBlock()];
      }
  
      createGenesisBlock() {
        return new Block(0,'' ,TX.CREATE,"signature",'userID',"VendorID",0,"couponCode");
      }
  
      getLatestBlock() {
          return this.chain[this.chain.length - 1];
      }
  
      addBlock(newBlock) {
          newBlock.previousHash = this.getLatestBlock().hash;
          newBlock.hash = newBlock.calculateHash();
          this.chain.push(newBlock);
      }
  
      isChainValid() {
          for (let i = 1; i < this.chain.length; i++){
              const currentBlock = this.chain[i];
              const previousBlock = this.chain[i - 1];
  
              if (currentBlock.hash !== currentBlock.calculateHash()) {
                  return false;
              }
  
              if (currentBlock.previousHash !== previousBlock.hash) {
                  return false;
              }
          }
  
          return true;
      }
  }







// Misc FUNCTION
 
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

 function svrts(){ // timestamp 
 
        var dt = new Date();
        date = (dt.getDate()<10? "0"+dt.getDate():dt.getDate());
        month = (dt.getMonth()+1<10? "0"+dt.getMonth()+1:dt.getMonth()+1);
        min = (dt.getMinutes()<10? "0"+dt.getMinutes():dt.getMinutes());
        sec = (dt.getSeconds()<10? "0"+dt.getSeconds():dt.getSeconds());
        hour = (dt.getHours()<10? "0"+dt.getHours():dt.getHours());
        ms = dt.getMilliseconds();
        if(ms<10){"00"+ms;}else if(ms<100){"0"+ms;}

        return " "+date+"-"+month+"-" + dt.getFullYear()+" "+hour+":"+min+":"+sec+";"+ms+"ms";
 

 }