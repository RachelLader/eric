// set the scene size
var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight;

// set some camera attributes
var VIEW_ANGLE = 45,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

// get the DOM element to attach to
// - assume we've got jQuery to hand
var $container = $('#container');

// create a WebGL renderer, camera
// and a scene
var renderer = new THREE.WebGLRenderer();


var camera =
  new THREE.PerspectiveCamera(
    VIEW_ANGLE,
    ASPECT,
    NEAR,
    FAR);

var scene = new THREE.Scene();

// add the camera to the scene
scene.add(camera);

// the camera starts at 0,0,0
// so pull it back
camera.position.z = 300;

// start the renderer
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild(renderer.domElement);

// attach the render-supplied DOM element
$container.append(renderer.domElement);

// set up the sphere vars
var radius = 40,
    segments = 16,
    rings = 16;

// create a new mesh with
// sphere geometry - we will cover
// the sphereMaterial next!
var sphere = new THREE.Mesh(

  new THREE.SphereGeometry(
    radius,
    segments,
    rings),

  sphereMaterial);

// add the sphere to the scene
// scene.add(sphere);

// create the sphere's material
var sphereMaterial =
  new THREE.MeshLambertMaterial(
    {
      color: 0xCC0000
    });

// set up the cube vars
var width = 20,
    height = 20,
    depth = 20;

var geometry = new THREE.BoxGeometry( width, height, depth );
var material = new THREE.MeshLambertMaterial( {color: 'yellow'} );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );


var material2 = new THREE.MeshLambertMaterial( {color: 'blue'} );
var cube2 = new THREE.Mesh( geometry, material2 );
scene.add( cube2 );


var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
 
// directionalLight.target = cube;

// create a point light
// var pointLight =
//   new THREE.PointLight(0xFFFFFF);

// set its position
// pointLight.position.x = 10;
// pointLight.position.y = 50;
// pointLight.position.z = 130;

// add to the scene
// scene.add(pointLight);


// cube.position.x = 90;
// cube.position.y = 100;
// cube.position.z = 50;

cube.position.set(0, 0, 0);
cube2.position.set(70, 40, 50);
sphere.position.set(80, 70, 20);

animate();

function animate() {

				requestAnimationFrame( animate );

				cube.rotation.x += 0.005;
				cube.rotation.y += 0.01;
				sphere.rotation.x += 0.01;
				sphere.rotation.y += 0.04;
				cube2.rotation.x += 0.03;
				cube2.rotation.y += 0.003;

				renderer.render( scene, camera );

}


// draw!
renderer.render(scene, camera);

// // sphere geometry
// sphere.geometry

// // which contains the vertices and faces
// sphere.geometry.vertices // an array
// sphere.geometry.faces // also an array

// // its position
// sphere.position // contains x, y and z
// sphere.rotation // same
// sphere.scale // ... same

// sphere.position.x = 30;
// sphere.position.y = 10;
// sphere.position.z = 50;





// set the geometry to dynamic
// so that it allow updates
sphere.geometry.dynamic = true;

// changes to the vertices
sphere.geometry.verticesNeedUpdate = true;

// changes to the normals
sphere.geometry.normalsNeedUpdate = true;

// set the geometry to dynamic
// so that it allow updates
cube.geometry.dynamic = true;

// changes to the vertices
cube.geometry.verticesNeedUpdate = true;

// changes to the normals
cube.geometry.normalsNeedUpdate = true;

