//<--HTU basic configuration start-->
var HTU={version:'1.00'};
HTU.originPoint = new THREE.Vector3(0,0,0);
HTU.radius = 500;
HTU.status = "NORMAL";//optional:NORMAL,EDIT
HTU.rootGroup = new THREE.Group();
HTU.mouse = new THREE.Vector2();
HTU.gapBetweenCardsPosition = HTU.radius*0.01;
HTU.cards = [];
HTU.sortedCards = [];
HTU.rotateGroupOperations = {
	startPosition:null,
	endPosition:null
};
HTU.CardOptions = {
	startPosition:new THREE.Vector3(0, -HTU.radius, 0),
	width:32,
	height:8,
	depth:64,
	text:'',
	textColor:'blue',
	textAreaWidth:32,
	textAreaHeight:64, 
	type:'TEXT',//optional:TEXT,DYNAMIC
	meshBasicMaterial:new THREE.MeshBasicMaterial( { color: 0x9DCFFA} )
};
HTU.dragZAxisOffset = HTU.CardOptions.depth*0.5;
HTU.menu = null;
HTU.DefaultText={
        size: 3,
        height: 0.2,
        curveSegments: 1,
        font: "optimer",
        weight: "bold",
        style: "normal",
        bevelThickness: 0.5,
        bevelSize: 0.5,
        bevelEnabled: false,
};
//<--HTU basic configuration end-->


HTU.install = function(){
	HTU.container = $("#container");
	HTU.scene = new THREE.Scene();
	HTU.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, HTU.radius*25 );
	HTU.camera.position.z = HTU.radius*0.25;
	HTU.camera.position.y = -HTU.radius*1.6;
	HTU.raycaster = new THREE.Raycaster();
	HTU.renderer = new THREE.WebGLRenderer();
	HTU.renderer.setSize( window.innerWidth, window.innerHeight );	
	HTU.controls = new THREE.OrbitControls( HTU.camera ,document,HTU.renderer.domElement);
	HTU.controls.damping = 2;
	HTU.controls.addEventListener('change', HTU.render );
	HTU.container.append( HTU.renderer.domElement );	
	
	HTU.torusGeometry = new THREE.TorusGeometry( HTU.radius, 0.1, 30, 1000); 
    HTU.material = new THREE.MeshBasicMaterial( { color: 0xe8e8e8} );
    HTU.torus = new THREE.Mesh( HTU.torusGeometry, HTU.material );
	HTU.rootGroup.add(HTU.torus);

    //EDIT mode: create an area for user to select and drag a card.
    HTU.dragTargetTorus = new THREE.TorusGeometry( HTU.radius, 100, 30, 1000);
	HTU.dragArea = new THREE.Mesh( HTU.dragTargetTorus, HTU.material );
    HTU.dragArea.visible = false;
    HTU.scene.add( HTU.dragArea );

    //create an area for slide the mouse and rotate the rootGroup.
    HTU.rotateReactor = new THREE.BoxGeometry(HTU.radius*2.5,HTU.radius*2.5,HTU.radius*2.5);
    HTU.rotateReactorArea = new THREE.Mesh( HTU.rotateReactor, HTU.material );
    HTU.rotateReactorArea.visible = false;
	HTU.scene.add( HTU.rotateReactorArea);
    
    
    HTU.torusPlane = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 2*HTU.radius, 2*HTU.radius, 8,8),
			new THREE.MeshBasicMaterial( { color: 0xe8e8e8, opacity: 0.25, transparent: true } )
		);
    HTU.torusPlane.visible = true;
    HTU.scene.add(HTU.torusPlane);

    var card = HTU.addCard(HTU.CardOptions.startPosition,'SAP',{fillStyle:'blue'});
	HTU.scene.add(card); 
	HTU.cards.push(card);
	HTU.rootGroup.add(card);

	var nextPosition = HTU.availablePositionTo(HTU.cards[0],'ANTICLOCKWISE');
    var card2  = HTU.createPreviewCard(nextPosition);
	HTU.scene.add(card2);
	HTU.cards.push(card2);
	HTU.rootGroup.add(card2);
	HTU.scene.add(HTU.rootGroup);
	// var textOpts = {
	// 		row1:{text:'title',color:'red'},
	// 		row2:{text:'subtitle',color:'blue'},
	// 		row3:{text:'content',color:'yellow'}
	// 	// var itemText1 = new HTU.TextGroup(new THREE.Vector3(0,-radius, 0),textOpts);
	// scene.add(itemText1); 
	// objects.push(itemText1);
	
    var helper = new THREE.GridHelper( HTU.radius*2, 50 );
    HTU.scene.add( helper );
    HTU.renderer.domElement.addEventListener( 'dblclick', HTU.onDocumentDblClick, false );
    HTU.renderer.domElement.addEventListener( 'mousemove', HTU.onDocumentMouseMove, false );
	HTU.renderer.domElement.addEventListener( 'mousedown', HTU.onDocumentMouseDown, false );
	HTU.renderer.domElement.addEventListener( 'mouseup', HTU.onDocumentMouseUp, false );

	//initializing menu bar
	HTU.createMenuBar();
	HTU.ShowCardForm();
};

