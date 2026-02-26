(function () {
  "use strict";

  /* =====================================================
     1. MENU RESPONSIVO
  ===================================================== */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isActive = navMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isActive);
      document.body.style.overflow = isActive ? "hidden" : "auto";
    });

    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "auto";
      });
    });
  }

  /* =====================================================
     2. SCROLL SUAVE COM OFFSET
  ===================================================== */
  const header = document.querySelector(".header");

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 10;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    });
  });

  /* =====================================================
     3. REVEAL ON SCROLL
  ===================================================== */
  const reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     4. VALIDAÇÃO + REDIRECIONAMENTO WHATSAPP
  ===================================================== */
  const form = document.getElementById("leadForm");
  const feedback = document.getElementById("formFeedback");

  if (form && feedback) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const telDigits = telefone.replace(/\D/g, "");

      feedback.style.color = "#ff4d4d";
      feedback.textContent = "";

      if (nome.length < 5 || !/\s/.test(nome)) {
        feedback.textContent = "Digite nome e sobrenome corretamente.";
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.textContent = "Digite um e-mail válido.";
        return;
      }

      if (telDigits.length < 10 || telDigits.length > 11) {
        feedback.textContent = "WhatsApp inválido. Use DDD + número.";
        return;
      }

      feedback.style.color = "#00F5A0";
      feedback.textContent = "Redirecionando para o WhatsApp...";

      const numeroPersonal = "5511999999999"; // ALTERE AQUI

      const mensagem = encodeURIComponent(
        `Olá! Me chamo ${nome}.
Quero agendar minha avaliação gratuita.
E-mail: ${email}`
      );

      setTimeout(() => {
        window.location.href = `https://wa.me/${numeroPersonal}?text=${mensagem}`;
      }, 1200);
    });
  }

})();