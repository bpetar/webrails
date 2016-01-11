//rails demo code

//we have rail track elements

//straight
var rails_straight = {'start_element':true};
//curve
var rails_turn = {};
//cart
var train_cart = [{},{},{}];
//locomotive
//var train_loco = {};

var debris_coal = {};
var debris_gold = {};
var debris_crystals = {};
var debris_rail1 = {};
var debris_rail2 = {};
var debris_rail3 = {};
var debris_rail4 = {};

var g_startPlaying = false;
var g_gameStarted = false;
var g_railCompleted = false;
var	g_ConfirmationShown = false;
var g_trackCompletedNotified = false;

var offset = {'x':0, 'y':0};

//rail matrix
var rail_map = new Array(MAP_SIZE);
for (var i = 0; i < MAP_SIZE; i++) {
  rail_map[i] = new Array(MAP_SIZE);
}

var current_element = 1;
var current_rotation = 0;

var g_numModels = 0;

//r rotate element at hand
var element_at_hand;

var lastMousePosition = {};

var globalJSONloader = new THREE.JSONLoader();

var sound_train_whistle;

function load_sounds()
{
	sound_train_whistle = document.createElement('audio');
	var source = document.createElement('source');
	source.src = 'media/sounds/train_whistle.mp3';
	sound_train_whistle.appendChild(source);
}

var request;
var progressBar = {};

function loadImage(imageURI)
{
	request = new XMLHttpRequest();
	//request.onloadstart = showProgressBar;
	request.onprogress = updateProgressBar;
	request.onload = loadedImage;
	//request.onloadend = hideProgressBar;
	request.open("GET", imageURI, true);
	request.overrideMimeType('text/plain; charset=x-user-defined'); 
	request.send(null);
}
			
function updateProgressBar(e)
{
	if (e.lengthComputable)
	{
		progressBar.value = e.loaded / e.total * 100;
		document.getElementById("id-loading-progress").style.width = "" + progressBar.value + "%";
	}
	else
		progressBar.removeAttribute("value");
}

function remove_loading_screen()
{
	document.getElementById("id-button-continue").style.display = "block";
	document.getElementById("id-p-loading").innerHTML = "v";
		
	
	
	// var textShapes = THREE.FontUtils.generateShapes( text, options );
// var text = new THREE.ShapeGeometry( textShapes );
// var textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;
// scene.add(textMesh);


	
	/*
	var canvas1 = document.createElement('canvas');
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 40px Arial";
    context1.fillStyle = "rgba(255,0,0,0.95)";
    context1.fillText("AGHAAAA", 0, 50);

    var texture1 = new THREE.Texture(canvas1);
    texture1.needsUpdate = true;

    var material1 = new THREE.MeshBasicMaterial( { map: texture1, side:THREE.DoubleSide } );
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 4),
        material1
    );

    mesh1.position.set(10,10,10);

    scene.add( mesh1 );*/
	
	
	
}

function loadedImage()
{
	// our big texture is loaded, we can remove loading screen
	setTimeout(function(){remove_loading_screen()}, 1400);
	

	console.log("that loaded");
	// init model positions
	layoutModelsAround();
}

			
function load_models()
{
	
	{
			//console.log("this loaded");
			
			loadImage('media/models/rail_set_atlas.png');
			
			// instantiate a loader
			/*var loader = new THREE.TextureLoader();

			// load a resource
			loader.load(
				// resource URL
				'media/textures/rail_set_atlas.png',
				// Function when resource is loaded
				function ( texture ) {
					// our big texture is loaded, we can remove loading screen
					document.getElementById("id-button-continue").style.display = "block";
					document.getElementById("id-p-loading").innerHTML = "v";
					
					console.log("that loaded");
					// init model positions
					layoutModelsAround();
				},
				// Function called when download progresses
				function ( xhr ) {
					console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
				},
				// Function called when download errors
				function ( xhr ) {
					console.log( 'An error happened' );
				}
			);*/
			
		}
		
	globalJSONloader.load( "media/models/rail_flat_straight.js", loadObject(rails_straight));
	globalJSONloader.load( "media/models/rail_flat_turn.js", loadObject(rails_turn));
	globalJSONloader.load( "media/models/handpropelled_railroad_car.json", loadTrainObject(train_cart[0]));
	globalJSONloader.load( "media/models/minecart_v1.json", loadTrainObject(train_cart[1]));
	globalJSONloader.load( "media/models/minecart_v1.json", loadTrainObject(train_cart[2]));
	globalJSONloader.load( "media/models/pile_coal.json", loadDebrisObject(debris_coal));
	globalJSONloader.load( "media/models/pile_gold.json", loadDebrisObject(debris_gold));
	globalJSONloader.load( "media/models/pile_crystals.json", loadDebrisObject(debris_crystals));
	globalJSONloader.load( "media/models/rail_flat_t_junction.json", loadDebrisObject(debris_rail1));
	globalJSONloader.load( "media/models/rail_stand_y1_junction_big_l.json", loadDebrisObject(debris_rail2));
	globalJSONloader.load( "media/models/rail_stand_end_broken.json", loadDebrisObject(debris_rail3));
	globalJSONloader.load( "media/models/rail_stand_upward.json", loadDebrisObject(debris_rail4));
	//
	element_at_hand = rails_straight;
}

