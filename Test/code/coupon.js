
function main()
{
	var content = document.getElementById(content);
	
	content.createElement("div");
	content.setAttribute("class","center-div");
	showbuttons(content);
}

function showbuttons(id)
{
	var con = document.getElementById(id);
	
	con.setAttribute("class","center-div img_container");
	
	var btn  = document.getElementById("kfc");
	var btn2  = document.createElement("starbucks");
	
	btn.setAttribute("class","mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
	btn.style.marginLeft = "62px";
			
			btn2.setAttribute("class","mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
			btn2.style.marginLeft = "62px";
			btn2.style.marginTop = "15px";
	
			btn.textContent = "Collection";
			btn2.textContent = "Get coupon";
	
	
	con.appendChild(btn);
	con.appendChild(btn2);
	
	
}