/**
 * Generates object for rendering a quad with a specified fragment shader
 * @param {string} shader Fragment shader source
 * @param {HTMLObjectElement} canvas HTML canvas to be drawn to 
 * @returns Quad
 */
function Quad(fragmentShaderSource, canvas) {
  const gl = canvas.getContext('webgl')

  if (gl == null) {
    // TODO: Handle case if WebGL is disabled  
    return
  }

  const vertices = [
    -1, -1,
    -1,  1,
     1, -1,
     1,  1,
  ]

  const vertexBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)

  let program = gl.createProgram()

  // vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER)

  gl.shaderSource(vertexShader, `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
    }
  `)

  gl.compileShader(vertexShader)

  // fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(fragmentShader, fragmentShaderSource)
  gl.compileShader(fragmentShader)

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    throw `Error in compiling fragment shader ${gl.getShaderInfoLog(fragmentShader)}`

  // attach and link shader program
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  gl.useProgram(program)

  // vertex layout
  const position = gl.getAttribLocation(program, 'position')
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(position)

  // uniforms
  const resolutionLoc = gl.getUniformLocation(program, 'resolution')
  const frameLoc = gl.getUniformLocation(program, 'frame')

  let frame = 0

  function draw() {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)

    gl.uniform2fv(resolutionLoc, [ canvas.width, canvas.height ])
    gl.uniform1f(frameLoc, frame++)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  return {
    draw
  }
}