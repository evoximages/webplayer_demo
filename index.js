'use strict';
(function() {
  function init() {
    var toggleInterior = document.querySelector('.toggle-interior');
    var toggleExterior = document.querySelector('.toggle-exterior');
    toggleExterior.addEventListener('click', handleClick);
    toggleInterior.addEventListener('click', handleClick);
  }

  function handleClick(e) {
    e.preventDefault();
    var selectedScene = e.target.getAttribute('data-scene');
    return setScene(selectedScene);
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
        camera.setAttribute('look-controls', { enabled: true });
        break;
      case 'exterior':
        exteriorScene.setAttribute('visible', true);
        interiorScene.setAttribute('visible', false);
        aScene.setAttribute('rotation', '0 0 0');
        camera.setAttribute('look-controls', { enabled: false });
        camera.object3D.rotation.set(0, 0, 0);
        break;
    }
  }

  init();
})();
