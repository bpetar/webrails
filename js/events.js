
//events

function onKeyDown(e)
{
	console.log(e.keyCode);
	 if (e.keyCode == 27) { // esc key remove element at hand
			element_at_hand.mesh.visible = false;
	 }
	 else if (e.keyCode == 67) { // c key clear
	 
		element_at_hand.mesh = element_at_hand.mesh.clone();
		element_at_hand.mesh.position.y = lastMousePosition.y;
		element_at_hand.mesh.position.x = lastMousePosition.x;
		element_at_hand.mesh.name = 'ruil';
		scene.add( element_at_hand.mesh );
		for( var i = scene.children.length - 1; i >= 0; i--) 
		{
			if(scene.children[i].name == 'rail')
				scene.remove(scene.children[i]);
		}
		element_at_hand.mesh.name = 'rail';

	}
	else if (e.keyCode == 82) { //r key rotate
		element_at_hand.mesh.rotation.z += Math.PI/2;
		current_rotation = Math.floor(element_at_hand.mesh.rotation.z/(Math.PI/2))%4;
	}
	else if (e.keyCode == 49) { //1 key select rail straight
		current_element = 1;
		element_at_hand.mesh.visible = false;
		element_at_hand = rails_straight;
		element_at_hand.mesh.visible = true;
		current_rotation = Math.floor(element_at_hand.mesh.rotation.z/(Math.PI/2))%4;
	}
	else if (e.keyCode == 50) { //2 key select rail turn
		current_element = 2;
		element_at_hand.mesh.visible = false;
		element_at_hand = rails_turn;
		element_at_hand.mesh.visible = true;
		current_rotation = Math.floor(element_at_hand.mesh.rotation.z/(Math.PI/2))%4;
	}
}

function onMouseDown (event)
{
	if (!event.ctrlKey) {
		//if eraser is selected, delete element in this place
		
		//if same element already in this place, ignore click
		
		//if different element is placed there, delete old element and place new one.
	
		element_at_hand.mesh = element_at_hand.mesh.clone();
		element_at_hand.mesh.position.y = lastMousePosition.y;
		element_at_hand.mesh.position.x = lastMousePosition.x;
		element_at_hand.mesh.name = 'rail';
		scene.add( element_at_hand.mesh );
		
		//TODO: play sound
		
		//reset track
		track = [];
		NUM_TRACK_SEGMENTS = 0;
		
		addElementToMatrix();
		convertMatrixToTrack();
		
		if(NUM_TRACK_SEGMENTS != 0)
			setup();
	}
}

function onDocumentMouseMove(event)
{
	var x_pos;
	var y_pos;
	
	raymouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	raymouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

	raycaster.setFromCamera( raymouse, camera );

	var intersects = raycaster.intersectObjects( intersection_objects, true );

	//snapping
	if ( intersects.length > 0 ) {

			//console.log( intersects[ 0 ].point );
			
			x_pos = intersects[ 0 ].point.x;
			y_pos = intersects[ 0 ].point.y;
			
			x_pos /= 10;
			y_pos /= 10;
			
			var sx = 1;
			var sy = 1;
			var x_pos_f = x_pos % 1;
			var y_pos_f = y_pos % 1;
			var x_pos_n = Math.floor(x_pos);
			var y_pos_n = Math.floor(y_pos);
			
			if(x_pos < 0) {sx = -1; x_pos_f = -x_pos_f;}
			if(y_pos < 0) {sy = -1; y_pos_f = -y_pos_f;}
			
			//console.log(x_pos_f + " " + x_pos_f);
			
			if((x_pos_f > 0.3)&&(x_pos_f < 0.7)&&(y_pos_f > 0.3)&&(y_pos_f < 0.7))
			{
				element_at_hand.mesh.position.x = x_pos_n*10 + 5;
				element_at_hand.mesh.position.y = y_pos_n*10 + 5;
				lastMousePosition.x = element_at_hand.mesh.position.x;
				lastMousePosition.y = element_at_hand.mesh.position.y;
			}
			else
			{
				element_at_hand.mesh.position.x = intersects[ 0 ].point.x;
				element_at_hand.mesh.position.y = intersects[ 0 ].point.y;	
				lastMousePosition.x = element_at_hand.mesh.position.x;
				lastMousePosition.y = element_at_hand.mesh.position.y;
			}
	}
	
	return true;

}