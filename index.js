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

  function setScene(scene) {
    var aScene = document.getElementById('a-scene');
    var cameraInt = document.getElementById('camera-interior');
    var cameraExt = document.getElementById('camera-exterior');
    var exteriorScene = document.querySelector('.exterior');
    var interiorScene = document.querySelector('.interior');

    switch (scene) {
      case 'interior':
        exteriorScene.setAttribute('visible', false);
        interiorScene.setAttribute('visible', true);
        aScene.setAttribute('rotation', '0 180 0');
        cameraExt.setAttribute('camera', 'active', 'false');
        cameraInt.setAttribute('camera', 'active', 'true');
        break;

      case 'exterior':
        exteriorScene.setAttribute('visible', true);
        interiorScene.setAttribute('visible', false);
        aScene.setAttribute('rotation', '0 0 0');
        cameraExt.setAttribute('camera', 'active', 'true');
        cameraInt.setAttribute('camera', 'active', 'false');
        break;
    }
  }

  init();
})();
