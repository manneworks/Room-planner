
var renderer, scene, camera, width, height, projector;
var groundMesh,myGroundGeo,myGround;
var particleMaterial;

var baseMaterial = new THREE.MeshLambertMaterial( { color: 'red', side:THREE.DoubleSide, shading: THREE.SmoothShading } );
var invMaterial = new THREE.MeshLambertMaterial( { color: 'red',transparent: true,blending: THREE.AdditiveBlending, side:THREE.DoubleSide, shading: THREE.SmoothShading } );


var objects = [];
var circles=[];
var walls=[];

var selected = false;
var selectedMesh = null;

var creation = true;
var points= [];

init();
animate();

function init(){
    // on initialise le moteur de rendu
    renderer = new THREE.WebGLRenderer({ antialias: true });

    //test div size
    width = document.getElementById('view').offsetWidth;
    height = document.getElementById('view').offsetHeight;

    renderer.setSize( width, height );
    document.getElementById('view').appendChild(renderer.domElement);

    // on initialise la scène
    scene = new THREE.Scene();

    // on initialise la camera que l’on place ensuite sur la scène
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000 );
    /*camera.position.set(0, 400, 1000);
    camera.rotation.x-=30* (Math.PI / 180);*/
    camera.position.set(0,1000,1000);
    camera.rotation.x-=45 * (Math.PI / 180);
    scene.add(camera);

    //creation de la piece

    //
    projector = new THREE.Projector();
    
	// on créé la sphère et on lui applique une texture sous forme d’image
    /*
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
    meshRoom1.position.y-=140;

    var roomGeo2 = new THREE.PlaneGeometry(500, 500);
    meshRoom2= new THREE.Mesh(roomGeo2,material);
    scene.add(meshRoom2);
    meshRoom2.position.z-=200;
*/
    //sol 10=1metre
    var geo = new THREE.PlaneGeometry(2000,2000);
    mat = new THREE.MeshLambertMaterial( { color: 0xdddddd, shading: THREE.SmoothShading } )
    //mat = new THREE.MeshDepthMaterial();
    groundMesh = new THREE.Mesh(geo,mat);
    scene.add(groundMesh);
    groundMesh.rotation.x-=90 * (Math.PI / 180);
    groundMesh.position.set(0,0,0);
    

	// on ajoute une lumière blanche
	var lumiere = new THREE.DirectionalLight( 0xffffff, 1 );
	lumiere.position.set( 0, 100, 400 );
	scene.add( lumiere );

    //camera.add(lumiere);
    //lumiere.position.set(0,0,0); //TODO

    //test lumiere
    
    pointLight = new THREE.PointLight( 0xffffff, 0.75 );
    camera.add( pointLight );


    //myGround
    myGroundGeo = new THREE.Geometry();


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
        c.position.x+=2;
        break;
    case "xm":
        c.position.x-=2;
        break;
    case "yp":
        c.position.y+=2;
        break;
    case "ym":
        c.position.y-=2;
        break;
    case "zp":
        c.position.z+=2;
        break;
    case "zm":
        c.position.z-=2;
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
    checkWalls();
}


function checkWalls(){
    var nearestwall = getNearestWall();
    for(var i=0;i<walls.length;i++){
        if(walls[i]!=nearestwall){
            walls[i].material=baseMaterial;
        }
    }
    if(nearestwall.material==baseMaterial){
        nearestwall.material=invMaterial;
    }

}

function addObject(p){
    //var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('img/metal.jpg') } );
    material = new THREE.MeshLambertMaterial( { color: 'grey', side:THREE.DoubleSide, shading: THREE.SmoothShading } );
    var geometry = new THREE.SphereGeometry( 50, 32, 32 );
    var mesh = new THREE.Mesh( geometry, material );
    objects.push(mesh);
    mesh.position.x=p.x;
    mesh.position.y=p.y+50;
    mesh.position.z=p.z;
    scene.add(mesh);
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
    if(creation){
        var vector = new THREE.Vector3((event.offsetX / width)*2-1, -(event.offsetY / height)*2+1,0.5);
        projector.unprojectVector(vector,camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObject(groundMesh);
        if(intersects.length > 0){
            drawCircle(intersects[0].point);
            points.push(intersects[0].point);
            updateMyGround();
        }else{
            creation=false;
            clearCircles();
            createWalls();
        }
    }else{
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
            var vector = new THREE.Vector3((event.offsetX / width)*2-1, -(event.offsetY / height)*2+1,0.5);
            projector.unprojectVector(vector,camera);
            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            var intersects = raycaster.intersectObject(myGround);
            if(intersects.length > 0){
                addObject(intersects[0].point);
            }
        }
    }

}

