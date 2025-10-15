// Sizes and positions the .links-row to exactly overlay the rendered .fixed-photo (tab3)
// without moving the tab image. Runs on load and resize.
(function () {
  function fitLinksRow() {
    var tab = document.querySelector('.fixed-photo');
    var links = document.querySelector('.links-row');
    if (!tab || !links) return;

    var rect = tab.getBoundingClientRect();

    // Position the links-row absolutely in viewport coordinates
    links.style.position = 'fixed';
    links.style.left = rect.left + 'px';
    links.style.top = rect.top + 'px';
    links.style.width = rect.width + 'px';
    links.style.height = rect.height + 'px';
    links.style.transform = 'none';
    links.style.display = 'flex';
    links.style.flexDirection = 'column';
    links.style.alignItems = 'stretch';
  links.style.gap = '0px';
    links.style.overflow = 'hidden';
    // ensure links are above the tab and other overlays but below the custom cursor
    links.style.zIndex = String((function(){
      try{ return (getComputedStyle(document.documentElement).getPropertyValue('--z-cursor')|0) - 1 }catch(e){return 12999}
    })());

    // size children to split the height evenly (account for three 3px gaps)
    var boxes = links.querySelectorAll('.link-box');
  var perHeight = Math.max(0, rect.height / boxes.length);

    boxes.forEach(function (img) {
      img.style.width = '100%';
      img.style.height = perHeight + 'px';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
    });
  }

  window.addEventListener('load', fitLinksRow);
  window.addEventListener('resize', fitLinksRow);
  // also observe for layout changes (fonts/images loading)
  var ro = new ResizeObserver(fitLinksRow);
  ro.observe(document.documentElement);
})();
