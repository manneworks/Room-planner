

init();

function init(){

    var mVwidth = document.getElementById('container').offsetWidth;
    var mVheight = document.getElementById('container').offsetHeight;

    document.getElementById('container').style.clear="both";

	var menu = document.createElement('div');
	menu.id='menu';
	menu.className='menu';
	menu.style.width="25%";
	menu.style.height="100%";
	menu.style.cssFloat="left"; //float n'est pas respecté par firefox ...
	document.getElementById('container').appendChild(menu);

	var view = document.createElement('div');
	view.id='view';
	view.className='view';
	view.style.width="75%";
	view.style.height="75%";
	view.style.cssFloat="right";
	document.getElementById('container').appendChild(view);

	var tools = document.createElement('div');
	tools.id='tools';
	tools.className='tools';
	tools.style.width="75%";
	tools.style.height="25%";
	tools.style.cssFloat="right";
	document.getElementById('container').appendChild(tools);

	initMenu();
	initTools();
}

function initTools(){
	var tools = document.getElementById('tools');

	//gestion camera
	var cameraTools = document.createElement('div');
	cameraTools.id='cameraTools';
	cameraTools.className='cameraTools';
	cameraTools.style.width="50%";
	cameraTools.style.height="100%";
	cameraTools.style.cssFloat="left";
	tools.appendChild(cameraTools);

	var h2 = document.createElement('h3');
	var text = document.createTextNode("Gestion Camera");
	cameraTools.appendChild(h2);
	h2.appendChild(text);

	initGestCam();


	//gestion obj
	var objTools = document.createElement('div');
	objTools.id='objTools';
	objTools.className='objTools';
	objTools.style.width="50%";
	objTools.style.height="100%";
	objTools.style.cssFloat="right";
	tools.appendChild(objTools);

	var h2 = document.createElement('h3');
	var text = document.createTextNode("Gestion Objet");
	objTools.appendChild(h2);
	h2.appendChild(text);

	initGestObj();
}

function initGestObj(){
	var objTools = document.getElementById('objTools');
	btn_oxp=document.createElement('button');
	btn_oxm=document.createElement('button');
	btn_oyp=document.createElement('button');
	btn_oym=document.createElement('button');
	btn_ozp=document.createElement('button');
	btn_ozm=document.createElement('button');
	btn_oxp.id='oxp';
	btn_oxm.id='oxm';
	btn_oyp.id='oyp';
	btn_oym.id='oym';
	btn_ozp.id='ozp';
	btn_ozm.id='ozm';
	btn_oxp.innerHTML='x+';
	btn_oxm.innerHTML='x-';
	btn_oyp.innerHTML='y+';
	btn_oym.innerHTML='y-';
	btn_ozp.innerHTML='z+';
	btn_ozm.innerHTML='z-';

	btn_roxp=document.createElement('button');
	btn_roxm=document.createElement('button');
	btn_royp=document.createElement('button');
	btn_roym=document.createElement('button');
	btn_rozp=document.createElement('button');
	btn_rozm=document.createElement('button');
	btn_roxp.id='roxp';
	btn_roxm.id='roxm';
	btn_royp.id='royp';
	btn_roym.id='roym';
	btn_rozp.id='rozp';
	btn_rozm.id='rozm';
	btn_roxp.innerHTML='rx+';
	btn_roxm.innerHTML='rx-';
	btn_royp.innerHTML='ry+';
	btn_roym.innerHTML='ry-';
	btn_rozp.innerHTML='rz+';
	btn_rozm.innerHTML='rz-';


	var table = document.createElement('table');
	table.id='objPanel';
	objTools.appendChild(table);
	table.style.margin="0 auto";
	ligne = table.insertRow();
	ligne.insertCell().appendChild(btn_oxp);
	ligne.insertCell().appendChild(btn_oyp);
	ligne.insertCell().appendChild(btn_ozp);
	ligne.insertCell().appendChild(btn_roxp);
	ligne.insertCell().appendChild(btn_royp);
	ligne.insertCell().appendChild(btn_rozp);
	ligne = table.insertRow();
	ligne.insertCell().appendChild(btn_oxm);
	ligne.insertCell().appendChild(btn_oym);
	ligne.insertCell().appendChild(btn_ozm);
	ligne.insertCell().appendChild(btn_roxm);
	ligne.insertCell().appendChild(btn_roym);
	ligne.insertCell().appendChild(btn_rozm);
	setObjControlVisibility(false);
}

function setObjControlVisibility(bool){
	if(bool){
		document.getElementById('objPanel').style.visibility="visible";
	}else{
		document.getElementById('objPanel').style.visibility="hidden";
	}
}