HTU.Card=function(options){
	var cardGeometry = new THREE.BoxGeometry(
			options.width?options.width:HTU.CardOptions.width,
			options.height?options.height:HTU.CardOptions.height,
			options.depth?options.depth:HTU.CardOptions.depth,1,1,1);
	var card,meshMaterial;
	if(options.type==='TEXT'){
		var textWidth  = options.textAreaWidth?options.textAreaWidth:HTU.CardOptions.textAreaWidth;
    	var textHeight = options.textAreaHeight?options.textAreaHeight:HTU.CardOptions.textAreaHeight;
    	var textColor =  options.textColor?options.textColor:HTU.CardOptions.textColor;
    	var dynamicTexture  = new THREEx.DynamicTexture(textWidth,textHeight);
    	//dynamicTexture.drawText(options.text,0,0,textColor,"bolder 3px optimer");
    	dynamicTexture.drawTextCooked(options.text,textColor);
    	//dynamicTexture.drawText(options.text,0,8,textColor);
    	dynamicTexture.texture.needsUpdate  = true;
    	meshMaterial = new THREE.MeshBasicMaterial({
    		map : dynamicTexture.texture
		});
	}else{
    	meshMaterial=options.meshBasicMaterial?options.meshBasicMaterial:HTU.CardOptions.meshBasicMaterial;
    }
    card = new THREE.Mesh( cardGeometry, meshMaterial);  
    card.position.x = options.position?options.position.x:HTU.CardOptions.x;
    card.position.y = options.position?options.position.y:HTU.CardOptions.y;
    card.position.z = -(options?options.depth/2:HTU.CardOptions.depth/2);	
    return card;
};

HTU.provideNextPositionForCard = function(){


};

HTU.addCard = function(position,text,color){
	return HTU.Card(
			{
				position:position,
				width:HTU.CardOptions.width,
				height:HTU.CardOptions.height,
				depth:HTU.CardOptions.depth,
				type:'TEXT',
				text:text,
				textColor:color
				// ,
				// textAreaWidth:HTU.CardOptions.textAreaWidth,
				// textAreaHeight:HTU.CardOptions.textAreaHeight
			}
	);
};


HTU.glideCard = function(angle,direction){
	var _direction = null;
	if(direction===undefined||direction===null||typeof direction!='string'){
		_direction = 'ANTICLOCKWISE';
	}else{
		_direction = direction;
	}
	var _angle;
	if(_direction==='CLOCKWISE'){
		_angle = -angle;
	}else{
		_angle = angle;
	}
	//rotate them self
	for(var i = 0;i<HTU.rootGroup.children.length;i++){
		HTU.rootGroup.children[i].rotation.z -= _angle;
	}
	//rotate around the original point
	HTU.rootGroup.rotateOnAxis(new THREE.Vector3(0,0,1).normalize(),_angle);
	HTU.renderer.render( HTU.scene, HTU.camera );
};

