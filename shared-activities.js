// Shared Activity Manager for both pages
const SharedActivityManager = {
    // Get activities from localStorage
    getActivities() {
        const stored = localStorage.getItem('corsano_activities');
        return stored ? JSON.parse(stored) : [];
    },

    // Save activities to localStorage
    saveActivities(activities) {
        localStorage.setItem('corsano_activities', JSON.stringify(activities));
    },

    // Create a new activity card HTML
    createActivityCard(activity) {
        return `
            <div class="col-md-4 activity" data-page="1">
                <div class="activity-card" id="${activity.id}" data-category="${activity.isOutdoor ? 'outdoor' : 'indoor'}">
                    <div class="card">
                        <img src="${activity.imageUrl || '/api/placeholder/400/300'}" class="card-img-top" alt="${activity.name}" style="height:400px">
                        <div class="card-body">
                            <h5 class="card-title">${activity.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Treinador${activity.trainer.toLowerCase().endsWith('a') ? 'a' : ''} ${activity.trainer}</h6>
                            <p class="card-text">
                                ${activity.weekDay} às ${activity.startTime} no ${activity.location}<br>
                                ${activity.description}
                            </p>
                            <div class="activity-status available mb-3">Vagas disponíveis: ${activity.maxParticipants}</div>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-info btn-sm" onclick="showMoreInfo('${activity.id}')">Mais Informações</button>
                                <button class="btn btn-success btn-sm enroll" onclick="toggleEnrollment('${activity.id}')">Inscrever-se</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Format location name for display
    formatLocation(location) {
        const locationMap = {
            'pavilhao': 'Pavilhão Aristides Hall',
            'pista': 'Pista de Atletismo',
            'sala1': 'Sala de Treinos 1',
            'squash': 'Campo de Squash'
        };
        return locationMap[location] || location;
    },

    // Format weekday name for display
    formatWeekDay(weekDay) {
        const weekDayMap = {
            'segunda': 'Segunda-feira',
            'terca': 'Terça-feira',
            'quarta': 'Quarta-feira',
            'quinta': 'Quinta-feira',
            'sexta': 'Sexta-feira'
        };
        return weekDayMap[weekDay] || weekDay;
    },

    // Initialize the activities display page
    initDisplayPage() {
        const activities = this.getActivities();
        const container = document.getElementById('activitiesContainer');
        
        if (container) {
            activities.forEach(activity => {
                // Enhance activity data with formatted strings
                activity.location = this.formatLocation(activity.location);
                activity.weekDay = this.formatWeekDay(activity.weekDay);
                
                // Add the activity card to the container
                const cardHtml = this.createActivityCard(activity);
                container.insertAdjacentHTML('beforeend', cardHtml);
            });
        }
    },

    // Initialize the management page
    initManagementPage() {
        const activities = this.getActivities();
        if (ActivityManager) {
            ActivityManager.activities = activities;
            ActivityManager.updateUI();
        }
    }
};

// Event listener for page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize based on current page
    if (document.getElementById('activitiesContainer')) {
        SharedActivityManager.initDisplayPage();
    } else if (document.getElementById('createActivityForm')) {
        SharedActivityManager.initManagementPage();
    }
});

// Modify existing ActivityManager to use SharedActivityManager
if (typeof ActivityManager !== 'undefined') {
    const originalSaveToStorage = ActivityManager.saveToStorage;
    ActivityManager.saveToStorage = function() {
        originalSaveToStorage.call(this);
        SharedActivityManager.saveActivities(this.activities);
    };
}