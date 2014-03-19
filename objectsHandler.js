

function ObjectHandler(){
	this.objs = [];
}

ObjectHandler.prototype.loadObjs = function(){
	this.waitUILoaded(this);
}


ObjectHandler.prototype.getMesh = function(name){
	var path = "models/"+name+".js";
	for(var i=0;i<this.objs.length;i++){
		console.log(this.objs[i].getName()+" "+path);
		if(this.objs[i].getName()==path){
			return this.objs[i].getMesh();
		}
	}
	console.log("Error obj not found");
	return null;
}

ObjectHandler.prototype.getName = function(geo){
	for(var i=0;i<this.objs.length;i++){
		if(this.objs[i].getMesh().geometry==geo){
			return this.objs[i].getName();
		}
	}
	console.log("Error obj not found");
	return null;
}

ObjectHandler.prototype.load = function(){
	var objs = this.objs;
	var objsElements = document.getElementsByClassName("models"); 
	var i = objsElements.length; 
	while(i--){
		var path = "models/"+objsElements[i].id+".js";
		var mat = new THREE.MeshLambertMaterial( { color: 'grey', side:THREE.DoubleSide, shading: THREE.SmoothShading } );

	    loader.load( path, this.makeHandler(path,mat,objs));
 	}
}

ObjectHandler.prototype.makeHandler = function(path , mat, objs){
	return function(geometry) {
	        mesh = new THREE.Mesh( geometry, mat );
	        geometry.computeFaceNormals();
	        mesh.position.set(0, 0, 0);
	        objs.push(new myObj(path,mesh));
    };
}

ObjectHandler.prototype.waitUILoaded = function(self){
	console.log(uiLoaded);
	if (!uiLoaded){
	   setTimeout(function(){
	   		self.waitUILoaded(self);
	   },100);
	} else {
	  	self.load();
	}
}

function myObj(name, mesh){
	this.name=name;
	this.mesh=mesh;

	this.getName = function(){
		return name;
	}

	this.getMesh = function(){
		return mesh;
	}
}
