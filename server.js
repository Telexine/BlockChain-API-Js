 
const SHA256 = require("crypto-js/sha256");
const port = 3000;

//https://github.com/SavjeeTutorials/SavjeeCoin
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
 

function adduserKey(UserID,PublicKey,PrivateKey){
    var  Ref = keyRef.child("/"+UserID);
    Ref.set({
        pk:PublicKey,
        sk:PrivateKey
      });
}

 
//FUNCTION getPublic Key
let getuserPk =function(UID){
    getUserPromise = new Promise (function(resolve,reject){

    var  Ref = keyRef.child("/"+UID+"/pk");
    Ref.once("value", function(snapshot) {
        resolve(snapshot.val());
         
      });
    });
    return getUserPromise;
}
 

//FUNCTION getPrivate key
let getuserSk =function(UID){
    getuserSkPromise = new Promise (function(resolve,reject){

    var  Ref = keyRef.child("/"+UID+"/sk");
    Ref.once("value", function(snapshot) {
        resolve(snapshot.val());
      });
    });
    return getuserSkPromise;
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

//Express 
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();
json = require('json-simple');

//OpenSSL 
// do this first
// openssl genrsa -out ./my-server.key.pem 2048 
// openssl rsa -in ./my-server.key.pem -pubout -out ./my-server.pub 


'use strict';
  
/*
//test
console.log('Encrypt with Public');
msg = crt.encrypt("Everything is going to be 200 OK", 'utf8', 'base64');
console.log('encrypted', msg, '\n');
 
console.log('Decrypt with Private');
msg = key.decrypt(msg, 'base64', 'utf8');
console.log('decrypted', msg, '\n');
*/

//END OpenSSL
 
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
 


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


// User request the coupon
app.post('/getCoupon', function(req, res){



    auth = req.body.data.auth;
    vendor = req.body.data.VendorID;
    couponCode = req.body.data.couponCode;
 
// notification 
var ip = req.headers['x-forwarded-for'] ||
req.connection.remoteAddress;
 
console.log("["+ip.replace("::ffff:","")+ svrts()+' ~] "POST / Request Coupon '+couponCode+' by AUTH '+ auth+'"');
//end notifiocation 
 
 
    
    //Vaildate done here 
        /*
        1. Check validate digital signature 
        2. Count Coupon and check it's is still usable 
        
        
        */
    //End validate

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('thanks'+" " +req.body.data.couponID);
});


// vender Register Coupon
app.post('/registercoupon', function(req, res){
 

    // check digitalsignature
    /*
    1. fetch vendor pubkey from firebase 
    2. decrypt pubey to check signature that is valid 
    */

    //end checkdigitalsignture



    //working
   let description = req.body.data.description;
   let vendor = req.body.data.VendorID;
   let timestamp = Date.now();
   let Expiredate = addDays(timestamp,req.body.data.Expiredate);
   let allowance =  req.body.data.allowance;

   
// notification 
var ip = req.headers['x-forwarded-for'] ||
req.connection.remoteAddress;

console.log("["+ip.replace("::ffff:","")+ svrts()+' ~] "POST / Registered Coupon by '+ vendor+"/ desc: "+description+'"');
//end notifiocation 




    // generatehash ID
    let couponCode = SHA256(JSON.stringify(description+vendor+timestamp+Expiredate+timestamp+allowance).toString());




    //Put on firebase
    registercoupon(couponCode,description,vendor,timestamp,Expiredate,allowance);

 
    //Vaildate done here 

 //End validate

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('thanks'+" " +couponCode);
});



app.listen(port);
console.log('Listening at http://localhost:' + port)


//end Express 


const  TX = { //Transaction Type
    CREATE : {value:0},
    UPDATE : {value:1},
    DELETE : {value:2},
};

class transaction{ // inside Data of class Block

    constructor(TX,signature,VendorAddress,amount){
        this.TX = TX;
        this.signature = signature;// client pubkey
        this.VendorAddress = VendorAddress;
        this.amount = amount;

    }

}

class Block {
  constructor(index, data, previousHash = '') {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = Date.now();
    this.data = data;
    this.hash = this.calculateHash();
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
        return new Block(0, new transaction(TX.CREATE,"signature","VendorAdd",30), "");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    getLatestHash(){
        return this.getLatestBlock().hash;
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




let AECOIN = new Blockchain();


// new transaction
let data = new transaction();
data.TX=TX.CREATE;
data.signature="me";
data.VendorAddress="vendorID";
data.amount="2";

AECOIN.addBlock(new Block(1,data));
  //END Transaction
  
console.log('Blockchain valid? ' + AECOIN.isChainValid());

console.log('Changing a block...');
AECOIN.chain[1].data = { amount: 100 };
 
console.log("Blockchain valid? " + AECOIN.isChainValid());

console.log(AECOIN .getLatestHash());
 
 

//get Pub Key
/*
getuserPk("baker").then(function(result) {
    console.log(result) //will log results.
 })
 
*/

//get  pri key
/*
getuserSk("baker").then(function(result) {
    console.log(result) //will log results.
 })
 
*/
 



// Main FUNCTION
 
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

 function svrts(){
 
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