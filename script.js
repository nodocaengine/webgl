onload = () => {
  console.log('setup');

  let c = document.getElementById('canvas');
  
  c.width = 300;
  c.height = 300;
  
  let gl = c.getContext('webgl') || c.getContext('experimental-webgl');
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUDDER_BIT);

  let v_shader = create_shader('vs');
  let f_shader = create_shader('fs');
  let prg = create_program(v_shader, f_shader);

  let attLocation = new Array(2);
  attLocation[0] = gl.getAttribLocation(prg, 'position');
  attLocation[1] = gl.getAttribLocation(prg, 'color');

  let attStride = new Array(2);
  attStride[0] = 3;
  attStride[1] = 4;

  let vertex_position = [
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0
  ];

  let vertex_color = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  let position_vbo = create_vbo(vertex_position);
  let color_vbo= create_vbo(vertex_color);

  gl.bindBuffer(gl.ARRAY_BUFFER, position_vbo);
  gl.enableVertexAttribArray(attLocation[0]);
  gl.vertexAttribPointer(attLocation[0], attStride[0], gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, color_vbo);
  gl.enableVertexAttribArray(attLocation[1]);
  gl.vertexAttribPointer(attLocation[1], attStride[1], gl.FLOAT, false, 0, 0);

  let m = new matIV();
  let mMatrix = m.identity(m.create());
  let vMatrix = m.identity(m.create());
  let pMatrix = m.identity(m.create());
  let mvpMatrix = m.identity(m.create());

  m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
  m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);

  m.multiply(pMatrix, vMatrix, mvpMatrix);
  m.multiply(mvpMatrix, mMatrix, mvpMatrix);

  let uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');

  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.flush();

  function create_shader(id) {
    let shader;
    let scriptElement = document.getElementById(id);

    if (!scriptElement) return;
  
    switch (scriptElement.type) {
      case 'x-shader/x-vertex':
        shader = gl.createShader(gl.VERTEX_SHADER);
        break;
  
      case 'x-shader/x-fragment':
        shader = gl.createShader(gl.FRAGMENT_SHADER);
        break;
  
      default:
        return;
    }
  
    gl.shaderSource(shader, scriptElement.text);
    gl.compileShader(shader);
  
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      alert(gl.getShaderInfoLog(shader));
    }
  }
  
  function create_program(vs, fs) {
    let program = gl.createProgram();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
  
    gl.linkProgram(program);
  
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      return program;
    } else {
      alert(gl.getProgramInfoLog(program));
    }
  }
  
  function create_vbo(data) {
    let vbo = gl.createBuffer();
  
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
    return vbo;
  }
};