function layoutModelsAround()
{
	//train position
	train_cart[0].mesh.position.set(5,5,0);
	train_cart[0].mesh.rotation.set(0,0,Math.PI/2);
	train_cart[1].mesh.position.set(10,5,0);
	train_cart[1].mesh.rotation.set(0,0,Math.PI/2);
	train_cart[2].mesh.position.set(15,5,0);
	train_cart[2].mesh.rotation.set(0,0,Math.PI/2);
	
	//debris
	debris_coal.mesh.position.set(4,25,0);
	debris_gold.mesh.position.set(-1,15,0);
	debris_crystals.mesh.position.set(-37,-22,0);
	
	var moreDebris = debris_gold.mesh.clone();
	moreDebris.position.set(10,25,0);
	moreDebris.rotation.set(0,0,Math.PI/5);
	moreDebris.scale.set(1.5,1.6,1.4);
	scene.add( moreDebris );

	moreDebris = debris_crystals.mesh.clone();
	moreDebris.position.set(-43,-25,0);
	moreDebris.rotation.set(0,0,Math.PI);
	moreDebris.scale.set(1.5,1.6,1.4);
	scene.add( moreDebris );
	moreDebris = debris_crystals.mesh.clone();
	moreDebris.position.set(-47,-20,0);
	moreDebris.rotation.set(0,0,Math.PI/2);
	//moreDebris.scale.set(1.5,1.6,1.4);
	scene.add( moreDebris );
	
	//debris rail elements
	debris_rail1.mesh.position.set(5.8,17.1,0);
	debris_rail1.mesh.rotation.set(0,0,Math.PI);
	debris_rail2.mesh.position.set(40,19,0); // stand l
	debris_rail2.mesh.rotation.set(0,0,-Math.PI/2);
	debris_rail3.mesh.position.set(45.5,35,0);//end
	debris_rail4.mesh.position.set(25,15,0);
	debris_rail4.mesh.rotation.set(0,0,Math.PI/2);
	
	//rail home start
	rail_map[50][49] = {"current_element":1,"current_rotation":1};
	moreDebris = rails_straight.mesh.clone();
	moreDebris.name = 'static_rail';
	moreDebris.position.set(5,5,0);
	moreDebris.rotation.set(0,0,Math.PI/2);
	scene.add( moreDebris );
	rail_map[51][49] = {"current_element":1,"current_rotation":1};
	moreDebris = rails_straight.mesh.clone();
	moreDebris.name = 'static_rail';
	moreDebris.position.set(15,5,0);
	moreDebris.rotation.set(0,0,Math.PI/2);
	scene.add( moreDebris );
	//rail crystal end
	rail_map[46][51] = {"current_element":1,"current_rotation":1};
	moreDebris = rails_straight.mesh.clone();
	moreDebris.name = 'static_rail';
	moreDebris.position.set(-35,-15,0);
	moreDebris.rotation.set(0,0,Math.PI/2);
	scene.add( moreDebris );

	track = [];
	track.push({'direction':DIRECTION_STRAIGHT,'x':50,'y':49});
	track.push({'direction':DIRECTION_STRAIGHT,'x':51,'y':49});
	NUM_TRACK_SEGMENTS = track.length;
	setup();
}


function loadObject( gobject ) 
{
	return function (geometry, materials ) 
	{
		materials[ 0 ].shading = THREE.FlatShading;
		gobject.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		gobject.mesh.name = 'first_rail';
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
		
		g_numModels++;
		console.log("that loaded");
		// if(g_numModels == 6)
		// {
			// document.getElementById("id-button-continue").style.display = "block";
		// }
	}
}

