

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
	view.style.height=mVheight-5+"px";
	view.style.border = "1px solid red";
	view.style.float="left";
	document.getElementById('container').appendChild(view);

	initMenu();
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
	

	
}

