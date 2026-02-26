(function () {
  "use strict";

  /* =====================================================
     1. MENU RESPONSIVO (UPGRADE)
  ===================================================== */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("nav");

  if (menuToggle && navMenu) {

    const toggleMenu = () => {
      const isActive = navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isActive);
      document.body.style.overflow = isActive ? "hidden" : "auto";
    };

    menuToggle.addEventListener("click", toggleMenu);

    // Fecha ao clicar em link
    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "auto";
      });
    });

    // Fecha clicando fora
    document.addEventListener("click", (e) => {
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "auto";
      }
    });

    // Fecha com ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "auto";
      }
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
    }, { threshold: 0.15 });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* =====================================================
     4. VALIDAÇÃO + REDIRECIONAMENTO WHATSAPP
  ===================================================== */
  const form = document.getElementById("leadForm");
  const feedback = document.getElementById("formFeedback");

  if (form && feedback) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const telDigits = telefone.replace(/\D/g, "");

      feedback.style.color = "#ffffff";
      feedback.textContent = "";

      if (nome.length < 5 || !/\s/.test(nome)) {
        feedback.textContent = "Digite nome e sobrenome corretamente.";
        return;
      }

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
      }, 1000);
    });
  }

  /* =====================================================
     5. NAV ACTIVE ON SCROLL (PERFORMANCE IMPROVED)
  ===================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav a");

  let ticking = false;

  const updateActiveLink = () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateActiveLink);
      ticking = true;
    }
  });

})();