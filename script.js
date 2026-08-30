const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});

const revealTargets = document.querySelectorAll(
  ".section, .booking, footer"
);

revealTargets.forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((element) => {
  observer.observe(element);
});

document.querySelectorAll(".price-categories details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    document.querySelectorAll(".price-categories details").forEach((other) => {
      if (other !== detail) {
        other.open = false;
      }
    });
  });
});

document.querySelector("#booking-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const name = formData.get("nombre");
  const service = formData.get("servicio");

  const message = `Hola Luna Bella, soy ${name} y quiero reservar una cita para: ${service}.`;

  window.open(
    `https://wa.me/59175450574?text=${encodeURIComponent(message)}`,
    "_blank"
  );
});