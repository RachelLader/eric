




Physijs.scripts.worker = './physijs/physijs_worker.js';
  Physijs.scripts.ammo = '../js/physijs/ammo.js';
  
  var initScene, render, createShape,
    renderer, render_stats, physics_stats, scene, light, ground, ground_material, camera;
  



  initScene = function() {
    TWEEN.start();
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    document.getElementById( 'viewport' ).appendChild( renderer.domElement );
    
    // var k = document.getElementById( 'viewport' );
    // reif(k!=null) k.appendChild( renderer.domElement );


    render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '0px';
    render_stats.domElement.style.zIndex = 100;
    document.getElementById( 'viewport' ).appendChild( render_stats.domElement );
    // if(k!=null) k.appendChild( render_stats.domElement );

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );
    // if(k!=null) k.appendChild( physics_stats.domElement );

    scene = new Physijs.Scene({ fixedTimeStep: 1 / 120 });
    scene.setGravity(new THREE.Vector3( 0, -10, 0 ));
    scene.addEventListener(
      'update',
      function() {
        scene.simulate( undefined, 2 );
        physics_stats.update();
      }
    );
    
    camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set( 60, 10, 60 );
    camera.lookAt( scene.position );
    scene.add( camera );
    
    // Light
    light = new THREE.DirectionalLight( 0xFFFFFF );
    light.position.set( 20, 40, -15 );
    light.target.position.copy( scene.position );
    light.castShadow = true;
    // light.shadowCameraLeft = -60;
    // light.shadowCameraTop = -60;
    // light.shadowCameraRight = 60;
    // light.shadowCameraBottom = 60;
    // light.shadowCameraNear = 20;
    // light.shadowCameraFar = 200;
    // light.shadowBias = -.0001
    light.shadowMapWidth = light.shadowMapHeight = 2048;
    light.shadowDarkness = .7;
    scene.add( light );

    light2 = new THREE.DirectionalLight( 0xFFFFFF );
    light2.position.set( -30, -40, -15 );
    light2.target.position.copy( scene.position );
    light2.castShadow = true;

    light2.shadowMapWidth = light2.shadowMapHeight = 2048;
    light2.shadowDarkness = .1;
    scene.add( light2 );
    
    // // Materials
    // ground_material = Physijs.createMaterial(
    //   new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../physijs/examples/images/rocks.jpg' ) }),
    //   .8, // high friction
    //   .4 // low restitution
    // );
    // ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    // ground_material.map.repeat.set( 2.5, 2.5 );
    
    // // Ground
    // ground = new Physijs.BoxMesh(
    //   new THREE.BoxGeometry(50, 1, 50),
    //   //new THREE.PlaneGeometry(50, 50),
    //   ground_material,
    //   0 // mass
    // );
    // ground.receiveShadow = true;
    // scene.add( ground );

    // Materials
    ground_material = Physijs.createMaterial(
      new THREE.MeshBasicMaterial( {color: 'black'},
      .8, // high friction
      .4 // low restitution
    ));

    
    // Ground
    ground = new Physijs.BoxMesh(
      new THREE.BoxGeometry(120, 1, 120),
      //new THREE.PlaneGeometry(50, 50),
      ground_material,
      0 // mass
    );
    ground.receiveShadow = true;
    ground.position.x = 0;
    ground.position.y = -10;

    ground.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
      scene.remove(other_object);
    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
    });

    scene.add( ground );

  // var geometry = new Physijs.PlaneMesh( 20, 20, 20 );
  // var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  // var rightWall = new THREE.Mesh( geometry, material );
  // rightWall.position.x = 20;
  // rightWall.position.y = 10;
  // scene.add( rightWall );

  // var geometry = new Physijs.PlaneMesh( 20, 20, 20 );
  // var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  // var leftWall = new THREE.Mesh( geometry, material );
  // rightWall.position.x = 20;
  // rightWall.position.y = 30;
  // scene.add( leftWall );

    
    // Bumpers
    var bumper,
      bumper_geom = new THREE.BoxGeometry(2, 120, 120);
    
    bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    bumper.position.y = 20;
    bumper.position.x = -59;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add( bumper );
    
    // bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    // bumper.position.y = 1;
    // bumper.position.x = 34;
    // bumper.receiveShadow = true;
    // bumper.castShadow = true;
    // scene.add( bumper );
    
    bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    bumper.position.y = 20;
    bumper.position.z = -59;
    bumper.rotation.y = Math.PI / 2;
    bumper.receiveShadow = true;
    bumper.castShadow = true;
    scene.add( bumper );
    
    // bumper = new Physijs.BoxMesh( bumper_geom, ground_material, 0, { restitution: .2 } );
    // bumper.position.y = 1;
    // bumper.position.z = 34;
    // bumper.rotation.y = Math.PI / 2;
    // bumper.receiveShadow = true;
    // bumper.castShadow = true;
    // scene.add( bumper );
    
    requestAnimationFrame( render );
    scene.simulate();
    createShape();
  };
  
  render = function() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    render_stats.update();
  };
  
  createShape = (function() {
    var addshapes = true,
      shapes = 0,
      box_geometry = new THREE.BoxGeometry( 2, 2, 2 ),
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

//       var geom = new THREE.Geometry(); 
// var v1 = new THREE.Vector3(0,0,0);
// var v2 = new THREE.Vector3(0,500,0);
// var v3 = new THREE.Vector3(0,500,500);

// geom.vertices.push(v1);
// geom.vertices.push(v2);
// geom.vertices.push(v3);

// geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
// geom.computeFaceNormals();

// var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );

// object.position.z = -100;//move a bit back - size of 500 is a bit big
// object.rotation.y = -Math.PI * .5;//triangle is pointing in depth, rotate it -90 degrees on Y

// scene.add(object);


      var shape, material = new THREE.MeshLambertMaterial({ opacity: 0, transparent: true });
      
      switch ( Math.floor(Math.random() * 1) ) {
        case 0:
          shape = new Physijs.BoxMesh(
            box_geometry,
            material
          );
          break;
        
        case 1:
          shape = new Physijs.SphereMesh(
            sphere_geometry,
            material,
            undefined,
            { restitution: Math.random() * 1.5 }
          );
          break;
        
        case 2:
          shape = new Physijs.CylinderMesh(
            cylinder_geometry,
            material
          );
          break;
        
        case 3:
          shape = new Physijs.ConeMesh(
            cone_geometry,
            material
          );
          break;
        
        case 4:
          shape = new Physijs.ConvexMesh(
            octahedron_geometry,
            material
          );
          break;
        
        case 5:
          shape = new Physijs.ConvexMesh(
            torus_geometry,
            material
          );
          break;

        
      }
        
      shape.material.color.setRGB(0xFF, 0xFF, 0xFF);
      

      shape.castShadow = true;
      shape.receiveShadow = true;
      
      shape.position.set(
        Math.random() * 30 - 15,
        20,
        Math.random() * 30 - 15
      );
      
      shape.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shape.setLinearVelocity(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      shape.setAngularVelocity(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );



      
      if ( addshapes ) {
        shape.addEventListener( 'ready', createShape );
      }
      scene.add( shape );
      
      new TWEEN.Tween(shape.material).to({opacity: 1}, 500).start();
      
      document.getElementById( 'shapecount' ).textContent = ( ++shapes ) + ' shapes created';
    };
    
    return function() {
      setTimeout( doCreateShape, 250 );
    };
  })();
  
  window.onload = initScene;