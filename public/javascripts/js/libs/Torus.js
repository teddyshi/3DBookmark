var scene,camera,renderer,material,torusGeometry,container,torus,dragArea,dragTargetTorus,torusPlane;
var objects = [];
var originPoint = new THREE.Vector3(0,0,0);
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
dragOffset = new THREE.Vector3(0,0,5),
INTERSECTED, SELECTED;
var mode = 'browse';//edit


function init(){
	container = document.getElementById("container");
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 750, window.innerWidth / window.innerHeight, 0.1, 10000 );
	camera.position.z = 200;
	camera.position.y = -70;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	controls = new THREE.OrbitControls( camera ,document,renderer.domElement);
	controls.damping = 2;
	controls.addEventListener( 'change', render );

	container.appendChild( renderer.domElement );
	
	dragTargetTorus = new THREE.TorusGeometry( 50, 20, 30, 1000);
	torusGeometry = new THREE.TorusGeometry( 50, 0.1, 30, 1000);
    
    material = new THREE.MeshBasicMaterial( { color: 0xe8e8e8} );
    torus = new THREE.Mesh( torusGeometry, material );
    dragArea = new THREE.Mesh( dragTargetTorus, material );
    dragArea.visible = false;
    
    scene.add( dragArea );
    scene.add( torus );
    
    torusPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 200, 200, 8, 8 ),
			new THREE.MeshBasicMaterial( { color: 0xe8e8e8, opacity: 0.25, transparent: true } )
		);
    torusPlane.visible = true;
    scene.add(torusPlane);
	
    var itemBox = new HTU.ItemBox(
    		{
    			position:new THREE.Vector3(0,-50, 0),
    			width:10,/*width*/
    			height:5,/*thickness*/
    			depth:20,/*height*/
    			useFaceMaterial:true,
    			meshFaceMaterial:
    				[
    				 new THREE.MeshBasicMaterial( { color: 0x5700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x6700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x8700a5} ),
    				 new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/EMP_Network.png' )}),
    				 new THREE.MeshBasicMaterial( { color: 0x7700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x9700a5} )
    				 ],
    			itemBoxVerticalGap:0.5
    		}
    );
	scene.add(itemBox); 
	objects.push(itemBox);
   // addNewItemBox(0,-50,0);
	
	
	
	
	var dynTexture = new THREEx.DynamicTexture(200,	200);
	var imageGrass = new Image();       
	imageGrass.src = 'textures/20141019_123603.jpg';
	dynTexture.context.font	= "bolder 50px Verdana";
	dynTexture.clear('gray')
	.drawTextCooked('Portal', {
		margin		:0.1,
		lineHeight	:  0.1,
		align		: 'right',
		fillStyle	: 'yellow'
	});
	dynTexture.drawImage(imageGrass,100,100);
	dynTexture.needsUpdate = true;
	
	
	var itemBox2 = new HTU.ItemBox(
    		{
    			position:new THREE.Vector3(-50,0,0),
    			width:10,/*width*/
    			height:5,/*thickness*/
    			depth:20,/*height*/
    			useFaceMaterial:true,
    			meshFaceMaterial:
    				[
    				 new THREE.MeshBasicMaterial( { color: 0x5700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x6700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x8700a5} ),
    				 new THREE.MeshBasicMaterial( { map: dynTexture.texture}),
    				 new THREE.MeshBasicMaterial( { color: 0x7700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x9700a5} )
    				 ],
    			itemBoxVerticalGap:0.5
    		}
    );
	
//	meshBasicMaterial:new THREE.MeshBasicMaterial( { map: dynTexture.texture}),
	scene.add(itemBox2); 
	objects.push(itemBox2);
	
    var itemBox3 = new HTU.ItemBox(
    		{
    			position:new THREE.Vector3(50,0, 0),
    			width:10,/*width*/
    			height:5,/*thickness*/
    			depth:20,/*height*/
    			useFaceMaterial:true,
    			meshFaceMaterial:
    				[
    				 new THREE.MeshBasicMaterial( { color: 0x5700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x6700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x8700a5} ),
    				 new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'textures/20141019_123603.jpg' )}),
    				 new THREE.MeshBasicMaterial( { color: 0x7700a5} ),
    				 new THREE.MeshBasicMaterial( { color: 0x9700a5} )
    				 ],
    			itemBoxVerticalGap:0.5
    		}
    );
	scene.add(itemBox3); 
	objects.push(itemBox3);
	
	
    var helper = new THREE.GridHelper( 100, 10 );
    scene.add( helper );
    renderer.domElement.addEventListener( 'dblclick', onDocumentDblClick, false );
    renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );



}


