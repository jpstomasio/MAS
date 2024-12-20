// Função para alternar entre temas
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    document.getElementById("dark_mode_toggle").checked = isDarkMode;
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    updateTheme();
}

// Função para sincronizar o tema com base no estado armazenado
function updateTheme() {
    const darkMode = localStorage.getItem('darkMode');
    const isDarkMode = darkMode === 'enabled';

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.getElementById("dark_mode_toggle").checked = true; // Atualiza o botão
    } else {
        document.body.classList.remove("dark-mode");
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.getElementById("dark_mode_toggle").checked = false; // Atualiza o botão
    }
}

// Aplica o tema ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateTheme(); // Garante que o bot�o e o tema est�o sincronizados
});
