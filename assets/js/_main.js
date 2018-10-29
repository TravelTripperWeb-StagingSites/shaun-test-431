/*
   Settings and other scripts
   ========================================================================== */
const fitImages = document.querySelectorAll("img.objectfit");

function getSticky() {
  const header = document.getElementById("js-navbar--main");

  if (header) {
    const sticky = header.offsetTop;

    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }
}

window.onscroll = () => {
  getSticky();
};

objectFitImages(fitImages);

document.ready(function() {
  const filter = [].slice.call(document.getElementsByClassName("nav--filter"));
  if (filter.length > 0) {
    filter.forEach(function(filterElement) {
      filterSetup(filterElement);
    });
  }

  const lightboxGalleries = [].slice.call(
    document.getElementsByClassName("lightbox--gallery")
  );
  if (lightboxGalleries.length > 0) {
    lightboxGalleries.forEach(function(lightboxGallery) {
      lightboxSetup(lightboxGallery);
    });
  }

  const hamburger = document.getElementsByClassName("navbar__burger");
  hamburgerSetup(hamburger);
});

function hamburgerSetup(hamburger) {
  hamburger[0].addEventListener("click", function() {
    document.getElementById("js-navbar--main").classList.toggle("nav--active");
    this.classList.toggle("is-active");
    document
      .getElementsByClassName("nav--device")[0]
      .classList.toggle("is-active");
  });
}
