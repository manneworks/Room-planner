
var renderer, scene, camera, width, height, projector;
var groundMesh,myGroundGeo,myGround;
var particleMaterial;


var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } );
var invisibleMaterial = new THREE.MeshLambertMaterial( {transparent: true, opacity: 0.0} );
var baseMaterial = new THREE.MeshLambertMaterial( { color:'red', side:THREE.DoubleSide, shading: THREE.SmoothShading } );
var invMaterial = new THREE.MeshLambertMaterial( { color:'red', side:THREE.DoubleSide, shading: THREE.SmoothShading , transparent: true, opacity: 0.1} );

var controls;

var objects = [];
var objectsBounds = [];

var circles=[];
var walls=[];

var selected = false;
var selectedMesh = null;
var offset = new THREE.Vector3();

var creation = true;
var points= [];

var loader = new THREE.JSONLoader();

var objHandler = null;

var clone=null;
var xsz=0;
var ysz=0;
var zsz=0;

initView();
animate();

function initView(){
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

    //loadObj
    objHandler = new ObjectHandler();
    objHandler.loadObjs();

    // on effectue le rendu de la scène
    render();

    document.getElementById('view').addEventListener('mousedown',onMouseDown,false);
    document.getElementById('view').addEventListener('mouseup',onMouseUp,false);
    document.getElementById('view').addEventListener('mousemove',onMouseMove,false);
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
}


function handleKeyDown(e){
    var unicode=e.keyCode? e.keyCode : e.charCode;
    if(selectedMesh==null){
        return;
    }
    if(unicode == 37){
        selectedMesh.rotation.y+= Math.PI / 180;
        objectsBounds[ objects.indexOf(selectedMesh) ].rotation.y+=Math.PI / 180;
        scene.remove(clone);
        clone=null;
    }else if(unicode == 39){
        selectedMesh.rotation.y-= Math.PI / 180;
        objectsBounds[ objects.indexOf(selectedMesh) ].rotation.y-=Math.PI / 180;
        scene.remove(clone);
        clone=null;
    }
}

function handleKeyUp(e){
    if(selectedMesh!=null && clone==null){
        updateClone();
        clone.position.y+=ysz;
    }
}

function updateClone(){
    if(clone==null){
        clone = selectedMesh.clone();
       // clone.material=new THREE.MeshLambertMaterial( { transparent: true, opacity: 0.5} );
        clone.material = wireMaterial;
        clone.traverse(function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.geometry.computeBoundingBox();
            box = child.geometry.boundingBox;
            console.log(box);
        }
        });  
        zsz = (((box.max.z*clone.scale.z)-(box.min.z*clone.scale.z)))/2;
        segments = Math.round((zsz/15)); ;
        console.log("segments: "+segments);
        geo = new THREE.CubeGeometry(box.max.x-box.min.x, box.max.y-box.min.y, box.max.z-box.min.z,segments,segments,segments);
        ysz=((box.max.y*clone.scale.y)-(box.min.y*clone.scale.y))/2;
        xsz = ((box.max.x*clone.scale.x)-(box.min.x*clone.scale.x))/2;
        clone.geometry=geo;
        scene.add(clone);
        console.log("nbVertices: "+clone.geometry.vertices.length);
    }
}



function addObject(p){
    mesh = objHandler.getMesh(objSelectedId).clone();
    mesh.position.set(p.x, p.y, p.z);
    scene.add(mesh);
    objects.push(mesh);

    c = mesh.clone();
   // clone.material=new THREE.MeshLambertMaterial( { transparent: true, opacity: 0.5} );
    //c.material = wireMaterial;
    c.material=invisibleMaterial;
    var box=null;
    c.traverse(function ( child ) {
    if ( child instanceof THREE.Mesh ) {
        child.geometry.computeBoundingBox();
        box = child.geometry.boundingBox;
    }
    });  
    var czsz = (((box.max.z*c.scale.z)-(box.min.z*c.scale.z)))/2;
    segments = Math.round((czsz/15));;
    geo = new THREE.CubeGeometry(box.max.x-box.min.x, box.max.y-box.min.y, box.max.z-box.min.z,segments,segments,segments);
    c.geometry=geo;
    c.position.y+= ((box.max.y*c.scale.y)-(box.min.y*c.scale.y))/2;
    scene.add(c);
    objectsBounds.push(c);
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
    scene.remove(clone);
    clone=null;
}