function initGestCam(){
	var cameraTools = document.getElementById('cameraTools');

//position
	btn_xp=document.createElement('button');
	btn_xm=document.createElement('button');
	btn_yp=document.createElement('button');
	btn_ym=document.createElement('button');
	btn_zp=document.createElement('button');
	btn_zm=document.createElement('button');
	btn_xp.id='xp';
	btn_xm.id='xm';
	btn_yp.id='yp';
	btn_ym.id='ym';
	btn_zp.id='zp';
	btn_zm.id='zm';
	btn_xp.innerHTML='x+';
	btn_xm.innerHTML='x-';
	btn_yp.innerHTML='y+';
	btn_ym.innerHTML='y-';
	btn_zp.innerHTML='z+';
	btn_zm.innerHTML='z-';
//rotation
	btn_rxp=document.createElement('button');
	btn_rxm=document.createElement('button');
	btn_ryp=document.createElement('button');
	btn_rym=document.createElement('button');
	btn_rzp=document.createElement('button');
	btn_rzm=document.createElement('button');
	btn_rxp.id='rxp';
	btn_rxm.id='rxm';
	btn_ryp.id='ryp';
	btn_rym.id='rym';
	btn_rzp.id='rzp';
	btn_rzm.id='rzm';
	btn_rxp.innerHTML='rx+';
	btn_rxm.innerHTML='rx-';
	btn_ryp.innerHTML='ry+';
	btn_rym.innerHTML='ry-';
	btn_rzp.innerHTML='rz+';
	btn_rzm.innerHTML='rz-';

	var table = document.createElement('table');
	cameraTools.appendChild(table);
	table.style.margin="0 auto";
	ligne = table.insertRow();
	ligne.insertCell().appendChild(btn_xp);
	ligne.insertCell().appendChild(btn_yp);
	ligne.insertCell().appendChild(btn_zp);
	ligne.insertCell().appendChild(btn_rxp);
	ligne.insertCell().appendChild(btn_ryp);
	ligne.insertCell().appendChild(btn_rzp);
	ligne = table.insertRow();
	ligne.insertCell().appendChild(btn_xm);
	ligne.insertCell().appendChild(btn_ym);
	ligne.insertCell().appendChild(btn_zm);
	ligne.insertCell().appendChild(btn_rxm);
	ligne.insertCell().appendChild(btn_rym);
	ligne.insertCell().appendChild(btn_rzm);
}

function initMenu(){
	var menu = document.getElementById('menu');

//

//	while(bdd){
//		var categorie=..
//		if(!categorie exist){
//				h2
//				h2.id=categorie
//		}
//		var objCat=document.getElementById(categorie);
//		var text = document.createTextNode(nom);
//		creation tooltip
//
//		ajout categorie;
//	}

//
	var h2 = document.createElement('h2');
	h2.className='togglers';
	var text = document.createTextNode("Cuisine");
	menu.appendChild(h2);
	h2.appendChild(text);
	h2.id='cuisine';

	var div = document.createElement('div');
	div.className='content';

	var p = document.createElement('p');
	var text = document.createTextNode("four");
	menu.appendChild(div);
	div.appendChild(p);
	p.appendChild(text)

	var p = document.createElement('p');
	var text = document.createTextNode("four");
	menu.appendChild(div);
	div.appendChild(p);
	p.appendChild(text)

	var p = document.createElement('p');
	var text = document.createTextNode("four");
	menu.appendChild(div);
	div.appendChild(p);
	p.appendChild(text)

	var p = document.createElement('p');
	var text = document.createTextNode("four");
	menu.appendChild(div);
	div.appendChild(p);
	p.appendChild(text)


	var h2_2 = document.createElement('h2');
	h2_2.className='togglers';
	var text_2 = document.createTextNode("Salle de bain");
	menu.appendChild(h2_2);
	h2_2.appendChild(text_2);

	var div = document.createElement('div');
	var p = document.createElement('p');
	div.className='content';
	var text = document.createTextNode("blablabla");
	menu.appendChild(div);
	div.appendChild(p);
	p.appendChild(text);


	var h2_3 = document.createElement('h2');
	h2_3.className='togglers';
	var text_3 = document.createTextNode("Séjour");
	menu.appendChild(h2_3);
	h2_3.appendChild(text_3);

	var div = document.createElement('div');
	var p = document.createElement('p');
	div.className='content';
	var text = document.createTextNode("blablabla");
	menu.appendChild(div);
	div.appendChild(p);
	p.appendChild(text);
	

	//fonction fx menu accordeon
	  $(function() {
    		$( "#menu" ).accordion();
  		});

	
}

