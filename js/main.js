//rails demo code

//we have rail track elements

//straight
var rails_straight = {'start_element':true};
//curve
var rails_turn = {};

//rail matrix
var rail_map = new Array(MAP_SIZE);
for (var i = 0; i < MAP_SIZE; i++) {
  rail_map[i] = new Array(MAP_SIZE);
}

var current_element = 1;
var current_rotation = 0;

//r rotate element at hand
var element_at_hand;

var lastMousePosition = {};

var globalJSONloader = new THREE.JSONLoader();

function load_models()
{
	globalJSONloader.load( "media/models/rail_flat_straight.js", loadObject(rails_straight));
	globalJSONloader.load( "media/models/rail_flat_turn.js", loadObject(rails_turn));
	element_at_hand = rails_straight;
}


function loadObject( gobject ) 
{
	return function (geometry, materials ) 
	{
		materials[ 0 ].shading = THREE.FlatShading;
		gobject.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		gobject.mesh.name = 'rail';
		scene.add( gobject.mesh );
		if(gobject.start_element == true) 
			{}
		else
			gobject.mesh.visible = false;
			
		//gobject.mesh.rotation.x += Math.PI/2;
		gobject.mesh.scale.x *= 1;
		gobject.mesh.scale.y *= 1;
		gobject.mesh.scale.z *= 1;
		//gobject.mesh.position.x -= 2.5;
	}
}

function checkElementDirectionDown(x,y)
{
	//we only allow straight elements of rotation 0 and 2 and turns of rotation 2 and 3
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 0)||(rail_map[x][y].current_rotation == 2))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x][y+1] != 'undefined')
			{
				track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});
				//go on, recurse
				checkElementDirectionDown(x,y+1);
			}
		}
	}

	if(rail_map[x][y].current_element == 2)
	{
		if(rail_map[x][y].current_rotation == 2)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x+1][y] != 'undefined')
			{
				//turn left
				track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});
				checkElementDirectionRight(x+1,y);//dont let this left/right confuse you
			}
		}
		else if (rail_map[x][y].current_rotation == 3)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x-1][y] != 'undefined')
			{
				//turn right
				track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});
				checkElementDirectionLeft(x-1,y);
			}
		}
	}

}

function checkElementDirectionUp(x,y)
{
	//we only allow straight elements of rotation 0 and 2 and turns of rotation 0 and 1
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 0)||(rail_map[x][y].current_rotation == 2))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x][y-1] != 'undefined')
			{
				track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});
				//go on, recurse
				checkElementDirectionUp(x,y-1);
			}
		}
	}

	if(rail_map[x][y].current_element == 2)
	{
		if(rail_map[x][y].current_rotation == 0)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x-1][y] != 'undefined')
			{
				//turn left
				track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});
				checkElementDirectionLeft(x-1,y);
			}
		}
		else if (rail_map[x][y].current_rotation == 1)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x+1][y] != 'undefined')
			{
				//turn right
				track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});
				checkElementDirectionRight(x+1,y);
			}
		}
	}

}


function checkElementDirectionRight(x,y)
{
	//we only allow straight elements of rotation 1 and 3 and turns of rotation 0 and 3
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 1)||(rail_map[x][y].current_rotation == 3))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x+1][y] != 'undefined')
			{
				track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});
				//go on, recurse
				checkElementDirectionRight(x+1,y);
			}
		}
	}
	if(rail_map[x][y].current_element == 2)
	{
		if(rail_map[x][y].current_rotation == 0)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x][y+1] != 'undefined')
			{
				//turn me down
				track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});
				checkElementDirectionDown(x,y+1);
			}
		}
		else if (rail_map[x][y].current_rotation == 3)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x][y-1] != 'undefined')
			{
				track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});
				//turn me up
				checkElementDirectionUp(x,y-1);
			}
		}
	}
}


function checkElementDirectionLeft(x,y)
{
	//we only allow straight elements of rotation 1 and 3 and turns of rotation 1 and 2
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 1)||(rail_map[x][y].current_rotation == 3))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x-1][y] != 'undefined')
			{
				track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});
				//go on, recurse
				checkElementDirectionLeft(x-1,y);
			}
		}
	}
	
	if(rail_map[x][y].current_element == 2)
	{
		if(rail_map[x][y].current_rotation == 1)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x][y+1] != 'undefined')
			{
				//turn me down
				track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});
				checkElementDirectionDown(x,y+1);
			}
		}
		else if (rail_map[x][y].current_rotation == 2)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				alert("track is completed!");
				console.log(track);
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			if(typeof rail_map[x][y-1] != 'undefined')
			{
				track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});
				//turn me up
				checkElementDirectionUp(x,y-1);
			}
		}
	}
}