function onMouseMove(event){
    if(selected){
        //collisions
        var vector = new THREE.Vector3((event.offsetX / width)*2-1, -(event.offsetY / height)*2+1,0.5);
        projector.unprojectVector(vector,camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObject(myGround);

        updateClone();

        if(intersects[0]!=null){
            mse = intersects[0].point.sub(offset);
            clone.position.copy(mse);
            clone.position.y+=ysz;
        }

        //liste obj a test
        var tmpObjs = [];
            for(var i=0;i<objectsBounds.length;i++){
                tmpObjs[i]=objectsBounds[i];
            }
        var index = objects.indexOf(selectedMesh);
        tmpObjs.splice(index, 1);


        //collisionbox
        var selectedCollisionBox = objectsBounds[index];

        var cpt=0;
        var test=false;
        for (var vertexIndex = 0; vertexIndex < clone.geometry.vertices.length; vertexIndex++){
            cpt++;

            var localVertex = clone.geometry.vertices[vertexIndex].clone();
            var globalVertex = localVertex.applyMatrix4(clone.matrix);
            var directionVector = globalVertex.sub( clone.position );

            //raycasting
            var ray = new THREE.Raycaster( clone.position, directionVector.clone().normalize() );
            var collisionResults = ray.intersectObjects( walls );
            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
            {
                test=true;
                break;
            }

            //test box contains pts
            var inBox=false;
            var testpts = new THREE.Vector3(globalVertex.x+clone.position.x,0,globalVertex.z+clone.position.z)
        
            //console.log(testpts);
            for(var objBoxId in tmpObjs){
                objBox = tmpObjs[objBoxId];
                if( RectContains(objBox.rotation.y,objBox.position.x,objBox.position.z,objBox.geometry.width,objBox.geometry.depth, testpts.x,testpts.z) ){
                    inBox=true;;
                    break;
                }
            }
            if(inBox){
                test=true;
                break;
            }

            
        }
        console.log(cpt +"pts utilisés sur: "+clone.geometry.vertices.length);
        

        if(!test){
           selectedMesh.position.copy(clone.position);
           selectedMesh.position.y-=ysz;
           selectedCollisionBox.position.copy(clone.position);
        }
        return;
    }
}

function RectContains(rotation,rx,ry,rwidth,rheight,x,y){ //rx ry, centre du rectangle
    var c = Math.cos(-rotation);
    var s = Math.sin(-rotation);

    var rotatedX = rx+c*(x-rx)-s*(y-ry);
    var rotatedY = ry+s*(x-rx)+c*(y-ry);

    var leftX = rx-rwidth/2;
    var rightX = rx+rwidth/2;
    var topY = ry-rheight/2;
    var bottomY = ry+rheight/2;
    return leftX <= rotatedX && rotatedX <= rightX && topY <= rotatedY && rotatedY <=bottomY;
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

function createWalls(){//100=1m
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

    //Triangulation ...
    if(points.length>2){  
        myGroundGeo=new THREE.Geometry();
        myGroundGeo.vertices = [];
        myGroundGeo.faces = [];
        scene.remove(myGround);

        myGround=null;
        for(var i=0;i<points.length;i++){
           myGroundGeo.vertices.push(points[i]);
        }

        holes = [];

        pts = [];
        for(var i=0;i<points.length;i++){
           pts.push(new THREE.Vector2(points[i].x,points[i].z));
           console.log(pts);
        }

        faces = triangulate2(pts, holes);
        for(var i=0;i<faces.length;i++){
            face = faces[i];
            myGroundGeo.faces.push(new THREE.Face3(face[0],face[1],face[2]));
        }

        console.log(myGroundGeo.faces);
        myGroundGeo.computeFaceNormals();
        myGroundGeo.computeCentroids();
        myGroundGeo.computeVertexNormals();    
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
    setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 / 30 );
    render();
}


 function triangulate2( mpts, holes ) {

        // For use with Poly2Tri.js

        var allpts = mpts.concat();
        var shape = [];

        for (var p in pts) {
            shape.push(new js.poly2tri.Point(pts[p].x, pts[p].y));
        }

        var swctx = new js.poly2tri.SweepContext(shape);


        for (var h in holes) {
            var aHole = holes[h];
            var newHole = []
            for (i in aHole) {
                newHole.push(new js.poly2tri.Point(aHole[i].x, aHole[i].y));
                allpts.push(aHole[i]);
            }
            swctx.AddHole(newHole);
        }

        var find;
        var findIndexForPt = function (pt) {
            find = new THREE.Vector2(pt.x, pt.y);
            var p;
            for (p=0, pl = allpts.length; p<pl; p++) {
                if (allpts[p].equals(find)) return p;
            }
            return -1;
        };

        // triangulate
        js.poly2tri.sweep.Triangulate(swctx);

        var triangles =  swctx.GetTriangles();
        var tr ;
        var facesPts = [];
        for (var t in triangles) {
            tr =  triangles[t];
            facesPts.push([
                findIndexForPt(tr.GetPoint(0)),
                findIndexForPt(tr.GetPoint(1)),
                findIndexForPt(tr.GetPoint(2))
                    ]);
        }


    //  console.log(facesPts);
    //  console.log("triangles", triangles.length, triangles);

        // Returns array of faces with 3 element each
    return facesPts;
    }

