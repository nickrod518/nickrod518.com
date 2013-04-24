/*
Nick Rodriguez
20 April 2013

adapted from: https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_obj_mtl.html

Checks browser type and for WebGL compatibility. Creates a 3D scene using WebGL. 
Initializes lights, camera, and loads model. Deals with all user mouse movements. 
Listens to toolbar function changes and reacts appropriately. 
*/








/*
=======================================================================================================================
***********************************************************************************************************************

-------------------------------------------- INITIALIZED VARIABLES ----------------------------------------------------

***********************************************************************************************************************
=======================================================================================================================
*/

// set to 1 if browser is WebGL capable
var webglCapable = 0;

// true if using a mobile device
var mobileDevice = false;

var container, stats;

// vars related to the scene and object
var camera, scene, renderer;
var spotLight = new THREE.SpotLight();
var object = new THREE.Mesh();

// vars related to user interaction
var prevX = 0, prevY = 0;
var dx = 0, dy = 0, dz = 0;
var mouseX = 0, mouseY = 0;
var mousedown = false;
var zoomSensitivity = 3;
var rotationSensitivity = 1;

// get value of "Free Look" checkbox
var freeLook = document.getElementById("freeLook");

// get value of model dropdown
var model = document.getElementById("model").value;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

/*
=======================================================================================================================
***********************************************************************************************************************
-------------------------------------------- END ----------------------------------------------------------------------
***********************************************************************************************************************
=======================================================================================================================
*/








/*
=======================================================================================================================
***********************************************************************************************************************

--------------------------------------------FUNCTION TO CHECK BROWSER TYPE --------------------------------------------

***********************************************************************************************************************
=======================================================================================================================
*/

// check for mobile devices so that sensitivity can be adjusted
// taken from http://detectmobilebrowsers.com/
function mobileCheck() {
  mobileDevice = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) mobileDevice = true })(navigator.userAgent || navigator.vendor || window.opera);
  return mobileDevice;
}

/*
=======================================================================================================================
***********************************************************************************************************************
-------------------------------------------- END ----------------------------------------------------------------------
***********************************************************************************************************************
=======================================================================================================================
*/








/*
=======================================================================================================================
***********************************************************************************************************************

-------------------------------------------- INITIALIZATION OF SCENE --------------------------------------------------

***********************************************************************************************************************
=======================================================================================================================
*/

// popup with instructions for user
window.onload = instructionsPopup();

init();
animate();

function init() {
  // create a new div container for the element
  container = document.createElement("div");
  // give the new div an id of "canvas"
  container.setAttribute("id", "canvas");

  document.body.appendChild(container);

  // PerspectiveCamera(fov, aspect, near, far)
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2500);
  // camera starts at (0, 0, 0) so pull it back
  camera.position.z = 500;

  // creates scene to use for lighting
  scene = new THREE.Scene();

  // adds ambient light to scene
  var ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  // adds blue directional light to left rear of head
  var directionalLight = new THREE.DirectionalLight(0x4169e1, 0.8);
  directionalLight.position.set(-0.2, 0, -0.2).normalize();
  scene.add(directionalLight);

  // adds light yellow spotlight attached to camera
  spotLight = new THREE.SpotLight(0xeee8aa, 0.8);
  spotLight.position.set(1, 100, 1000);
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;
  spotLight.shadowCameraNear = 1;
  spotLight.shadowCameraFar = 2500;
  spotLight.shadowCameraFov = 45;
  scene.add(spotLight);

  // model loader
  var loader = new THREE.OBJMTLLoader();
  loader.addEventListener("load", function (event) {
    object = event.content;
    object.position.y = 0;
    scene.add(object);
  });

  // use html element's value as the filename and location of the model's files
  loader.load("models/" + model + "/" + model + ".obj", "models/" + model + "/" + model + ".mtl");

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.setAttribute("id", "scene");
  container.appendChild(renderer.domElement);

  // event listener for window
  window.addEventListener("resize", onWindowResize, false);

  // event listeners for mouse
  container.addEventListener("mousedown", mousedown = true, false);
  container.addEventListener("mouseup", mousedown = false, false);
  container.addEventListener("mousemove", onDocumentMouseMove, false);
  container.addEventListener("mousewheel", mouseWheelHandler, false);
  container.addEventListener("DOMMouseScroll", mouseWheelHandler, false);

  // event listeners for touch devices
  container.addEventListener("touchstart", touchHandler, true);
  container.addEventListener("touchmove", touchHandler, true);
  container.addEventListener("touchend", touchHandler, true);
  container.addEventListener("touchcancel", touchHandler, true);
}

