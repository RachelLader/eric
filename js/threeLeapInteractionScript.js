Physijs.scripts.worker = './js/physijs/physijs_worker.js';
Physijs.scripts.ammo = './ammo.js';

var boxes = new Set()

// Global Variables for THREE.JS
var container , camera, scene, renderer , stats, createShapes;
// Global variable for leap
var frame, controller;
// Setting up how big we want the scene to be
var sceneSize = 100;
// This is the color and direction 
// of every light we are creating
var lightArray = [
  [ 0x0F4DA8 , [  1 ,  0 ,  0 ] ],
  [ 0x437DD4 , [ -1 ,  0 ,  0 ] ],
  [ 0x6A94D4 , [  0 ,  1 ,  0 ] ],
  [ 0xFFF040 , [  0 , -1 ,  0 ] ],
  [ 0xBF3330 , [  0 ,  0 ,  1 ] ],
  [ 0xA60400 , [  0 ,  0 , -1 ] ]
]
// The array we will store our finished materials in
var fingerMaterials = [];
// We will need a different material for each joint 
// Because we will be using Phong lighting, 
// we will also need a few different properties:
var fingerMaterialArray = [
// Diffuse , Specular , Emissive
  [ 0x007AFF , 0x37B6FF , 0x36BBCE ],
  [ 0xFF00FF , 0x3FEFF3 , 0x1FFB75 ],
  [ 0xDCFF55 , 0xAA6B9E , 0xFF6B75 ],
  [ 0xFFAA00 , 0xD0F7F3 , 0xFC8CD5 ],
];
var geometries = [];
var fingers = [];




function init(){

  controller = new Leap.Controller();

  scene = new Physijs.Scene({fixedTimeStep:1/120});
  scene.addEventListener(
    'update',
    function() {
      scene.simulate( undefined, 2 );
    }
  );
  scene.clear
  
  camera = new THREE.PerspectiveCamera( 
    50 ,
    window.innerWidth / window.innerHeight,
    sceneSize / 100 ,
    sceneSize * 4
  );

  // placing our camera position so it can see everything
  camera.position.z = sceneSize;

  // Getting the container in the right location
  container = document.createElement( 'div' );

  container.style.width      = '100%';
  container.style.height     = '100%';
  container.style.position   = 'absolute';
  container.style.top        = '0px';
  container.style.left       = '0px';
  container.style.background = '#000';

  $("#ducindex").append( container );


  // Getting the stats in the right position
  stats = new Stats();

  stats.domElement.style.position  = 'absolute';
  stats.domElement.style.bottom    = '0px';
  stats.domElement.style.right     = '0px';
  stats.domElement.style.zIndex    = '999';

  document.body.appendChild( stats.domElement );


  // Setting up our Renderer
  TWEEN.start();
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x111111);

  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );


  // Making sure our renderer is always the right size
  window.addEventListener( 'resize', onWindowResize , false );


  /*
    INITIALIZE AWESOMENESS!
  */
  initLights();
  initMaterials();
  initGeometry();
  initFingers();
  initBox();
  controller.connect();
  requestAnimationFrame( animate );
  scene.simulate();
  createShapes();
}


function initLights(){

  // We are creating a directional light,
  // coloring and placing it according to the light array
  for( var i = 0; i < lightArray.length; i++ ){

    // The parameters for the light
    var l = lightArray[i];  

    // Creating the light
    var light = new THREE.DirectionalLight( l[0] , 0.5 );
    light.position.set( l[1][0] , l[1][1]  , l[1][2]  );

    // Making sure that the light is part of
    // Whats getting rendered
    scene.add( light );
  
  }
}

// Creates the proper materials to use for creating the fingers
function initMaterials(){

  for( var i = 0; i < fingerMaterialArray.length; i++ ){

    var fM = fingerMaterialArray[i];

    // Uses the parts of the finger material array to assign 
    // an aesthetic material
    var material = new THREE.MeshPhongMaterial({
      color:                 fM[0],
      specular:              fM[1],
      emissive:              fM[2],
      shininess:                10,
      shading:    THREE.FlatShading
    });

    fingerMaterials.push( material );

  }


}


// Creates all the geometries we want, 
// In this case, spheres that get slightly smaller
// as they get closer to the tip
function initGeometry(){

  for( var i = 0; i < 4; i++ ){

    var size = sceneSize / ( 20  + ( 2 * ( i + 1 ) ));
    var geometry = new THREE.SphereGeometry(size, 40,40);
    geometries.push( geometry );
  }

}


function initFingers(){
  // Creating dramatically more finger points than needed
  // just in case 4 hands are in the field
  for( var i = 0 ; i < 20; i++ ){

    var finger = {};
    finger.points = [];

    for( var j = 0; j < geometries.length; j++ ){
      var geo_material;
      var geo;
      geo_material = Physijs.createMaterial(fingerMaterials[j],.5,.5)
      geo = new Physijs.SphereMesh( geometries[j] , geo_material);
      geo.mass = 0
      geo.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        if (!(other_object instanceof Physijs.SphereMesh)){
          var randomIndex = Math.floor(Math.random()*geometries.length)
          var new_geo_material = Physijs.createMaterial(fingerMaterials[randomIndex],.5,.5)
          other_object.material = new_geo_material
        }
      })
      finger.points.push( geo );
      scene.add( geo );
    }
    fingers.push( finger );
  }
}

