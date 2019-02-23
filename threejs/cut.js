if ( WEBGL.isWebGLAvailable() === false ) {

  document.body.appendChild( WEBGL.getWebGLErrorMessage() );

}

var renderer, scene, camera, controls;
var  cloudMesh, spherePoint;
var raycaster; // 实现鼠标在3d上的点的投射点
var mouse = new THREE.Vector2();
var rangeLines = []; // 框选的线
var rangePoints = []; // 框线的点


var width = 80;
var length = 160;

init();
animate();

function generatePointCloudGeometry( color, width, length ) {

  var geometry = new THREE.BufferGeometry();
  var numPoints = width * length;

  var positions = new Float32Array( numPoints * 3 );
  var colors = new Float32Array( numPoints * 3 );

  var k = 0;

  for ( var i = 0; i < width; i ++ ) {

    for ( var j = 0; j < length; j ++ ) {

      var u = i / width;
      var v = j / length;
      var x = u - 0.5;
      var y = ( Math.cos( u * Math.PI * 4 ) + Math.sin( v * Math.PI * 8 ) ) / 20;
      var z = v - 0.5;

      positions[ 3 * k ] = x * 200;
      positions[ 3 * k + 1 ] = z * 200;
      positions[ 3 * k + 2 ] = y * 200;

      var intensity = ( y + 0.1 ) * 5;
      colors[ 3 * k ] = color.r * intensity;
      colors[ 3 * k + 1 ] = color.g * intensity;
      colors[ 3 * k + 2 ] = color.b * intensity;

      k ++;

    }

  }

  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
  geometry.computeBoundingBox();

  return geometry;

}

/**
 * 生成点云
 * @param {*} color
 * @param {*} width
 * @param {*} length
 */
function generatePointcloud( color, width, length ) {

  var geometry = generatePointCloudGeometry( color, width, length );
  var material = new THREE.PointsMaterial( { size: 6, vertexColors: THREE.VertexColors } );

  return  new THREE.Points( geometry, material );

}

function init() {

  container = document.getElementById( 'cloud' );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 100, 3000 );
  scene.background = new THREE.Color( 0x000000 );
  camera.position.x = -40;
  camera.position.y = -80;
  camera.position.z = 1000;
  camera.up.set( 0, 0, -1 );
  controls = new THREE.TrackballControls( camera, document.getElementById('cloud') );
  controls.rotateSpeed = 10;
  controls.zoomSpeed = 3;
  controls.panSpeed = 20;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.minDistance = 30;
  controls.maxDistance = 30 * 100;
  scene.add( camera );
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById('cloud').appendChild( renderer.domElement );

  cloudMesh  = generatePointcloud(new THREE.Color( 0, 1, 0 ), width, length);
  scene.add( cloudMesh );
  // 放大点的大小，不然太小了，图看不清
  controls.target.set( 0, 0, 0 );
  controls.update();

  container = document.createElement( 'div' );
  document.getElementById('cloud').appendChild( container );
  container.appendChild( renderer.domElement );


  // 后面可以进行鼠标点投射
  raycaster = new THREE.Raycaster();
  raycaster.params.Points.threshold = 1;

  // 添加鼠标在图像上移动的投射点
  var sphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 1, 32, 32 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
  scene.add( sphere );
  spherePoint = sphere;

  container.addEventListener( 'mousedown', onDocumentMouseDown, false );
  container.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'keydown', keyboard, false );
}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function keyboard( ev ) {
  switch ( ev.key || String.fromCharCode( ev.keyCode || ev.charCode ) ) {
    case 'c':
      let points = cloudMesh;
      let positionArr = points.geometry.attributes.position.array;
      let colorArr = points.geometry.attributes.color.array;
      let newPositionArr = [];
      let newColorArr = [];
      let lineVerticesArr = rangeLines.map(item => {
        return [
          {
            x: item.geometry.vertices[0].x,
            y: item.geometry.vertices[0].y,
            z: item.geometry.vertices[0].z
          },{
            x: item.geometry.vertices[1].x,
            y: item.geometry.vertices[1].y,
            z: item.geometry.vertices[1].z
          }
        ]
      });
      for (var i = 0;i < positionArr.length;i=i+3) {
        let point = {
          x: positionArr[i],
          y: positionArr[i + 1]
        };
        if (isPointInRange(point, lineVerticesArr)) {
          newPositionArr.push(positionArr[i],positionArr[i+1],positionArr[i+2])
          newColorArr.push(colorArr[i],colorArr[i+1],colorArr[i+2]);
        }
      }
      points.geometry.attributes.position.setArray(new Float32Array(newPositionArr));
      points.geometry.attributes.color.setArray(new Float32Array(newColorArr));
      points.geometry.attributes.position.needsUpdate = true;
      points.geometry.attributes.color.needsUpdate = true;
      renderer.render( scene, camera );
      break;
  }
}

