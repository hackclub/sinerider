function ShaderProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram()

  const vertexShader = gl.createShader(gl.VERTEX_SHADER)

  gl.shaderSource(vertexShader, vertexSource)
  gl.compileShader(vertexShader)

  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    throw `Error in compiling vertex shader ${gl.getShaderInfoLog(vertexShader)}`

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

  gl.shaderSource(fragmentShader, fragmentSource)
  gl.compileShader(fragmentShader)

  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    throw `Error in compiling fragment shader ${gl.getShaderInfoLog(fragmentShader)}`

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program)

  function use() {
    gl.useProgram(program)
  }

  function getUniformLocation(name) {
    return gl.getUniformLocation(program, name)
  }

  function getAttribLocation(name) {
    return gl.getAttribLocation(program, name)
  }

  return {
    getAttribLocation,
    getUniformLocation,
    use
  } 
}