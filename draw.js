// Load global vars
var mouseDown = false;
var x1 = 0;
var y1 = 0;
var r = 0;
var loaded = false;
var currentPicture = 0;

function draw() {
    var canvas  = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    var tool = document.getElementById("tools");
    var color = document.getElementById("color");
    var width = document.getElementById("width");
    var pictureButton = document.getElementById("picture");
    var clearButton = document.getElementById("clear");
    var saveButton = document.getElementById("save");
    ctx.lineJoin = "round";
    // Get brush stroke color from user defined selection
    ctx.strokeStyle = color.value;
    // Get rectangle/circle color from user defined selection
    ctx.fillStyle = color.value;
    // Set brush/line width from user defined selection
    ctx.lineWidth = width.value;
    
    // Draw background picture
    if (!loaded || (currentPicture != picture.value)) {
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }
        img.src = "images/" + picture.value;
        loaded = true;
        currentPicture = picture.value;
    }
    
    // Open a new URL with the picture and canvas modifications to save
    saveButton.onclick = function save() {
        window.location = canvas.toDataURL('image/png');
    }
    
    // Clear all canvas modifications
    clearButton.onclick = function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        loaded = false;
    }
    
    // Paint, depending on tool selected
    canvas.onmousedown = function(mouseEvent) {
        // Get X position of mouse
        var xPos = mouseEvent.pageX-canvas.offsetLeft;
        // Get Y position of mouse
        var yPos = mouseEvent.pageY-canvas.offsetTop;
        
        // Brush tool
        if (tool.value == "brush") {
            mouseDown = true;
            
            ctx.beginPath();
            ctx.arc(xPos, yPos, width.value/2, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.stroke();
        }

        // Line tool
        if (tool.value == "line") {
            ctx.beginPath();
            ctx.moveTo(xPos, yPos);
        }

        // Get Circle or Rectangle starting coordinates
        if ((tool.value == "circle") || (tool.value == "rectangle")) {
            x1 = xPos;
            y1 = yPos;
        }
    }
    
    // If the mouse is still pressed and the brush tool is selected, paint
    canvas.onmousemove = function(mouseEvent) {
        // Get X position of mouse
        var xPos = mouseEvent.pageX-canvas.offsetLeft;
        // Get Y position of mouse
        var yPos = mouseEvent.pageY-canvas.offsetTop;
        
        if (tool.value == "brush" && mouseDown) {
            ctx.lineTo(xPos, yPos);
            ctx.stroke();
        }
    }
    
    // Events when mouse button is released
    canvas.onmouseup = function(mouseEvent) {
        // Get X position of mouse
        var xPos = mouseEvent.pageX-canvas.offsetLeft;
        // Get Y position of mouse
        var yPos = mouseEvent.pageY-canvas.offsetTop;
    
        // Close brush path when button is released
        if (tool.value == "brush") {
            ctx.closePath();
            mouseDown = false;
            ctx.beginPath();
            ctx.arc(xPos, yPos, width.value/2, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
        }

        // Draw line from starting coords to release position coords when released
        if (tool.value == "line") {
            ctx.lineTo(xPos, yPos);
            ctx.stroke();
            ctx.closePath();
        }

        // Draw circle from starting coords with radius to the current release position
        if (tool.value == "circle") {
            ctx.beginPath();
            r = Math.sqrt(Math.pow(xPos-x1, 2) + Math.pow(yPos-y1, 2));
            ctx.arc(x1, y1, r, 0, 2*Math.PI);
            ctx.closePath();
            ctx.fill();
            x1 = 0;
            y1 = 0;
            r = 0;
        }

        // Draw rectangle from starting coords with opposite corner set as release coords
        if (tool.value == "rectangle") {
            ctx.fillRect(x1, y1, xPos-x1, yPos-y1);
            x1 = 0;
            y1 = 0;
        }
    }
    
    // If mouse leaves canvas, end brush stroke
    canvas.onmouseout = function(mouseEvent) {
        if (tool.value == "brush" && mouseDown) {
            ctx.closePath();
        }
    }
    
    // If mouse enters canvas and button is pushed, begin stroke
    canvas.onmouseover = function(mouseEvent) {
        if (tool.value == "brush" && mouseDown) {
            ctx.beginPath();
            ctx.stroke();
        }
    }
    
    // If mouse is released, turn mouseDown off
    window.onmouseup = function(mouseEvent) {
        mouseDown = false;
    }

    // Refresh user selections and actions
    setTimeout(draw, 10);
}

window.onload = draw;