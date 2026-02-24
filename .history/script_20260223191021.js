(function () {
  "use strict";

  /* =====================================================
     1. MENU RESPONSIVO COM ACESSIBILIDADE
  ===================================================== */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isActive = navMenu.classList.toggle("active");

      // Atualiza aria-expanded para acessibilidade
      menuToggle.setAttribute("aria-expanded", isActive);

      // Impede scroll do body quando menu aberto
      document.body.style.overflow = isActive ? "hidden" : "auto";
    });

    // Fecha menu ao clicar em link
    document.querySelectorAll(".nav-menu a").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "auto";
      });
    });
  }

  /* =====================================================
     2. SCROLL SUAVE COM OFFSET DO HEADER
  ===================================================== */
  const header = document.querySelector("header");

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
     3. REVEAL ON SCROLL (OTIMIZADO)
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
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback simples
    reveals.forEach(el => el.classList.add("active"));
  }

  /* =====================================================
     4. CONTADOR ANIMADO
  ===================================================== */
  const counter = document.querySelector(".counter-number");

  if (counter) {
    const target = parseInt(counter.dataset.target, 10);
    let current = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animateCounter = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      current = Math.floor(progress * target);
      counter.textContent = current.toLocaleString("pt-BR");

      if (progress < 1) {
        requestAnimationFrame(animateCounter);
      } else {
        counter.textContent = target.toLocaleString("pt-BR");
      }
    };

    const counterObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        requestAnimationFrame(animateCounter);
        counterObserver.disconnect();
      }
    }, { threshold: 0.6 });

    counterObserver.observe(counter);
  }

  /* =====================================================
     5. VALIDAÇÃO AVANÇADA + REDIRECIONAMENTO WHATSAPP
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

      // Reset visual
      feedback.style.color = "#ff4d4d";
      feedback.textContent = "";

      /* ===== Validações ===== */

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

      /* ===== Sucesso ===== */
      feedback.style.color = "#00FF99";
      feedback.textContent = "Redirecionando para o WhatsApp...";

      /* ===== Disparo de Pixel ===== */

      // Meta Pixel
      if (typeof fbq === "function") {
        fbq("track", "Lead");
      }

      // Google Ads (exemplo)
      if (typeof gtag === "function") {
        gtag("event", "conversion", {
          event_category: "Lead",
          event_label: "Form Landing"
        });
      }

      /* ===== Redirecionamento WhatsApp ===== */

      const numeroPersonal = "5511999999999"; // ⚠️ ALTERE AQUI
      const mensagem = encodeURIComponent(
        `Olá! Me chamo ${nome}.\nQuero agendar minha avaliação gratuita.\nE-mail: ${email}`
      );

      setTimeout(() => {
        window.location.href = `https://wa.me/${numeroPersonal}?text=${mensagem}`;
      }, 1200);
    });
  }

})();