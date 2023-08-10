import { OrbitControls } from './OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
scene.background = new THREE.Color('ForestGreen');

function degrees_to_radians(degrees) {
	var pi = Math.PI;
	return degrees * (pi / 180);
}

// Add here the rendering of your goal

// -------------- Axis Helper --------------

const axesHelper = new THREE.AxesHelper(5);
axesHelper.position.y = 0.01;
scene.add(axesHelper);

// -------------- Grid --------------

const size = 10;
const divisions = 10;
const colorCenterLine = new THREE.Color(0x000000);
const colorGrid = new THREE.Color(0x444444);

const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
scene.add(gridHelper);

// -------------- Ambient Light --------------

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// -------------- GOAL --------------

let goalSkeleton = []

// 	-------------- Skeleton --------------

const goalHeight = 1;

// 		-------------- Crossbar --------------

const crossbarGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 32);
crossbarGeometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(Math.PI / 2));
crossbarGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, goalHeight, 0));
const crossbarMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const crossbar = new THREE.Mesh(crossbarGeometry, crossbarMaterial);
goalSkeleton.push(crossbar);


// 		-------------- Goal Posts --------------

// -------------- left post --------------
const leftPostGeometry = new THREE.CylinderGeometry(0.05, 0.05, goalHeight, 32);
leftPostGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-1.5, 0.5, 0));
const leftPostMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const leftPost = new THREE.Mesh(leftPostGeometry, leftPostMaterial);
goalSkeleton.push(leftPost);
// -------------- right post --------------

// Clone the left post and translate the clone
const rightPost = leftPost.clone();
rightPost.applyMatrix4(new THREE.Matrix4().makeTranslation(3, 0, 0));
goalSkeleton.push(rightPost);

// -------------- left post edge --------------
const leftPostEdgeGeometry = new THREE.TorusGeometry(0.05, 0.05, 2, 32);
leftPostEdgeGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
leftPostEdgeGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-1.5, 0, 0));
const leftPostEdgeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const leftPostEdge = new THREE.Mesh(leftPostEdgeGeometry, leftPostEdgeMaterial);
goalSkeleton.push(leftPostEdge);

// -------------- right post edge --------------

// Clone the left post edge and translate the clone
const rightPostEdge = leftPostEdge.clone();
rightPostEdge.applyMatrix4(new THREE.Matrix4().makeTranslation(3, 0, 0));
goalSkeleton.push(rightPostEdge);


// 		-------------- Back Supports --------------

// 		-------------- left back support --------------

const leftBackSupportGeometry = new THREE.CylinderGeometry(0.05, 0.05, Math.SQRT2, 32);
leftBackSupportGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-1.5, Math.SQRT2 / 2, -1));
const leftBackSupportMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const leftBackSupport = new THREE.Mesh(leftBackSupportGeometry, leftBackSupportMaterial);

// Translate to origin
let translationMatrix = new THREE.Matrix4().makeTranslation(1.5, 0, 1);
leftBackSupport.applyMatrix4(translationMatrix);

// Apply 45 degrees rotation about X axis
let rotationMatrix = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(45));
leftBackSupport.applyMatrix4(rotationMatrix);

// Translate back to the original position
let translationMatrixInverse = translationMatrix.invert();
leftBackSupport.applyMatrix4(translationMatrixInverse);

goalSkeleton.push(leftBackSupport);

// 		-------------- right back support --------------
// Clone the left back support and translate the clone
const rightBackSupport = leftBackSupport.clone();
rightBackSupport.applyMatrix4(new THREE.Matrix4().makeTranslation(3, 0, 0));
goalSkeleton.push(rightBackSupport);

// -------------- left back support edge --------------
const leftBackSupportEdgeGeometry = new THREE.TorusGeometry(0.05, 0.05, 2 * Math.SQRT2, 32);
leftBackSupportEdgeGeometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));
leftBackSupportEdgeGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-1.5, 0, -1));
const leftBackSupportEdgeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
const leftBackSupportEdge = new THREE.Mesh(leftBackSupportEdgeGeometry, leftBackSupportEdgeMaterial);

goalSkeleton.push(leftBackSupportEdge);

