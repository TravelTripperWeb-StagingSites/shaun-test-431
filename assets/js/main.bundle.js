"use strict";

/* replaces jquery document.ready */
Document.prototype.ready = function (callback) {
  if (callback && typeof callback === "function") {
    document.addEventListener("DOMContentLoaded", function () {
      if (document.readyState === "interactive" || document.readyState === "complete") {
        return callback();
      }
    });
  }
};
"use strict";

/**
 * @file Fader
 * @author Shaun Callaghan
 * @version 0.1
 */

/**
 * Fade
 *
 * @param el - dom element to fade
 * @param type - 'in' or 'out' string
 * @param ms - time for fade
 */
function fade(el, type, ms) {
  var isIn = type === "in";
  var opacity = isIn ? 0 : 1;
  var interval = 50;
  var duration = ms;
  var gap = interval / duration;

  if (isIn) {
    el.classList.toggle("hidden");
    el.style.opacity = opacity;
  }

  function fader() {
    opacity = isIn ? opacity + gap : opacity - gap;
    el.style.opacity = opacity;

    if (opacity <= 0) el.classList.add("hidden");
    if (opacity <= 0 || opacity >= 1) window.clearInterval(fading);
  }

  var fading = window.setInterval(fader, interval);
}
"use strict";

/**
 * @file Content Filter
 * @author Shaun Callaghan
 * @version 0.1
 */

/**
 * Filter Setup
 *
 * @param filter - the dom element of the filter nav
 * filterOptions - array of all filter dom element options
 * allItems - array of all items to be filtered - elements with 'filter-item' class
 *
 * adds onClick function to each filter option to display filtered results
 */
function filterSetup(filter) {
  var filterOptions = [].slice.call(filter.getElementsByClassName("filter--option"));
  var allItems = [].slice.call(filter.parentElement.getElementsByClassName("filter-item"));
  var filterValue = void 0;

  filterOptions.forEach(function (option) {
    option.addEventListener("click", function (event) {
      event.preventDefault();
      removeActive(filterOptions);
      option.classList.add("active");
      filterValue = option.getAttribute("data-filter");
      displayItems(filterValue, allItems);
    });
  });
}

/**
 * Display Items
 *
 * @param filterValue - selected filter option as string
 * @param allItems - array of all items with 'filter-item' class
 *
 * filteredItems - all items filtered down to selected filter
 * hiddenItems - all items currently hidden
 *
 * when function runs, all items are hidden, then filtered items are faded in
 *
 * TODO: do not hide ALL items if said items are in next batch of filtered items
 */

function displayItems(filterValue, allItems) {
  var filteredItems = allItems.filter(function (image) {
    return image.getAttribute("data-filter") === filterValue;
  });
  var hiddenItems = allItems.filter(function (image) {
    return image.classList.contains("hidden");
  });

  allItems.forEach(function (image) {
    image.classList.add("hidden");
  });

  if (filterValue === "all") {
    hiddenItems.forEach(function (image) {
      fade(image, "in", 500);
    });
  } else {
    filteredItems.forEach(function (image) {
      fade(image, "in", 500);
    });
  }
}

/**
 *	Remove Active
 *
 * removes active state from filter options
 *
 */
function removeActive(options) {
  options.forEach(function (option) {
    option.classList.remove("active");
  });
}
"use strict";

/**
 * @file lightbox image display
 * @author Shaun Callaghan
 * @version 0.1
 */

/* create global vars */
var lightBox = void 0;
var imageContainer = void 0;
var galleryArray = [];
var arrowRightBox = void 0;
var arrowLeftBox = void 0;

/**
 * Lightbox Setup
 *
 * @param lightboxGallery lightbox gallery container dom element
 * lightboxImages - array of all available images to be shown in lightbox with class 'lightbox-item'
 */
function lightboxSetup(lightboxGallery) {
  var lightboxImages = [].slice.call(lightboxGallery.getElementsByClassName("lightbox-item"));

  createLightbox();
  buildGalleryArray(lightboxImages);
  buildThumbnails(lightboxImages);
  imageBoxSetup(lightboxImages);
}