/*
=======================================================================================================================
***********************************************************************************************************************
-------------------------------------------- END ----------------------------------------------------------------------
***********************************************************************************************************************
=======================================================================================================================
*/








/*
=======================================================================================================================
***********************************************************************************************************************

-------------------------------------------- TOOLBAR RELATED FUNCTIONS ------------------------------------------------

***********************************************************************************************************************
=======================================================================================================================
*/

// on change of dropdown, update model
document.getElementById("model").onchange = function () {
  // update model value
  model = document.getElementById("model").value;
  // get the div with the canvas element
  var c = document.getElementById("canvas");
  // remove the div with the canvas element
  var remElement = (c.parentNode).removeChild(c);
  // redraw
  init();
};

// hide toolbar when button is pressed; show when pressed again
function toggleToolbar() {
  var toolbar = document.getElementById("toolbar");
  var text = document.getElementById("toolbarButton");
  if (toolbar.style.display == "block") {
    toolbar.style.display = "none";
    text.innerHTML = "Show Toolbar";
  }
  else {
    toolbar.style.display = "block";
    text.innerHTML = "Hide Toolbar";
  }
}

// reset camera, spotlight, and model position on button press
function reset() {
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 500;

  spotLight.intensity = 0.8;

  object.rotation.x = 0;
  object.rotation.y = 0;

  dx = 0;
  dy = 0;
  dz = 0;

  mouseX = 0;
  mouseY = 0;

  document.getElementById("zoom").value = 500;
  document.getElementById("rotationSensitivity").value = 1;
  document.getElementById("brightness").value = 8;
  document.getElementById("color").value = "#eee8aa";
  updateLightColor("#eee8aa");
}

// update sensitivity of rotation
function updateRotationSensitivity(sensitivity) {
  rotationSensitivity = sensitivity;
}

// update z position from zoom slider
function updateZoom(zoom) {
  camera.position.z = 1250 - zoom;
}

// update intensity of spotlight
function updateLightBrightness(brightness) {
  // because the slider uses ints, we use a scale of 0-100 and then normalize here
  spotLight.intensity = brightness * 0.1;
}

// update the color of the spotlight
function updateLightColor(color) {
  // convert the color value into a usable hex value
  color = color.replace("#", "0x");
  spotLight.color.setHex(color);
}

// reset the camera and model when free look is checked/unchecked
freeLook.onchange = function () {
  reset();
};

// WebGL detection or instruction popup called on load or button press
function instructionsPopup() {
  // check if this is the first time we've checked webgl capabilities or if
  if (!webglCapable) {
    // check if webgl capable and if so, increment flag
    if (Detector.webgl) {
      alert('Controls:\nThe model will follow your mouse when "Free Look" is checked. When unchecked, drag and release the mouse in any direction (flick) to rotate the model in that direction. Use the scroll wheel or "Zoom" slider to zoom in and out on the model.\n\nUse the dropdown box to select a model to load.\n\nUse the "Sensitivity" slider to adjust mouse or touch rotation sensitivity.\n\nUse the "Light" slider to adjust light intensity (brightness). Use the color picker to change the spotlight color.\n\n"Reset" will reset all toolbar settings.\n\n"Instructions" will bring this prompt back up.\n\nPress the "Hide Toolbar" button at the top to hide the toolbar. Press again to bring back.');
      webglCapable++;
      // web browser is not webgl capable
    } else {
      alert("Your web browser does not support WebGL.");
    }
    // web browser is webgl capable
  } else {
    alert('Controls:\nThe model will follow your mouse when "Free Look" is checked. When unchecked, drag and release the mouse in any direction (flick) to rotate the model in that direction. Use the scroll wheel or "Zoom" slider to zoom in and out on the model.\n\nUse the dropdown box to select a model to load.\n\nUse the "Sensitivity" slider to adjust mouse or touch rotation sensitivity.\n\nUse the "Light" slider to adjust light intensity (brightness). Use the color picker to change the spotlight color.\n\n"Reset" will reset all toolbar settings.\n\n"Instructions" will bring this prompt back up.\n\nPress the "Hide Toolbar" button at the top to hide the toolbar. Press again to bring back.');
  }
}

