
var renderer, scene, camera, width, height, projector;
var groundMesh,myGroundGeo,myGround;
var particleMaterial;

var baseMaterial = new THREE.MeshLambertMaterial( { color: 'red', side:THREE.DoubleSide, shading: THREE.SmoothShading } );
var invMaterial = new THREE.MeshLambertMaterial( { color: 'red', side:THREE.DoubleSide, shading: THREE.SmoothShading , transparent: true, opacity: 0.1} );

var controls;

var objects = [];
var circles=[];
var walls=[];

var selected = false;
var selectedMesh = null;
var offset = new THREE.Vector3();

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
    camera.position.set(0,1000,1000);
    camera.rotation.x-=45 * (Math.PI / 180);
    scene.add(camera);

    //controller camera
    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'change', render );


    //
    projector = new THREE.Projector();
    
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

    //test lumiere
    
    pointLight = new THREE.PointLight( 0xffffff, 0.75 );
    camera.add( pointLight );


    //myGround
    myGroundGeo = new THREE.Geometry();


    // on effectue le rendu de la scène
    render();

    document.getElementById('view').addEventListener('mousedown',onMouseDown,false);
    document.getElementById('view').addEventListener('mouseup',onMouseUp,false);
    document.getElementById('view').addEventListener('mousemove',onMouseMove,false);

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

function onMouseDown(event){
    if(event.which==1){
        var x = event.offsetX==undefined?event.layerX:event.offsetX;
        var y = event.offsetX==undefined?event.layerY:event.offsetY;
        if(creation){
            var vector = new THREE.Vector3((x / width)*2-1, -(y / height)*2+1,0.5);
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
            var vector = new THREE.Vector3((x / width)*2-1, -(y / height)*2+1,0.5);
            projector.unprojectVector(vector,camera);
            var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
            var intersects = raycaster.intersectObjects(objects);
            if(intersects.length > 0){
                selected=true;
                selectedMesh=intersects[0].object;

                //var intersects = raycaster.intersectObject(myGround);
                //offset.copy(intersects[0].point).sub(myGround.position);

                offset.set(0,myGround.position.y-selectedMesh.position.y,0);

            }else{
                selected=false;
                selectedMesh=null;
                var vector = new THREE.Vector3((x / width)*2-1, -(y / height)*2+1,0.5);
                projector.unprojectVector(vector,camera);
                var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
                var intersects = raycaster.intersectObject(myGround);
                if(intersects.length > 0){
                    addObject(intersects[0].point);
                }
            }
        }
    }
}

function onMouseUp(event){
    selected=false;
    selectedMesh=null;
}

var clone=null;
function onMouseMove(event){
    if(selected){
        var vector = new THREE.Vector3((event.offsetX / width)*2-1, -(event.offsetY / height)*2+1,0.5);
        projector.unprojectVector(vector,camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObject(myGround);

        if(clone==null){
            clone = selectedMesh.clone();
            clone.material=new THREE.MeshLambertMaterial( { transparent: true, opacity: 0} );
            scene.add(clone);
        }
        if(intersects[0]!=null){
            mse = intersects[0].point.sub(offset);
            clone.position.copy(mse);

        }

        var test = false;
        console.log(clone.position);
        for (var vertexIndex = 0; vertexIndex < clone.geometry.vertices.length; vertexIndex++){       
            var localVertex = clone.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(clone.matrix);
            var directionVector = globalVertex.sub( clone.position );

            var ray = new THREE.Raycaster( clone.position, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( walls );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
            {
                test=true;
                break;
            }
            var tmpObjs = [];
            for(var i=0;i<objects.length;i++){
                tmpObjs[i]=objects[i];
            }
            var index = tmpObjs.indexOf(selectedMesh);
            tmpObjs.splice(index, 1);
            collisionResults = ray.intersectObjects( tmpObjs );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
            {
                test=true;
                break;
            }
        }

        if(!test){
           selectedMesh.position.copy(clone.position);
        }
        return;
    }
}

function checkWalls(){
    if(walls.length==0){return;}
    var nearestwall = getNearestWall(camera);
    for(var i=0;i<walls.length;i++){
        if(walls[i]!=nearestwall){
            walls[i].material=baseMaterial;
        }
    }
    if(nearestwall.material==baseMaterial){
        nearestwall.material=invMaterial;
    }
}

function getNearestWall(obj){
    var minDist=99999999;
    var nearestwall=null;
    for(var i=0;i<walls.length;i++){
        var dist=0;
        var j;
        for(j=0;j<walls[i].geometry.vertices.length;j++){
            dist+=obj.position.distanceTo(walls[i].geometry.vertices[j]);
        }
        dist=dist/j;
        if(dist<minDist){
            minDist=dist;
            nearestwall=walls[i];
        }
    }
    return nearestwall;
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

function updateMyGround(){//TODO triangulation
    if(points.length>2){
        myGroundGeo=new THREE.Geometry();
        myGroundGeo.vertices = [];
        myGroundGeo.faces = [];
        scene.remove(myGround);

        myGround=null;
        for(var i=0;i<points.length;i++){
           myGroundGeo.vertices.push(points[i]);
        }

        //face
        for(var i=0;i<points.length-2;i++){
                myGroundGeo.faces.push(new THREE.Face3(0,i+1,i+2));
        }

        myGroundGeo.computeFaceNormals();
        myGroundGeo.computeCentroids();
        myGroundGeo.computeVertexNormals();
        myGround = new THREE.Mesh( myGroundGeo, baseMaterial );
        
        myGround = new THREE.Mesh( myGroundGeo, baseMaterial );
        myGround.position.set(0,1,0);
        scene.add(myGround);
    }
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
    controls.update();
    checkWalls();
    requestAnimationFrame( animate );
    render();
}

