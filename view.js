
var renderer, scene, camera, width, height, projector;
var groundMesh,myGroundGeo,myGround;


var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } );
var invisibleMaterial = new THREE.MeshLambertMaterial( {transparent: true, opacity: 0.0} );
var baseMaterial = new THREE.MeshLambertMaterial( { color:'#4c555e', side:THREE.DoubleSide, shading: THREE.SmoothShading } );
var invMaterial = new THREE.MeshLambertMaterial( { color:'white', side:THREE.DoubleSide, shading: THREE.SmoothShading , transparent: true, opacity: 0.1} );

var controls;

var objects = [];
var objectsBounds = [];

var circles=[];
var walls=[];

var date= new Date();
var mouseDownTime=0;
var mouseCD = 80;
var mouseDown=false;

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
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 20000 );
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
    mat = new THREE.MeshLambertMaterial( { color: 0xdddddd, side:THREE.DoubleSide, shading: THREE.SmoothShading } )
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

    //skybox
    createSkyBox();

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

function createSkyBox(){
    var cubegeo = new THREE.CubeGeometry(20000,20000,20000);
    var faces = [
    'textures/sky40000.jpg',//ok
    'textures/sky20000.jpg',//ok
    'textures/sky10000.jpg',//ok
    'textures/sky60000.jpg',//ok
    'textures/sky30000.jpg',
    'textures/sky50000.jpg'
    ];
    var cubemap = THREE.ImageUtils.loadTextureCube(faces);
    cubemap.format = THREE.RGBFormat;
    var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
    shader.uniforms['tCube'].value = cubemap; // apply textures to shader
    // create shader material
    var skyBoxMaterial = new THREE.ShaderMaterial( {
      fragmentShader: shader.fragmentShader,
      vertexShader: shader.vertexShader,
      uniforms: shader.uniforms,
      depthWrite: false,
      side:THREE.DoubleSide
    });

    // create skybox mesh
    var skybox = new THREE.Mesh(cubegeo,skyBoxMaterial);
    console.log(skybox);
    scene.add(skybox);
}


