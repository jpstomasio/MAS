// Load activities state from localStorage or set the initial state

const activityDetails = {
    'yoga-class': { 
        fullName: 'Aula de Ioga Avançada', 
        instructor: 'Treinadora Isabel', 
        description: 'Aula focada...', 
        location: 'Pavilhão Aristides Hall', 
        schedule: 'Segunda-feira às 17:00', 
        duration: '1 hora', 
        difficulty: 'Intermediário',
        equipment: 'Tapete de yoga, roupa confortável', 
        additionalInfo: 'Recomendado para pessoas com experiência em yoga.' 
    },
    'zumba-class': { 
        fullName: 'Aula de Zumba Fitness', 
        instructor: 'Treinador Marcelino', 
        description: 'Aula de dança energética...', 
        location: 'Pavilhão Aristides Hall', 
        schedule: 'Terça-feira às 17:00', 
        duration: '45 minutos', 
        difficulty: 'Todos os níveis', 
        equipment: 'Roupa confortável, sapatilhas de dança', 
        additionalInfo: 'Ótimo para queima de calorias.' 
    },
    'group-walk': { 
        fullName: 'Caminhada em Grupo', 
        instructor: 'Treinador Carlos', 
        description: 'Caminhada relaxante...', 
        location: 'Pista de Atletismo', 
        schedule: 'Quarta-feira às 14:30', 
        duration: '1 hora', 
        difficulty: 'Baixa', 
        equipment: 'Calçado confortável, água', 
        additionalInfo: 'Adequado para todas as idades.' 
    },  
    'spinning-class': {
        fullName: 'Aula de Spinning Avançada',
        instructor: 'Treinadora Isabel',
        description: 'Sessão de ciclismo indoor focada em resistência cardiovascular, força e queima calórica.',
        location: 'Pavilhão Aristides Hall',
        schedule: 'Segunda-feira às 17:00',
        duration: '1 hora',
        difficulty: 'Avançado',
        equipment: 'Toalha, garrafa de água',
        additionalInfo: 'Recomendado para praticantes com boa resistência física e experiência em ciclismo indoor.'
    },
    'squash-class': {
        fullName: 'Aula de Squash Fitness',
        instructor: 'Treinador Marcelino',
        description: 'Sessão dinâmica focada em técnicas de squash, resistência física e agilidade.',
        location: 'Pavilho Aristides Hall',
        schedule: 'Terça-feira às 17:00',
        duration: '45 minutos',
        difficulty: 'Todos os níveis',
        equipment: 'Roupa desportiva, sapatilhas desportivas, raquete de squash',
        additionalInfo: 'Ideal para melhorar a coordenação, reflexos e condicionamento físico.'
    },
    'pilates-class': {
        fullName: 'Aula de Pilates',
        instructor: 'Instrutora Ana',
        description: 'Aula focada no fortalecimento muscular, flexibilidade e controle da respiração através de exercícios suaves.',
        location: 'Sala de Pilates',
        schedule: 'Segunda-feira às 10:00',
        duration: '1 hora',
        difficulty: 'Todos os níveis',
        equipment: 'Roupas confortáveis, tapete de Pilates',
        additionalInfo: 'Ideal para quem busca melhorar a postura e o equilíbrio, adequado para iniciantes e praticantes experientes.'
    }
}

function loadActivities() {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
        return JSON.parse(savedActivities);
    }
    // Default state if no data is found in localStorage
    return {
        'yoga-class': { name: 'Aula de Ioga', vagas: 15, enrolled: false, category: 'indoor' },
        'zumba-class': { name: 'Aula de Zumba', vagas: 10, enrolled: false, category: 'indoor' },
        'group-walk': { name: 'Caminhada em Grupo', vagas: 20, enrolled: false, category: 'outdoor' },
        'spinning-class': { name: 'Aula de Spinning', vagas: 30, enrolled: false, category: 'indoor' },
        'pilates-class': { name: 'Aula de Pilates', vagas: 25, enrolled: false, category: 'indoor' },
        'squash-class': {name: 'Aula de Squash', vagas: 16, enrolled: false, category: 'indoor'},
        'capoeira-class': { name: 'Aula de Capoeira', vagas: 15, enrolled: false, category: 'indoor' },
        'self-defense': { name: 'Aula de Defesa Pessoal', vagas: 40, enrolled: false, category: 'outdoor' }
    };
}

// Save activities state to localStorage
function saveActivities() {
    localStorage.setItem('activities', JSON.stringify(activities));
}

// Initialize activities from localStorage
let activities = loadActivities();