/*
=======================================================================================================================
***********************************************************************************************************************
-------------------------------------------- END ----------------------------------------------------------------------
***********************************************************************************************************************
=======================================================================================================================
*/








/*
=======================================================================================================================
***********************************************************************************************************************

-------------------------------------------- MODEL INTERACTION EVENT HANDLERS -----------------------------------------

***********************************************************************************************************************
=======================================================================================================================

*/

// touch event handler - remaps touch events to simulated mouse events
// taken from http://ross.posterous.com/2008/08/19/iphone-touch-events-in-javascript/
function touchHandler(event) {
  var touches = event.changedTouches,
    first = touches[0],
    type = "";
  switch (event.type) {
    case "touchstart": type = "mousedown"; break;
    case "touchmove": type = "mousemove"; break;
    case "touchend": type = "mouseup"; break;
    default: return;
  }

  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent(type, true, true, window, 1,
  first.screenX, first.screenY,
  first.clientX, first.clientY, false,
  false, false, false, 0, null);
  first.target.dispatchEvent(simulatedEvent);
  event.preventDefault();
}

// triggered when mouse button is pressed
document.onmousedown = function () {
  mousedown = true;
  //throw ("mouse is down");
}

// triggered when mouse button is released
document.onmouseup = function () {
  mousedown = false;
  //throw ("mouse is up");
}

// use mouse position to rotate camera
function onDocumentMouseMove(event) {
  // calculate new mouse position
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);

  // find difference of old mouse position - new mouse position
  if (mousedown) {
    dx = prevX - mouseX;
    dy = prevY - mouseY;
  }

  // set old mouse position to current mouse position
  prevX = mouseX;
  prevY = mouseY;
}

// used to get capture scroll wheel movement for zooming
function mouseWheelHandler(event) {
  dz = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));
  return false;
}

// keep track of window size on resize
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

/*
=======================================================================================================================
***********************************************************************************************************************
-------------------------------------------- END ----------------------------------------------------------------------
***********************************************************************************************************************
=======================================================================================================================
*/








/*
=======================================================================================================================
***********************************************************************************************************************

-------------------------------------------- ANIMATION AND RENDERING --------------------------------------------------

***********************************************************************************************************************
=======================================================================================================================
*/

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  // calculate new position when using free mouse method
  if (freeLook.checked) {
    targetX = mouseX * .005;
    targetY = mouseY * .008;

    object.rotation.x += 0.05 * (targetY - object.rotation.x) * rotationSensitivity;
    object.rotation.y += 0.05 * (targetX - object.rotation.y) * rotationSensitivity;
  }

    // calculate new position when using click/drag method
  else {
    // if using a mobile device use a lower sensitivity
    if (mobileCheck()) {
      object.rotation.x -= 0.002 * dy * rotationSensitivity;
      object.rotation.y -= 0.002 * dx * rotationSensitivity;
      // use a higher sensitivity for desktop browsers
    } else {
      object.rotation.x -= 0.02 * dy * rotationSensitivity;
      object.rotation.y -= 0.02 * dx * rotationSensitivity;
    }

    // decellerate rotation to a stop
    dx *= .9;
    dy *= .9;
  }

  // calculate new z position from mouse wheel method
  if (camera.position.z > 250 && dz > 0) {
    camera.position.z += -zoomSensitivity * 25;
    document.getElementById("zoom").value = 1250 - camera.position.z;
  } else if (camera.position.z < 1000 && dz < 0) {
    camera.position.z += zoomSensitivity * 25;
    document.getElementById("zoom").value = 1250 - camera.position.z;
  }

  // reset dz to prevent continuous zooming
  dz = 0;

  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

/*
=======================================================================================================================
***********************************************************************************************************************
-------------------------------------------- END ----------------------------------------------------------------------
***********************************************************************************************************************
=======================================================================================================================.
*/