HTU.glideAll = function(){

};


//Handle the dragging event on one card.
//With this feature user can drag and put a card to a new position.
HTU.singleDrag = function(){	
	if ( HTU.SELECTED ) {
		HTU.raycaster.setFromCamera( HTU.mouse, HTU.camera );
		var intersects = HTU.raycaster.intersectObject( HTU.dragArea,true);
		if(intersects.length>0){
		var intersectPos = intersects[ 0 ].point;
			if(HTU.SELECTED.group){
				HTU.SELECTED.group.position.copy(intersectPos);
			}else{
				HTU.SELECTED.position.copy( intersectPos );
			}
		}
		HTU.render();
		return;
	}
	//If nothing selected then try to select some thing.
	HTU.selectObject();
};


HTU.TextGroup=function(position,textContent){//unfinished
	var group,textRow1,textRow2,textRow3;
	group = new THREE.Group();
	group.position = position;
	if(textContent.row1!=null){
		textRow1 = new HTU.Text(group,position,textContent.row1.text,1,textContent.row1.color);
		console.log(textRow1.fillStyle);
		group.add(textRow1);
	}
	if(textContent.row2!=null){
		textRow2 = new HTU.Text(group,position,textContent.row2.text,2,textContent.row2.color);
		group.add(textRow2);
	}
	if(textContent.row3!=null){
		textRow3 = new HTU.Text(group,position,textContent.row3.text,3,textContent.row3.color);
		group.add(textRow3);
	}
	return group;
};

HTU.onDocumentMouseDown = function( event ) {
	event.preventDefault();
	HTU.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	HTU.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	var vector = new THREE.Vector3( HTU.mouse.x, HTU.mouse.y, 0.5 ).unproject( HTU.camera );
	//var raycaster = new THREE.Raycaster( HTU.camera.position, vector.sub( HTU.camera.position ).normalize() );
	HTU.raycaster.setFromCamera( HTU.mouse, HTU.camera );
	var intersects = HTU.raycaster.intersectObjects( HTU.cards,true );
	if ( intersects.length > 0 ) {
		HTU.controls.enabled = false;
		HTU.SELECTED = intersects[0].object;
		HTU.container.css('cursor', 'move');
	}
	if(HTU.status==="NORMAL"){
		HTU.rotateGroupOperations.startPosition = HTU.getPointFromRotateReactor();
		return;
	}
};

HTU.getPointFromRotateReactor = function(){
	HTU.raycaster.setFromCamera( HTU.mouse, HTU.camera );
	var intersects = HTU.raycaster.intersectObject(HTU.rotateReactorArea,true );
	if(intersects.length>0){
		return intersects[0].point;
	}else{
		console.log('Please click and drag your mouse near the cards.');
		return undefined;
	}
};


HTU.onDocumentMouseMove = function( event ) {
	event.preventDefault();
	HTU.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	HTU.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	if(HTU.status==="NORMAL"){
		HTU.selectObject();
		HTU.rotateGroupByAngle();
	}
	if(HTU.status==="EDIT"){
		HTU.singleDrag();
	}
};

HTU.rotateGroupByAngle = function(){
	var startPointOnTorus = HTU.getProjectionPointOnTorus(HTU.rotateGroupOperations.startPosition);
	HTU.rotateGroupOperations.endPosition = HTU.getPointFromRotateReactor();
	var nowPointOnTorus = HTU.getProjectionPointOnTorus(HTU.rotateGroupOperations.endPosition);
	var angle = startPointOnTorus.angleTo(nowPointOnTorus);
	
};

