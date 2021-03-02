"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;
var direction = true;
var speed = 0.1;
var x = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vertices = [
        vec2(0, 1),
        vec2(-1, 0),
        vec2(1, 0),
        vec2(0, -1)
    ];


    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    // Initialize event handler (button)
    document.getElementById("Direction").onclick = function() {
        console.log("pressed button");
        direction = !direction;
    }

    document.getElementById("slider").onchange = function(event) {
        speed = parseFloat(event.target.value);
        console.log("slider!!!", speed);
    }

    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index) {
            case 0:
                x=x+0.1;
                gl.clearColor(x, x, x, 1);
                break;
            case 1:
                x=x-0.1;
                gl.clearColor(x, x, x, 1);
        }
    }
    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'D': //direction
          case 'd':
            direction = !direction;
            break;
          case 'F': //faster
          case 'f':
            speed += .1;
            break;
          case 'S': //slower
          case 's':
            speed -= .1;
            if (speed < 0) {
                speed = 0;
            }
            break;
        }
    };

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (direction == true) {
        theta += 0.01;
    }
    else {
        theta -= 0.01;
    }

    theta += speed;

    gl.uniform1f(thetaLoc, theta);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