//function addNewItemBox(mountPointX,mountPointY,mountPointZ){
//	var mountPointSphere = new THREE.SphereGeometry( 0.5, 0.8, 0.1);
//	var mountPoint = new THREE.Mesh( mountPointSphere, new THREE.MeshBasicMaterial( { color: 0x2700a5} ) );
//	mountPoint.position.x = mountPointX;
//	mountPoint.position.y = mountPointY;
//	mountPoint.position.z = mountPointZ;
//	scene.add(mountPoint); 
//	objects.push(mountPoint);
//	 
//	var itemBoxGeometry = new THREE.BoxGeometry(10, 2, 20);
//	var itemBox = new THREE.Mesh( itemBoxGeometry, new THREE.MeshBasicMaterial( { color: 0x2700a5} ) );
//	itemBox.position.x = mountPointX;
//	itemBox.position.y = mountPointY;
//	itemBox.position.z = -10.5;	
//	scene.add(itemBox); 
//	objects.push(itemBox);
//}

function animate() {
	requestAnimationFrame(animate);
	controls.update();
}

function render() {
	renderer.render( scene, camera );
}

/*events start*/
function onDocumentMouseDown( event ) {
	event.preventDefault();
	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 ).unproject( camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( objects ,true);
	if ( intersects.length > 0 ) {
		controls.enabled = false;
		SELECTED = intersects[0].object;
		container.style.cursor = 'move';
	}
}


function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	raycaster.setFromCamera( mouse, camera );
	if ( SELECTED ) {
		var intersects = raycaster.intersectObject( dragArea,true);
		if(intersects.length>0){
			if(mode=='edit'){
				SELECTED.position.copy( intersects[ 0 ].point.sub( dragOffset ) );
			}else if(mode=='browse'){
				//intersects[ 0 ].point
				console.log(intersects[ 0 ].point.x+","+intersects[ 0 ].point.y);
			}
		}
		render();
		return;
	}
	var intersects = raycaster.intersectObjects( objects,true );
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			INTERSECTED = intersects[ 0 ].object;
		}
		container.style.cursor = 'pointer';
	} else {
		INTERSECTED = null;
		container.style.cursor = 'auto';
	}
}


//cylGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, cyl_height/2, 0 ) );

function getReleventPositionOnTorus(newPosition,radius,objectDepth){
	var currentMouseVectorProjectionOnPlane = new THREE.Vector3(newPosition.x,newPosition.y,0);
	var distanceToOrigin = currentMouseVectorProjectionOnPlane.distanceTo(originPoint);
	var rate = distanceToOrigin/radius;
	var new_x = SELECTED.position.x/rate;
	var new_y = SELECTED.position.y/rate;
	return new THREE.Vector3(new_x,new_y,-objectDepth/2-0.5);
}


function onDocumentDblClick( event ){
		alert("not implemented...");
}

function onDocumentMouseUp( event ) {
	event.preventDefault();
	controls.enabled = true;
	if(SELECTED!=null){
		var currentMouseVectorProjectionOnPlane = new THREE.Vector3(SELECTED.position.x,SELECTED.position.y,0);
		var distanceToOrigin = currentMouseVectorProjectionOnPlane.distanceTo(originPoint);
		var rate = distanceToOrigin/50;
		var new_x = SELECTED.position.x/rate;
		var new_y = SELECTED.position.y/rate;
		SELECTED.position.x = new_x;
		SELECTED.position.y = new_y;
		SELECTED.position.z = -10.5;
		render();
	}

	if ( INTERSECTED ) {
		SELECTED = null;
	}
	container.style.cursor = 'auto';
}
