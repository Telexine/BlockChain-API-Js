  window.fbAsyncInit = function() {
        FB.init({
          appId      : '1450879965011386',
          cookie     : true,
          xfbml      : true,
          version    : 'v2.11'
        });
        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
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
    