// -------------- right back support edge --------------
// Clone the left back support and translate the clone
const rightBackSupportEdge = leftBackSupportEdge.clone();
rightBackSupportEdge.applyMatrix4(new THREE.Matrix4().makeTranslation(3, 0, 0));
goalSkeleton.push(rightBackSupportEdge);


// 	-------------- Nets --------------
let nets = []

// -------------- Rectangular net --------------
let pointA = new THREE.Vector3(0,1,0);
let pointB = new THREE.Vector3(-1,0,0);
const rectHeight = pointA.distanceTo(pointB);

const netWidth = 3;
const netHeight = rectHeight;
const netDepth = 0.02;
const netGeometry = new THREE.BoxGeometry(netWidth, netHeight, netDepth);
const netMaterial = new THREE.MeshPhongMaterial({ color: 0xd3d3d3 });
const backNet = new THREE.Mesh(netGeometry, netMaterial);

// Positioning
backNet.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0.5 * rectHeight, -1));

// Translate the middle of the bottom part of the rectangle to the origin
let backNetTranslationMatrix = new THREE.Matrix4().makeTranslation(0, 0, 1);
backNet.applyMatrix4(backNetTranslationMatrix);

// Apply 45 degrees rotation about X axis
backNet.applyMatrix4(rotationMatrix);

// Translate back to the original position
let backNetTranslationMatrixInverse = backNetTranslationMatrix.invert();
backNet.applyMatrix4(backNetTranslationMatrixInverse);

// -------------- Triangle nets --------------
let vertices = new Float32Array([
    1.5, 0, 0,    // vertex 1
    1.5, 0, -1,     // vertex 2
    1.5, 1, 0,      // vertex 3
]);

// Creating the right triangle net as shown in recitation 7
const sideNetGeometry = new THREE.BufferGeometry();
sideNetGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const sideNetMaterial = new THREE.MeshPhongMaterial({ color: 0xd3d3d3, side: THREE.DoubleSide });
const rightTriangleNet = new THREE.Mesh(sideNetGeometry, sideNetMaterial);

// Creating the left triangle net by cloning the right one and translating the clone
const leftTriangleNet = rightTriangleNet.clone();
leftTriangleNet.applyMatrix4(new THREE.Matrix4().makeTranslation(-3, 0, 0));

nets.push(backNet, rightTriangleNet, leftTriangleNet);

// -------------- Ball --------------
const ballGeometry = new THREE.SphereGeometry( goalHeight/16, 32, 32 ); 
const ballMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } ); 
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.applyMatrix4(new THREE.Matrix4().makeTranslation(0, goalHeight/16, 1));

// ------------------------------------------------------------------------------------------------
const goal = new THREE.Group();

for (var i = 0; i < goalSkeleton.length; i++) {
	goal.add(goalSkeleton[i]);
}
for (var i = 0; i < nets.length; i++) {
	goal.add(nets[i]);
}

scene.add(goal);
scene.add(ball);
// ------------------------------------------------------------------------------------------------
// -------------- Goalkeeper --------------
const goalkeeperParts = [];
const shoesHeight = 0.08;
const legsHeight = goalHeight / 4;
const upperBodyHeight = legsHeight;
const neckHeight = legsHeight / 7;
const headHeight = 5 * neckHeight;
const handsHeight = legsHeight;

// -------------- left shoe --------------
const leftShoeGeometry = new THREE.BoxGeometry(shoesHeight, shoesHeight, 2 * shoesHeight);
leftShoeGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-0.075, shoesHeight / 2, 0.02));
const leftShoeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
const leftShoe = new THREE.Mesh(leftShoeGeometry, leftShoeMaterial);
goalkeeperParts.push(leftShoe);

// -------------- right shoe --------------

// Clone the left Shoe and translate the clone
const rightShoe = leftShoe.clone();
rightShoe.applyMatrix4(new THREE.Matrix4().makeTranslation(0.15, 0, 0));
goalkeeperParts.push(rightShoe);

// -------------- left leg --------------
const leftLegGeometry = new THREE.CylinderGeometry(0.03, 0.03, legsHeight, 32);
leftLegGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(-0.075, legsHeight / 2 + shoesHeight, 0));
const leftLegMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const leftLeg = new THREE.Mesh(leftLegGeometry, leftLegMaterial);
goalkeeperParts.push(leftLeg);

// -------------- right leg --------------