function onDocumentMouseDown( event ) {
  event.preventDefault();

  raycaster.setFromCamera( mouse, camera );
  var intersections = raycaster.intersectObject( cloudMesh ); // 报错
  var intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

  if ( intersection !== null ) {

    let isDuplicated = false;
    let duplicatedIndex = 0;
    for (duplicatedIndex = 0;duplicatedIndex < rangePoints.length; duplicatedIndex++) {
      if (Math.abs(intersection.point.x - rangePoints[duplicatedIndex].position.x) < 4
          && Math.abs(intersection.point.y - rangePoints[duplicatedIndex].position.y) < 4
          && Math.abs(intersection.point.z - rangePoints[duplicatedIndex].position.z) < 4 ) {
        isDuplicated = true;
        break;
      }
    }

    if (!isDuplicated) {
      var sphereGeometry = new THREE.SphereBufferGeometry( 1, 32, 32 );
      var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
      var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
      scene.add( sphere );
      sphere.position.copy( intersection.point );
      sphere.scale.set( 1, 1, 1 );
    }
    if (rangePoints.length > 0) {
      var material = new THREE.LineBasicMaterial({
        color: 0xffffff
      });

      var geometry = new THREE.Geometry();
      geometry.vertices.push(
        rangePoints[rangePoints.length - 1].position,
        isDuplicated ? rangePoints[duplicatedIndex].position : intersection.point
      );
      var line = new THREE.Line( geometry, material );
      scene.add( line );
      rangeLines.push( line )
    }
    if (!isDuplicated) {
      rangePoints.push(sphere);
    }

    renderer.render( scene, camera );

  }
}

function runRaycaster () {
  raycaster.setFromCamera( mouse, camera );
  var intersections = raycaster.intersectObject( cloudMesh );
  var intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
  if ( intersection !== null ) {
    spherePoint.position.copy( intersection.point );
    spherePoint.scale.set( 1, 1, 1 );
  }
}
function animate() {
  requestAnimationFrame( animate );
  controls.update();
  if (cloudMesh !== null) {
    runRaycaster();
  }
  renderer.render( scene, camera );
}

/**
  * 是否点在一系列线段构成的区域内（二维区域，只算x、y）
  */
function isPointInRange (pointPos, lineVerticesArr) {
  let intersectedPointArr = [];
  for (let i = 0;i < lineVerticesArr.length;i++) {
    let intersectedPoint = this.getIntersect(pointPos, lineVerticesArr[i]);
    if (intersectedPoint !== null) {
      intersectedPointArr.push(intersectedPoint);
    }
  }
  // 固定pointPos的y值，计算pointPos左边和右边的相交点的数量
  let leftPointNum = 0, rightPointNum = 0;
  intersectedPointArr.forEach(item => {
    if (item.x < pointPos.x ) {
      leftPointNum++;
    } else {
      rightPointNum++;
    }
  });
  // 如果左右的相交点的数量都为奇数，则点在图中
  return leftPointNum%2==1 && rightPointNum%2==1;
}
/**
  * 在x、y平面上，以点的y值为直线，获取直线与线段的交点
  */
function getIntersect (pointPos, lineVertices) {
  let y = pointPos.y;
  let x;
  // 线段和x轴平行，则和以点的y值为直线的线不会有交点
  if (lineVertices[1].y === lineVertices[0].y) {
    return null;
  } else {
    x = (lineVertices[1].x - lineVertices[0].x)*y/(lineVertices[1].y - lineVertices[0].y) + (lineVertices[0].y*lineVertices[1].x - lineVertices[1].y*lineVertices[0].x)/(lineVertices[0].y - lineVertices[1].y);
  }
  let isInLine = (y < lineVertices[1].y && y > lineVertices[0].y) || (y < lineVertices[0].y && y > lineVertices[1].y) || (y === lineVertices[0].y) || y === lineVertices[1].y;
  if (isInLine) {
    return {
      x: x,
      y: y
    };
  } else {
    return null;
  }
}