function convertMatrixToTrack()
{
	var x_coord = MAP_SIZE/2 + Math.floor(lastMousePosition.x/10);
	var y_coord = MAP_SIZE - (MAP_SIZE/2 + Math.floor(lastMousePosition.y/10) + 1);
	
	//analyze element and search for neighbors
	if(rail_map[x_coord][y_coord].current_element == 1)
	{
		//look around
		if((rail_map[x_coord][y_coord].current_rotation == 1)||(rail_map[x_coord][y_coord].current_rotation == 3))
		{
			//check left and right
			if(typeof rail_map[x_coord+1][y_coord] != 'undefined')
			{
				//we have element to the right, lets go there.
				track.push({'direction':DIRECTION_STRAIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionRight(x_coord+1,y_coord);
			}
			else if(typeof rail_map[x_coord-1][y_coord] != 'undefined')
			{
				//lets go left
				//I DONT THINK WE SHOULD GO HERE BECAUSE THERE IS NO ELEM TO THE RIGHT, SO TRACK IS NOT COMPLETE FOR SURE
				track.push({'direction':DIRECTION_STRAIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionLeft(x_coord-1,y_coord);
			}
		}
		else if((rail_map[x_coord][y_coord].current_rotation == 0)||(rail_map[x_coord][y_coord].current_rotation == 2))
		{
			//check up and down
			if(typeof rail_map[x_coord][y_coord-1] != 'undefined')
			{
				//we have element up, lets go there.
				track.push({'direction':DIRECTION_STRAIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionUp(x_coord,y_coord-1);
			}
			else if(typeof rail_map[x_coord][y_coord+1] != 'undefined')
			{
				//lets go down
				//I DONT THINK WE SHOULD GO HERE BECAUSE THERE IS NO ELEM UP, SO TRACK IS NOT COMPLETE FOR SURE
				track.push({'direction':DIRECTION_STRAIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionDown(x_coord,y_coord+1);
			}
		}
	}
	else if(rail_map[x_coord][y_coord].current_element == 2)
	{
		//we have a turn element, lets see where it goes
		if(rail_map[x_coord][y_coord].current_rotation == 0)
		{
			//check left and bottom neighbors
			if(typeof rail_map[x_coord-1][y_coord] != 'undefined')
			{
				//going left
				track.push({'direction':DIRECTION_LEFT,'x':x_coord,'y':y_coord});
				checkElementDirectionLeft(x_coord-1,y_coord);
			}
			else if(typeof rail_map[x_coord][y_coord+1] != 'undefined')
			{
				//going down
				track.push({'direction':DIRECTION_RIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionDown(x_coord,y_coord+1);
			}
		}
		else if(rail_map[x_coord][y_coord].current_rotation == 1)
		{
			//check right and bottom neighbors
			if(typeof rail_map[x_coord+1][y_coord] != 'undefined')
			{
				//going right
				track.push({'direction':DIRECTION_RIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionRight(x_coord+1,y_coord);
			}
			else if(typeof rail_map[x_coord][y_coord+1] != 'undefined')
			{
				//going down
				track.push({'direction':DIRECTION_LEFT,'x':x_coord,'y':y_coord});
				checkElementDirectionDown(x_coord,y_coord+1);
			}
		}
		else if(rail_map[x_coord][y_coord].current_rotation == 2)
		{
			//check up and right neighbors
			if(typeof rail_map[x_coord][y_coord-1] != 'undefined')
			{
				//going up
				track.push({'direction':DIRECTION_RIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionUp(x_coord,y_coord-1);
			}
			else if(typeof rail_map[x_coord+1][y_coord] != 'undefined')
			{
				//going right
				track.push({'direction':DIRECTION_LEFT,'x':x_coord,'y':y_coord});
				checkElementDirectionRight(x_coord+1,y_coord);
			}
		}
		else if(rail_map[x_coord][y_coord].current_rotation == 3)
		{
			//check up and left neighbors
			if(typeof rail_map[x_coord][y_coord-1] != 'undefined')
			{
				//going up
				track.push({'direction':DIRECTION_LEFT,'x':x_coord,'y':y_coord});
				checkElementDirectionUp(x_coord,y_coord-1);
			}
			else if(typeof rail_map[x_coord-1][y_coord] != 'undefined')
			{
				//going left
				track.push({'direction':DIRECTION_RIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionLeft(x_coord-1,y_coord);
			}
		}
	}
}

function addElementToMatrix()
{
	var x_coord = MAP_SIZE/2 + Math.floor(lastMousePosition.x/10);
	var y_coord = MAP_SIZE - (MAP_SIZE/2 + Math.floor(lastMousePosition.y/10) + 1);
	
	rail_map[x_coord][y_coord] = {"current_element":current_element,"current_rotation":current_rotation};
	
	//console.log(rail_map[x_coord][y_coord]);
}

