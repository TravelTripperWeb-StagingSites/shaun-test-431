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
  let isIn = type === "in";
  let opacity = isIn ? 0 : 1;
  let interval = 50;
  let duration = ms;
  let gap = interval / duration;

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

  let fading = window.setInterval(fader, interval);
}
