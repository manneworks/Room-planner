var renderer, scene, camera, mesh, width,height,projector;
var selected = false;

init();
animate();

function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();

    //test div size
    width = document.getElementById('view').offsetWidth;
    height = document.getElementById('view').offsetHeight;

    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
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

    var geometry2 = new THREE.SphereGeometry( 50, 32, 32 );

    mesh2 = new THREE.Mesh( geometry2, material );
    scene.add( mesh2 );
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
    document.getElementById('cameraTools').addEventListener('mouseup',handleCameraUp,false);
}


var interval=0;
var dir="";
function loop(){
    switch(dir){
    case "xp":
        camera.position.x+=1;
        break;
    case "xm":
        camera.position.x-=1;
        break;
    case "yp":
        camera.position.y+=1;
        break;
    case "ym":
        camera.position.y-=1;
        break;
    case "zp":
        camera.position.z+=1;
        break;
    case "zm":
        camera.position.z-=1;
        break;
    }
     

}

function handleCamera(event){
    e = event || window.event;
    var elementId = (e.target || e.srcElement).id;
    dir=elementId;
    interval = setInterval(loop,10);
}

function handleCameraUp(event){
    clearInterval(interval);
}

function moveCamera(dir){
    if(dir=='xp'){
        camera.position.x+=1;
    }
}

function handleKeyDown(){
    if(selected){
        mesh.position.x+=1;
    }
	render();
}

function onDocumentMouseDown(event){
    var vector = new THREE.Vector3((event.offsetX / width)*2-1, -(event.offsetY / height)*2+1,0.5);
    projector.unprojectVector(vector,camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObject(mesh);
    if(intersects.length > 0){
        selected=true;
    }else{
        selected=false;
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