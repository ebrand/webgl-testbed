Options = function() {
	this.camZ = 400;
};

WebGlTestbed = function() {
	var _container;
	var _scene;
	var _camera;
	var _renderer;
	var _controls;
	var _boxMesh;
	var _stats;
	var _datGui;
	var _that = this;
	var _options = new Options();

	this.render = function(){
		init();
		animate();
	}

	// init

	function init(){
		
		_container = document.body;
		_scene     = new THREE.Scene();
		_camera    = initCamera();
		_renderer  = initRenderer();
		_controls  = initControls();
		_stats     = initStats();
		_datGui    = initDatGui();

		initLights();
		initWallsAndFloor();
		initGeometries();
		
		window.addEventListener('resize', onWindowResize, false);
	}
	function initStats(){
		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.left = '0px';
		stats.domElement.style.top = '0px';
		_container.appendChild(stats.domElement);
		return stats;
	}
	function initDatGui(){
		var datGui = new dat.GUI();
		datGui.add(_options, 'camZ', 150, 1000);
		return datGui;
	}
	function initCamera(){
		var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.z = 400;
		return camera;
	}
	function initRenderer(){
		var renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setClearColor(new THREE.Color(0x000000, 0.0));
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.autoClear = true;
		renderer.domElement.style.position = "relative";
		renderer.shadowMapEnabled = true;
		_container.appendChild(renderer.domElement);
		return renderer;
	}
	function initControls() {
		var controls = new THREE.OrbitControls(_camera, _renderer.domElement);
		controls.target = new THREE.Vector3(0, 100, 0);
		return controls;
	}
	function initLights() {
		var amb = new THREE.AmbientLight(0x000000, 0.0);
		_scene.add(amb);
	}
	function initWallsAndFloor() {
		// Create a cube used to build the floor and walls
	    var radius = 600;
	    var cube = new THREE.CubeGeometry(radius, 1, radius);
	  	
	    // create different materials
	    var floorMat  = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('images/wood-floor.jpg') });
	    var wallMat   = new THREE.MeshPhongMaterial({ map: THREE.ImageUtils.loadTexture('images/bricks.jpg') });
	    var redMat    = new THREE.MeshPhongMaterial({ color: 0xff3300, specular: 0x555555, shininess: 30 });
	    var purpleMat = new THREE.MeshPhongMaterial({ color: 0x6F6CC5, specular: 0x555555, shininess: 30 });
	  
	    // Floor
	    var floor = new THREE.Mesh(cube, floorMat);
	    _scene.add(floor);
	  
	    // Back wall
	    var backWall = new THREE.Mesh(cube, wallMat);
	    backWall.rotation.x = Math.PI/180 * 90;
	    backWall.position.set(0, radius, -radius);
	    _scene.add(backWall);
	  
	    // Left wall
	    var leftWall = new THREE.Mesh(cube, wallMat);
	    leftWall.rotation.x = Math.PI/180 * 90;
	    leftWall.rotation.z = Math.PI/180 * 90;
	    leftWall.position.set(-radius, radius, 0);
	    _scene.add(leftWall);
	  
	    // Right wall
	    var rightWall = new THREE.Mesh(cube, wallMat);
	    rightWall.rotation.x = Math.PI/180 * 90;
	    rightWall.rotation.z = Math.PI/180 * 90;
	    rightWall.position.set(radius, radius, 0);
	    _scene.add(rightWall);
	}
	function initGeometries(){
		var texture = new THREE.TextureLoader().load('images/crate.gif');
		var geometry = new THREE.BoxGeometry(200, 200, 200);
		var material = new THREE.MeshBasicMaterial({ map: texture });
		_boxMesh = new THREE.Mesh(geometry, material);
		_scene.add(_boxMesh);
	}

	// animate

	function animate(){
		
		requestAnimationFrame(animate);
		
		// animate
		_boxMesh.rotation.x += 0.01;
		_boxMesh.rotation.y -= 0.01;
		_boxMesh.rotation.z += 0.01;
		
		// update camera position
		_camera.position.z = _options.camZ;

		// render the scene
		_renderer.render(_scene, _camera);

		// update controls
		_controls.update();

		// update stats
		_stats.update();
	}

	// window events

	function onWindowResize() {
		_camera.aspect = window.innerWidth / window.innerHeight;
		_camera.updateProjectionMatrix();
		_renderer.setSize(window.innerWidth, window.innerHeight);
	}
}	