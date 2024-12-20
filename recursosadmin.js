// Initialize the modal
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
let currentEditButton = null;

// Function to format schedule text
function formatScheduleText() {
    // Get all selected weekdays
    const weekdays = {
        'monday': 'Segunda',
        'tuesday': 'Terça',
        'wednesday': 'Quarta',
        'thursday': 'Quinta',
        'friday': 'Sexta',
        'saturday': 'Sábado',
        'sunday': 'Domingo'
    };

    // Get selected days
    const selectedDays = [];
    Object.keys(weekdays).forEach(day => {
        if (document.getElementById(day).checked) {
            selectedDays.push(weekdays[day]);
        }
    });

    // If no days selected, return empty string
    if (selectedDays.length === 0) return '';

    // Format days range
    let daysText = '';
    if (selectedDays.length === 1) {
        daysText = selectedDays[0];
    } else {
        daysText = `${selectedDays[0]} a ${selectedDays[selectedDays.length - 1]}`;
    }

    // Check if unavailable is checked
    const isIndisponivel = document.getElementById('indisponivelCheck').checked;
    if (isIndisponivel) {
        return 'Indisponível';
    }

    // Get times
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const breakStartTime = document.getElementById('breakStartTime').value;
    const breakEndTime = document.getElementById('breakEndTime').value;

    // Format time ranges
    let timeText = '';
    if (breakStartTime && breakEndTime) {
        timeText = `${startTime}-${breakStartTime} e ${breakEndTime}-${endTime}`;
    } else {
        timeText = `${startTime}-${endTime}`;
    }

    return `${daysText} das ${timeText}`;
}

// Function to parse schedule string and set modal values
function parseScheduleString(scheduleString) {
    // Reset all checkboxes
    document.querySelectorAll('[name="weekdays"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset all time inputs
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('breakStartTime').value = '';
    document.getElementById('breakEndTime').value = '';

    if (scheduleString === 'Indisponível') {
        document.getElementById('indisponivelCheck').checked = true;
        return;
    }

    document.getElementById('indisponivelCheck').checked = false;

    // Parse the schedule string
    const parts = scheduleString.split(' das ');
    if (parts.length !== 2) return;

    // Parse days
    const days = parts[0].split(' a ');
    const weekdayMap = {
        'Segunda': 'monday',
        'Terça': 'tuesday',
        'Quarta': 'wednesday',
        'Quinta': 'thursday',
        'Sexta': 'friday',
        'Sábado': 'saturday',
        'Domingo': 'sunday'
    };

    // Set day checkboxes
    if (days.length === 1) {
        const dayId = weekdayMap[days[0]];
        if (dayId) document.getElementById(dayId).checked = true;
    } else if (days.length === 2) {
        let shouldCheck = false;
        Object.entries(weekdayMap).forEach(([pt, en]) => {
            if (pt === days[0]) shouldCheck = true;
            if (shouldCheck) document.getElementById(en).checked = true;
            if (pt === days[1]) shouldCheck = false;
        });
    }

    // Parse times
    const times = parts[1];
    if (times.includes(' e ')) {
        // Has break time
        const [firstPeriod, secondPeriod] = times.split(' e ');
        const [start, breakStart] = firstPeriod.split('-');
        const [breakEnd, end] = secondPeriod.split('-');

        document.getElementById('startTime').value = start;
        document.getElementById('endTime').value = end;
        document.getElementById('breakStartTime').value = breakStart;
        document.getElementById('breakEndTime').value = breakEnd;
    } else {
        // No break time
        const [start, end] = times.split('-');
        document.getElementById('startTime').value = start;
        document.getElementById('endTime').value = end;
    }
}

// Add click event listeners to all edit buttons
document.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', function() {
        currentEditButton = this;
        const card = this.closest('.card.resource-card');
        const infoButton = card.querySelector('.info-button');
        
        // Get current values and parse them
        const currentHorario = infoButton.getAttribute('data-horario');
        parseScheduleString(currentHorario);
        
        // Show the modal
        editModal.show();
    });
});

// Handle save changes
document.getElementById('saveChanges').addEventListener('click', function() {
    if (currentEditButton) {
        const card = currentEditButton.closest('.card.resource-card');
        const infoButton = card.querySelector('.info-button');
        
        // Format the new schedule text
        const newHorario = formatScheduleText();
        
        // Update the info button's data attribute
        infoButton.setAttribute('data-horario', newHorario);
        
        // Handle status badge
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
        
        // Save to localStorage
        const title = infoButton.getAttribute('data-title');
        saveHours(title, newHorario);
        
        // Update info container if necessary
        const infoContainer = document.getElementById('infoContainer');
        if (infoContainer.classList.contains('active')) {
            const infoTitle = document.getElementById('infoTitle');
            const currentTitle = infoButton.getAttribute('data-title');
            if (infoTitle.textContent === currentTitle) {
                document.getElementById('infoHorario').textContent = `Horário: ${newHorario}`;
            }
        }
    }
    
    // Close the modal
    editModal.hide();
});

// Function to save hours to localStorage
function saveHours(title, hours) {
    const savedHours = localStorage.getItem('resourceHours') || '{}';
    const hoursData = JSON.parse(savedHours);
    hoursData[title] = hours;
    localStorage.setItem('resourceHours', JSON.stringify(hoursData));
}

// Load saved hours on page load
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
                
                // Update status badge
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