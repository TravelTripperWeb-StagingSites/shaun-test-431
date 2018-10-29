document.ready(function() {
  const subnavElements = [].slice.call(
    document.getElementsByClassName("subnav")
  );
  if (subnavElements.length > 0) {
    subnavElements.forEach(function(subnav) {
      let height = subnav.parentElement.clientHeight;
      subnav.setAttribute(
        "style",
        "transform: translate3d(0px, " + height + "px, 0px);"
      );
    });
  }
});
