const SHA256 = require("crypto-js/sha256");
const port = 3000;
const jwt = require('jsonwebtoken');//wee-auth
json = require('json-simple');
firebase = require('firebase');
var admin = require("firebase-admin");
require('es6-promise').polyfill();
let ArrayList = require('array-list');


//##########  INIT FBase Database  


/*
var config = {
    apiKey: "AIzaSyDZ8RandVyq9fv-VE4Ugg49eqfl4c2U49k",
    authDomain: "couponchaintx.firebaseapp.com",
    databaseURL: "https://couponchaintx.firebaseio.com"
  };
  
  firebase.initializeApp(config);
  
  var ref = firebase.database().ref();
*/
  
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
function add(Token,Username){
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
        snapshot.val();
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

//FUNCTION getCoupondata
let getAllCoupon =function(){
    getAllCouponPromise = new Promise (function(resolve,reject){

    var  Ref = couponRef.child("/");
    Ref.once("value", function(snapshot) {
        data = snapshot.val();
        if(data==null){
            console.log("code "+couponID+ " not found.");
            return;
        }

        resolve(snapshotToArray(snapshot));
   
      });
   
    });
    return getAllCouponPromise;
}


function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};
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


function deductAllowance(couponCode,num){
    var  Ref = couponRef.child("/"+couponCode);
    Ref.once("value", function(snapshot) {
        console.log(snapshot.val().Allowance);
        Ref.update({
            Allowance:(snapshot.val().Allowance-num)
          });
         
      });

      /*
    Ref.set({
        username:Username
      });*/
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
                Pool.addBlock(new Block(0,Pool.getLatestBlock().hash,TX.CREATE,token,vendor,1,couponCode));
                deductAllowance(couponCode,1); 


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



// vender Register Coupon
app.post('/registercoupon', function(req, res){
  
    // check digitalsignature
    /*
    1.  
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




// ############################################
//### CORE FUNCTION 
//#$##########################################
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
   
                        Do Chain ^^^^^ pass thru this it's mean user and code  exist 
    
*/
 
                    // เช็คว่ามคนนี้ีมีปองนี้อยู่แล้วไหม แล้วยังไม่ได้ใช้
                if(Pool.getCouponTransaction(couponCode,token,true)){
                    Pool.addBlock(new Block(0,Pool.getLatestBlock().hash,TX.DELETE,token,vendor,0,couponCode));
                    console.log("Complete : /n" );
                    console.log(Pool);
                }
            }else { // token not found
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end("ERROR: Token not found");
            }
         });

    }else { // coupon not found
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ERROR: Coupon not found");
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks'+" " +req.body.data.couponID); 
 });


});
app.post('/transfer', (req, res) => {
/**
 * 1. validate 
 * 2. create block
 * 
 */

  token = req.body.data.token;
  couponCode= req.body.data.couponCode;
  recieverToken=  req.body.data.recieverToken; // ผู้รับ

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
   
                        Do Chain pass thru this it's mean user and code  exist 
   !@#$%^ 
*/ 
                    if(Pool.getCouponTransaction(couponCode,token,true)){
                        
                        // used that coupon then redeem to trasnfered token
                        Pool.addBlock(new Block(0,Pool.getLatestBlock().hash,TX.TRASNFER,token,vendor,0,couponCode));
                        Pool.addBlock(new Block(0,Pool.getLatestBlock().hash,TX.CREATE,recieverToken,vendor,1,this.calculateHash()));
                    }
      
            }else { // token not found
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end("ERROR: Token not found");
            }
         });

    }else { // coupon not found
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("ERROR: Coupon not found");
    }

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('thanks'+" " +req.body.data.couponID); 
    
 });




});

/***
 * 
 *  PHASE 2 Function
 * 
 */
