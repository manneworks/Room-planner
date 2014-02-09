
var renderer, scene, camera, width, height, projector;

var objects = [];

var selected = false;
var selectedMesh = null;

init();
animate();

function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();

    //test div size
    width = document.getElementById('view').offsetWidth;
    height = document.getElementById('view').offsetHeight;

    renderer.setSize( width, height );
    document.getElementById('view').appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000 );
    camera.position.set(0, 400, 1000);
    camera.rotation.x-=30* (Math.PI / 180);
    scene.add(camera);

    //creation de la piece

    //
    projector = new THREE.Projector(   );
    
	// on créé la sphère et on lui applique une texture sous forme d’image
	var geometry = new THREE.SphereGeometry( 50, 32, 32 );
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('img/metal.jpg') } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
    objects.push(mesh);

    var geometry2 = new THREE.SphereGeometry( 50, 32, 32 );

    mesh2 = new THREE.Mesh( geometry2, material );
    scene.add( mesh2 );
    objects.push(mesh2);
    mesh2.position.x+=100;

    var roomGeo1 = new THREE.PlaneGeometry(500, 500);
    meshRoom1= new THREE.Mesh(roomGeo1,material);
    scene.add(meshRoom1);
    meshRoom1.rotation.x-=80 * (Math.PI / 180);
    meshRoom1.position.y-=100;

    var roomGeo2 = new THREE.PlaneGeometry(500, 500);
    meshRoom2= new THREE.Mesh(roomGeo2,material);
    scene.add(meshRoom2);
    meshRoom2.position.z-=200;

	// on ajoute une lumière blanche
	var lumiere = new THREE.DirectionalLight( 0xffffff, 1.0 );
	lumiere.position.set( 0, 100, 400 );
	scene.add( lumiere );

    // on effectue le rendu de la scène
    render();
    document.onkeydown = handleKeyDown;
    document.getElementById('view').addEventListener('mousedown',onDocumentMouseDown,false);
    document.getElementById('cameraTools').addEventListener('mousedown',handleCamera,false);
    document.getElementById('cameraTools').addEventListener('mouseup',handleObjUp,false);
    document.getElementById('objTools').addEventListener('mousedown',handleObj,false);
    document.getElementById('objTools').addEventListener('mouseup',handleObjUp,false);
}


var interval=0;
var dir="";
var c=null;
function loop(){
    if(c==null){return;}
    switch(dir){
    case "xp":
        c.position.x+=1;
        break;
    case "xm":
        c.position.x-=1;
        break;
    case "yp":
        c.position.y+=1;
        break;
    case "ym":
        c.position.y-=1;
        break;
    case "zp":
        c.position.z+=1;
        break;
    case "zm":
        c.position.z-=1;
        break;
    case "rxp":
        c.rotation.x+=1* (Math.PI / 180);
        break;
    case "rxm":
        c.rotation.x-=1* (Math.PI / 180);
        break;
    case "ryp":
        c.rotation.y+=1* (Math.PI / 180);
        break;
    case "rym":
        c.rotation.y-=1* (Math.PI / 180);
        break;
    case "rzp":
        c.rotation.z+=1* (Math.PI / 180);
        break;
    case "rzm":
        c.rotation.z-=1* (Math.PI / 180);
        break;
    }
}

function handleCamera(event){
    e = event || window.event;
    var elementId = (e.target || e.srcElement).id;
    dir=elementId;
    c=camera;
    interval = setInterval(loop,10);
}

function handleObjUp(event){
    clearInterval(interval);
    dir="";
    c=null;
}

function handleObj(event){
    if(selectedMesh==null){return;}
    e = event || window.event;
    var elementId = (e.target || e.srcElement).id;
    dir=elementId;
    dir=dir.replace("o","");
    c=selectedMesh;
    interval = setInterval(loop,10);
}

function handleKeyDown(){
    if(selected){
        selectedMesh.position.x+=1;
    }
	render();
}

function onDocumentMouseDown(event){
    var vector = new THREE.Vector3((event.offsetX / width)*2-1, -(event.offsetY / height)*2+1,0.5);
    projector.unprojectVector(vector,camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(objects);
    if(intersects.length > 0){
        selected=true;
        setObjControlVisibility(true);
        selectedMesh=intersects[0].object;
    }else{
        selected=false;
        selectedMesh=null;
        setObjControlVisibility(false);
    }

}

function render(){
	renderer.render( scene, camera );
}

function animate(){
    requestAnimationFrame( animate );
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
    render();
}