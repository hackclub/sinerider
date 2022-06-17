/**
 * Quad generated using passed in fragment shader, generates its own WebGL context and off-screen buffer
 * @param {number} xRes Width of off-screen buffer
 * @param {number} yRes Height of off-screen buffer
 * @param {HTMLObjectElement} fragmentShaderSource Source code of fragment shader
 * @returns Quad
 */
function Quad(xRes, yRes, fragmentShaderSource) {
  const screenbuffer = document.createElement('canvas')

  screenbuffer.width = xRes
  screenbuffer.height = yRes
  screenbuffer.display = 'none' // Hidden

  const gl = screenbuffer.getContext('webgl')

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

  const vertexShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
    }
  `

  const program = ShaderProgram(gl, vertexShaderSource, fragmentShaderSource)

  program.use()

  // vertex layout
  const position = program.getAttribLocation('position')
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(position)

  // uniforms
  const resolutionLoc = program.getUniformLocation('resolution')
  const frameLoc = program.getUniformLocation('frame')

  let frame = 0

  function draw() {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, screenbuffer.width, screenbuffer.height)

    gl.uniform2fv(resolutionLoc, [ screenbuffer.width, screenbuffer.height ])
    gl.uniform1f(frameLoc, frame++)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  function getBuffer() {
    return screenbuffer
  }

  return {
    draw,
    getBuffer
  }
}