function handleKeyDown(e){
    var unicode=e.keyCode? e.keyCode : e.charCode;
    if(selectedMesh==null){
        return;
    }
    if(unicode==46){
        if(selectedMesh!=null){
           var index = objects.indexOf(selectedMesh);
            scene.remove(selectedMesh);
            scene.remove(objectsBounds[index]);
            objectsBounds.splice(index, 1);
            objects.splice(index,1);
            deselect();
        }
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
        clone.material = invMaterial;
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
    mesh.material = baseMaterial.clone();
    mesh.material.color.setHex(0x9e9e9e);
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

function onMouseUp(event){
    if(event.which==1){
        mouseDown=false;
    }

    if(event.which==1 && selectedMesh!=null){
        mouseDownTime= new Date().getTime()-mouseDownTime;
        if(mouseDownTime<mouseCD){
            deselect();
        }
        mouseDownTime=0;
    }
}

//si pas selectionné: si objet => select
//                      sinon create
//sinon: si objet => deselect/reselect
//          si on selected=objet = si mouseup -1sec apres, deselect, sinon move

function onMouseDown(event){
    if(event.which==1){
        mouseDown=true;
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
                if(points.length == 1){
                    removePre();
                }
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
                if(mouseDownTime==0 && selectedMesh==intersects[0].object){
                    mouseDownTime= new Date().getTime();
                }
                if(selectedMesh!=intersects[0].object){
                    deselect();
                }
                selected=true;
                selectedMesh=intersects[0].object;
                offset.set(0,myGround.position.y-selectedMesh.position.y,0);
                updateClone();
                addObjModifMenu(selectedMesh);
            }else{
                    console.log(myGround.geometry);

                deselect();
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

function deselect(){
    selected=false;
    selectedMesh=null;
    scene.remove(clone);
    clone=null;
    removeObjModifMenu();
}

function onMouseMove(event){
    if(selected && mouseDown && (new Date().getTime()-mouseDownTime)>mouseCD){ 
        //collisions
        var vector = new THREE.Vector3((event.offsetX / width)*2-1, -(event.offsetY / height)*2+1,0.5);
        projector.unprojectVector(vector,camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObject(myGround);

        if(clone==null){
            updateClone();
            clone.position.y+=ysz;
            return;
        }
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

      //  var cpt=0;
        var test=false;
        for (var vertexIndex = 0; vertexIndex < clone.geometry.vertices.length; vertexIndex++){
          //  cpt++;

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
        //console.log(cpt +"pts utilisés sur: "+clone.geometry.vertices.length);
        
        if(!test){
           selectedMesh.position.copy(clone.position);
           selectedMesh.position.y-=ysz;
           selectedCollisionBox.position.copy(clone.position);
           updateObjModifMenu(selectedMesh);
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
        }

        faces = triangulate2(pts, holes);
        for(var i=0;i<faces.length;i++){
            face = faces[i];
            myGroundGeo.faces.push(new THREE.Face3(face[0],face[1],face[2]));
        }
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

        for (var p in mpts) {
            shape.push(new js.poly2tri.Point(mpts[p].x, mpts[p].y));
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


function getStringData(){
    var dataString = "";
    //pts
    for(var ipts in points){
        dataString+=points[ipts].x+":"+points[ipts].y+":"+points[ipts].z+":";
    }
    dataString+="@";

    //faces
    for(var facesi in myGround.geometry.faces){
        dataString+=myGround.geometry.faces[facesi].a+":"+myGround.geometry.faces[facesi].b+":"+myGround.geometry.faces[facesi].c+":";
    }
    dataString+="@";
    //objs
    for(var i in objects){//nom:x:y:z:roatationy:couleur:
        dataString+=objHandler.getName(objects[i].geometry)+":"+objects[i].position.x+":"+objects[i].position.z+":"+objects[i].rotation.y+":"+objects[i].material.color.getHex()+":";
    }
    return dataString;
}



function loading(){
    //data = "898.5677961804388:-922.1311776224752:-944.2516828022626:-921.2801931431663:-916.7483344514978:-116.56546076104055:-304.5192175519951:-131.8557089175673:-320.12228060276334:-75.60367548719972:-903.3719349975084:-67.62742065494125:-903.6957618476957:868.8635382939517:-238.52362647493578:927.4277638501892:-141.44863206236778:-133.40254338496212:36.78434327534865:-150.25529132671596:66.94003676213629:880.480643613388:930.6274722890041:883.2602093852882:/models/Lit.js:406.25405248397124:617.8052263387385:3.1590459461097256:15077649:models/Lit.js:-755.8547131460243:-415.50171624222287:1.5882496193148417:1687070:models/Lavabo.js:-330.8791481329302:799.9203058942983:0:10395294:models/Lavabo.js:-501.48639041991447:820.958807362194:0:10395294:models/Lavabo.js:-728.9778531314628:802.9169989204822:0:10395294:models/Lavabo.js:-696.736602293387:163.66603257837278:0:5595547:models/Table.js:387.33851602264724:-271.0686980576895:0:8516402:";
    //vider objets , sol, mur , points;
    data = "-947.4857138106239:6.406809452529783e-13:-930.6852331523451:-297.44433688182403:1.795657892520065e-13:-916.3462107819128:-299.1561304558819:2.014144645576572e-13:-453.5450537644465:-256.80738274158523:2.0206184756329566e-13:-455.00283069592615:-228.07287681493764:4.120537215079196e-13:-927.8624933198464:967.4364425820453:4.0622765384565903e-13:-914.7433552434504:950.2359969947477:2.6933661641105343e-13:417.5078573469748:-291.5151282129207:-1.5196343333025802e-13:342.1912308600456:-261.371482766283:1.46971635812872e-13:-330.9507021404413:-307.7043056401549:1.4626334840749894e-13:-329.3557806929866:-388.85344137342497:7.844733050692727e-14:335.3523157803961:-405.6443703829115:-2.2701221481357396e-13:511.18606302148135:-337.13706829256597:-2.3212113751908804e-13:522.6903342178903:-304.69812608656576:-1.6780951187979325e-13:377.87342758553086:952.2094965855998:2.940270742321171e-14:445.79098890257:940.7893803494759:-4.2317443089153786e-13:952.9041046379258:-361.26531959307675:-4.181146978274102e-13:941.510598666826:-318.09799275085237:-5.394541899121046e-14:633.4742844335804:-404.5287524216344:-2.768671646071069e-13:623.4494296778462:-433.3930063322248:4.191513829235886e-14:929.6154994026749:-939.4263865753113:-4.076192202195078e-13:917.8768841448137:@10:20:0:11:20:10:20:11:18:19:20:18:18:11:12:18:12:17:17:12:13:17:13:14:15:17:14:16:17:15:10:0:9:9:0:2:9:2:8:8:2:3:5:8:3:6:8:5:7:8:6:3:4:5:2:0:1:@models/Lit.js:503.7530084799597:-373.6564691741751:0:10395294:models/Lit.js:542.215110956237:142.52433646519057:0:10395294:models/Chaise.js:-663.3397133274843:-151.72827375176985:-0.9250245035569955:547032:models/Lavabo.js:606.2621365656232:589.0379965926525:0:10395294:models/Table.js:166.3030443188447:678.8039040116759:0.8726646259971655:63505:";
    for(var walli in walls){
        scene.remove(walls[walli]);
    }
    walls=[];
    for(var objecti in objects){
        scene.remove(objects[objecti]);
    }
    objects=[];
    points=[];
    objectsBounds=[];
    clone=null;
    xsz=0;
    ysz=0;
    zsz=0;
    creation=true;

    var data_pts = data.split("@")[0];
    console.log(data_pts);
    var data_faces = data.split("@")[1].split(":");
    var data_obj = data.split("@")[2].split(":");

    data_pts = data_pts.split(":");
    var indexp=0;
    while(indexp < data_pts.length-2){
        points.push(new THREE.Vector3(parseFloat(data_pts[indexp]),parseFloat(data_pts[indexp+1]),parseFloat(data_pts[indexp+2])));
        drawCircle(points[points.length-1]);
        indexp+=3;
    }


    //create ground
    myGroundGeo=new THREE.Geometry();
    myGroundGeo.vertices = [];
    myGroundGeo.faces = [];
    scene.remove(myGround);
    myGround=null;
    for(var i=0;i<points.length;i++){
       myGroundGeo.vertices.push(points[i]);
    }
    var i=0;
    while(i < data_faces.length-2){
        myGroundGeo.faces.push(new THREE.Face3(parseInt(data_faces[i]),parseInt(data_faces[i+1]),parseInt(data_faces[i+2])));
        myGroundGeo.faces[0].normal.set(6.713464226568749e-17,-1,-4.840213533345553e-16);
        i+=3;
    }

    myGroundGeo.computeFaceNormals();
    myGroundGeo.computeCentroids();
    myGroundGeo.computeVertexNormals(); 
  
    myGround = new THREE.Mesh( myGroundGeo, baseMaterial );
    myGround.position.set(0,1,0);
    scene.add(myGround);

    createWalls();
    clearCircles();
    creation=false;

    //loadObj

     var i=0;
    while(i < data_obj.length-2){

        var nomObj = data_obj[i];
        nomObj = nomObj.substring(7,nomObj.length-3);

        mesh = objHandler.getMesh(nomObj).clone();
        mesh.position.set(data_obj[i+1], 1, data_obj[i+2]);
        mesh.rotation.y=data_obj[i+3];
        mesh.material = baseMaterial.clone();
        mesh.material.color.setHex("0x"+Number(data_obj[i+4]).toString(16));
        console.log(Number(data_obj[i+4]).toString(16));
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

        i+=5;
    }
}