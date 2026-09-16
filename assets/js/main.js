// Euro Top — interações leves (menu mobile + revelação suave ao rolar)
// Sem dependências externas. Respeita prefers-reduced-motion via CSS.

document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", function () {
  // Menu mobile
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");

  if (header && toggle) {
    toggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Fecha o menu ao clicar num link (mobile)
    header.querySelectorAll(".main-nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Revelação suave ao rolar a página
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }
});

// Carrossel de banners da Home (assets/img/banners/) — sem dependências
// externas, autoplay lento (6s), pausa em hover/foco e respeita
// prefers-reduced-motion (autoplay desligado, navegação manual continua ok).
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var carousel = document.querySelector(".hero-carousel");
    if (!carousel) return;

    var track = carousel.querySelector(".hero-carousel__track");
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-carousel__slide"));
    var dotsWrap = carousel.querySelector(".hero-carousel__dots");
    var prevBtn = carousel.querySelector(".hero-carousel__arrow--prev");
    var nextBtn = carousel.querySelector(".hero-carousel__arrow--next");
    if (!track || slides.length < 2) return;

    var index = 0;
    var autoplayMs = 6000;
    var timer = null;
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "hero-carousel__dot";
        dot.setAttribute("aria-label", "Ir para banner " + (i + 1));
        dot.addEventListener("click", function () {
          goTo(i);
          resetAutoplay();
        });
        dotsWrap.appendChild(dot);
      });
      dots = Array.prototype.slice.call(dotsWrap.children);
    }

    function update() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
      });
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }

    function next() {
      goTo(index + 1);
    }

    function prev() {
      goTo(index - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        next();
        resetAutoplay();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prev();
        resetAutoplay();
      });
    }

    function startAutoplay() {
      if (reduceMotion) return;
      stopAutoplay();
      timer = setInterval(next, autoplayMs);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function resetAutoplay() {
      startAutoplay();
    }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    update();
    startAutoplay();
  });
})();
