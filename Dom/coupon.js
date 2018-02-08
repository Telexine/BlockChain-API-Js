
function btnkfc()
{		
			var get_kfc = document.getElementById("get_kfc_id");
			var content1 = document.getElementById("content1"); 			
 			var newbtn  = document.createElement("button");
			var newbtn2  = document.createElement("button");
	
	var hide = document.createElement('div');
			hide.setAttribute("class","center-div")	;
					hide.style.textAlign = "center";
					hide.style.marginTop = "10px";
			
			newbtn.setAttribute("class","mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
			newbtn.style.marginLeft = "62px";
			
			newbtn2.setAttribute("class","mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
			newbtn2.style.marginLeft = "62px";
			newbtn2.style.marginTop = "15px";
	
			newbtn.textContent = "Collection";
			newbtn2.textContent = "Get coupon";
			
			content1.removeChild(get_kfc);
			content1.appendChild(newbtn);
			content1.appendChild(hide);
			content1.appendChild(newbtn2);
	
				/* create new div + collect+hide div */
			
				newbtn.onclick = function()
				{
					if(hide.style.display === 'none'){
						hide.style.display = "block";
				}
					else
					{
						var coupon = document.createElement("div");
				var x = document.getElementsByClassName("myClasskfc");    
				var xparent = x[0].parentNode;
					
				 while (x.length) {
        				coupon.appendChild(x[0]);
				 	}
						xparent.appendChild(coupon);
						coupon.setAttribute('id','coupon');
					
					hide.appendChild(xparent);
					console.log(xparent);
						hide.style.display = "none";
					}
					
				};
				
				
				/* create new div + gencode */
				newbtn2.onclick = function()
				{
					
					var wrapper1 = document.createElement("div");			wrapper1.setAttribute("class","myClasskfc");		
					wrapper1.style.textAlign = "center";
					wrapper1.style.marginTop = "10px";
					wrapper1.textContent = "JAV"+Math.floor((Math.random() * 100000000) + 1);
					
					content1.appendChild(wrapper1);
					
				};			
}
function btnstar()
{
	var get_star = document.getElementById("get_star_id");
	var content2 = document.getElementById("content2");	
	var newbtn  = document.createElement("button");
	var newbtn2  = document.createElement("button");
	/* */
	var usecoupon  = document.createElement("button");
	usecoupon.setAttribute("id","use");
	
			var hide = document.createElement('div');
			hide.setAttribute("class","center-div")	;
					hide.style.textAlign = "center";
					hide.style.marginTop = "10px";
	
			newbtn.setAttribute("class","mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
			newbtn.style.marginLeft = "62px";
			
			newbtn2.setAttribute("class","mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
	
			newbtn2.style.marginLeft = "62px";
			newbtn2.style.marginTop = "15px";

			newbtn.textContent = "Collection";
			newbtn2.textContent = "Get coupon";
			
			
			content2.removeChild(get_star);
			content2.appendChild(newbtn);
			content2.appendChild(hide);
			content2.appendChild(newbtn2);
			
				/* create new div + collect+hide div */
		
				newbtn.onclick = function()
				{
					if(hide.style.display === 'none'){
						hide.style.display = "block";
				}
					else
					{
						var coupon = document.createElement("div");
				var x = document.getElementsByClassName("myClass");    
				var xparent = x[0].parentNode;
					
				 while (x.length) 
				 	{
        				coupon.appendChild(x[0]);
						
						
				 	}
						xparent.appendChild(coupon);
						
						coupon.setAttribute('id','coupon');
						
					
					hide.appendChild(xparent);
					console.log(xparent);
						hide.style.display = "none";
					}
					
				};
                
	
	
				
				/* create new div + gencode */
				newbtn2.onclick = function()
				{
				
					var wrapper1 = document.createElement("div");			wrapper1.setAttribute("class","myClass");		
					wrapper1.style.textAlign = "center";
					wrapper1.style.marginTop = "10px";
					wrapper1.textContent = "JAV"+Math.floor((Math.random() * 100000000) + 1);										
					
					content2.appendChild(wrapper1);		
				
					console.log(wrapper1);
					
					
				};
}


/*
function removed()
{
					 hide = document.getElementById("wrapper");
						while (hide.firstChild) 
						{
    				 hide.removeChild(hide.firstChild);
							}
}*/
