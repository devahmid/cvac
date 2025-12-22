// Fallback JS: set --vh CSS variable to handle mobile Safari 100vh issues
(function(){
  function setVh(){
    document.documentElement.style.setProperty('--vh',(window.innerHeight*0.01)+'px');
  }
  setVh();
  window.addEventListener('resize', setVh);
})();
