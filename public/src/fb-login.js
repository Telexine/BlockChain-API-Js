  

  window.fbAsyncInit = function() {
  
        FB.init({
          appId      : '1450879965011386',
          cookie     : true,
          xfbml      : true,
          version    : 'v2.11'
        });
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
            
             var accessToken =  response.authResponse.accessToken;
            FB.api('/me', function(response) {
               

                  console.log(accessToken)

            
                  DATA =  {data:{
                    token: accessToken,
                    username:  response.name
                }};
        
                 //encode 
                 var json_str = JSON.stringify(DATA); //JSON.parse()
                 console.log(json_str);

                 var http = new XMLHttpRequest();
                 
                         // var params = "text=stuff"; // data sender
                 
                         var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
                 
                 
                          
                          http.open("POST", "http://"+"localhost"+":3000/login", true);
                  
                          http.setRequestHeader("Content-Type", "application/json");
                 
                  
                          http.onreadystatechange = function() {
                              console.log('onreadystatechange');
                              if (http.readyState == 4 && http.status == 200) {
                                  alert(http.responseText);
                              }
                              else {
                                  console.log('readyState=' + http.readyState + ', status: ' + http.status);
                              }
                          }
                  
                          console.log('sending...')
                          http.send(json_str);
                          console.log('end');



              });


      
      
        function buildProfile(user){
          let profile = `
           ${user.name}
          `; 
          console.log(user.name+"sdsd")
        }


        });
      };
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
       function statusChangeCallback(response){
         if(response.status === 'connected'){
           console.log('Logged in and authenticated');
      
           // LOGIN Complete  Tae Added send req to svr
           
     
           
            FB.api('/me?fields=name', function(response){

               
              if(response && !response.error){
                console.log(response);
                
              }
      
              });

            
            
           setElements(true);
           testAPI();
         } else {
           console.log('Not authenticated');
           setElements(false);
         }
       }
      function checkLoginState() {
        FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
        });
      }

      

      function testAPI(){
        FB.api('/me?fields=name,email,birthday,location,picture', function(response){
          if(response && !response.error){
            //console.log(response);
            buildProfile(response);

          }
          FB.api('/me/feed', function(response){
            if(response && !response.error){
              buildFeed(response);
            }
          });
        })
      }
      function buildProfile(user){
        let profile = `
         ${user.name}
        `;
       
		let img = `<img src="http://graph.facebook.com/${user.id}/picture" >`;
        document.getElementById('profile').innerHTML = profile;
		document.getElementById('img-fb').innerHTML = img;

      }
      
      
      function setElements(isLoggedIn){
        if(isLoggedIn){
          document.getElementById('logout').style.display = 'block';
          document.getElementById('profile').style.display = 'block';
          document.getElementById('fb-btn').style.display = 'none';
		   document.getElementById('img-fb').style.display = 'block';
        } else {
          document.getElementById('logout').style.display = 'none';
          document.getElementById('profile').style.display = 'none';
          document.getElementById('fb-btn').style.display = 'block';
		  document.getElementById('img-fb').style.display = 'none';

        }
      }
      function logout(){
        FB.logout(function(response){
          setElements(false);
        });
      }
    



      // Tae ADDED

      function post(path, params, method) {
        method = method || "post"; // Set method to post by default if not specified.
    
        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);
    
        for(var key in params) {
            if(params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);
    
                form.appendChild(hiddenField);
            }
        }
    
        document.body.appendChild(form);
        form.submit();
    }
  
    
    /* ****************************************************************************  */
    
    
    
    /*
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1450879965011386',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
      });
      FB.getLoginStatus(function(response) {
          statusChangeCallback(response);
          FB.getLoginStatus(function(response) {
            if (response.status === 'connected') {
              console.log(response.authResponse.accessToken);
            }
          });
      });
    };
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
     function statusChangeCallback(response){
       if(response.status === 'connected'){
         console.log('Logged in and authenticated');
         setElements(true);
         testAPI();
       } else {
         console.log('Not authenticated');
         setElements(false);
       }
     }
    function checkLoginState() {
      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });
    }
    function testAPI(){
      FB.api('/me?fields=name,email,birthday,location,picture', function(response){
        if(response && !response.error){
          console.log(response);
          buildProfile(response);

        }
        FB.api('/me/feed', function(response){
          if(response && !response.error){
            buildFeed(response);
          }
        });
      })
    }
    function buildProfile(user){
      let profile = `
       ${user.name}
      `;
  let img = `<img src="http://graph.facebook.com/${user.id}/picture" >`;
      document.getElementById('profile').innerHTML = profile;
  document.getElementById('img-fb').innerHTML = img;
  
    }
    
    
    function setElements(isLoggedIn){
      if(isLoggedIn){
        document.getElementById('logout').style.display = 'block';
        document.getElementById('profile').style.display = 'block';
        document.getElementById('fb-btn').style.display = 'none';
     document.getElementById('img-fb').style.display = 'block';
      } else {
        document.getElementById('logout').style.display = 'none';
        document.getElementById('profile').style.display = 'none';
        document.getElementById('fb-btn').style.display = 'block';
    document.getElementById('img-fb').style.display = 'none';

      }
    }
    function logout(){
      FB.logout(function(response){
        setElements(false);
      });
    }
    */