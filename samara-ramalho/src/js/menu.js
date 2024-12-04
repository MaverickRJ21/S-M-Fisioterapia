document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  // Função para alternar o menu
  function toggleMenu() {
    menuToggle.classList.toggle("active");
    menu.classList.toggle("active");
  }

  // Adicionar evento de clique no botão de menu
  menuToggle.addEventListener("click", toggleMenu);

  // Fechar menu quando um link for clicado
  const menuLinks = document.querySelectorAll(".menu a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      menu.classList.remove("active");
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener("click", (event) => {
    const isClickInsideMenu = menu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    if (
      !isClickInsideMenu &&
      !isClickOnToggle &&
      menu.classList.contains("active")
    ) {
      menuToggle.classList.remove("active");
      menu.classList.remove("active");
    }
  });
});
