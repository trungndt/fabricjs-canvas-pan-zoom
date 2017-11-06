var canvas;
$(function() {
  var CANVAS_W;
  var CANVAS_H;
  var group;

  var calculateCanvasSize = function() {
    var $container = $('#canvasContainer');
    CANVAS_W = $container.width();
    CANVAS_H = $container.height();
  }();

  var setupCanvas = function() {
    canvas = new fabric.Canvas('c', {
      width: CANVAS_W,
      height: CANVAS_H,
      backgroundColor: '#fff',
      selection: false,
      originX: 'center',
      originY: 'center'
    });
    // setTimeout(function() {
    //   canvas.setBackgroundImage('assets/images/stadium.jpg', canvas.renderAll.bind(canvas));
    // }, 100);
  }();

  var renderSamplePoints = function() {
    // background
    fabric.Image.fromURL('assets/images/precinct.jpg', function(precinct) {
      var pWidth = CANVAS_W;
      var pHeight = CANVAS_W / precinct.width * precinct.height;
      precinct.scaleToWidth(CANVAS_W);

      group = new fabric.Group([precinct], {
        
      });
      canvas.add(group);
      for (var i = 0; i < 200; i++) {
        fabric.loadSVGFromURL('assets/images/food.svg', function(objects, options) {
          var obj = fabric.util.groupSVGElements(objects, options);
          obj.set({
            lockMovementX: true,
            lockMovementY: true,
            originX: 'center',
            originY: 'bottom',
            top: Math.floor((Math.random() * pHeight) + 1),
            left: Math.floor((Math.random() * pWidth) + 1)
          });
          if (canvas.getZoom()) {
            obj.scale(1 / canvas.getZoom());
          }
          group.addWithUpdate(obj);
          canvas.renderAll();
        });
      }
      setupZooming('in', CANVAS_H / canvas.getObjects()[0].height)
    });
  }();

  // canvas.on('mouse:over', function(e) {
  //   if (e.target != null)
  //     console.log(e.target.dataLabel);
  // });
  //canvas.zoomToPoint(new fabric.Point(canvas.getCenter().left, canvas.getCenter().top,1)) ;

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

  var setupZooming = function(type, step) {
    if (step == undefined)
      step = type == 'in' ? ZOOM_STEP : 1/ZOOM_STEP;

    canvas.zoomToPoint(new fabric.Point(CANVAS_W / 2, 0), canvas.getZoom() * step);

    group.getObjects().forEach(function(e, i) {
      if (e.type != 'image') {
        e.scale(1 / canvas.getZoom());
      }
    });

    console.log(canvas.getObjects()[0].height * canvas.getZoom());
  }

  var ZOOM_STEP = 1.2;
  $('#zoomIn').click(function() {
    setupZooming('in');
  });

  $('#zoomOut').click(function() {
    setupZooming('out');
    
  });
});