/**
 * Create Lightbox
 *
 * Builds lightbox element with all the navigation pieces and thumbnail container
 * click listener for closing lightbox
 * click listeners on arrows
 *
 * TODO: clicking outside of image/thumbnail closes lightbox
 * TODO: mobile version of slider - add swiping
 */
function createLightbox() {
  lightBox = document.createElement("div");
  imageContainer = document.createElement("div");
  arrowRightBox = document.createElement("div");
  arrowLeftBox = document.createElement("div");
  var closeBox = document.createElement("div");
  var closeIcon = document.createElement("i");
  var arrowRightIcon = document.createElement("i");
  var arrowLeftIcon = document.createElement("i");
  var thumbContainer = document.createElement("div");
  var thumbList = document.createElement("ul");
  var spinnerIcon = document.createElement("i");

  closeBox.addEventListener("click", function () {
    var img = document.querySelector(".img-active");
    img.parentNode.removeChild(img);
    document.querySelector(".lightbox").classList.add("hidden");
    document.body.classList.remove("no-scroll");
  });

  arrowRightBox.addEventListener("click", function () {
    var index = this.getAttribute("data-id");
    arrowClick(index);
  });

  arrowLeftBox.addEventListener("click", function () {
    var index = this.getAttribute("data-id");
    arrowClick(index);
  });

  closeBox.classList.add("close-box");
  closeIcon.classList.add("fas", "fa-times", "fa-2x");
  arrowRightBox.classList.add("slider-control-arrows__button", "icon-box", "light", "arrow-right");
  arrowLeftBox.classList.add("slider-control-arrows__button", "icon-box", "light", "arrow-left");
  arrowRightIcon.classList.add("fas", "fa-arrow-right");
  arrowLeftIcon.classList.add("fas", "fa-arrow-left");
  spinnerIcon.classList.add("fas", "fa-spinner", "fa-pulse", "fa-3x");
  imageContainer.classList.add("image-container");
  lightBox.classList.add("lightbox", "hidden");
  thumbContainer.classList.add("thumb-container");
  thumbList.classList.add("thumb-list");
  closeBox.appendChild(closeIcon);
  arrowRightBox.appendChild(arrowRightIcon);
  arrowLeftBox.appendChild(arrowLeftIcon);
  thumbContainer.appendChild(thumbList);
  lightBox.appendChild(closeBox);
  lightBox.appendChild(spinnerIcon);
  lightBox.appendChild(arrowRightBox);
  lightBox.appendChild(arrowLeftBox);
  lightBox.appendChild(imageContainer);
  lightBox.appendChild(thumbContainer);
  document.body.appendChild(lightBox);
}

/**
 * Build Gallery Array
 *
 * @param images - array of image elements in lightbox gallery
 *
 * builds array of all information for each image for thumbnails, large version, and which filter it is under
 */
function buildGalleryArray(images) {
  images.forEach(function (image, index) {
    var filter = image.getAttribute("data-filter");
    var thumb = image.getElementsByTagName("img")[0].getAttribute("data-thumb");
    var large = image.getElementsByTagName("img")[0].getAttribute("data-large");
    image.setAttribute("data-id", index);
    galleryArray.push({ filter: filter, thumb: thumb, large: large });
  });
}

/**
 * Build Thumbnails
 *
 * @param images - array of image elements in lightbox gallery
 *
 * creates and adds thumbnails to lightbox thumbnail container
 * adds onClick event to swap current image with clicked thumbnail
 *
 * TODO:
 */
function buildThumbnails(images) {
  var thumbList = document.querySelector(".thumb-list");
  images.forEach(function (image, index) {
    var thumbItem = document.createElement("li");
    var thumb = document.createElement("IMG");
    thumb.src = galleryArray[index].thumb;
    thumbItem.appendChild(thumb);
    thumbItem.setAttribute("data-id", index);
    thumbItem.addEventListener("click", function () {
      swapImage(galleryArray[index].large);
    });
    thumbList.appendChild(thumbItem);
  });
}

