(function () {
  "use strict";

  /* =====================================================
     ELEMENTOS BASE
  ===================================================== */
  const header = document.querySelector(".header");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav a");
  const sections = document.querySelectorAll("section[id]");
  const form = document.getElementById("leadForm");
  const feedback = document.getElementById("formFeedback");

  /* =====================================================
     1. MENU RESPONSIVO PREMIUM
  ===================================================== */
  if (menuToggle && navMenu) {

    const closeMenu = () => {
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "auto";
    };

    const openMenu = () => {
      navMenu.classList.add("active");
      menuToggle.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    menuToggle.addEventListener("click", () => {
      navMenu.classList.contains("active") ? closeMenu() : openMenu();
    });

    navLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* =====================================================
     2. HEADER DINÂMICO NO SCROLL
  ===================================================== */
  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 60) {
      header.style.background = "rgba(11,15,26,0.95)";
      header.style.padding = "14px 0";
      header.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
    } else {
      header.style.background = "rgba(11,15,26,0.85)";
      header.style.padding = "20px 0";
      header.style.boxShadow = "none";
    }
  };

  window.addEventListener("scroll", updateHeader);

  /* =====================================================
     3. SCROLL SUAVE COM OFFSET INTELIGENTE
  ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = target.offsetTop - headerHeight - 10;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });

  /* =====================================================
     4. REVEAL ON SCROLL
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
     5. NAV ACTIVE LINK (OTIMIZADO)
  ===================================================== */
  let ticking = false;

  const updateActiveLink = () => {
    let currentSection = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;

      if (
        window.scrollY >= sectionTop &&
        window.scrollY < sectionTop + sectionHeight
      ) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
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

  /* =====================================================
     6. FORM VALIDAÇÃO + WHATSAPP
  ===================================================== */
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

      const numeroPersonal = "5511999999999"; // ALTERAR

      const mensagem = encodeURIComponent(
`Olá! Me chamo ${nome}.
Quero agendar minha avaliação gratuita.
E-mail: ${email}`
      );

      setTimeout(() => {
        window.location.href = `https://wa.me/${numeroPersonal}?text=${mensagem}`;
      }, 900);
    });
  }

})();