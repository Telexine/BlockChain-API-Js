


function appendMessage(storeName,logoPath)
{
	//init declare button action
	const content = document.createElement("div");
	const btnCol  = document.createElement("button");
	const btnCou  = document.createElement("button");
	const hide = document.createElement('div');
	
	
	btnCol.className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
	btnCou.className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
	btnCol.style.width = "150px";
	btnCou.style.width = "150px";
	btnCou.style.marginTop="5px";

	btnCol.textContent = " Collection";
	btnCou.textContent = "Get coupon ";
	
	content.setAttribute("style","margin:auto");
	
	
	//create Body
	const messagesElement = document.querySelector('#main');
	const dataDivElement_title = document.createElement('div');
	const dataDivElement_title_text = document.createElement('div');	
	const dataDiv_support_text = document.createElement('div');
	const dataDiv_start = document.createElement('div');
	
	const datalogo =document.createElement('img');
	
	
	//create img
	datalogo.src = logoPath;//"src/kfc.jpg";
	datalogo.style.width ="300px";
	
	dataDivElement_title.className = "demo-card-wide mdl-card mdl-shadow--2dp";
	dataDivElement_title_text.className = "mdl-card__title";
	dataDiv_support_text.className = "mdl-card__supporting-text";
	dataDiv_start.className = "mdl-card__actions mdl-card--border";
	
	
	const h2 = document.createElement('h2');
	h2.className="mdl-card__title-text";
	h2.textContent=storeName;
	dataDivElement_title_text.appendChild(h2);
	
	dataDiv_support_text.className="mdl-card__supporting-text";
	dataDiv_support_text.appendChild(datalogo);
	
	dataDiv_start.className="mdl-card__actions mdl-card--border";
	
	const datalink =document.createElement('button');
	datalink.className=	"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent";
	datalink.textContent="button";
	dataDiv_start.appendChild(datalink);
	
	//------ action gen coupon -------------
	content.appendChild(btnCol);
	content.appendChild(hide);
	content.appendChild(btnCou);
	
	btnCol.onclick = function(){
		if(hide.style.display === 'none'){
			hide.style.display = "block";
		}
		else{
			hide.appendChild(showCollection(storeName)); //<----call show 
			
			hide.style.display = "none";
		}
		
	};
	btnCou.onclick = function()
	{
		content.appendChild(ShowCoupon(storeName));		
		hide.appendChild(showCollection(storeName));
	};
	
	//--------------
	
	dataDivElement_title.appendChild(dataDivElement_title_text);
	dataDivElement_title.appendChild(dataDiv_support_text);
	dataDivElement_title.appendChild(content);
	messagesElement.appendChild(dataDivElement_title);
	
}

// HTML Object div to return 
function showCollection(storeName){
	
	var coupon = document.createElement("div");
	var x = document.getElementsByClassName(storeName);//<----#storeName this is Primary Key !!!  
	var xparent = x[0].parentNode;

	while (x.length) 
	{
		coupon.appendChild(x[0]);
	}
	xparent.appendChild(coupon);
	
	coupon.setAttribute('id','coupon');
	
	return xparent;//return hide val
}

// HTML Object div to return 
function ShowCoupon(storeName){ 
	
	var wrapper1 = document.createElement("div");			
	wrapper1.setAttribute("class",storeName);//<<----primary key by class name	
	wrapper1.style.textAlign = "center";
	wrapper1.style.marginTop = "10px";
	var cgen = CouponGenerator();
	wrapper1.textContent = cgen;
	return wrapper1;
}

function CouponGenerator(){
	return  "JAV"+Math.floor((Math.random() * 100000000) + 1);
}


// now not use
function gotoPage(page){
	window.location.href = page;
}
function gotoNewTabPage(page){
	window.open(page);
}
function docInterHTML(id,inerHtml){
	document.getElementById(id).innerHTML = inner;
}