let scene, camera, renderer, model, muscle;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xaaaaaa);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / 500, 0.1, 100);
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, 500);
  document.getElementById('viewer').appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5,5,5);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x404040));

  // Last inn GLB-modellen din
  const loader = new THREE.GLTFLoader();
  loader.load('model.glb', function(gltf){
    model = gltf.scene;
    scene.add(model);

    // Bytt navn her hvis muskelen har et annet navn i Blender
    muscle = model.getObjectByName('Glut_Med');
  });

  // Rotasjon med mus
  let isDragging = false;
  let previousMouseX = 0;
  renderer.domElement.addEventListener('mousedown', e => { isDragging=true; previousMouseX = e.clientX; });
  renderer.domElement.addEventListener('mouseup', e => { isDragging=false; });
  renderer.domElement.addEventListener('mousemove', e => {
    if(isDragging && model){
      const deltaX = e.clientX - previousMouseX;
      model.rotation.y += deltaX * 0.01;
      previousMouseX = e.clientX;
    }
  });

  // Slider for å kontrahere muskelen
  const slider = document.getElementById('slider');
  slider.addEventListener('input', e => {
    if(muscle && muscle.morphTargetInfluences){
      muscle.morphTargetInfluences[0] = parseFloat(e.target.value);
    }
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / 500;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 500);
  });
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
