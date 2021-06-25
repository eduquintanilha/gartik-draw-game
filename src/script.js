
// Add event listener for execute scripts only all the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
  const drawCanvas = document.querySelector('#screen');
  const context = drawCanvas.getContext('2d');
  
  drawCanvas.width = drawCanvas.clientWidth;
  drawCanvas.height = drawCanvas.clientHeight;

  // Listener on color input to get color and set brush color
  const brushColorInput = document.querySelector('#brush-color');
  context.strokeStyle = brushColorInput.value;
  brushColorInput .addEventListener('change', () => {
    context.strokeStyle = brushColorInput.value;
  })
  // Listener on range input to get and set brush size
  const brushSizeInput = document.querySelector('#brush-size');
  context.lineWidth = brushSizeInput.value; // Default setup brush size to range input default
  brushSizeInput.addEventListener("change", () => {
    // Set Brush size
    context.lineWidth = brushSizeInput.value;
    //context.strokeStyle = "red";
  });

  // Listener on clear burron to clear all the screen
  const clearScreenButton = document.querySelector('#clear-screen');
  clearScreenButton.addEventListener('click', () => {
    context.clearRect(0,0,screen.width, screen.height);
  })

  const brush = {
    isActive: false,
    isMoving: false,
    newPosition: { x:0, y:0 },
    previousPosition: null 
  }

  // Function for get exact X,Y position of mouse, compensating the canvas rect;
  const getBrushPosition = (canvas,event) => {
    var rect = canvas.getBoundingClientRect();
    return { 
      x: (event.clientX - rect.left),
      y: (event.clientY - rect.top)
    }
  }

  // Function to draw line on canvas with mouse position parameters
  const drawLine = (line) => {
    context.beginPath();
    context.lineWidth = brushSizeInput.value;
    context.lineCap = "round";
    context.lineJoin = "round"
    context.moveTo(line.previousPosition.x, line.previousPosition.y);
    context.lineTo(line.newPosition.x, line.newPosition.y);
    context.stroke();
    context.closePath();
  } 

  // Mouse events listeners
  drawCanvas.onmousedown = (event) => { brush.isActive = true }
  drawCanvas.onmouseup = (event) => { brush.isActive = false }
  drawCanvas.onmousemove = (event) => {
    
    const brushPosition = getBrushPosition(drawCanvas, event);
    brush.newPosition.x = brushPosition.x;
    brush.newPosition.y = brushPosition.y;
    brush.isMoving = true;
  }


  // Loop executing for draw a continuous line when you move the mouse over the canvas
  const loop = () => {
    if (brush.isActive && brush.isMoving && brush.previousPosition) {
      drawLine({ newPosition:  brush.newPosition, previousPosition: brush.previousPosition });
      brush.isMoving = false;
    }
    brush.previousPosition = { x: brush.newPosition.x, y: brush.newPosition.y };
    setTimeout(loop, 1); //Time to loop in Miliseconds. (Increase or decrease for change speed of the brush)
  }

  
  loop();

});
