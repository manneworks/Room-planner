var uiLoaded=false;
var objSelectedId=null;

initUI();

function initUI(){

	//desactive scrolling mousewheel
	$(function() {
   		$('body').mousedown(function(e){if(e.button==1)
   			return false;
   		});
	});



	//
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
	view.style.position='relative';//firefox
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

	requestMenu(initMenu);
}

//Initialisation du menu

function requestMenu(callback){
            
            var xhr = getXMLHttpRequest();

            

            xhr.open("POST", "recupMenu.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            
            

            xhr.send(null);
            xhr.onreadystatechange = function() { 

                if(xhr.readyState == 4) { 

                   callback(xhr.responseText.split(":")); 

           } 
     }   
}

       
function initMenu(sData){
    console.log(fonction);
    var menu = document.getElementById('menu');
    if(fonction!='arc'){
        loadObjMenu(sData);
    }
    if(fonction !='deco'){
        loadPre();
    }
    if(fonction!='null'){
        loadOptionMenu();
    }
    


    $(function() {
        $("#menu").accordion({heightStyle: "content" ,collapsible: true, active: false});
    });

    uiLoaded=true;
}

function loadPre(){
     var h2 = document.createElement('h2');
    h2.className='togglers';
    var text = document.createTextNode('Pieces');
    menu.appendChild(h2);
    h2.appendChild(text);
    h2.id = "prefabh2";

    var div = document.createElement('div');
    div.id = "prefabdiv";
    div.className='content';

    menu.appendChild(div);

    var div = document.getElementById('prefabdiv');
    var p = document.createElement('p');
    p.className='models';
    p.id='test';
    var text = document.createTextNode('test');
    div.appendChild(p);
    p.appendChild(text);
}



function loadOptionMenu(){
    var h2 = document.createElement('h2');
    h2.className='togglers';
    var text = document.createTextNode('Options');
    menu.appendChild(h2);
    h2.appendChild(text);
    h2.id = "options";

    var div = document.createElement('div');
    div.id = "optionsdiv";
    div.className='content';

    menu.appendChild(div);

    //Options
    var optionsString = ['Enregistrer','Charger','Gérer projet'];
    for(var str in optionsString){
        var div = document.getElementById('optionsdiv');
        var p = document.createElement('p');
        p.className='options';
        p.id=optionsString[str];
        var text = document.createTextNode(optionsString[str]);
        div.appendChild(p);
        p.appendChild(text);
    }
}

function loadObjMenu(sData){
    var i=0;
    var menu = document.getElementById('menu');
    while (i < sData.length-1){                
        if (document.getElementById(sData[i]+"h2") == null){
            var h2 = document.createElement('h2');
            h2.className='togglers';
            var text = document.createTextNode(sData[i]);
            menu.appendChild(h2);
            h2.appendChild(text);
            h2.id = sData[i] + "h2";
            var div = document.createElement('div');
            div.id = sData[i] + "div";
            div.className='content';
            menu.appendChild(div);
        }
        var div = document.getElementById(sData[i]+"div");
        var p = document.createElement('p');
        p.className='models';
        p.id = sData[i+1];
        var text = document.createTextNode(sData[i+1]);
        div.appendChild(p);
        p.appendChild(text);
        p.addEventListener('mousedown',function(){
            objSelectedId=this.id;
            console.log(objSelectedId);
        },false);
        p.addEventListener('mouseover',function(){
            console.log("ici");
            tooltip.pop(this,"Test Tooltip",{position:1,offsetX:-20, effect:'slide'});
        },false);

	 p.addEventListener('mouseover',function(){
                    console.log("OK");
                    tooltip.pop(this, "Test", {position:1,offsetX:-20, effect:'slide'});
         },false);
	
        i+=2;   
    }
}