HTU.directionJduge = function(startPoint,endPoint){
	var direction = '';
	var xDiff = endPoint.x - startPoint.x;
	var yDiff = endPoint.y - startPoint.y;
	if(xDiff>0&&yDiff<0){
		direction='ANTICLOCKWISE';
	}
	if(xDiff<0&&)

};

HTU.getProjectionPointOnTorus = function(position){
	var projectionOnPlane = new THREE.Vector3(position.x,position.y,0);
	var distanceToOrigin = projectionOnPlane.distanceTo(HTU.originPoint);
	var rate = distanceToOrigin/HTU.radius;
	var xOnTorus = position.x/rate;
	var yOnTorus = position.y/rate;
	return new THREE.Vector3(xOnTorus,yOnTorus,0);
};

HTU.selectObject = function(){
	HTU.raycaster.setFromCamera( HTU.mouse, HTU.camera );
	var intersects = HTU.raycaster.intersectObjects( HTU.cards ,true);
	if ( intersects.length > 0 ) {
		if ( HTU.INTERSECTED != intersects[ 0 ].object ) {
			HTU.INTERSECTED = intersects[ 0 ].object;
		}
		HTU.container.css('cursor', 'pointer');
	} else {
		HTU.INTERSECTED = null;
		HTU.container.css('cursor', 'auto');
	}
};



HTU.clearRotateGroupOperations = function(){
	HTU.rotateGroupOperations.startPosition = null;
	HTU.rotateGroupOperations.endPosition = null;
};


HTU.onDocumentMouseUp = function( event ) {
	if(HTU.status==="NORMAL"){
		console.log('on mouse up...');
		event.preventDefault();
		HTU.controls.enabled = true;
		HTU.rotateGroupOperations.endPosition = HTU.getPointFromRotateReactor();
		console.log(HTU.rotateGroupOperations.startPosition);
		console.log(HTU.rotateGroupOperations.endPosition);
		var _distance = HTU.rotateGroupOperations.endPosition.distanceTo(HTU.rotateGroupOperations.startPosition);
		console.log('_distance:'+_distance);
		if(_distance>2){
			console.log('rotating...');
		}else{
			HTU.clearRotateGroupOperations();
		}
		return;
	}else{
		event.preventDefault();
		HTU.controls.enabled = true;
		if(HTU.SELECTED!=null){
			var projectionPointOnTorus = HTU.getProjectionPointOnTorus(HTU.SELECTED.position);
			HTU.SELECTED.position.x = projectionPointOnTorus.x;
			HTU.SELECTED.position.y = projectionPointOnTorus.y;
			HTU.SELECTED.position.z = -HTU.dragZAxisOffset;
			HTU.render();
		}
	}
	if ( HTU.INTERSECTED ) {
		HTU.SELECTED = null;
	}
	HTU.container.css('cusor','auto');
	HTU.printPosition(HTU.cards[1]);
};

HTU.onDocumentDblClick = function( event ){
		alert('dbclick');
};


HTU.Text = function(group,_position,textContent,rowNumber,textColor){//unfinished
	console.log("group===>"+group);
	var textGeo = new THREE.TextGeometry(textContent,HTU.DefaultText);
	var rs = new THREE.Mesh(textGeo,new THREE.MeshBasicMaterial({color: textColor}));
	console.log(rs.font);
	rs.position.x = _position.x;
	rs.position.y = _position.y;
	rs.position.z = _position.z;
	rs.verticalOffset = 6;
	rs.group = group;
	if(rowNumber==1){
		rs.position.z -=rs.verticalOffset;
	}else if(rowNumber==2){
		rs.position.z -=rs.verticalOffset*2;
	}else if(rowNumber==3){
		rs.position.z -=rs.verticalOffset*3;
	}else{
		
	}
	rs.rotation.x-=1.5*Math.PI;
	return rs;
};

