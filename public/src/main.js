import * as THREE from "three";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls.js";
import { LoadGLTFByPath } from "./Helpers/ModelHelper.js";

const loaderContainer = document.getElementById("loader-container");
loaderContainer.style.display = "block";

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#background"),
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadows = true;
renderer.shadowType = 1;
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = 0;
renderer.toneMappingExposure = 1;
renderer.useLegacyLights = false;
renderer.toneMapping = THREE.NoToneMapping;
renderer.setClearColor(0x000000, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

let cameraList = [];
let camera;
let controls; // Declare controls in the global scope

window.addEventListener("resize", () => {
  updateCameraAspect(camera);
  renderer.setSize(window.innerWidth, window.innerHeight);
});

LoadGLTFByPath(scene)
  .then(() => {
    loaderContainer.style.display = "none";
    retrieveListOfCameras(scene);
  })
  .catch((error) => {
    console.error("Error loading JSON scene:", error);
  });

function retrieveListOfCameras(scene) {
  scene.traverse(function (object) {
    if (object.isCamera) {
      cameraList.push(object);
    }
  });

  if (cameraList.length > 0) {
    // Set the camera to the first value in the list of cameras
    camera = cameraList[0];

    // Log camera position to check if it's defined
    console.log("Camera position:", camera.position);

    // Create OrbitControls after the camera is assigned
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;

    updateCameraAspect(camera);

    // Start the animation loop after the model and cameras are loaded
    animate();
  } else {
    console.error("No cameras found in the scene.");
  }
}

function updateCameraAspect(camera) {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  renderer.render(scene, camera);
}
