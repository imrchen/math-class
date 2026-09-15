(function () {
  var tries = 0;
  function sweep() {
    var mj = window.MathJax;
    if (mj && mj.typesetPromise) {
      mj.typesetPromise([document.body]).catch(function () {});
      return true;
    }
    return false;
  }
  if (sweep()) return;
  var timer = setInterval(function () {
    if (sweep() || ++tries > 120) clearInterval(timer);
  }, 100);
})();
