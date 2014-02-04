var renderer, scene, camera, mesh;

init();
animate();

function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer();

    //test div size
    var width = document.getElementById('container').offsetWidth;
    var height = document.getElementById('container').offsetHeight;

    alert(width);

    // si WebGL ne fonctionne pas sur votre navigateur vous pouvez utiliser le moteur de rendu Canvas à la place
    // renderer = new THREE.CanvasRenderer();
    renderer.setSize( width, height );
    document.getElementById('container').appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000 );
    camera.position.set(0, 0, 1000);
    scene.add(camera);
    
	// on créé la sphère et on lui applique une texture sous forme d’image
	var geometry = new THREE.SphereGeometry( 200, 32, 32 );
    var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('img/metal.jpg') } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	// on ajoute une lumière blanche
	var lumiere = new THREE.DirectionalLight( 0xffffff, 1.0 );
	lumiere.position.set( 0, 0, 400 );
	scene.add( lumiere );

    // on effectue le rendu de la scène
    render();

    document.onkeydown = handleKeyDown;
}

function handleKeyDown(){
	camera.position.x+=1;
	render();
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