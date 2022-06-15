/**
 * Compiles shader and links to program, logs error if there is one
 * @param {WebGLRenderingContext} gl WebGL context
 * @param {WebGLProgram} program Shader program to attach to
 * @param {string} source Shader source code
 * @param {number} type Shader type
 */
function compileAndAttachShader(gl, program, source, type) {
  const shader = gl.createShader(type)

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS)

  if (!status) {
    const error = gl.getShaderInfoLog(shader)
    throw `Error in compiling shader ${error}`
  }

  gl.attachShader(program, shader)
}

/**
 * Generates object for rendering a quad with a specified fragment shader
 * @param {string} shader Fragment shader source
 * @param {HTMLObjectElement} canvas HTML canvas to be drawn to 
 * @returns Quad
 */
function Quad(shader, canvas) {
  let self = {}

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

  const vertexSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0, 1);
    }
  `

  let program = gl.createProgram()

  compileAndAttachShader(gl, program, vertexSource, gl.VERTEX_SHADER)
  compileAndAttachShader(gl, program, shader, gl.FRAGMENT_SHADER)

  gl.linkProgram(program)
  gl.useProgram(program)

  const position = gl.getAttribLocation(program, 'position')
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(position)

  const resolutionLoc = gl.getUniformLocation(program, 'resolution')
  const frameLoc = gl.getUniformLocation(program, 'frame')

  let frame = 0

  self.draw = () => {
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.viewport(0, 0, canvas.width, canvas.height)

    gl.uniform2fv(resolutionLoc, [ canvas.width, canvas.height ])
    gl.uniform1f(frameLoc, frame++)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  return self
}