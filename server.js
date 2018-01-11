 
 
const SHA256 = require("crypto-js/sha256");
const port = 3000;

const jwt = require('jsonwebtoken');//wee-auth

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


//'use strict';
  
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
 
app.use(express.static('public'));
 

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

// fb front ->

// wee authen
app.post('/login', (req, res) => {
    // Mock user

    const user = JSON.stringify(req.body) ;
    console.log(req.body.id);


    // แยกส่วน body
    //Token = req.body.data.Token;

    /*
    1. search in db if exist 
       - exist is login
       - else create new user
    */





    /*jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
      res.json({
        token
      });
     
    }); */

  });
// token // name  fb 
 

  

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

// BlockChain ==========================================================
const  TX = { //Transaction Type
    CREATE : {value:0},
    UPDATE : {value:1},
    DELETE : {value:2},
};

const  BlockTX ={
    REQUESTFROMVENDOR : {value:0},
    TRANSFER : {value:1},
    REDEEM :  {value:2}
}
// Genesisblock remark
const initblock ={
    SIGNAURE:{value:0},
    USERID:{value:0},
    VENDORID:{value:0},
    COUPONCODE:{value:0}
}; // REDEEMED REMARK
const REDEEMBLOCK ={
    SIGNAURE:{value:0},
    USERID:{value:0},
    VENDORID:{value:0},
    COUPONCODE:{value:0}
};
class transaction{ // Merged with Block 
   
    constructor(TX,signature,UserID,VendorAddress,amount,couponCode){
        this.TX = TX;
        this.signature = signature;// client pubkey
        this.userID = UserID;
        this.VendorAddress = VendorAddress;
        this.couponCode = couponCode
        this.amount = amount;

    }

}

class Block {
  constructor(index, previousHash = '',TX,signature,UserID,VendorAddress,amount,couponCode) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = Date.now();
    this.hash = this.calculateHash();
   
    // transaction 

    this.TX = TX;
    this.signature = signature;// client pubkey
    this.userID = UserID;
    this.VendorAddress = VendorAddress;
    this.couponCode = couponCode
    this.amount = amount;
  }

  getPreviouseHash(){

  }


  calculateHash() {
      return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
  }

  
}

class pool { // put blockchain inside it  *** this is for svr 
   
    constructor() {
        const  State = { //Transaction Type
            Valid : {value:1},
            Invalid : {value:0}

        };
        this.poolsize = 0;
        this.status = State.Valid;
        this.pool = []; // 1st array is init block  second is sub block 
        // blockchain is the main  chain data
        this.branch = []; // for store temp block, wait for validation and then commit to blockchain

    }

    size(){
        return  this.poolsize;
    }
    addPool(){
        this.poolsize++;
    }
    getStatus(){
        return this.status;
    }   

    pushBox(requestedBlock ){
 
       // console.log(requestedBlock);
       for(let i = 1;i<requestedBlock.length();i++){
      
                // chk allowance 
                let fbaseCouponData;
     
                let beforeamount ;
                let thisPool = this.pool;
                let thisPoolsize= this.poolsize;
                  let coupon = requestedBlock.getCouponCode(i); //40a59c1afb3e05eaec72928b1d70777678678884e56ca963b0277d15e5c4f34e
                  let thisBlock= requestedBlock.getBlock(i);
              let amount = requestedBlock.getBlock(i).amount;
        
        // if get from vendor (init pool)
        // create frist block pool 
             let thisBlockTransacType= requestedBlock.getBlockTransactionType().value;  
          if(thisBlockTransacType==BlockTX.REQUESTFROMVENDOR.value){ // BlockTX.REQUESTFROMVENDOR
  
       
            
            //console.log(this.poolsize);
            this.pool[this.poolsize]=thisBlock;
            

            getCoupon(coupon)
            .then(function(fetch) {
                fbaseCouponData = fetch;
                beforeamount = fbaseCouponData.Allowance;
                
             }).then(function(res){
                     // decrease allowance
                    if(beforeamount>amount){
                    //then add to pool
                   
                    
                    couponRef = ref.child("/couponcode/"+coupon);
                        
                        couponRef.update({
                            Allowance:(beforeamount-amount)
                          })
                        }else{return;};
             }).then(function(res){
                thisPool[thisPoolsize]=thisBlock;
               
             });
              this.poolsize++;
            console.log(this.poolsize);
            
           
 
         

          }else if(thisBlockTransacType==BlockTX.TRANSFER.value){ //BlockTX.TRANSFER
 
      
            for(let j = 0;j<this.poolsize;j++){
                      //find that coupon code in pool by hash in this.pool[j].hash

                     
                    if(this.pool[j].couponCode== coupon){// found the init block
                         // generate new hash
                        thisBlock.previousHash = this.pool[j].hash;
                        thisBlock.hash = thisBlock.calculateHash();
                 
                        this.pool.push(thisBlock);  // push to pool
               
                    }
 
              
             }
      
          }
           
    
       }
 
 
        
    }


          


}


class Blockchain{  
    constructor(blockTX) {
        this.chain = [this.createGenesisBlock()];
        this.BlockTX = blockTX;
    }

    createGenesisBlock() {
        return new Block(0,'' ,TX.CREATE,"signature",'userID',"VendorID",0,"couponCode");
    }
    
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    length(){ // count chain
        return this.chain.length;

    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    getLatestHash(){
        return this.getLatestBlock().hash;
    }
    getBlockTransactionType(){
        return this.BlockTX;
    }
    getInitBlock(){ // get first Block
        return this.chain[0];
    }

    getCouponCode(index){  // broken  
        return this.chain[index].couponCode;
    }

    getTransaction(index){return this.chain[index].data;}

    getCoupon(){
        return this.couponCode;
    }

    getBlock(index){ // get   Block
        return this.chain[index];
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


// End BlockChain ==========================================================

let AECOIN = new Blockchain(BlockTX.REQUESTFROMVENDOR);


// new transaction ========================================
 
AECOIN.addBlock(new Block(1,AECOIN.getLatestHash(),TX.CREATE,"me","id1","Vd001",1,"40a59c1afb3e05eaec72928b1d70777678678884e56ca963b0277d15e5c4f34e")); // creat box 
  
 
  //END Transaction ==========================================


  let Pool = new pool();
 
  console.log("Pool stat  " +Pool.getStatus().value);
  console.log("Pool Size "+ Pool.size());

//console.log(AECOIN.getBlock(1));
Pool.pushBox(AECOIN);

let transf = new Blockchain(BlockTX.TRANSFER);
transf.addBlock(new Block(1,transf.getLatestHash(),TX.CREATE,"me","id1","Vd001",1,"40a59c1afb3e05eaec72928b1d70777678678884e56ca963b0277d15e5c4f34e")); // creat box 
Pool.pushBox(transf);



console.log("Pool stat  " +Pool.getStatus());
console.log("Pool Size "+ Pool.size());

  //chk
  //console.log(Pool);


/*
  getCoupon("40a59c1afb3e05eaec72928b1d70777678678884e56ca963b0277d15e5c4f34e").then(function(result) {
    console.log(result) //will log results.
 })
*/
/*console.log('Blockchain valid? ' + AECOIN.isChainValid());

console.log('Changing a block...');
AECOIN.chain[1].data = { amount: 100 };
 
console.log("Blockchain valid? " + AECOIN.isChainValid());

console.log(AECOIN .getLatestHash());
 */


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