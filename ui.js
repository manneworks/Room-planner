
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

//Initialisation du menus
function requestMenu(callback){         
    var xhr = getXMLHttpRequest();
    xhr.open("POST", "recupMenu.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");        
    xhr.send(null);
    xhr.onreadystatechange = function() { 
        if(xhr.readyState == 4) { 
           callback(xhr.responseText.split("~")); 
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
    p.className='options';
    p.id='test';
    var text = document.createTextNode('test');
    div.appendChild(p);
    p.appendChild(text);
}

function removePre(){
    menu.removeChild(document.getElementById("prefabdiv"));
    menu.removeChild(document.getElementById("prefabh2"));
}

function addObjModifMenu(obj){
    if(document.getElementById("modifdiv")==null){
        var h2 = document.createElement('h2');
        h2.className='togglers';
        var text = document.createTextNode('Selection');
        menu.appendChild(h2);
        h2.appendChild(text);
        h2.id = "modifh2";

        var div = document.createElement('div');
        div.id = "modifdiv";
        div.className='content';

        menu.appendChild(div);
        var p = document.createElement('p');
        p.id='info';
        p.className='info';
        div.appendChild(p);

        var text = document.createTextNode('x: '+obj.position.x);
        p.appendChild(text);
        p.appendChild(document.createElement('br'));
        var text = document.createTextNode('y: '+obj.position.y);
        p.appendChild(text);
        p.appendChild(document.createElement('br'));
        var text = document.createTextNode('z: '+obj.position.z);
        p.appendChild(text);
        p.appendChild(document.createElement('br'));
        var text = document.createTextNode('color:  ');
        p.appendChild(text);

        var input = document.createElement("input");
        input.type = "color";
        input.id="color";
        p.appendChild(input);

        $("#color").spectrum({
            color: obj.material.color.getHex().toString(16),
            change: function(color) {
                var c = color.toRgb();
                console.log(c);
                console.log(obj.material.color);
                obj.material.color.setRGB(c.r/256,c.g/256,c.b/256);
                console.log(obj.material.color);
            }
        });


        $(function() {
            $("#menu").accordion("refresh");
            var i=$("#modifh2").index();
            $("#menu").accordion({ active : i/2});
        });
    }
}

function updateObjModifMenu(obj){

    if(document.getElementById("modifdiv")!=null){
        var $textNodes = $('.info').contents().filter(function() {
            return this.nodeType == Node.TEXT_NODE;
        });
        $textNodes.each(function() {
            if(this.data.indexOf('x')!=-1){
                this.data = 'x: '+obj.position.x;
            }else if(this.data.indexOf('y')!=-1){
                this.data = 'y: '+obj.position.y;
            }else if(this.data.indexOf('z')!=-1){
                this.data = 'z: '+obj.position.z;
            }
        });
    }
}


function removeObjModifMenu(){
    if(document.getElementById("modifdiv")!=null){
        menu.removeChild(document.getElementById("modifdiv"));
        menu.removeChild(document.getElementById("modifh2"));
    }
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
    var optionsString = ['Enregistrer','Charger','Projets'];
    for(var str in optionsString){
        var div = document.getElementById('optionsdiv');
        var p = document.createElement('p');
        p.className='options';
        p.id=optionsString[str];
        var text = document.createTextNode(optionsString[str]);
        div.appendChild(p);
        p.appendChild(text);
    }
    initOptWnd(optionsString);
}

function initOptWnd(arr){

    //create Popup
     for(var str in arr){
        var div = document.createElement('div');
        div.id=arr[str]+"_diag";
        div.className="popup_block";
        menu.appendChild(div);
     }

    //enregistrement dialogue
    //deja crée
    $('#Enregistrer_diag').append("<h3>Enregistrement</h3><br>");
    //nouveau
    $('#Enregistrer_diag').append("<br> Nouveau: <input type=\"text\" name=\"ProjectName\" id=\"ProjectName\"><br><button type=\"button\" onClick=\"enreg()\">Ok</button>");


    $('#Charger_diag').append("<br> Nouveau: <input type=\"text\" name=\"ProjectName\" id=\"ProjectName\"><br><button type=\"button\" onClick=\"charger()\">Ok</button>");

    //gestion popup
    for(var str in arr){
        console.log(arr[str]);
        initPopup(arr[str]);
    }
}

function charger(){
    loading();
}

function getExistingProject(){

}

function enreg(){
    var test = document.getElementById('ProjectName').value;
     $.ajax({
        type: "POST",
        url: "enregistrement.php",
        data: {nomProjet: test, data : getStringData()}, 
        cache: false,
        success: function(){
            $('#Enregistrer_diag').dialog( "close" );
            $('#fade').remove();
        }
    });

}

function initPopup(str){
    $('#'+str+'_diag').dialog({
            autoOpen: false,
            modal: true,
        }).prepend('<a class="close_btn"><img src="img/btn_close.png" class="btn_close" title="Fermer" alt="Fermer" /></a>');

        $('#'+str+'_diag').css({
            'margin-top' : -$('#'+str+'_diag').height()/2,
            'margin-left' : -$('#'+str+'_diag').width()/2
        });

        $('#'+str).on('click',function(){
            $('#'+str+'_diag').dialog( "open" );
            $('body').append('<div id="fade"></div>');
        });

        $(".close_btn").on('click',function(){
            $('#'+str+'_diag').dialog( "close" );
             $('#fade').remove();
        });
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

        var txt= document.createElement('txt');
        txt=sData[i+2];
        setTooltip(txt,p);

        i+=4;   
    }
}

 function setTooltip(txt,p){
    p.addEventListener('mouseover',function(){
            tooltip.pop(this, txt, {position:1,offsetX:-20, effect:'slide'});
    },false);

 } 