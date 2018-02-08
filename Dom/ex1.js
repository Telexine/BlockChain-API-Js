






function appendMessage()
{
//create Body
		const messagesElement = document.querySelector('#main');
		const dataDivElement_title = document.createElement('div');
		const dataDivElement_title_text = document.createElement('div');	
		const dataDiv_support_text = document.createElement('div');
		const dataDiv_start = document.createElement('div');
		
		const datalogo =document.createElement('img');
		
		//create img
		datalogo.src = "src/kfc.jpg";
		datalogo.style.width ="300px";
		
		dataDivElement_title.className = "demo-card-wide mdl-card mdl-shadow--2dp";
		dataDivElement_title_text.className = "mdl-card__title";
		dataDiv_support_text.className = "mdl-card__supporting-text";
		dataDiv_start.className = "mdl-card__actions mdl-card--border";
		
		
		const h2 = document.createElement('h2');
		h2.className="mdl-card__title-text";
		h2.textContent="Welcome"
		dataDivElement_title_text.appendChild(h2);
		
		dataDiv_support_text.className="mdl-card__supporting-text";
		dataDiv_support_text.appendChild(datalogo);
		
		dataDiv_start.className="mdl-card__actions mdl-card--border";
		const datalink =document.createElement('a');
		datalink.className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect";
		datalink.textContent="Get Started";
		dataDiv_start.appendChild(datalink);
		
		dataDivElement_title.appendChild(dataDivElement_title_text);
		dataDivElement_title.appendChild(dataDiv_support_text);
		dataDivElement_title.appendChild(dataDiv_start);
		
		messagesElement.appendChild(dataDivElement_title);
		
}