function initBox(){
  box_material = fingerMaterials[Math.floor(Math.random()*geometries.length)]

  //GROUND
  ground = new Physijs.BoxMesh(
    new THREE.CubeGeometry(400, 1, 400),
    //new THREE.PlaneGeometry(50, 50),
    box_material,
    0 // mass
  );
  ground.receiveShadow = true;
  ground.position.x = 0;
  ground.position.y = -120;

  ground.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    scene.remove(other_object);
    if (boxes.has(other_object)){
      boxes.delete(other_object);
    }
  // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
  });

  //LEFT WALL
  var bumper,
    bumper_geom = new THREE.BoxGeometry(1, 400, 400);
  
  bumper = new Physijs.BoxMesh( bumper_geom, box_material, 0, { restitution: .2 } );
  bumper.position.y = -60;
  bumper.position.x = -200;
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  scene.add( bumper );

  //RIGHT WALL
  bumper = new Physijs.BoxMesh( bumper_geom, box_material, 0, { restitution: .2 } );
  bumper.position.y = 60;
  bumper.position.x = 200;
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  scene.add( bumper );

  //BACK WALL
  box_material2 = fingerMaterials[Math.floor(Math.random()*geometries.length)]
  bumper_geom = new THREE.BoxGeometry(400, 400, 1);
  bumper = new Physijs.BoxMesh( bumper_geom, box_material2, 0, { restitution: .2 } );
  bumper.position.y = 0;
  bumper.position.x = 0;
  bumper.position.z = -200
  bumper.receiveShadow = true;
  bumper.castShadow = true;
  scene.add( bumper );

  scene.add( ground );
}


// This function moves from a position from leap space, 
// to a position in scene space, using the sceneSize
// we defined in the global variables section
function leapToScene( position ){

  var x = position[0] - frame.interactionBox.center[0];
  var y = position[1] - frame.interactionBox.center[1];
  var z = position[2] - frame.interactionBox.center[2];
    
  x /= frame.interactionBox.size[0];
  y /= frame.interactionBox.size[1];
  z /= frame.interactionBox.size[2];

  x *= sceneSize;
  y *= sceneSize;
  z *= sceneSize;

  z -= sceneSize;

  return new THREE.Vector3( x , y , z );
}


// The magical update loop,
// using the global frame data we assigned
function update(){
  if( frame.fingers ){
    var length;
    for( var i = 0; i < fingers.length; i++ ){ 
      if( frame.fingers[i] ){ 
        var leapFinger  = frame.fingers[i];     // Leap Finger Position
        var finger      = fingers[i];           // Our array of THREE finger objects
        for( var j = 0; j < finger.points.length; j++ ){
          new_position = leapToScene( leapFinger.positions[j] );
          finger.points[j].position.setX(new_position.x);
          finger.points[j].position.setY(new_position.y);
          finger.points[j].position.setZ(new_position.z);
          var sphere_rad = finger.points[j].geometry.boundingSphere.radius
          for (box of boxes){
            var distance = new_position.distanceTo(box.position)
            var box_rad = box.geometry.boundingSphere.radius
            var tolerance = sphere_rad+box_rad
            if (distance < tolerance){
              box.material = finger.points[j].material
            }
          }
        }
      }else{ // If there aren't fingers, move them offscreen)
        var finger  = fingers[i];
        for( var j = 0; j < finger.points.length; j++ ){
          finger.points[j].position.x = 500;
          finger.points[j].position.y = 500;
          finger.points[j].position.z = 500;
        }
      }
    }
  }
}


function animate(){
  frame = controller.frame();
  update();
  stats.update();
  renderer.render( scene , camera );
  requestAnimationFrame( animate );
}

// Resets the renderer to be the proper size
function onWindowResize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

createShapes = (function() {
  var addshapes = true,
    shapes = 0,
    box_geometry = new THREE.BoxGeometry( 5, 5, 5 ),
    sphere_geometry = new THREE.SphereGeometry( 1.5, 32, 32 ),
    cylinder_geometry = new THREE.CylinderGeometry( 2, 2, 1, 32 ),
    cone_geometry = new THREE.CylinderGeometry( 0, 2, 4, 32 ),
    octahedron_geometry = new THREE.OctahedronGeometry( 1.7, 1 ),
    torus_geometry = new THREE.TorusKnotGeometry ( 1.7, .2, 32, 4 ),
    doCreateShape;
  
  setTimeout(
    function addListener() {
      var button = document.getElementById( 'stop' );
      if ( button ) {
        button.addEventListener( 'click', function() { addshapes = false; } );
      } else {
        setTimeout( addListener );
      }
    }
  );
    
  doCreateShape = function() {

    var shape, material = new THREE.MeshLambertMaterial({ opacity: 0, transparent: true });
    shape = new Physijs.BoxMesh(
      box_geometry,
      material
    );
      
    shape.material.color.setRGB(0xFF, 0xFF, 0xFF);
    
    shape.castShadow = true;
    shape.receiveShadow = true;
    
    shape.position.set(
      Math.random() * 30 - 15,
      20,
      0
    );
    
    shape.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    shape.setLinearVelocity(
      Math.random() * Math.PI * 40,
      Math.random() * Math.PI * 40,
      Math.random() * Math.PI *40
    );

    shape.setAngularVelocity(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    if ( addshapes ) {
      shape.addEventListener( 'ready', createShapes );
    }
    shape.mass=100
    scene.add( shape );
    boxes.add(shape);
    
    new TWEEN.Tween(shape.material).to({opacity: 1}, 500).start();
  };
  
  return function() {
    setTimeout( doCreateShape, 300 );
  };
})();

init();