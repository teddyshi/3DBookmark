var scene,camera,renderer,material,torusGeometry,container,torus,
dragArea,dragTargetTorus,torusPlane,INTERSECTED,SELECTED;
var objects = [];
var originPoint = new THREE.Vector3(0,0,0);
//var torusObejcts = [];
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var radius = 500;
var cardDefaultSize = {width:32,height:2,depth:64};
var dragZAxisOffset = cardDefaultSize.depth*0.5;
var status = "NORMAL";//EDIT
var rootGroup = new THREE.Group();


function init(){
	container = document.getElementById("container");
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, radius*25 );
	camera.position.z = radius*0.25;
	camera.position.y = -radius*1.6;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );	
	controls = new THREE.OrbitControls( camera ,document,renderer.domElement);
	controls.damping = 2;
	controls.addEventListener('change', render );
	container.appendChild( renderer.domElement );	
	dragTargetTorus = new THREE.TorusGeometry( radius, 100, 30, 1000);
	torusGeometry = new THREE.TorusGeometry( radius, 0.1, 30, 1000); 
    material = new THREE.MeshBasicMaterial( { color: 0xe8e8e8} );
    torus = new THREE.Mesh( torusGeometry, material );
	dragArea = new THREE.Mesh( dragTargetTorus, material );
    dragArea.visible = false;
    scene.add( dragArea );
    //rootGroup.add(torus);
    torusPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 2*radius, 2*radius, 8,8),
			new THREE.MeshBasicMaterial( { color: 0xe8e8e8, opacity: 0.25, transparent: true } )
		);
    torusPlane.visible = true;
    scene.add(torusPlane);
    var itemBox = addCard(new THREE.Vector3(0,-radius,0),'SAP',{fillStyle:'blue'});
	scene.add(itemBox); 
	objects.push(itemBox);
	rootGroup.add(itemBox);
	scene.add(rootGroup);
	// var textOpts = {
	// 		row1:{text:'title',color:'red'},
	// 		row2:{text:'subtitle',color:'blue'},
	// 		row3:{text:'content',color:'yellow'}
	// };
	// var itemText1 = new HTU.TextGroup(new THREE.Vector3(0,-radius, 0),textOpts);
	// scene.add(itemText1); 
	// objects.push(itemText1);
	
    var helper = new THREE.GridHelper( radius*2, 50 );
    scene.add( helper );
    renderer.domElement.addEventListener( 'dblclick', onDocumentDblClick, false );
    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
}

function addCard(position,text,color){
	return new HTU.Card(
    		{
    			position:position,
    			width:cardDefaultSize.width,
    			height:cardDefaultSize.height,
    			depth:cardDefaultSize.depth,
    			type:'TEXT',
    			text:text,
    			textColor:color,
    			textAreaWidth:cardDefaultSize.width,
				textAreaHeight:cardDefaultSize.depth,
    		}
    );
}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
}

//True:clockwise,False:anticlockwise
function rotateCard(direction){
	var _direction = null;
	if(direction===undefined||direction===null||typeof direction!='boolean'){
		_direction = false;
	}else{
		_direction = direction;
	}
	var angle = Math.PI*0.05;
	if(_direction){
		angle = -angle;
	}
	//rotate it's self
	rootGroup.children[1].rotation.z -= angle;
	//rotate around the original point
	rootGroup.rotateOnAxis(new THREE.Vector3(0,0,1).normalize(),angle);
	renderer.render( scene, camera );
}

function render() {
	renderer.render( scene, camera );
	//var interval = window.setInterval('console.log(rootGroup);rootGroup.rotateOnAxis(new THREE.Vector3(0,0,1),Math.PI*0.05);renderer.render( scene, camera );',2000);
}


//event
function onDocumentMouseDown( event ) {
	if(status==="NORMAL"){
		return;
	}
	//console.log("enter:onDocumentMouseDown");
	event.preventDefault();
	
	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );
	//console.log("x,y:["+mouse.x+","+mouse.y+"]");
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	//console.log("raycaster:"+raycaster);
	
	var intersects = raycaster.intersectObjects( objects,true );
	if ( intersects.length > 0 ) {
		//console.log('selected...');
		controls.enabled = false;

		SELECTED = intersects[0].object;

		container.style.cursor = 'move';
	}
	//console.log("exit:onDocumentMouseDown");
}

function onDocumentMouseMove( event ) {
	if(status==="NORMAL"){
		return;
	}
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	
	if ( SELECTED ) {
		//console.log("intersect with torus ...:");
		var intersects = raycaster.intersectObject( dragArea,true);
		if(intersects.length>0){
		//console.log("intersect with torus:"+intersects.length);
		//console.log("moving");
		var intersectPos = intersects[ 0 ].point;
			if(SELECTED.group){
				//SELECTED.group.matrix.setPosition(new THREE.Vector3(mouse.x,mouse.y,0));
				SELECTED.group.position.copy(intersectPos);
			}else{
				SELECTED.position.copy( intersectPos );
			}
			//var projectOnPlane = currentMouseVector.projectOnPlane(torusPlane);
			////console.log("project on torus plane:{"+projectOnPlane.x+","+projectOnPlane.y+","+projectOnPlane.z+"}");
		}
		////console.log("intersect with torus end");
		render();
		return;

	}
	////console.log("SELECTED:"+SELECTED);
	var intersects = raycaster.intersectObjects( objects ,true);
	//console.log("intersects size:"+intersects.length);
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			//if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			//INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
			//plane.position.copy( INTERSECTED.position );
			//plane.lookAt( camera.position );
		}
		container.style.cursor = 'pointer';
		//console.log("intersects.length > 0");
	} else {
		//if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
		container.style.cursor = 'auto';
		//console.log("container.style.cursor = 'auto'");
	}

}

function onDocumentDblClick( event ){
		alert(1);
}

function onDocumentMouseUp( event ) {
	if(status==="NORMAL"){
		return;
	}
	event.preventDefault();
	controls.enabled = true;
	if(SELECTED!=null){
		var currentMouseVectorProjectionOnPlane = new THREE.Vector3(SELECTED.position.x,SELECTED.position.y,0);
		var distanceToOrigin = currentMouseVectorProjectionOnPlane.distanceTo(originPoint);
		var rate = distanceToOrigin/radius;
		var new_x = SELECTED.position.x/rate;
		var new_y = SELECTED.position.y/rate;
		SELECTED.position.x = new_x;
		SELECTED.position.y = new_y;
		SELECTED.position.z = -dragZAxisOffset;
		render();
	}

	if ( INTERSECTED ) {
		SELECTED = null;
	}
	container.style.cursor = 'auto';
}