// Unified Enrollment Function
function toggleEnrollment(activityId) {
    const activityCard = document.getElementById(activityId);
    const statusElement = activityCard.querySelector('.activity-status');
    const enrollButton = activityCard.querySelector('.enroll');

    if (activities[activityId].enrolled) {
        // Unsubscribe
        activities[activityId].vagas++;
        activities[activityId].enrolled = false;

        activityCard.classList.remove('enrolled');
        statusElement.textContent = `Vagas disponíveis: ${activities[activityId].vagas}`;
        statusElement.classList.remove('enrolled');
        statusElement.classList.add('available');

        enrollButton.textContent = 'Inscrever-se';
        enrollButton.classList.remove('btn-warning');
        enrollButton.classList.add('btn-success');

        alert(`Inscrição anulada na atividade ${activities[activityId].name}`);
    } else {
        // Subscribe
        if (activities[activityId].vagas > 0) {
            activities[activityId].vagas--;
            activities[activityId].enrolled = true;

            activityCard.classList.add('enrolled');
            statusElement.textContent = `Vagas disponíveis: ${activities[activityId].vagas}`;
            statusElement.classList.remove('available');
            statusElement.classList.add('enrolled');

            enrollButton.textContent = 'Anular Inscrição';
            enrollButton.classList.remove('btn-success');
            enrollButton.classList.add('btn-warning');

            alert(`Inscrição confirmada na atividade ${activities[activityId].name}!`);

            if (activities[activityId].vagas === 0) {
                statusElement.classList.remove('enrolled');
                statusElement.classList.add('full');
                statusElement.textContent = 'Sem vagas';
                enrollButton.disabled = true;
            }
        } else {
            alert('Não há vagas disponíveis para esta atividade.');
        }
    }

    // Save to localStorage
    saveActivities();
}

// Function to initialize enrollment buttons
function initializeEnrollment() {
    for (const activityId in activities) {
        const activityCard = document.getElementById(activityId);
        if (!activityCard) continue;

        const statusElement = activityCard.querySelector('.activity-status');
        const enrollButton = activityCard.querySelector('.enroll');

        if (activities[activityId].enrolled) {
            activityCard.classList.add('enrolled');
            statusElement.textContent = `Vagas disponíveis: ${activities[activityId].vagas}`;
            statusElement.classList.remove('available');
            statusElement.classList.add('enrolled');

            enrollButton.textContent = 'Anular Inscrição';
            enrollButton.classList.remove('btn-success');
            enrollButton.classList.add('btn-warning');
        } else {
            statusElement.textContent = `Vagas disponíveis: ${activities[activityId].vagas}`;
            statusElement.classList.add('available');

            enrollButton.textContent = 'Inscrever-se';
            enrollButton.classList.remove('btn-warning');
            enrollButton.classList.add('btn-success');
        }
    }
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.btn-group button');
    const activityCards = document.querySelectorAll('.activity-card');

    // Reset all buttons to outline style
    function resetButtonStyles() {
        filterButtons.forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline-primary');
        });
    }

    // Show all activities
    function showAllActivities() {
        activityCards.forEach(card => {
            card.style.display = 'block';
        });
    }

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset button styles and highlight current button
            resetButtonStyles();
            this.classList.remove('btn-outline-primary');
            this.classList.add('btn-primary');

            // Reset to show all activities first
            showAllActivities();

            
            }
        );
    });
}

// Load data on page load
document.addEventListener('DOMContentLoaded', function () {
    initializeEnrollment();
    setupFilterButtons();
});

// Unified Modal Information Function
function showMoreInfo(activityId) {
    const details = activityDetails[activityId];

    if (!details) {
        console.error(`No details found for activityId: ${activityId}`);
        return;
    }

    const modalBody = document.getElementById('activityModalBody');
    const modalTitle = document.getElementById('activityModalLabel');

    // Update modal content
    modalTitle.textContent = details.fullName; // Set the modal title
    modalBody.innerHTML = `
    <div class="row">
        <div class="col-md-6">
            <h6><strong>Instrutor:</strong></h6>
            <p>${details.instructor}</p>
            <h6><strong>Descrição:</strong></h6>
            <p>${details.description}</p>
            <h6><strong>Local:</strong></h6>
            <p>${details.location}</p>
        </div>
        <div class="col-md-6">
            <h6><strong>Horário:</strong></h6>
            <p>${details.schedule}</p>
            <h6><strong>Duração:</strong></h6>
            <p>${details.duration}</p>
            <h6><strong>Dificuldade:</strong></h6>
            <p>${details.difficulty}</p>
            <h6><strong>Equipamento:</strong></h6>
            <p>${details.equipment}</p>
            <h6><strong>Informações Adicionais:</strong></h6>
            <p>${details.additionalInfo}</p>
        </div>
    </div>
`;

    // Show the Bootstrap modal
    const activityModal = new bootstrap.Modal(document.getElementById('activityModal'));
    activityModal.show();
}