function loadDebrisObject( gobject ) 
{
	return function (geometry, materials ) 
	{
		materials[ 0 ].shading = THREE.FlatShading;
		gobject.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		gobject.mesh.name = 'debris';
		scene.add( gobject.mesh );
		
		g_numModels++;
		console.log("that loaded");
		//if(g_numModels == 6)
		// {
			// document.getElementById("id-button-continue").style.display = "block";
		// }
	}
}


function loadTrainObject( gobject ) 
{
	return function (geometry, materials ) 
	{
		materials[ 0 ].shading = THREE.FlatShading;
		gobject.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
		gobject.mesh.name = 'cart';
		scene.add( gobject.mesh );
		
		g_numModels++;
		console.log("that loaded");
		//if(g_numModels == 6)
		
	}
}

function notifyTrackCompleted()
{
	if(!g_trackCompletedNotified)
	{
		floatingTextRailCompleted = makeText("Track Completed!", {'x':lastMousePosition.x+3, 'y':lastMousePosition.y-1, 'z':5}, {r:15, g:215, b:20, a:1.0}, 44);
		drawTextRailCompleted = true;
		g_trackCompletedNotified = true;
	}
}

function checkElementDirectionDown(x,y)
{
	//crossroad allows to flow through in any direction
	if(rail_map[x][y].current_element == 3)
	{
		track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});

		if(typeof rail_map[x][y+1] != 'undefined')
		{
			//go on, recurse
			checkElementDirectionDown(x,y+1);
		}
	}
	
	//we only allow straight elements of rotation 0 and 2 and turns of rotation 2 and 3
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 0)||(rail_map[x][y].current_rotation == 2))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});

			if(typeof rail_map[x][y+1] != 'undefined')
			{
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
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});

			if(typeof rail_map[x+1][y] != 'undefined')
			{
				//turn left
				checkElementDirectionRight(x+1,y);//dont let this left/right confuse you
			}
		}
		else if (rail_map[x][y].current_rotation == 3)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});

			if(typeof rail_map[x-1][y] != 'undefined')
			{
				//turn right
				checkElementDirectionLeft(x-1,y);
			}
		}
	}

}

function checkElementDirectionUp(x,y)
{
	//crossroad allows to flow through in any direction
	if(rail_map[x][y].current_element == 3)
	{
		track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});

		if(typeof rail_map[x][y-1] != 'undefined')
		{
			//go on, recurse
			checkElementDirectionUp(x,y-1);
		}
	}
	
	//we only allow straight elements of rotation 0 and 2 and turns of rotation 0 and 1
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 0)||(rail_map[x][y].current_rotation == 2))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});

			if(typeof rail_map[x][y-1] != 'undefined')
			{
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
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});

			if(typeof rail_map[x-1][y] != 'undefined')
			{
				//turn left
				checkElementDirectionLeft(x-1,y);
			}
		}
		else if (rail_map[x][y].current_rotation == 1)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});

			if(typeof rail_map[x+1][y] != 'undefined')
			{
				//turn right
				checkElementDirectionRight(x+1,y);
			}
		}
	}

}


function checkElementDirectionRight(x,y)
{
	//crossroad allows to flow through in any direction
	if(rail_map[x][y].current_element == 3)
	{
		track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});
		
		if(typeof rail_map[x+1][y] != 'undefined')
		{
			//go on, recurse
			checkElementDirectionRight(x+1,y);
		}
	}

	//we only allow straight elements of rotation 1 and 3 and turns of rotation 0 and 3
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 1)||(rail_map[x][y].current_rotation == 3))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});

			if(typeof rail_map[x+1][y] != 'undefined')
			{
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
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});

			if(typeof rail_map[x][y+1] != 'undefined')
			{
				//turn me down
				checkElementDirectionDown(x,y+1);
			}
		}
		else if (rail_map[x][y].current_rotation == 3)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});

			if(typeof rail_map[x][y-1] != 'undefined')
			{
				//turn me up
				checkElementDirectionUp(x,y-1);
			}
		}
	}
}


