export function scrollSmooth() {
  window.scrollBy({
    top: Math.min(window.innerHeight * 0.85, 480),
    behavior: "smooth",
  });
}