// Clone the left leg and translate the clone
const rightLeg = leftLeg.clone();
rightLeg.applyMatrix4(new THREE.Matrix4().makeTranslation(0.15, 0, 0));
goalkeeperParts.push(rightLeg);

// -------------- upper body --------------
const upperBodyGeometry = new THREE.BoxGeometry(upperBodyHeight, upperBodyHeight, upperBodyHeight / 3);
upperBodyGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, upperBodyHeight / 2 + legsHeight + shoesHeight, 0));
const upperBodyMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const upperBody = new THREE.Mesh(upperBodyGeometry, upperBodyMaterial);
goalkeeperParts.push(upperBody);

// -------------- neck --------------
const neckGeometry = new THREE.CylinderGeometry(0.03, 0.03, neckHeight, 32);
neckGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, neckHeight / 2 + upperBodyHeight + legsHeight + shoesHeight, 0));
const neckMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
const neck = new THREE.Mesh(neckGeometry, neckMaterial);
goalkeeperParts.push(neck);

// -------------- head --------------
const headGeometry = new THREE.SphereGeometry(headHeight / 2, 32, 32 ); 
const headMaterial = neckMaterial; 
const head = new THREE.Mesh(headGeometry, headMaterial);
head.applyMatrix4(new THREE.Matrix4().makeTranslation(0, headHeight / 2 + neckHeight + upperBodyHeight + legsHeight + shoesHeight, 0));
goalkeeperParts.push(head);

// -------------- left hand --------------
const leftHandGeometry = new THREE.CylinderGeometry(0.03, 0.03, handsHeight, 32);
leftHandGeometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(-30)));
leftHandGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(upperBodyHeight * 0.6, handsHeight / 2 + upperBodyHeight * 0.75 + legsHeight + shoesHeight , 0));
const leftHandMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const leftHand = new THREE.Mesh(leftHandGeometry, leftHandMaterial);
goalkeeperParts.push(leftHand);

// -------------- right hand --------------
const rightHandGeometry = new THREE.CylinderGeometry(0.03, 0.03, handsHeight, 32);
rightHandGeometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(30)));
rightHandGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(upperBodyHeight * -0.6, handsHeight / 2 + upperBodyHeight * 0.75 + legsHeight + shoesHeight , 0));
const rightHandMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const rightHand = new THREE.Mesh(rightHandGeometry, rightHandMaterial);
goalkeeperParts.push(rightHand);

// -------------- left glove --------------
const gloveWidth = 0.08;
const gloveHeight = 0.1;
const gloveDepth = 0.08;

const leftGloveGeometry = new THREE.BoxGeometry(gloveWidth, gloveHeight, gloveDepth);
leftGloveGeometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(-30)));
leftGloveGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(upperBodyHeight * 0.6 + gloveWidth, handsHeight + upperBodyHeight * 0.75 + legsHeight + shoesHeight, 0));
const leftGloveMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
const leftGlove = new THREE.Mesh(leftGloveGeometry, leftGloveMaterial);
goalkeeperParts.push(leftGlove);

// -------------- right glove --------------
const rightGloveGeometry = new THREE.BoxGeometry(gloveWidth, gloveHeight, gloveDepth);
rightGloveGeometry.applyMatrix4(new THREE.Matrix4().makeRotationZ(THREE.MathUtils.degToRad(30)));
rightGloveGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(upperBodyHeight * -0.6 - gloveWidth, handsHeight + upperBodyHeight * 0.75 + legsHeight + shoesHeight, 0));
const rightGloveMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
const rightGlove = new THREE.Mesh(rightGloveGeometry, rightGloveMaterial);
goalkeeperParts.push(rightGlove);

// -------------- mouth --------------
const mouthWidth = headHeight * 0.5;
const mouthHeight = headHeight * 0.05;
const mouthDepth = 0.02;

const mouthGeometry = new THREE.BoxGeometry(mouthWidth, mouthHeight, mouthDepth);
mouthGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -0.03, headHeight * 0.5));
const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0x660000	 });
const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
head.add(mouth);

// -------------- Left Eye --------------
const eyeRadius = headHeight * 0.1;
const eyeGeometry = new THREE.SphereGeometry(eyeRadius, 32, 32);
eyeGeometry.applyMatrix4(new THREE.Matrix4().makeTranslation(headHeight * -0.2, headHeight * 0.1, headHeight * 0.35));
const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
head.add(leftEye);

