var renderer = new THREE.WebGLRenderer({
    autoClear: true,
    autoClearColor: true,
    autoClearDepth: true,
    autoClearStencil: true,
    antialias: true
});

renderer.setClearColor(0x1B1F27, 1);
renderer.setPixelRatio( window.devicePixelRatio );

document.getElementById("page-slider-1").appendChild(renderer.domElement);

var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x1B1F27, 1, 800 );

camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 0, 15, 150 );
camera.lookAt( new THREE.Vector3() );

controls = new THREE.OrbitControls(camera, renderer.domElement);

controls.minAzimuthAngle = -Infinity;
controls.maxAzimuthAngle = Infinity;

controls.minPolarAngle = 80 * Math.PI / 180;
controls.maxPolarAngle = 90 * Math.PI / 180;

controls.enableDamping = false;
controls.dampingFactor = 0.25;
controls.enableZoom = false;
controls.enablePan = false;

var lights = [];

function addLight(d,s,o){
    /*var geometry = new THREE.SphereGeometry( 0.1, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh( geometry, material );*/

    var l = new THREE.PointLight( 0xffffff, 2, 50, 2 );
    //l.add(sphere);
    l.position.xd = d[0];
    l.position.yd = d[1];
    l.position.zd = d[2];
    l.position.xs = s[0];
    l.position.ys = s[1];
    l.position.zs = s[2];
    l.position.xo = o[0];
    l.position.yo = o[1];
    l.position.zo = o[2];
    scene.add(l);
    lights.push(l);
}

addLight(
    [5,0,5],
    [0.003,0,0.001],
    [0,15,10]
);
addLight(
    [15,0,5],
    [0.0015,0,0.001],
    [0,-5,10]
);

addLight(
    [5,0,4+Math.random()],
    [0.001+Math.random()*0.001,0.0015+Math.random()*0.001,0.001+Math.random()*0.001],
    [-30,-18,10]
);

addLight(
    [5,0,4+Math.random()],
    [0.001+Math.random()*0.001,0.0015+Math.random()*0.001,0.001+Math.random()*0.001],
    [0,-18,10]
);



addLight(
    [5,0,4+Math.random()],
    [0.001+Math.random()*0.001,0.0015+Math.random()*0.001,0.001+Math.random()*0.001],
    [30,-18,10]
);

for(var i=0;i<3;i++) {
    addLight(
        [
            (Math.random()-0.5)*60,
            (Math.random()-0.5)*60,
            (Math.random()-0.5)*60
        ],
        [
            Math.random()*0.001,
            Math.random()*0.001,
            Math.random()*0.001
        ],
        [
            0,
            -40,
            -10
        ]
    );
}

var geometry = new THREE.BoxGeometry( 500, 500, 500 );
var material = new THREE.MeshPhongMaterial( {
    color: 0x1B1F27,
    side: THREE.BackSide
} );
var mesh = new THREE.Mesh( geometry, material );
mesh.position.y = 210;
mesh.position.z = -50;
scene.add( mesh );

var loader = new THREE.SVGLoader();

loader.load('images/webprofy.svg', function (svgObject) {
    var path = svgObject.getElementsByTagName("path");

    var material = new THREE.MeshLambertMaterial({
        color: 0x1B1F27,
        opacity: 0.5,
        transparent: true
    });

    for (var i = 0; i < path.length; i++) {
        shape = transformSVGPathExposed(path[i].getAttribute("d"));
        if (shape.length > 1) {
            for (var x = 1; x < shape.length; x++) {
                shape[0].holes.push(shape[x]);
            }
        }
        shape = new THREE.ExtrudeGeometry([shape[0]], {
            amount: 1,
            bevelThickness: 2,
            bevelSize: 0.5,
            bevelSegments: 3,
            bevelEnabled: true,
            curveSegments: 30,
            steps: 1
        });

        shape.applyMatrix(new THREE.Matrix4().makeTranslation(-3398, -2213, 0));
        shape = new THREE.MorphAnimMesh(shape, material);
        shape.scale.x = 0.01;
        shape.scale.y = 0.01;
        shape.rotation.z = Math.PI;
        shape.rotation.y = Math.PI;

        scene.add(shape);
    }
});

var frameID = -1;
var frame = function () {
    if (window.requestAnimationFrame)
        window.requestAnimationFrame(animation);
    else if (window.msRequestAnimationFrame)
        window.msRequestAnimationFrame(animation);
    else if (window.webkitRequestAnimationFrame)
        window.webkitRequestAnimationFrame(animation);
    else if (window.mozRequestAnimationFrame)
        window.mozRequestAnimationFrame(animation);
    else if (window.oRequestAnimationFrame)
        window.oRequestAnimationFrame(animation);
    else {
        frame = function () {
        };
        frameID = window.setInterval(animation, 16.7);
    }
};
/*
var stats = new Stats();
stats.setMode( 0 );
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );
*/
var animation = function () {
    //stats.begin();
    var ll,p,i,l;
        ll = lights.length;
        if(ll>0) {
            p = performance.now();
            for (i = 0; i < ll; ++i) {
                l = lights[i].position;
                l.x = Math.sin(p * l.xs) * l.xd + l.xo;
                l.y = Math.sin(p * l.ys) * l.yd + l.yo;
                l.z = Math.sin(p * l.zs) * l.zd + l.zo;
            }
        }
        renderer.render(scene, camera);
    //stats.end();
    frame();
};

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('orientationchange',
    function () {
        onWindowResize();
    }
);


window.addEventListener('resize',
    function () {
        onWindowResize();
    }
);

setInterval(
    function(){
        onWindowResize();
    },
    1000
);

onWindowResize();

frame();