/**
 * Image Box Setup
 *
 * @param images - array of image elements in lightbox gallery
 *
 * adds click event to each gallery image to open in the light box
 */
function imageBoxSetup(images) {
  images.forEach(function (image, index) {
    image.setAttribute("data-id", index);
    image.addEventListener("click", function () {
      openLightbox(galleryArray[index].large, index);
    });
  });
}

/**
 * Open Light Box
 *
 * @param url - url of large image
 * @param imageIndex - index of image in array
 *
 * opens lightbox and populates image container with large version of image
 *
 * TODO: Add 'active' to thumbnail in thumbnail container
 */
function openLightbox(url, imageIndex) {
  var popupImage = document.createElement("IMG");
  var imageContainer = document.querySelector(".image-container");
  popupImage.src = url;
  popupImage.classList.add("img-active");
  updateArrows(imageIndex);
  imageContainer.appendChild(popupImage);
  lightBox.classList.toggle("hidden");
  document.body.classList.add("no-scroll");
}

/**
 * Swap Image
 *
 * @param newImageSrc - url of next image to be loaded
 *
 * removes current loaded image in lightbox and loads newly selected image while lightbox is open
 */
function swapImage(newImageSrc) {
  var currentImage = lightBox.querySelector(".img-active");
  var newImage = document.createElement("IMG");
  currentImage.parentNode.removeChild(currentImage);
  newImage.src = newImageSrc;
  newImage.classList.add("img-active");
  imageContainer.appendChild(newImage);
}

/**
 * Update Arrows
 *
 * @param imageIndex - index of current image in image array
 *
 * updates arrow data attributes with next/prev image index
 */
function updateArrows(imageIndex) {
  imageIndex = parseInt(imageIndex);
  if (imageIndex === galleryArray.length) {
    arrowRightBox.setAttribute("data-id", "x");
  } else {
    arrowRightBox.setAttribute("data-id", imageIndex + 1);
  }

  if (imageIndex === 0) {
    arrowLeftBox.setAttribute("data-id", "x");
  } else {
    arrowLeftBox.setAttribute("data-id", imageIndex - 1);
  }
}

/**
 * Arrow Click
 *
 * @param index - index of image to switch to
 *
 * when arrow is clicked, image is swapped to index, and arrows are updated to have new index attributes
 */
function arrowClick(index) {
  swapImage(galleryArray[index].large);
  updateArrows(index);
}
"use strict";

/*
   Settings and other scripts
   ========================================================================== */
var fitImages = document.querySelectorAll("img.objectfit");

function getSticky() {
  var header = document.getElementById("js-navbar--main");

  if (header) {
    var sticky = header.offsetTop;

    if (window.pageYOffset > sticky) {
      header.classList.add("sticky");
    } else {
      header.classList.remove("sticky");
    }
  }
}

window.onscroll = function () {
  getSticky();
};

objectFitImages(fitImages);

document.ready(function () {
  var filter = [].slice.call(document.getElementsByClassName("nav--filter"));
  if (filter.length > 0) {
    filter.forEach(function (filterElement) {
      filterSetup(filterElement);
    });
  }

  var lightboxGalleries = [].slice.call(document.getElementsByClassName("lightbox--gallery"));
  if (lightboxGalleries.length > 0) {
    lightboxGalleries.forEach(function (lightboxGallery) {
      lightboxSetup(lightboxGallery);
    });
  }

  var hamburger = document.getElementsByClassName("navbar__burger");
  hamburgerSetup(hamburger);
});

function hamburgerSetup(hamburger) {
  hamburger[0].addEventListener("click", function () {
    document.getElementById("js-navbar--main").classList.toggle("nav--active");
    this.classList.toggle("is-active");
    document.getElementsByClassName("nav--device")[0].classList.toggle("is-active");
  });
}