/**
*Detect whether the card has collision with other objects or not
*/
HTU.isCardCollision = function(card,objects,distance){
	return HTU.isPositionCollision(card.position,objects,distance);
};

HTU.isPositionCollision = function(position,objects,distance){
	var _distance = distance?distance:(HTU.CardOptions.width+HTU.gapBetweenCardsPosition);
	for(var i =0;i<objects.length;i++){
		if(position.distanceTo(objects[i].position)<_distance){
			return true;
		}
	}
	return false;
};


// HTU.collisionDetect = function(object,objects){
// 	var lineLength = HTU.CardOptions.width*0.5;
// 	console.log("objectID:"+object.id);
// 	HTU.printPosition(object);
// 	HTU.printPosition(objects[0]);
// 	var raycasterArray = [
// 		new THREE.Raycaster(object.position,new THREE.Vector3( 1, 0, 0)),
// 		new THREE.Raycaster(object.position,new THREE.Vector3( 0,-1, 0)),
// 		new THREE.Raycaster(object.position,new THREE.Vector3( 1,-1, 0)),
// 		new THREE.Raycaster(object.position,new THREE.Vector3( 1, 1, 0)),
// 		new THREE.Raycaster(object.position,new THREE.Vector3( 0, 1, 0)),
// 		new THREE.Raycaster(object.position,new THREE.Vector3(-1, 1, 0)),
// 		new THREE.Raycaster(object.position,new THREE.Vector3(-1, 0, 0)),
// 		new THREE.Raycaster(object.position,new THREE.Vector3(-1,-1, 0))
// 	];
// 	for(var i =0;i<raycasterArray.length;i++){
// 		var intersections = raycasterArray[i].intersectObjects(objects);
// 		console.log(i+'-intersection length:'+intersections.length);
// 		if(intersections.length>0){
// 			HTU.printPosition(intersections[0]);
// 			HTU.printPosition(intersections[1]);
// 			console.log("distance:"+intersections[0].distance);
// 			return true;
// 		}
// 	}
// 	return false;
// };

HTU.printPosition = function(object){
	if(!object){
		return;
	}
	if(object.position){
		console.log("["+object.id+":"+object.position.x+","+object.position.y+","+object.position.z+"]");
	}else{
		console.log("["+object.object.id+":"+object.object.position.x+","+object.object.position.y+","+object.object.position.z+"]");
	}	
}

HTU.animate = function() {
	requestAnimationFrame(HTU.animate);
	HTU.controls.update();
};

HTU.render = function() {
	HTU.renderer.render( HTU.scene, HTU.camera );
};

HTU.createMenuBar = function(){
	HTU.menuBar = $("<div>", { id:"MENU_BAR"});
	HTU.menuBar.id = "MENU_BAR";
	HTU.menuBar.addClass('menuBar');
	HTU.menuBar.childrenItem = new Array();
	HTU.container.append(HTU.menuBar);
	HTU.createMenuItem(0,'create_card','Create Card',function(){console.log('creating.. card');});	
	HTU.createMenuItem(1,'remove_card','Remove Card',function(){console.log('removing.. card');});
};

HTU.createMenuItem = function(index,name,label,fn){
	var item = $('<div>',{id:HTU.menuBar.id+"_"+name});
	item.addClass('menuItem');
	item.css('top',index*50+'px');
	item.html(label);
	HTU.menuBar.childrenItem.push(item);
	item.click(fn);
	HTU.menuBar.append(item);
};

