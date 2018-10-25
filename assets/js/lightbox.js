/**
 * @file lightbox image display
 * @author Shaun Callaghan
 * @version 0.1
 */

/* create global vars */
let lightBox;
let imageContainer;
let galleryArray = [];
let arrowRightBox;
let arrowLeftBox;

/**
 * Lightbox Setup
 *
 * @param lightboxGallery lightbox gallery container dom element
 * lightboxImages - array of all available images to be shown in lightbox with class 'lightbox-item'
 */
function lightboxSetup(lightboxGallery) {
  const lightboxImages = [].slice.call(
    lightboxGallery.getElementsByClassName("lightbox-item")
  );

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
  let closeBox = document.createElement("div");
  let closeIcon = document.createElement("i");
  let arrowRightIcon = document.createElement("i");
  let arrowLeftIcon = document.createElement("i");
  let thumbContainer = document.createElement("div");
  let thumbList = document.createElement("ul");
  let spinnerIcon = document.createElement("i");

  closeBox.addEventListener("click", function() {
    let img = document.querySelector(".img-active");
    img.parentNode.removeChild(img);
    document.querySelector(".lightbox").classList.add("hidden");
    document.body.classList.remove("no-scroll");
  });

  arrowRightBox.addEventListener("click", function() {
    let index = this.getAttribute("data-id");
    arrowClick(index);
  });

  arrowLeftBox.addEventListener("click", function() {
    let index = this.getAttribute("data-id");
    arrowClick(index);
  });

  closeBox.classList.add("close-box");
  closeIcon.classList.add("fas", "fa-times", "fa-2x");
  arrowRightBox.classList.add(
    "slider-control-arrows__button",
    "icon-box",
    "light",
    "arrow-right"
  );
  arrowLeftBox.classList.add(
    "slider-control-arrows__button",
    "icon-box",
    "light",
    "arrow-left"
  );
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
  images.forEach(function(image, index) {
    let filter = image.getAttribute("data-filter");
    let thumb = image.getElementsByTagName("img")[0].getAttribute("data-thumb");
    let large = image.getElementsByTagName("img")[0].getAttribute("data-large");
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
  let thumbList = document.querySelector(".thumb-list");
  images.forEach(function(image, index) {
    let thumbItem = document.createElement("li");
    let thumb = document.createElement("IMG");
    thumb.src = galleryArray[index].thumb;
    thumbItem.appendChild(thumb);
    thumbItem.setAttribute("data-id", index);
    thumbItem.addEventListener("click", function() {
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
  images.forEach(function(image, index) {
    image.setAttribute("data-id", index);
    image.addEventListener("click", function() {
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
  let popupImage = document.createElement("IMG");
  let imageContainer = document.querySelector(".image-container");
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
  let currentImage = lightBox.querySelector(".img-active");
  let newImage = document.createElement("IMG");
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
