
//events

function onKeyDown(e)
{
	console.log(e.keyCode);
	 if (e.keyCode == 27) { // esc key remove element at hand
			element_at_hand.mesh.visible = false;
	 }
	 else if (e.keyCode == 67) { // c key clear
	 		
		for( var i = scene.children.length - 1; i >= 0; i--) 
		{
			if(scene.children[i].name == 'rail')
				scene.remove(scene.children[i]);
		}

		g_startPlaying = false;
		element_at_hand.mesh.visible = true;
		
		//reset train position
		train_cart[0].mesh.position.set(5,5,0);
		train_cart[0].mesh.rotation.set(0,0,Math.PI/2);
		train_cart[1].mesh.position.set(10,5,0);
		train_cart[1].mesh.rotation.set(0,0,Math.PI/2);
		train_cart[2].mesh.position.set(15,5,0);
		train_cart[2].mesh.rotation.set(0,0,Math.PI/2);

		//clear matrix map
		rail_map = new Array(MAP_SIZE);
		for (var i = 0; i < MAP_SIZE; i++) {
		  rail_map[i] = new Array(MAP_SIZE);
		}
		rail_map[50][49] = {"current_element":1,"current_rotation":1};
		rail_map[51][49] = {"current_element":1,"current_rotation":1};
		rail_map[46][51] = {"current_element":1,"current_rotation":1};
		track = [];
		track.push({'direction':DIRECTION_STRAIGHT,'x':50,'y':49});
		track.push({'direction':DIRECTION_STRAIGHT,'x':51,'y':49});
		NUM_TRACK_SEGMENTS = track.length;
		setup();
		
		g_railCompleted = false;
		g_trackCompletedNotified = false;

	}
	else if (e.keyCode == 82) { //r key rotate
		element_at_hand.mesh.rotation.z += Math.PI/2;
		current_rotation = Math.round(element_at_hand.mesh.rotation.z/(Math.PI/2))%4;
	}
	else if (e.keyCode == 49) { //1 key select rail straight
		current_element = 1;
		element_at_hand.mesh.visible = false;
		element_at_hand = rails_straight;
		element_at_hand.mesh.visible = true;
		current_rotation = Math.round(element_at_hand.mesh.rotation.z/(Math.PI/2))%4;
	}
	else if (e.keyCode == 50) { //2 key select rail turn
		current_element = 2;
		element_at_hand.mesh.visible = false;
		element_at_hand = rails_turn;
		element_at_hand.mesh.visible = true;
		current_rotation = Math.round(element_at_hand.mesh.rotation.z/(Math.PI/2))%4;
	}
	else if (e.keyCode == 80) { //p key play train
		console.log('start playing');
		
		if(!g_startPlaying)
		{
			//player wants to start the train
			if(!g_railCompleted)
			{
				showConfirmation("Rail tracks doesnt seem to be completed. Are you sure you want to run the train?", RunTheTrain);
			}
			else
			{
				RunTheTrain();
			}
		}
		else
		{
			g_startPlaying = !g_startPlaying;
			element_at_hand.mesh.visible = true;
		}		
	}
	else if (e.keyCode == 109) { //- key slow down
		DELTA -= 0.1;
	}
	else if (e.keyCode == 107) { //+ key faster
		DELTA += 0.1;
	}
	else if (e.keyCode == 65) { //a key about
		document.getElementById("id-loading").style.display = "none";
		if(g_gameStarted)
		{
			//g_gameStarted
			document.getElementById("id-about").style.display = "block";
			g_gameStarted = false;
		}
		else
		{
			document.getElementById("id-about").style.display = "none";
			g_gameStarted = true;
		}
	}
}

function RunTheTrain()
{
	if(!g_railCompleted) console.log('rail should be completed before running the train');
	sound_train_whistle.play();
	g_startPlaying = !g_startPlaying;
	element_at_hand.mesh.visible = false;
}

function onMouseDown (event)
{
	if ((!event.ctrlKey)&&(!g_startPlaying)&&(g_gameStarted)&&(!g_ConfirmationShown)) {
		//if eraser is selected, delete element in this place
		
		//if same element already in this place, ignore click
		
		//if different element is placed there, delete old element and place new one.
	
		//cloning fucks up rotation, 3Pi/2 becomes -Pi/2(three.js bug?), which I admit is pretty much the same, matematically speaking,
		//but it fucks up my rotation logic somehow so we have to save it and assign it manualy
		//element_at_hand.mesh
		var putDownElem = element_at_hand.mesh.clone();
		putDownElem.position.y = lastMousePosition.y;
		putDownElem.position.x = lastMousePosition.x;
		putDownElem.name = 'rail';
		scene.add( putDownElem );
		
		//TODO: play sound
		
		//reset track
		track = [];
		NUM_TRACK_SEGMENTS = 0;
		g_railCompleted = false;
		
		addElementToMatrix();
		convertMatrixToTrackFixed();
		
		if(!g_railCompleted)
		{
			g_trackCompletedNotified = false;
		}
		
		if(typeof floatingText != 'undefined') floatingText.visible = false;
		floatingText = makeText("-1119$", {'x':lastMousePosition.x+8, 'y':lastMousePosition.y-1, 'z':0}, {r:215, g:215, b:20, a:1.0}, 34);
		drawText = true;


		NUM_TRACK_SEGMENTS = track.length;
		
		console.log(track);
		
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

			function onWindowResize() {
				
				//camera.aspect = window.innerWidth / window.innerHeight;
				//camera.updateProjectionMatrix();

				camera.left = window.innerWidth / - 2;
				camera.right = window.innerWidth / 2;
				camera.top = window.innerHeight / 2;
				camera.bottom = window.innerHeight / - 2;

				camera.updateProjectionMatrix();

				
				renderer.setSize( window.innerWidth, window.innerHeight );
				

			}