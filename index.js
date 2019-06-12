'use strict';

(function() {
  function init() {
    var toggleInterior = document.querySelector('.toggle-interior');
    var toggleExterior = document.querySelector('.toggle-exterior');
    toggleExterior.addEventListener('click', handleClick);
    toggleInterior.addEventListener('click', handleClick);
    setScene('exterior');
  }

  function handleClick(e) {
    e.preventDefault();
    var selectedScene = e.target.getAttribute('data-scene');
    return setScene(selectedScene);
  }

  function faceCameraToCoords(camera, coords) {
    camera.setAttribute('look-controls', { enabled: true });
    camera.setAttribute('rotation', coords);
    var newX = camera.object3D.rotation.x;
    var newY = camera.object3D.rotation.y;
    camera.components['look-controls'].pitchObject.rotation.x = newX;
    camera.components['look-controls'].yawObject.rotation.y = newY;
    camera.setAttribute('look-controls', { enabled: false });
  }

  function setScene(scene) {
    var aScene = document.getElementById('a-scene');
    var camera = document.getElementById('camera');
    var exteriorScene = document.querySelector('.exterior');
    var interiorScene = document.querySelector('.interior');

    switch (scene) {
      case 'interior':
        exteriorScene.setAttribute('visible', false);
        interiorScene.setAttribute('visible', true);
        aScene.setAttribute('rotation', '0 180 0');
        faceCameraToCoords(camera, '0 0 0');
        camera.setAttribute('look-controls', { enabled: true });
        break;
      case 'exterior':
        exteriorScene.setAttribute('visible', true);
        interiorScene.setAttribute('visible', false);
        aScene.setAttribute('rotation', '0 0 0');
        faceCameraToCoords(camera, '0 0 0');
        camera.setAttribute('look-controls', { enabled: true });
        break;
    }
  }

  init();
})();
