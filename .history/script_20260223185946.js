 (function() {
            // 1. Menu responsivo animado
            const menuToggle = document.getElementById('menuToggle');
            const navMenu = document.getElementById('navMenu');
            if (menuToggle) {
                menuToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                    // troca ícone opcional
                });
            }
            // fechar menu ao clicar em link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => navMenu.classList.remove('active'));
            });

            // 2. Scroll suave
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if(href === "#") return;
                    const target = document.querySelector(href);
                    if(target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

            // 3. Reveal on scroll
            const reveals = document.querySelectorAll('.reveal');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if(entry.isIntersecting) entry.target.classList.add('active');
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
            reveals.forEach(r => observer.observe(r));

            // 4. Contador animado (alunos transformados)
            const counterEl = document.querySelector('.counter-number');
            if (counterEl) {
                const target = +counterEl.getAttribute('data-target');
                let current = 0;
                const updateCounter = () => {
                    if (current < target) {
                        current += Math.ceil(target / 90); // incremento suave
                        if (current > target) current = target;
                        counterEl.innerText = current;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counterEl.innerText = target;
                    }
                };
                // dispara quando visível
                const counterObserver = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        updateCounter();
                        counterObserver.unobserve(counterEl);
                    }
                }, { threshold: 0.5 });
                counterObserver.observe(counterEl);
            }

            // 5. Validação avançada de formulário
            const form = document.getElementById('leadForm');
            const feedback = document.getElementById('formFeedback');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const nome = document.getElementById('nome').value.trim();
                    const email = document.getElementById('email').value.trim();
                    const tel = document.getElementById('telefone').value.trim();

                    // nome com pelo menos 2 palavras? mínimo 5 caracteres
                    if (nome.length < 5 || !/\s/.test(nome)) {
                        feedback.innerText = 'Digite nome e sobrenome (mínimo 5 caracteres).';
                        return;
                    }
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email) || email.length < 6) {
                        feedback.innerText = 'E-mail inválido.';
                        return;
                    }
                    // telefone: pelo menos 10 dígitos (DDD + número)
                    const telDigits = tel.replace(/\D/g, '');
                    if (telDigits.length < 10 || telDigits.length > 11) {
                        feedback.innerText = 'Telefone deve ter DDD + número (10 ou 11 dígitos).';
                        return;
                    }
                    feedback.style.color = '#00FF99';
                    feedback.innerText = 'Ótimo! Redirecionando para o WhatsApp...';

                    // Aqui pode disparar Pixel (exemplo comentado)
                    // if (typeof fbq === 'function') fbq('track', 'Lead');

                    // simulação: exibe mensagem e reseta
                    setTimeout(() => {
                        form.reset();
                        feedback.innerText = 'Enviamos um link no seu WhatsApp.';
                    }, 2000);
                });
            }
        })();