// fetch  coupon  of this user 
app.post('/fetchAllCoupon', (req, res) => {
 // do at node pool not at firebase
 let  Data = [];
 getAllCoupon().then(function(result) {
    
 
    // get coupon    
    for(let i = 0 ; i<result.length;i++ ){
       let createDate = result[i].CreateDate;
       let description = result[i].Description;
       let couponCode = result[i].couponCode;
       let allowance = result[i].Allowance;
       let vendorID = result[i].VendorID;
       
       Data.push({couponCode:couponCode,
          description:description,
          createDate:createDate,
          allowance:allowance,
          vendorID:vendorID
      });
   
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    let json = JSON.stringify(Data, null, 3);
    res.end(json);
});

 
     
}); 


// fetch  coupon  of this user 
app.post('/fetchUsersCoupon', (req, res) => {
 // do at node pool not at firebase
 let Token = req.body.data.token;
 
 
Datas = Pool.getThisUserChains(Token);

 // loop block,

 let Data = [];
 // get coupon    
 for(let i = 0 ; i<Datas.size();i++ ){
     let couponCode = Datas.get(i).couponCode;

     Data.push({data:couponCode});
   
      
      }
      // then call each coupon on userdevice

      res.writeHead(200, {'Content-Type': 'application/json'});
      let json = JSON.stringify(Data, null, 3);
      res.end(json);
     
 

  

}); 



// fetch  coupon  of this user 
app.post('/getCouponData', (req, res) => {
    // do at node pool not at firebase
  
    
   let  couponCode= req.body.data.couponCode;

   
    // loop block,
   
    let Data = [];
    // get coupon    
      
   
        Data.push({data:couponCode});
     
        getCoupon(couponCode).then(function(result) {
           let Desc= result.Description;
           let timestamp= result.CreateDate;
           let  allowance= result.Allowance;
           let  VID= result.VendorID;
           
               let Tmp_data = [];
   
               Tmp_data ={
                   couponCode:couponCode,
                   description:Desc,
                   CreateDate:timestamp,
                   Allowance:allowance,
                   VID:VID
                };
   
               Data.push(Tmp_data);


               res.writeHead(200, {'Content-Type': 'application/json'});
               let json = JSON.stringify(data, null, 3);
               res.end(json);
           });
               
            //encode 
         
          
         // then call each coupon on userdevice
   
       
        
    
   
     
   
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
    TRASNFER: {value:3}
};



class Block {
    constructor(index, previousHash = '',TX,Token,VendorAddress,amount,couponCode) {
      this.index = index;
      this.previousHash = previousHash;
      this.timestamp = Date.now();
 
      this.hash = this.calculateHash();



        // Transaction Data 

        this.TX = TX;
        this.token = Token;// client ID
        this.VendorAddress = VendorAddress;
        this.couponCode = couponCode
        this.amount = amount; // 0 = used
    }
    getCoupon(){
        return this.couponCode;
    }
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
  }
  
  
  class Blockchain{

    

      constructor() {
          this.Size = 0; 
          this.chain = [this.createGenesisBlock()];
         
      }
      
      createGenesisBlock() {
        this.Size++;
        return new Block(0,'' ,TX.CREATE,"signature",'userID',"VendorID",0,"couponCode");
      
      }
  
      getLatestBlock() {
          return this.chain[this.chain.length - 1];
      }
  
      addBlock(newBlock) {
          newBlock.previousHash = this.getLatestBlock().hash;
          newBlock.hash = newBlock.calculateHash();
          this.chain.push(newBlock);
          this.Size++;
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
      // 2 argument = get block ; 3 args = get un redeem block
      getCouponTransaction(couponcode,token,Valid/*:Optional, false = Used */){//ดู couponcode นั้นๆ
        
        if(typeof Valid === "undefined") {
            Valid = false;// unuse
        }
        let _flag = false;// chk is still usable
        let _findex = 0,_index=0;
        for(let i = 0;i<this.size();i++){
              let CouponCode = this.chain[i].couponCode;
              let Token = this.chain[i].token;
            if(CouponCode==(couponcode)&&Token==token){
                if(Valid==true){ // :: Optional 3rd arg check 
                    if(this.chain[i].amount>0){
                        _flag=true;
                        _findex=i;
                        continue; // it's used, then check next
                    }else{
                        _flag=false;
                       // return this.chain[i]; // return unuse coupon
                    }
                }else{
                    return this.chain[i]; // not care about use or not 
                }
            }
        }
        if(Valid&_flag){
            //return the lastest coupon that useable
            return this.chain[_findex];
        }else if(Valid&_flag==false){
            return false; // not usable anymore 
        } 
        return this.chain[_index]; // return lasted coupon that usable or not
      }

      getThisUserChains(token){


        let List = ArrayList();
        for(let i = 0;i<this.size();i++){
            let Token = this.chain[i].token;
          if(Token==token){
                    List.push(this.chain[i]); 
              } 
          }
          return List;
      }
      
    
      size(){
        return this.Size;
      }
  }


/*#########################################################
##                           INIT                         ###
########################################################### */

let Pool = new Blockchain();
//console.log(Pool.size()); 

//console.log(Pool.getLatestBlock().hash)
//console.log(Pool);
 
// โชวบล็อกที่มี แฮชนั้นๆ
Pool.addBlock(new Block(0,Pool.getLatestBlock().hash,TX.CREATE,"EAAUnkVDtHboBAFurxzGUJlzUq6GYozbpueyWA3gZBMBhXfxdgS6AaGZCDBYMXebhMb3dvkXER944F7LRrCONsv0q7D2AiSgSipMuRQAZBwlSElaoaNCg4YtgVVoMGgT7i8Qk5jZAj3ZA5YPrT6Jy2p4vrQm0NijZCj1QW1DDUWzHRhLSg3n3Yi7pGIzSzcrj0EmfetYbNbgQZDZD","VID0001",1,"08d511dd738e67223bc183c0a064c847d861fc1fb45f51572a9501a8c1826b07"));

//  Pool.getCouponTransaction(Pool.getLatestBlock().hash,"signature");
/*
Pool.addBlock(new Block(0,Pool.getLatestBlock().hash,TX.CREATE,"ccc","vendor",1,"cscscsc"));
console.log(Pool);
console.log(Pool.getCouponTransaction(0,"signature"));
*/
//deductAllowance("08d511dd738e67223bc183c0a064c847d861fc1fb45f51572a9501a8c1826b07",1);
//Pool.getThisUserChain("signature");
/*#########################################################
##                      END INIT     ###
########################################################## */

 


/*#########################################################
##                           Misc FUNCTION              ###
########################################################### */
 
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