function createWalls(){
    var p1,p2;
    for(var i=0;i<points.length;i++){

        p1=points[i];
        if(i==points.length-1){
            p2=points[0]
        }else{
            p2=points[i+1];
        }

        var wallGeo = new THREE.Geometry();
        wallGeo.vertices.push(p1);
        wallGeo.vertices.push(new THREE.Vector3(p1.x,p1.y+240,p1.z));
        wallGeo.vertices.push(new THREE.Vector3(p2.x,p2.y+240,p2.z));
        wallGeo.vertices.push(p2);
        wallGeo.faces.push(new THREE.Face3(0,1,2));
        wallGeo.faces.push(new THREE.Face3(0,2,3));
        //material = new THREE.MeshBasicMaterial( { color: 'red', side:THREE.DoubleSide} );
        wallGeo.computeFaceNormals();
        wallGeo.computeCentroids();
        wallGeo.computeVertexNormals();
        wallMesh = new THREE.Mesh(wallGeo,baseMaterial);
        walls.push(wallMesh);
        scene.add(wallMesh);
    }
}

function updateMyGround(){
    if(points.length>2){
        myGroundGeo=new THREE.Geometry();
        myGroundGeo.vertices = [];
        myGroundGeo.faces = [];
        scene.remove(myGround);

        //suppr myGround si dans objects
        /*
        var index = objects.indexOf(myGround);
        if (index > -1) {
            objects.splice(index, 1);
        }
        */
        myGround=null;
        for(var i=0;i<points.length;i++){
            myGroundGeo.vertices.push(points[i]);
        }
        //face
        for(var i=0;i<points.length-2;i++){
                myGroundGeo.faces.push(new THREE.Face3(0,i+1,i+2));
        }
       //alert(myGroundGeo.faces.length);
        //material = new THREE.MeshBasicMaterial( { color: 'red', side:THREE.DoubleSide} );
        myGroundGeo.computeFaceNormals();
        myGroundGeo.computeCentroids();
        myGroundGeo.computeVertexNormals();
        myGround = new THREE.Mesh( myGroundGeo, baseMaterial );
        /*
        for(var i=0;i<myGroundGeo.faces.length;i++){
            var face = new THREE.Geometry();
            face.faces.push(myGroundGeo.faces[i]);
            meshFace = new THREE.Mesh( face, material );
            objects.push(meshFace);
            scene.add(meshFace);
        }
        */
        //scene.add(myGround);
        myGround.position.set(0,1,0);
        //objects.push(myGround);
        scene.add(myGround);
        render();
    }
}

function getNearestWall(){
    var minDist=99999999;
    var nearestwall=null;
    for(var i=0;i<walls.length;i++){
        var dist=0;
        var j;
        for(j=0;j<walls[i].geometry.vertices.length;j++){
            dist+=camera.position.distanceTo(walls[i].geometry.vertices[j]);
        }
        dist=dist/j;
        if(dist<minDist){
            minDist=dist;
            nearestwall=walls[i];
        }
    }
    return nearestwall;
}

function drawCircle(pos){
    var radius   = 5,
    segments = 64,
    material = new THREE.LineBasicMaterial( { color: 0x0000ff } ),
    geometry = new THREE.CircleGeometry( radius, segments );

    // Remove center vertex
    //geometry.vertices.shift();
    circle = new THREE.Line( geometry, material );
    circle.rotation.x-=90 * (Math.PI / 180);
    circle.position.set(pos.x,pos.y+1,pos.z);
    scene.add(circle);
    circles.push(circle);
}

function clearCircles(){
    for(var i =0 ;i<circles.length;i++){
        scene.remove(circles[i]);
    }
    circles=[];
}

function render(){
	renderer.render( scene, camera );
}

function animate(){
    requestAnimationFrame( animate );
    render();
}

function checkCollision(obj1, obj2){
    
}