HTU.ShowCardForm = function(data){
	var cardContentDiv = $("<div>", { id:"_CARD_CONTENT_DIV"});
	cardContentDiv.addClass('cardForm');
	var form = $("<form>",{
		id:"_CARD_FORM",
		method:'post',
		enctype:'multipart/form-data',
		action:'/upload'
	});
	form.ajaxForm();
	var fileInput = $("<input>",{
		type:'file',
		name:'displayImage',
	});
	var uploadBtn = $("<input>",{
		type:'button'
	});
	uploadBtn.click(function(){
		form.ajaxSubmit({                                                                                                                 
			error: function(xhr) {
				console.error('Error: ' + xhr.status);
			},
			success: function(response) {
				if(response.error) {
				console.error('Opps, something bad happened');
				return;
			}
			var imageUrlOnServer = response.path;
				console.log('Success, file uploaded to:' + imageUrlOnServer);
				$('<img/>').attr('src', imageUrlOnServer).appendTo(cardContentDiv);
			}
		});
	});
	form.append(fileInput);
	form.append(uploadBtn);
	cardContentDiv.append(form);
	HTU.container.append(cardContentDiv);
};


HTU.testSaveCard = function(){
	$.ajax({
			url:'/saveCard',
			dataType:'json',
			data: { a: "John", b: "Boston" },
			method:'post'
		}).done(function(data){
			console.log('after ajax:'+data);
		});
};

HTU.testUpload = function(){
	$.ajax({
			url:'/upload',
			dataType:'json',
			data: { a: "John", b: "Boston" },
			method:'post'
		}).done(function(data){
			console.log('after ajax:'+data);
		});
};


/*
 * This function will give out the recommended position of a new object.
 * the function can calculate one position avoiding duplicated positions of objects.
 * 
 */
HTU.availablePositionTo = function(card,direction){
	var position = card.position.clone();
	var movingAngle = 0;
	while(!HTU.isPositionAvailable(position)){
		position = HTU.afterMovingShortDistance(position,direction);
		movingAngle+= (HTU.CardOptions.width*0.1)/(Math.PI*2*HTU.radius);
		if(movingAngle>=Math.PI*2&&!HTU.isPositionAvailable(position)){
			return null;
		}
	}
	return position;
};

HTU.isPositionAvailable = function(position){
	return !HTU.isPositionCollision(position,HTU.cards);
};

HTU.afterMovingShortDistance = function(position,direction){
	var p = position.clone();
	var d = HTU.CardOptions.width*0.1;
	var r = HTU.radius;
	if('ANTICLOCKWISE'===direction){
		d = -d;
	}else if('CLOCKWISE'===direction){
		
	}else{
		return;
	}
	if(p.x===0&&p.y===-r){
		p.x+=d;
	}else if(p.x===0&&p.y===r){
		p.x-=d;
	}else if(p.x===-r&&p.y===0){
		p.y+=d;
	}else if(p.x===r&&p.y===0){
		p.y-=d;
	}else{
		p.x += p.y>0?d:-d;
		p.y += p.x>0?d:-d;
	}
	var distanceToOrigin = p.distanceTo(HTU.originPoint);
	var rate = distanceToOrigin/HTU.radius;
	var new_x = p.x/rate;
	var new_y = p.y/rate;	
	p.x = new_x;
	p.y = new_y;
	return p;
};

HTU.createPreviewCard = function(position){
	return HTU.Card(
			{
				position:position,
				width:HTU.CardOptions.width,
				height:HTU.CardOptions.height,
				depth:HTU.CardOptions.depth,
				type:'DYNAMIC',
				meshBasicMaterial:new THREE.MeshBasicMaterial({
					color: 0x4EC83B
				})
			}
	);
};


HTU.RotateAllStuffs = function(originPoint,radius,existedObjects,xDistance){
	
};



//backlogs:---->
//build stage - implemented
//select - implemented
//drag - implemented
//swap - 
//fold - 
//browsing / edit mode
//rotate all stuffs when mouse moving
//auto browsing - no idea
//free creation - allow user to upload their own pictures,writing down text.And finally put the new item box on the torus.
//remove ,edit
//free js embed ,event controlling
//position adjusting, avoiding the conflicts of the positions (two objects might have the same position in the same time).碰撞检测
//add fog -
//decorate(lighting,filtering) - 
//backlogs end:------>


