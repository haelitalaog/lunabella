
/* ==========================================
   LUNA BELLA - FUNCIONES PRINCIPALES
   ========================================== */

// MENÚ DE NAVEGACIÓN

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
    });
  });
}

// ANIMACIONES

const revealTargets = document.querySelectorAll(
  ".section, .booking, footer"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(element => {
    element.classList.add("reveal");
    observer.observe(element);
  });
}

// RESERVAS POR WHATSAPP

const bookingForm = document.querySelector("#booking-form");

if (bookingForm) {
  bookingForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("nombre");
    const service = formData.get("servicio");

    const config = lbLeer("lunabella_configuracion", {});
    const telefono = String(config.telefono || "75450574").replace(/\D/g, "");
    const numero = telefono.startsWith("591") ? telefono : "591" + telefono;

    const message = `Hola Luna Bella, soy ${name} y quiero reservar una cita para: ${service}.`;

    window.open(
      `https://wa.me/${numero}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  });
}

// ==========================================
// CONEXIÓN CON EL ADMINISTRADOR
// ==========================================

const LB_STORAGE = {
  servicios: "lunabella_servicios",
  productos: "lunabella_productos",
  configuracion: "lunabella_configuracion"
};

function lbLeer(clave, defecto) {
  try {
    const datos = localStorage.getItem(clave);
    return datos ? JSON.parse(datos) : defecto;
  } catch (error) {
    console.error("Error al leer los datos:", error);
    return defecto;
  }
}

function lbEscapar(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, caracter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);
}

function lbCategoria(categoria) {
  const texto = String(categoria || "Otros").toLowerCase();

  if (texto.includes("cabello")) return "Cabello";
  if (texto.includes("uñas") || texto.includes("manos")) return "Manos y uñas";
  if (texto.includes("cejas") || texto.includes("pestañas")) return "Cejas y pestañas";
  if (texto.includes("facial")) return "Tratamientos faciales";
  if (texto.includes("depilación")) return "Depilación";

  return "Otros";
}

// MOSTRAR SERVICIOS EN LA PÁGINA PRINCIPAL

function lbMostrarServicios() {
  const servicios = lbLeer(LB_STORAGE.servicios, []);

  // Si no hay servicios guardados, se conserva el contenido original.
  if (!servicios.length) return;

  const contenedor = document.querySelector("#servicios .service-grid");

  if (contenedor) {
    contenedor.innerHTML = servicios.map((servicio, indice) => `
      <article class="service-card ${indice === 1 ? "feature" : ""}">
        ${servicio.imagen ? `
          <img
            class="lb-service-image"
            src="${servicio.imagen}"
            alt="${lbEscapar(servicio.nombre)}"
            loading="lazy"
          >
        ` : ""}

        <div class="lb-service-content">
          <span class="lb-service-category">
            ${lbEscapar(servicio.categoria)}
          </span>

          <h3>${lbEscapar(servicio.nombre)}</h3>

          <p>${lbEscapar(servicio.descripcion)}</p>

          <div class="lb-service-info">
            <strong>Bs ${Number(servicio.precio).toFixed(2)}</strong>
            <span>
              ${servicio.duracion
                ? lbEscapar(servicio.duracion) + " min"
                : ""}
            </span>
          </div>
        </div>
      </article>
    `).join("");
  }

  lbMostrarPrecios(servicios);
}

// MOSTRAR PRECIOS AGRUPADOS POR CATEGORÍA

function lbMostrarPrecios(servicios) {
  const contenedor = document.querySelector("#precios .price-categories");

  if (!contenedor) return;

  const grupos = {};

  servicios.forEach(servicio => {
    const categoria = lbCategoria(servicio.categoria);

    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }

    grupos[categoria].push(servicio);
  });

  contenedor.innerHTML = Object.entries(grupos).map(([categoria, lista], indice) => `
    <details class="lb-price-category" ${indice === 0 ? "open" : ""}>
      <summary>${lbEscapar(categoria)}</summary>

      <div class="price-items lb-price-items">
        ${lista.map(servicio => `
          <div class="lb-price-row">
            <div>
              <strong>${lbEscapar(servicio.nombre)}</strong>
              <p>${lbEscapar(servicio.descripcion)}</p>
            </div>

            <span>Bs ${Number(servicio.precio).toFixed(2)}</span>
          </div>
        `).join("")}
      </div>
    </details>
  `).join("");
}

// ACORDEÓN DE PRECIOS

document.addEventListener("toggle", event => {
  if (
    event.target.matches(".price-categories details") &&
    event.target.open
  ) {
    document.querySelectorAll(".price-categories details").forEach(other => {
      if (other !== event.target) {
        other.open = false;
      }
    });
  }
}, true);

// ACTUALIZAR AL ABRIR LA PÁGINA

lbMostrarServicios();

// ACTUALIZAR CUANDO CAMBIAN LOS DATOS EN OTRA PESTAÑA

window.addEventListener("storage", event => {
  if (
    event.key === LB_STORAGE.servicios ||
    event.key === null
  ) {
    lbMostrarServicios();
  }
});