function checkElementDirectionLeft(x,y)
{
	//crossroad allows to flow through in any direction
	if(rail_map[x][y].current_element == 3)
	{
		track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});

		if(typeof rail_map[x-1][y] != 'undefined')
		{
			//go on, recurse
			checkElementDirectionLeft(x-1,y);
		}
	}

	//we only allow straight elements of rotation 1 and 3 and turns of rotation 1 and 2
	if(rail_map[x][y].current_element == 1)
	{
		if((rail_map[x][y].current_rotation == 1)||(rail_map[x][y].current_rotation == 3))
		{
			//if this is first track element that means we made a full circle!
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_STRAIGHT,'x':x,'y':y});

			if(typeof rail_map[x-1][y] != 'undefined')
			{
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
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_LEFT,'x':x,'y':y});

			if(typeof rail_map[x][y+1] != 'undefined')
			{
				//turn me down
				checkElementDirectionDown(x,y+1);
			}
		}
		else if (rail_map[x][y].current_rotation == 2)
		{
			if((track[0].x == x)&&(track[0].y == y))
			{
				console.log("track is completed!");
				console.log(track);
				g_railCompleted = true; notifyTrackCompleted();
				NUM_TRACK_SEGMENTS = track.length;
				return;
			}
			
			track.push({'direction':DIRECTION_RIGHT,'x':x,'y':y});

			if(typeof rail_map[x][y-1] != 'undefined')
			{
				//turn me up
				checkElementDirectionUp(x,y-1);
			}
		}
	}
}

function findLeftmost(x,y)
{
	return 'izes ga, nije ravan';
}

function convertMatrixToTrackFixedL()
{
		var x_coord = 49;
		var y_coord = 49;
		
		//we have element to the right, lets go there.
		track.push({'direction':DIRECTION_LEFT,'x':x_coord,'y':y_coord});
		checkElementDirectionRight(x_coord+1,y_coord);

}

function convertMatrixToTrackFixed()
{
	//if(typeof rail_map[52][49] != 'undefined')
	{
		//go right
		var x_coord = 50;
		var y_coord = 49;
		
		//we have element to the right, lets go there.
		track.push({'direction':DIRECTION_STRAIGHT,'x':x_coord,'y':y_coord});
		checkElementDirectionRight(x_coord+1,y_coord);

	}
	//else if(typeof rail_map[49][49] != 'undefined')
	{
		//player didnt do anything on the right... lets track leftmost element and start from there?
		/*var leftmost = findLeftmost(51,49);
		
		if(leftmost != 'izes ga, nije ravan')
		{
			var x_coord = leftmost.x;
			var y_coord = leftmost.y;
			
			//set offset
			offset.x = x_coord-50;
			offset.y = 49-y_coord;

			track.push({'direction':DIRECTION_STRAIGHT,'x':x_coord,'y':y_coord});
			checkElementDirectionRight(x_coord+1,y_coord);
		}*/
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
			if(typeof rail_map[x_coord][y_coord+1] != 'undefined')
			{
				//going down
				track.push({'direction':DIRECTION_RIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionDown(x_coord,y_coord+1);
			}
			else if(typeof rail_map[x_coord-1][y_coord] != 'undefined')
			{
				//going left
				track.push({'direction':DIRECTION_LEFT,'x':x_coord,'y':y_coord});
				checkElementDirectionLeft(x_coord-1,y_coord);
			}
		}
		else if(rail_map[x_coord][y_coord].current_rotation == 1)
		{
			//check right and bottom neighbors
			if(typeof rail_map[x_coord][y_coord+1] != 'undefined')
			{
				//going down
				track.push({'direction':DIRECTION_LEFT,'x':x_coord,'y':y_coord});
				checkElementDirectionDown(x_coord,y_coord+1);
			}
			else if(typeof rail_map[x_coord+1][y_coord] != 'undefined')
			{
				//going right
				track.push({'direction':DIRECTION_RIGHT,'x':x_coord,'y':y_coord});
				checkElementDirectionRight(x_coord+1,y_coord);
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
	
	//console.log(lastMousePosition.x + ',' + lastMousePosition.y);
	
	//if(typeof rail_map[x-1][y] != 'undefined')
	if ((current_element == 1)&&(typeof rail_map[x_coord][y_coord] != 'undefined')&&(rail_map[x_coord][y_coord].current_element == 1)&&(current_rotation!=rail_map[x_coord][y_coord].current_rotation))
	{
		//crossroad hack
		rail_map[x_coord][y_coord] = {"current_element":3,"current_rotation":0};
	}
	else
	{
		rail_map[x_coord][y_coord] = {"current_element":current_element,"current_rotation":current_rotation};
	}
	
	//offset.x = Math.floor(lastMousePosition.x/10);
	//offset.y = Math.floor(lastMousePosition.y/10);
	
	//console.log(offset.x + ',' + offset.y);
}

