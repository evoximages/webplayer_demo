AFRAME.registerComponent('spin-frames', {
  multiple: true,
  schema: {
    // configurable options
    urls: { type: 'array' },
    vifnum: { type: 'string' },
    folder: { type: 'string' },
    sensitivity: { default: 3.2 },
    eye: { type: 'string', default: 'left' },
    stereo: { type: 'string', default: 'both' },
    frameIndex: { type: 'number', default: 24 },
    visible: { type: 'boolean', default: true },
    clickToSpin: { type: 'boolean', default: false },

    // default flags
    loading: { default: true },
    enabled: { default: true },
    initTick: { type: 'boolean', default: false }
  },
  init: function() {
    this.textures = [];
    this.SPEED = 1 / 88;
    this.COUNTER = 2112; // starting image * FRAMES

    this.startX = 0;
    this.lookVector = new THREE.Vector2();
    this.mouseDown = false;
    this.touchDown = false;
    this._isMobile = this.el.sceneEl.isMobile;
    this.bindMethods();

    if (!this._isMobile) {
      var scene = document.getElementById('a-scene');
      scene.setAttribute('vr-mode-ui', { enabled: false });
    }
  },

  update: function() {
    this.el.setAttribute('visible', this.data.visible);
    this.loadImages();
    this.updateMeshTexture(this.data.frameIndex);
    this.setStereoLayer();
  },

  play: function() {
    this.addEventListeners();
  },

  pause: function() {
    this.removeEventListeners();
    this.lookVector.set(0, 0);
  },

  remove: function() {
    this.pause();
  },

  bindMethods: function() {
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    this.setStereoLayer = this.setStereoLayer.bind(this);
    this.onExitVr = this.onExitVr.bind(this);
    this.onEnterVr = this.onEnterVr.bind(this);
  },

  addEventListeners: function() {
    const canvasEl = this.el.sceneEl.canvas;
    const aScene = document.querySelector('a-scene');
    // Mouse events
    canvasEl.addEventListener('mousedown', this.onMouseDown, false);
    canvasEl.addEventListener('mouseup', this.onMouseUp, false);
    canvasEl.addEventListener('mousemove', this.onMouseMove, false);

    // Touch events
    canvasEl.addEventListener('touchstart', this.onTouchStart, false);
    canvasEl.addEventListener('touchmove', this.onTouchMove, false);
    canvasEl.addEventListener('touchend', this.onTouchEnd, false);

    aScene.addEventListener('enter-vr', this.onEnterVr, false);
    aScene.addEventListener('exit-vr', this.onExitVr, false);
  },

  removeEventListeners: function() {
    const canvasEl = this.el.sceneEl && this.el.sceneEl.canvas;
    if (canvasEl) {
      canvasEl.removeEventListener('mousedown', this.onMouseDown);
      canvasEl.removeEventListener('mousemove', this.onMouseMove);
      canvasEl.removeEventListener('mouseup', this.onMouseUp);

      canvasEl.removeEventListener('touchstart', this.onTouchStart);
      canvasEl.removeEventListener('touchmove', this.onTouchMove);
      canvasEl.removeEventListener('touchend', this.onTouchEnd);
    }
  },

  tick: function(time, delta) {
    if (this.data.initTick) {
      this.updateImageByFrame(time, delta);
    }
  },

  loadImages: function() {
    const loader = new THREE.TextureLoader();
    loader.setPath(this.data.folder);

    if (this.data.urls.length) {
      return this.data.urls.map(path => {
        let texture = loader.load(path);
        texture.minFilter = THREE.LinearFilter;
        this.textures.push(texture);
      });
    }

    for (let i = 10; i <= 360; i += 10) {
      let num = i.toString();
      let paddedNum = '000'.substring(num.length, 4) + num;
      let path = `/AIL${this.data.vifnum}_${this.data.eye}_${paddedNum}.png`;
      let texture = loader.load(path);
      this.textures.push(texture);
    }
  },

  updateMeshTexture: function(index) {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh || !mesh.material) return;
    mesh.material.map = this.textures[index];
  },

  updateImageByFrame: function(time, delta) {
    let frame = Math.round(this.COUNTER * this.SPEED);
    if (!this.data.clickToSpin) {
      this.COUNTER += Math.round(time);
    } else {
      this.COUNTER += Math.round(delta);
    }
    this.updateMeshTexture(this.frameModulo(frame));
  },

  frameModulo: function(frame) {
    return ((frame % 36) + 36) % 36;
  },

  isRotationActive: function() {
    return this.data.enabled && (this.mouseDown || this.touchDown);
  },

  rotateObject: function(clientX) {
    if (clientX === this.startX) return;

    const currentX = clientX;
    let direction = 1;

    if (currentX > this.startX) {
      direction = -1;
    }

    const amountMoved =
      Math.abs(currentX - this.startX) * direction * this.data.sensitivity;
    this.updateImageByFrame(amountMoved);
    this.startX = currentX;
  },

  onMouseMove: function(event) {
    if (!this.data.enabled || !this.mouseDown || this.data.clickToSpin) return;

    const previousMouseEvent = this.previousMouseEvent;

    let movementX;
    movementX = event.movementX || event.mozMovementX || 0;

    if (movementX === undefined) {
      movementX = event.screenX - previousMouseEvent.screenX;
    }
    this.previousMouseEvent = event;

    if (this.isRotationActive()) {
      this.lookVector.x += movementX;
      this.rotateObject(this.lookVector.x);
    }
  },

  onMouseDown: function(event) {
    this.mouseDown = true;
    this.previousMouseEvent = event;
    if (!this.data.clickToSpin) return;
    this.data.initTick
      ? (this.data.initTick = false)
      : (this.data.initTick = true);
  },

  onMouseUp: function() {
    this.mouseDown = false;
    if (!this.data.clickToSpin) return;
    this.data.initTick
      ? (this.data.initTick = false)
      : (this.data.initTick = true);
  },

  // TOUCH CONTROLS
  onTouchMove: function(event) {
    if (!this.data.enabled || !this.touchDown) return;

    const previousTouchEvent = this.previousTouchEvent;
    const touch = event.touches[0];
    const movementX = touch.screenX - previousTouchEvent.touches[0].screenX;

    this.previousTouchEvent = event;

    if (this.isRotationActive()) {
      this.lookVector.x += movementX;
      this.rotateObject(this.lookVector.x);
    }
  },

  onTouchStart: function(event) {
    this.touchDown = true;
    this.previousTouchEvent = event;
    if (!this.data.clickToSpin) return;
    this.data.initTick
      ? (this.data.initTick = false)
      : (this.data.initTick = true);
  },

  onTouchEnd: function() {
    this.touchDown = false;
  },

  onEnterVr: function() {
    this.setStereoLayer('inVrMode');
    this.data.clickToSpin = true;
    this.el.sceneEl.addEventListener('mouseenter', this.onMouseDown, false);
    this.el.sceneEl.addEventListener('mouseleave', this.onMouseDown, false);
  },

  onExitVr: function() {
    window.location.reload(true);
  },

  setStereoLayer: function(event) {
    const data = this.data;
    const obj3D = this.el.object3D.children[0];

    if (data.stereo === 'both' || data.stereo === 'left') {
      obj3D.layers.set(0);
    } else if (data.stereo === 'right') {
      obj3D.layers.set(2);
    }

    if (event === 'inVrMode' && data.stereo === 'both') {
      obj3D.layers.set(1);
    }
  }
});
