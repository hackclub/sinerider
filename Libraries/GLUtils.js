// TODO: Add JSDoc

function GLUtils(gl) {
  const self = {}
  const FLOAT_SIZE = 4

  function viewport(width, height) {
    gl.viewport(0, 0, width, height)
  }

  function clear() {
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  function Program({ vert, frag }) {
    const self = { vert, frag }

    const program = gl.createProgram()

    const vertexShader = gl.createShader(gl.VERTEX_SHADER)

    gl.shaderSource(vertexShader, vert)
    gl.compileShader(vertexShader)

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.log('self', self)
      throw `Error in compiling vertex shader ${gl.getShaderInfoLog(
        vertexShader,
      )}.`
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(fragmentShader, frag)
    gl.compileShader(fragmentShader)

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.log('self', self)
      throw `Error in compiling fragment shader ${gl.getShaderInfoLog(
        fragmentShader,
      )}. Source ${frag}`
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)

    self.use = () => {
      gl.useProgram(program)
      return self
    }

    let locations = {
      attributes: {},
      uniforms: {},
    }

    const getAttribute = (name) => {
      let location = locations.attributes[name]
      if (!location) {
        location = gl.getAttribLocation(program, name)
        if (location == -1) {
          console.trace()
          throw `Unable to find location of attribute '${name}' in shader program`
        }
        locations.attributes[name] = location
      }

      return location
    }

    self.instancedAttributes = (ext, array, layout) => {
      array.bind()

      for ({
        type,
        name,
        perInstance,
        stride = null,
        offset = null,
      } of layout) {
        const length = lengths[type]
        const location = getAttribute(name)
        gl.enableVertexAttribArray(location)
        gl.vertexAttribPointer(
          location,
          length,
          gl.FLOAT,
          false,
          (stride || 0) * FLOAT_SIZE,
          (offset || 0) * FLOAT_SIZE,
        )
        ext.vertexAttribDivisor(location, perInstance)
      }

      return self
    }

    self.vertices = (v) => {
      return self.attributes(v.array, v.layout)
    }

    self.resetVerticesInstancing = (ext, v) => {
      const layout = v.layout

      for ({ name } of layout) {
        const location = getAttribute(name)
        ext.vertexAttribDivisor(location, 0)
      }

      return self
    }

    self.attributes = (array, layout) => {
      array.bind()

      for ({ name, length, stride = null, offset = null } of layout) {
        const location = getAttribute(name)
        gl.enableVertexAttribArray(location)
        gl.vertexAttribPointer(
          location,
          length,
          gl.FLOAT,
          false,
          (stride || 0) * FLOAT_SIZE,
          (offset || 0) * FLOAT_SIZE,
        )
      }

      return self
    }

    self.attrib = (name, length, stride, offset) => {
      const location = getAttribute(name)

      gl.enableVertexAttribArray(location)
      gl.vertexAttribPointer(
        location,
        length,
        gl.FLOAT,
        false,
        stride * FLOAT_SIZE,
        offset * FLOAT_SIZE,
      )

      return self
    }

    self.attribDivisor = (ext, name, count) => {
      const location = getAttribute(name)

      ext.vertexAttribDivisorANGLE(location, count)

      return self
    }

    const getUniform = (name) => {
      let location = locations.uniforms[name]
      if (!location) {
        location = gl.getUniformLocation(program, name)
        locations.uniforms[name] = location
      }
      return location
    }

    self.uniform = (name, value) => {
      const uniform = getUniform(name)

      if (typeof value === 'number') gl.uniform1f(uniform, value)
      else if (value.length == 2) gl.uniform2fv(uniform, value)
      else if (value.length == 3) gl.uniform3fv(uniform, value)
      else
        throw `Unexpected length ${value.length} when invoking GLUtils.Program.uniform() (${value})`

      return self
    }

    self.uniformi = (name, value) => {
      const uniform = getUniform(name)
      gl.uniform1i(uniform, value)
      return self
    }

    self.buffer = (buffer) => {
      buffer.bind()
      return self
    }

    self.viewport = (width, height) => {
      viewport(width, height)
      return self
    }

    self.draw = (type, count) => {
      clear()
      gl.drawArrays(type, 0, count)
    }

    self.drawInstanced = (ext, type, count, instancesCount) => {
      clear()
      ext.drawArraysInstanced(type, 0, count, instancesCount)
    }

    return self
  }

  function createReadBuffer(width, height, format) {
    const formatSize = format == gl.RGB ? 3 : format == gl.RGBA ? 4 : null
    return new Uint8Array(width * height * formatSize)
  }

  // TODO
  function pipeline(...programs) {
    const self = {}
    const fb = Framebuffer()

    self.instancedAttributes = (...args) => {
      programs.forEach((p) => p.instancedAttributes(args))
      return self
    }
    self.vertices = (...args) => {
      programs.forEach((p) => p.vertices(args))
      return self
    }
    self.resetVerticesInstancing = (...args) => {
      programs.forEach((p) => p.resetVerticesInstancing(args))
      return self
    }
    self.attributes = (...args) => {
      programs.forEach((p) => p.attributes(args))
      return self
    }
    self.attrib = (...args) => {
      programs.forEach((p) => p.attrib(args))
      return self
    }
    self.attribDivisor = (...args) => {
      programs.forEach((p) => p.attribDivisor(args))
      return self
    }
    self.uniform = (...args) => {
      programs.forEach((p) => p.uniform(args))
      return self
    }

    self.uniformi = (...args) => {
      programs.forEach((p) => p.uniformi(args))
      return self
    }
    self.buffer = (...args) => {
      programs.forEach((p) => p.buffer(args))
      return self
    }
    self.viewport = (...args) => {
      programs.forEach((p) => p.viewport(args))
      return self
    }
    self.drawInstanced = (...args) => {
      programs.forEach((p) => p.drawInstanced(args))
      return self
    }

    self.draw = (type, count) => {
      for (const program of programs) {
      }
    }
  }

  function Framebuffer() {
    const framebuffer = gl.createFramebuffer()

    function readTo(buffer, width, height, format) {
      gl.readPixels(0, 0, width, height, format, gl.UNSIGNED_BYTE, buffer)
      return buffer
    }

    function bind() {
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    }

    function setColorAttachment(texture) {
      bind()
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture._texture,
        0,
      )
    }

    return {
      bind,
      setColorAttachment,
      readTo,
    }
  }

  function bindDisplay() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  const fb = Framebuffer()

  function Texture(size = null, format = null) {
    const texture = gl.createTexture()
    const self = {}

    function bind(slot) {
      gl.activeTexture(gl.TEXTURE0 + slot)
      gl.bindTexture(gl.TEXTURE_2D, texture)
    }

    // Overwrites texture bound to unit 0 for initialization,
    // note that all draw calls which use Texture should immediately
    // be preceded by Texture binds
    bind(0)

    function image(img, format) {
      bind(0)
      gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, img)
      self.width = img.width
      self.height = img.height
    }

    function resize(_width, _height, _format) {
      // const newTexture = Texture([_width, _height], _format)
      // // fb.bind()
      // // fb.setColorAttachment(newTexture)
      // // bind(0)
      // // self.quadProgram.use()
      // //   .vertices(self.quad)
      // //   .uniformi('texture', 0)
      // //   .viewport(_width, _height)
      // //   .draw(gl.TRIANGLE_STRIP, 4)
      // texture.destroy()
      // return newTexture
    }

    if (size) {
      if (!format)
        throw `Expected size and format when constructing GLUtils.Texture`
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        format,
        size[0],
        size[1],
        0,
        format,
        gl.UNSIGNED_BYTE,
        null,
      )
    }

    // Overwrites texture bound to unit 0 for setting parameter
    function parameter(name, value) {
      bind(0)
      gl.texParameteri(gl.TEXTURE_2D, name, value)
    }

    // Default texture parameters
    parameter(gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    parameter(gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    parameter(gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    parameter(gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

    function destroy() {
      gl.deleteTexture(texture)
    }

    function resize(size) {
      destroy()
      return Texture(size, format)
    }

    return _.merge(self, {
      bind,
      parameter,
      image,
      destroy,
      resize,

      get _texture() {
        return texture
      },
      width: size ? size.width : 0,
      height: size ? size.height : 0,
    })
  }

  async function imageTexture(src, format) {
    const img = new Image()
    img.src = src

    await new Promise((resolve, _) => {
      img.onload = () => resolve()
    })

    const imageTex = Texture()

    imageTex.image(img, format)

    return imageTex
  }

  function Array(values, drawMode) {
    const buffer = gl.createBuffer()

    function bind() {
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    }

    function unbind() {
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }

    function data(data) {
      bind()
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)
      unbind()
    }

    bind()
    // Array must be floats
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), drawMode)
    unbind()

    return {
      bind,
      unbind,
      data,
    }
  }

  const lengths = {
    float: 1,
    sampler2D: 1,
    vec2: 2,
    vec3: 3,
  }

  function Vertices(drawMode, attributes) {
    const values = Object.values(attributes)

    if (values.length == 0)
      throw `At least one attribute must be specified for vertex buffer`

    const count = values[0].data.length / lengths[values[0].type]
    if (
      values.length > 1 &&
      values.some((attr) => attr.data.length / lengths[attr.type] != count)
    )
      throw `All attributes must be for the same number of vertices`

    const buffer = _.flattenDeep(
      _.zip(...values.map((attr) => _.chunk(attr.data, lengths[attr.type]))),
    )

    const array = Array(buffer, drawMode)

    const stride = values.reduce((s, attr) => s + lengths[attr.type], 0)

    const layout = []
    let offset = 0

    for (const [name, { type }] of Object.entries(attributes)) {
      const length = lengths[type]
      layout.push({ name, length, stride, offset })
      offset += length
    }

    return {
      layout,
      array,
    }
  }

  function InstancingExtension() {
    const ext = gl.getExtension('ANGLE_instanced_arrays')

    if (!ext) {
      alert(
        "WebGL feature 'ANGLE_INSTANCED_arrays' must be enabled in order to run this webpage. Try switching or updating your browser!",
      )
      throw `'ANGLE_INSTANCED_arrays' not enabled for WebGL`
      // TODO: Handle case in which browser doesn't support feature -- delete document?
    }

    const drawArraysInstanced = (mode, first, count, primcount) =>
      ext.drawArraysInstancedANGLE(mode, first, count, primcount)

    const vertexAttribDivisor = (location, divisor) =>
      ext.vertexAttribDivisorANGLE(location, divisor)

    return {
      drawArraysInstanced,
      vertexAttribDivisor,
    }
  }

  const quad = Vertices(gl.STATIC_DRAW, {
    aCoords: {
      type: 'vec2',
      data: [-1, -1, -1, 1, 1, -1, 1, 1],
    },
    aTexCoords: {
      type: 'vec2',
      data: [0, 0, 0, 1, 1, 0, 1, 1],
    },
  })

  const quadProgram = Program({
    vert: `
precision mediump float;
attribute vec2 aCoords;
attribute vec2 aTexCoords;
varying vec2 TexCoords;
void main() {
  gl_Position = vec4(aCoords, 0, 1);
  TexCoords = aTexCoords;
}`,
    frag: `
precision mediump float;
uniform sampler2D texture;
varying vec2 uv;
void main(void) {
vec3 col = texture2D(texture, uv).rgb;
gl_FragColor = vec4(col, 1.0);
}`,
  })

  return _.mixIn(self, {
    Program,
    Framebuffer,
    Texture,
    Array,
    Vertices,
    InstancingExtension,

    bindDisplay,
    imageTexture,
    createReadBuffer,

    get quad() {
      return quad
    },
    get quadProgram() {
      return quadProgram
    },
  })
}
