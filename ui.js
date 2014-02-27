
init();

function init(){

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

            var i=0;
            var menu = document.getElementById('menu');

            while (sData[i].length){                

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
                p.id = sData[i+1];
                var text = document.createTextNode(sData[i+1]);
                
                div.appendChild(p);
                p.appendChild(text);
            

                i+=2;   
            }

        $(function() {
            $("#menu").accordion({heightStyle: "content"});
        });


        }

        


