document.addEventListener('DOMContentLoaded', function() {
    loadSavedHours();
});

function loadSavedHours() {
    const savedHours = localStorage.getItem('resourceHours');
    if (savedHours) {
        const hoursData = JSON.parse(savedHours);

        document.querySelectorAll('.info-button').forEach(button => {
            const title = button.getAttribute('data-title');
            if (hoursData[title]) {
                const newHorario = hoursData[title];
                button.setAttribute('data-horario', newHorario);

                // Update status badge or other UI elements
                const card = button.closest('.card.resource-card');
                let statusBadge = card.querySelector('.status-badge');

                if (newHorario === 'Indisponível') {
                    if (!statusBadge) {
                        statusBadge = document.createElement('div');
                        statusBadge.className = 'status-badge';
                        card.style.position = 'relative';
                        card.insertBefore(statusBadge, card.firstChild);
                    }
                    statusBadge.textContent = 'Indisponível';
                } else if (statusBadge) {
                    statusBadge.remove();
                }
            }
        });
    }
}