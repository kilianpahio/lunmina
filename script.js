/* ============================================================
   LUNMINA — script.js
   Nav sticky + burger · smooth scroll · scroll reveal ·
   FAQ accordéon · validation du formulaire (sans backend)
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Nav : ombre au scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 20) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 2. Menu mobile (burger) ---------- */
  var burger = document.getElementById("navBurger");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
    burger.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", function () {
    var open = burger.classList.toggle("is-open");
    navLinks.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  navLinks.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ---------- 3. Smooth scroll (avec offset nav) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ---------- 4. Scroll reveal (fade-in des sections) ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function checkReveals() {
    var trigger = window.innerHeight * 0.9;
    for (var i = reveals.length - 1; i >= 0; i--) {
      var el = reveals[i];
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add("is-visible");
        reveals.splice(i, 1);
      }
    }
  }
  // On n'active le fondu que dans un vrai navigateur (où rAF tourne).
  // Sinon (capture statique, impression…) le contenu reste visible par défaut.
  requestAnimationFrame(function () {
    document.documentElement.classList.add("reveal-anim");
    checkReveals();
    window.addEventListener("scroll", checkReveals, { passive: true });
    window.addEventListener("resize", checkReveals, { passive: true });
    window.addEventListener("load", checkReveals);
    // filet de sécurité : tout révéler peu après
    setTimeout(checkReveals, 1200);
  });

  /* ---------- 4b. Aperçu live : mise à l'échelle des iframes ---------- */
  function scaleEmbeds() {
    document.querySelectorAll(".folio-live[data-embed]").forEach(function (box) {
      var iframe = box.querySelector("iframe");
      if (!iframe) return;
      var w = box.clientWidth;
      if (!w) return;
      var base = 1280;
      var s = w / base;
      iframe.style.transform = "scale(" + s + ")";
      box.style.height = Math.round(800 * s) + "px";
    });
  }
  scaleEmbeds();
  window.addEventListener("load", scaleEmbeds);
  window.addEventListener("resize", scaleEmbeds);
  setTimeout(scaleEmbeds, 600);

  /* ---------- 5. FAQ accordéon ---------- */
  var accItems = document.querySelectorAll(".acc-item");
  accItems.forEach(function (item) {
    var btn = item.querySelector(".acc-item__q");
    var panel = item.querySelector(".acc-item__a");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("is-open");
      // ferme tout
      accItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".acc-item__q").setAttribute("aria-expanded", "false");
        other.querySelector(".acc-item__a").style.maxHeight = null;
      });
      // ouvre le cliqué s'il était fermé
      if (!isOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- 6. Validation du formulaire ---------- */
  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");

  function setError(field, msg) {
    var wrap = field.closest(".field");
    wrap.classList.add("is-error");
    var span = wrap.querySelector(".field__error");
    if (span) span.textContent = msg;
  }
  function clearError(field) {
    var wrap = field.closest(".field");
    wrap.classList.remove("is-error");
    var span = wrap.querySelector(".field__error");
    if (span) span.textContent = "";
  }
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // efface l'erreur dès que l'utilisateur corrige
  form.querySelectorAll("input, select, textarea").forEach(function (el) {
    el.addEventListener("input", function () { clearError(el); });
    el.addEventListener("change", function () { clearError(el); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var project = form.elements.project; // RadioNodeList (cases à cocher multiples)
    var message = form.elements.message;

    if (!name.value.trim()) { setError(name, "Merci d'indiquer votre nom."); ok = false; }
    if (!email.value.trim()) { setError(email, "Merci d'indiquer votre email."); ok = false; }
    else if (!isEmail(email.value.trim())) { setError(email, "Cette adresse email semble invalide."); ok = false; }
    var projectChecked = form.querySelectorAll('input[name="project"]:checked').length;
    if (projectChecked === 0) { setError(form.querySelector('input[name="project"]'), "Choisissez au moins une formule."); ok = false; }
    if (message.value.trim().length < 10) { setError(message, "Quelques mots de plus nous aideraient (10 caractères min)."); ok = false; }

    if (!ok) {
      var firstError = form.querySelector(".field.is-error input, .field.is-error select, .field.is-error textarea");
      if (firstError) firstError.focus();
      return;
    }

    // Pas de backend : on simule l'envoi
    success.hidden = false;
    form.querySelector('button[type="submit"]').textContent = "Demande envoyée ✓";
    form.querySelector('button[type="submit"]').disabled = true;
    setTimeout(function () {
      form.reset();
    }, 400);
  });

  /* ---------- 7. Année dynamique (footer) ---------- */
  var yearSpan = document.querySelector(".footer__bottom span");
  if (yearSpan) yearSpan.textContent = "© " + new Date().getFullYear() + " Lunmina. Tous droits réservés.";
})();
