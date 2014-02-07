

init();

function init(){

    var mVwidth = document.getElementById('container').offsetWidth;
    var mVheight = document.getElementById('container').offsetHeight;

	var menu = document.createElement('div');
	menu.id='menu';
	menu.className='menu';
	menu.style.width="200px";
	menu.style.height=mVheight-5+"px";
	menu.style.border = "1px solid blue";
	menu.style.float="left";
	document.getElementById('container').appendChild(menu);

	var view = document.createElement('div');
	view.id='view';
	view.className='view';
	view.style.width=mVwidth-210+"px";
	view.style.height=mVheight-105+"px";
	view.style.border = "1px solid red";
	view.style.float="left";
	document.getElementById('container').appendChild(view);

	var tools = document.createElement('div');
	tools.id='tools';
	tools.className='tools';
	tools.style.width=mVwidth-210+"px";
	tools.style.height=95+"px";
	tools.style.border = "1px solid orange";
	tools.style.float="left";
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
	cameraTools.style.width=(tools.offsetWidth/2)-1+"px";
	cameraTools.style.height=tools.offsetHeight+"px";
	cameraTools.style.float="left";
	tools.appendChild(cameraTools);

	var h2 = document.createElement('h3');
	var text = document.createTextNode("Gestion Camera");
	cameraTools.appendChild(h2);
	h2.appendChild(text);


	var btn_xp = document.createElement('button');
	btn_xp.id="xp";
	btn_xp.innerHTML='x+';
	cameraTools.appendChild(btn_xp);

	var btn_xm = document.createElement('button');
	btn_xm.id="xm";
	btn_xm.innerHTML='x-';
	cameraTools.appendChild(btn_xm);

	var btn_yp = document.createElement('button');
	btn_yp.id="yp";
	btn_yp.innerHTML='y+';
	cameraTools.appendChild(btn_yp);

	var btn_ym = document.createElement('button');
	btn_ym.id="ym";
	btn_ym.innerHTML='y-';
	cameraTools.appendChild(btn_ym);

	var btn_zp = document.createElement('button');
	btn_zp.id="zp";
	btn_zp.innerHTML='z+';
	cameraTools.appendChild(btn_zp);

	var btn_zm = document.createElement('button');
	btn_zm.id="zm";
	btn_zm.innerHTML='z-';
	cameraTools.appendChild(btn_zm);


	//gestion obj
	var objTools = document.createElement('div');
	objTools.id='objTools';
	objTools.className='objTools';
	objTools.style.width=(tools.offsetWidth/2)-1+"px";
	objTools.style.height=tools.offsetHeight+"px";
	objTools.style.float="left";
	tools.appendChild(objTools);

	var h2 = document.createElement('h3');
	var text = document.createTextNode("Gestion Objet");
	objTools.appendChild(h2);
	h2.appendChild(text);
}

function initMenu(){
	var menu = document.getElementById('menu');

	var h2 = document.createElement('h2');
	h2.className='togglers';
	var text = document.createTextNode("menu1");
	menu.appendChild(h2);
	h2.appendChild(text);

	var div = document.createElement('div');
	var p = document.createElement('p');
	div.className='content';
	var text = document.createTextNode("blablabla");
	menu.appendChild(div);
	div.appendChild(p);
	p.appendChild(text);

	var h2_2 = document.createElement('h2');
	h2_2.className='togglers';
	var text_2 = document.createTextNode("menu2");
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
	var text_3 = document.createTextNode("menu3");
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

