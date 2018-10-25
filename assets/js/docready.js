/* replaces jquery document.ready */
Document.prototype.ready = function(callback) {
  if (callback && typeof callback === "function") {
    document.addEventListener("DOMContentLoaded", function() {
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        return callback();
      }
    });
  }
};
