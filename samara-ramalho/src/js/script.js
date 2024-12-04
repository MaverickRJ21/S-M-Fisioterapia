// Função de debounce para otimizar eventos
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Função principal de inicialização
document.addEventListener("DOMContentLoaded", () => {
  // Seleção de elementos
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");
  const menuLinks = document.querySelectorAll(".menu a");
  const form = document.querySelector(".formulario-contato");
  const navbar = document.querySelector(".navbar");
  const headerContainer = document.querySelector("header.container");
  const languageBtn = document.querySelector(".language-btn");

  // Verificações de existência de elementos
  if (!menuToggle || !menu) {
    console.error("Menu elements not found");
    return;
  }

  // Gerenciamento do menu mobile
  function setupMobileMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      toggleMenu(isExpanded);
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (
        menu.classList.contains("active") &&
        !menu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Fechar menu ao clicar em um link
    menuLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // Função para alternar estado do menu
  function toggleMenu(isCurrentlyExpanded) {
    menuToggle.setAttribute("aria-expanded", !isCurrentlyExpanded);
    menuToggle.setAttribute(
      "aria-label",
      isCurrentlyExpanded ? "Abrir menu" : "Fechar menu"
    );
    menu.classList.toggle("active");
    menuToggle.classList.toggle("active");
    document.body.style.overflow = isCurrentlyExpanded ? "auto" : "hidden";
  }

  // Função para fechar menu
  function closeMenu() {
    menu.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "auto";
  }

  // Efeito de rolagem no navbar
  function setupNavbarScroll() {
    const handleScroll = debounce(() => {
      const scrolled = window.scrollY > 50;
      navbar.classList.toggle("scrolled", scrolled);
      headerContainer.classList.toggle("scrolled", scrolled);
    }, 10);

    window.addEventListener("scroll", handleScroll);
  }

  // Rolagem suave entre seções
  function setupSmoothScroll() {
    menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href").substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          const headerOffset = 100;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          closeMenu();
        }
      });
    });
  }

  // Animações de entrada com Intersection Observer
  function setupEntranceAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Elementos para animar
    const animatedElements = document.querySelectorAll(
      ".hero-content, .service-card, .ebook-card, .depoimento-card"
    );
    animatedElements.forEach((el) => observer.observe(el));
  }

  // Tratamento de formulário de contato
  function setupContactForm() {
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = form.querySelector('input[name="nome"]');
      const telefone = form.querySelector('input[name="telefone"]');
      const email = form.querySelector('input[name="email"]');
      const mensagem = form.querySelector('textarea[name="mensagem"]');

      // Validação de campos
      const fields = [nome, telefone, email, mensagem];
      const emptyFields = fields.filter((field) => !field.value.trim());

      if (emptyFields.length > 0) {
        emptyFields.forEach((field) => field.classList.add("error"));
        alert("Por favor, preencha todos os campos corretamente.");
        return;
      }

      // Limpar erros anteriores
      fields.forEach((field) => field.classList.remove("error"));

      // Envio de formulário (exemplo)
      console.log("Formulário enviado:", {
        nome: nome.value,
        telefone: telefone.value,
        email: email.value,
        mensagem: mensagem.value,
      });

      form.reset();
      alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
    });
  }

  // Interatividade de E-books
  function setupEbookInteraction() {
    const ebookButtons = document.querySelectorAll(".ebook-price .btn");

    ebookButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const ebookCard = e.target.closest(".ebook-card");
        const ebookTitle = ebookCard.querySelector(".ebook-title").textContent;
        const ebookPrice = ebookCard.querySelector(".price").textContent;

        // Lógica de compra (placeholder)
        alert(
          `Você está comprando o e-book: ${ebookTitle}\nPreço: ${ebookPrice}`
        );
      });
    });
  }

  // Destaque de menu ativo
  function setupActiveMenuTracking() {
    const sections = document.querySelectorAll("section[id]");
    const menuLinks = document.querySelectorAll(".menu a");

    function updateActiveMenu() {
      let scrollPosition = window.scrollY;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          menuLinks.forEach((link) => link.classList.remove("active"));
          const activeLink = document.querySelector(
            `.menu a[href="#${sectionId}"]`
          );
          if (activeLink) {
            activeLink.classList.add("active");
          }
        }
      });
    }

    window.addEventListener("scroll", updateActiveMenu);
  }

  // Gerenciamento de depoimentos
  function setupDepoimentos() {
    const depoimentosContainer = document.querySelector(
      ".depoimentos-container"
    );
    if (!depoimentosContainer) return;

    // Adiciona classe de loading inicialmente
    const depoimentoCards = document.querySelectorAll(".depoimento-card");
    depoimentoCards.forEach((card) => card.classList.add("loading"));

    // Remove loading após as imagens carregarem
    const images = depoimentosContainer.querySelectorAll("img");
    let loadedImages = 0;

    function removeLoading() {
      depoimentoCards.forEach((card) => {
        card.classList.remove("loading");
        card.style.opacity = "1";
      });
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === images.length) {
          removeLoading();
        }
      } else {
        img.addEventListener("load", () => {
          loadedImages++;
          if (loadedImages === images.length) {
            removeLoading();
          }
        });
      }
    });

    // Fallback para garantir que o loading será removido
    setTimeout(removeLoading, 2000);
  }

  // Mobile Menu Toggle
  const mobileToggle = document.querySelector(".header-mobile-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

  function toggleMobileMenu() {
    mobileMenu.classList.toggle("active");
  }

  mobileToggle.addEventListener("click", toggleMobileMenu);
  mobileMenuClose.addEventListener("click", toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", toggleMobileMenu);
  });

  // Inicialização de funcionalidades
  setupMobileMenu();
  setupNavbarScroll();
  setupSmoothScroll();
  setupEntranceAnimations();
  setupContactForm();
  setupEbookInteraction();
  setupActiveMenuTracking();
  setupDepoimentos();
});
