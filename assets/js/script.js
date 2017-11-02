var CANVAS_SIZE = 550;
var canvas = new fabric.Canvas('c', {
  width: CANVAS_SIZE,
  height: CANVAS_SIZE,
  backgroundColor: '#fff',
  selection: false
});
setTimeout(function(){
  canvas.setBackgroundImage('assets/images/stadium.jpg', canvas.renderAll.bind(canvas));
}, 100);
var circle = new fabric.Circle({
  radius: 20,
  fill: 'green',
  left: 300,
  top: 300,
  originX: 'center',
  originY: 'bottom',
  draggable: false,
  dataLabel: 'stadium'
});


var triangle = new fabric.Circle({
  radius: 30,
  fill: 'blue',
  left: 215,
  top: 240,
  originX: 'center',
  originY: 'bottom',
  draggable: false,
  dataLabel: 'stadium blue'
});
canvas.add(circle, triangle);


canvas.on('mouse:over', function(e) {
  if (e.target != null)
    console.log(e.target.dataLabel);
});
//canvas.zoomToPoint(new fabric.Point(canvas.getCenter().left, canvas.getCenter().top,1)) ;

var UNIT = 2;

var setupMouseDragging = function() {
  var oldPos, currPos;
  var isDragging = false;
  var isReachBoundaries = function(stepX, stepY) {
    var result = false;
    var bound = canvas.calcViewportBoundaries();
    if (bound.tl.x <= 0 && stepX > 0) result = true;
    if (bound.tl.y <= 0 && stepY > 0) result = true;
    if (bound.br.x >= canvas.width && stepX < 0) result = true;
    if (bound.br.y >= canvas.height && stepY < 0) result = true;
    return result;
  }
  $(document).on('mousedown', '#canvasContainer', function(e) {
    oldPos = {
      x: e.offsetX,
      y: e.offsetY
    }
    isDragging = true;
  });

  $(document).on('mousemove', '#canvasContainer', function(e) {
    if (isDragging) {
      currPos = {
        x: e.offsetX,
        y: e.offsetY
      }
      var stepX = currPos.x - oldPos.x, 
        stepY = currPos.y - oldPos.y;
      if (isReachBoundaries(stepX, stepY))
        return;
      
      var delta = new fabric.Point(stepX, stepY);
      canvas.relativePan(delta);
      // console.log('x: ' + stepX);
      console.log(canvas.calcViewportBoundaries().br);
      oldPos = currPos;
    }
  });
  
  $(document).on('mouseup', '#canvasContainer', function(e) {
    if (isDragging) {
      isDragging = false;
    }
  });
  
}();

$(function() {

  $('#zoomIn').click(function() {
    canvas.setZoom(canvas.getZoom() * 1.1);

    canvas.getObjects().forEach(function(e,i) {
      var currRadius = e.radius;
      e.setRadius(currRadius/1.1);
    })
  });

  $('#zoomOut').click(function() {
    canvas.setZoom(canvas.getZoom() / 1.1);
    canvas.getObjects().forEach(function(e,i) {
      var currRadius = e.radius;
      e.setRadius(currRadius * 1.1);
    })
  });

  $('#goRight').click(function() {
    var units = 10;
    var delta = new fabric.Point(units, 0);
    canvas.relativePan(delta);
  });

  $('#goLeft').click(function() {
    var units = 10;
    var delta = new fabric.Point(-units, 0);
    canvas.relativePan(delta);
  });
  $('#goUp').click(function() {
    var units = 10;
    var delta = new fabric.Point(0, -units);
    canvas.relativePan(delta);
  });

  $('#goDown').click(function() {
    var units = 10;
    var delta = new fabric.Point(0, units);
    canvas.relativePan(delta);
  });


});