// -------------- Right Eye --------------

// Clone the left leg and translate the clone
const rightEye = leftEye.clone();
rightEye.applyMatrix4(new THREE.Matrix4().makeTranslation(headHeight * 0.4, 0, 0));
head.add(rightEye);

const goalkeeper = new THREE.Group();
for (var i = 0; i < goalkeeperParts.length; i++) {
	goalkeeper.add(goalkeeperParts[i]);
}

let goalkeeperMoveEdge = 1;

scene.add(goalkeeper);
// ------------------------------------------------------------------------------------------------

// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 0, 5);
camera.applyMatrix4(cameraTranslate)

renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

let isOrbitEnabled = true;
let isWireframeViewEnabled = false;
let isOneAnimationEnabled = false;
let isTwoAnimationEnabled = false;
let ballSpeed = 1;

const toggleOrbit = (e) => {
	if (e.key == "o") {
		isOrbitEnabled = !isOrbitEnabled;
	}
}

const toggleWireframe = (e) => {
	if (e.key == "w") {
		isWireframeViewEnabled = !isWireframeViewEnabled;
	}
}

const ballRotationalMovementOne = (e) => {
	if (e.key == "1") {
		isOneAnimationEnabled = !isOneAnimationEnabled;
	}
}

const ballRotationalMovementTwo = (e) => {
	if (e.key == "2") {
		isTwoAnimationEnabled = !isTwoAnimationEnabled;
	}
}

const goalShrink = (e) => {
	if (e.key == "3") {
		goal.applyMatrix4(new THREE.Matrix4().makeScale(0.95, 0.95, 0.95));
		goalkeeper.applyMatrix4(new THREE.Matrix4().makeScale(0.95, 0.95, 0.95));
		goalkeeperMoveEdge *= 0.95;
	}
}

const increaseSpeedOfBall = (e) => {
	if (e.key == "ArrowUp" && (isOneAnimationEnabled || isTwoAnimationEnabled) && ballSpeed < 45)  {
		ballSpeed++;
	}
}

const decreaseSpeedOfBall = (e) => {
	if (e.key == "ArrowDown" && (isOneAnimationEnabled || isTwoAnimationEnabled) && ballSpeed > 0) {
		ballSpeed--;
	}
}

const moveGoalkeeperRight = (e) => {
	if (e.key == "d" && goalkeeper.position.x < goalkeeperMoveEdge) {
		goalkeeper.applyMatrix4(new THREE.Matrix4().makeTranslation(0.1, 0, 0));
	}
}

const moveGoalkeeperLeft = (e) => {
	if (e.key == "a" && goalkeeper.position.x > -goalkeeperMoveEdge) {
		goalkeeper.applyMatrix4(new THREE.Matrix4().makeTranslation(-0.1, 0, 0));
	}
}

document.addEventListener('keydown', toggleOrbit)
document.addEventListener('keydown', toggleWireframe)
document.addEventListener('keydown', ballRotationalMovementOne)
document.addEventListener('keydown', ballRotationalMovementTwo)
document.addEventListener('keydown', goalShrink)
document.addEventListener('keydown', increaseSpeedOfBall)
document.addEventListener('keydown', decreaseSpeedOfBall)
document.addEventListener('keydown', moveGoalkeeperRight)
document.addEventListener('keydown', moveGoalkeeperLeft)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame(animate);

	controls.enabled = isOrbitEnabled;
	controls.update();

	goalSkeleton.forEach(element => {
		element.material.wireframe = isWireframeViewEnabled;
	});

	nets.forEach(element => {
		element.material.wireframe = isWireframeViewEnabled;
	});

	ball.material.wireframe = isWireframeViewEnabled;
	
	goalkeeperParts.forEach(element => {
		element.material.wireframe = isWireframeViewEnabled;
	});

	if (isOneAnimationEnabled) {
		ball.applyMatrix4(new THREE.Matrix4().makeRotationX(degrees_to_radians(ballSpeed)));
	}

	if (isTwoAnimationEnabled) {
		ball.applyMatrix4(new THREE.Matrix4().makeRotationY(degrees_to_radians(ballSpeed)));
	}

	renderer.render(scene, camera);

}
animate()