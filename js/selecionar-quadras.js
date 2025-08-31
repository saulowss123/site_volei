let selectedCourt = null;
let selectedDay = null;
let selectedTime = null;
let currentStep = 'court';

// Dados de exemplo dos horários ocupados
const occupiedSlots = {
    'domingo': ['09:00', '14:00', '19:00'],
    'segunda': ['10:00', '16:00'],
    'terca': ['11:00', '15:00', '20:00'],
    'quinta': ['08:00', '17:00'],
    'sexta': ['12:00', '18:00', '21:00'],
    'sabado': ['09:00', '13:00', '16:00', '19:00']
};

// Horários disponíveis (das 8h às 22h)
const availableHours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

// Informações das quadras
const courtsInfo = {
    'quadra-01': { name: 'QUADRA 01', type: 'Vôlei de Praia' },
    'quadra-02': { name: 'QUADRA 02', type: 'Beach Tênis' },
    'quadra-03': { name: 'QUADRA 03', type: 'Futevôlei' },
    'quadra-04': { name: 'QUADRA 04', type: 'Vôlei de Praia' }
};

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateProgressSteps();
});

function setupEventListeners() {
    // Funcionalidade de busca
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const courtItems = document.querySelectorAll('.court-item');
            
            courtItems.forEach(item => {
                const courtName = item.querySelector('h3').textContent.toLowerCase();
                const courtType = item.querySelector('.court-type').textContent.toLowerCase();
                
                if (courtName.includes(searchTerm) || courtType.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

function selectCourt(courtId) {
    // Remove seleção anterior
    document.querySelectorAll('.court-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    // Seleciona a quadra clicada
    event.target.closest('.court-item').classList.add('selected');
    selectedCourt = courtId;
    
    // Atualiza resumo
    updateCourtSummary();
    
    // Avança para próximo passo
    setTimeout(() => {
        goToStep('step-day');
        generateWeekDays();
    }, 500);
}

function goToStep(stepId) {
    // Esconde todos os passos
    document.querySelectorAll('.step-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostra o passo atual
    document.getElementById(stepId).classList.add('active');
    
    // Atualiza progresso
    const stepMap = {
        'step-court': 'court',
        'step-day': 'day', 
        'step-time': 'time',
        'step-login': 'login'
    };
    
    currentStep = stepMap[stepId];
    updateProgressSteps();
}

function goBackToStep(stepId) {
    goToStep(stepId);
    
    // Limpa seleções dependendo do passo
    if (stepId === 'step-court') {
        selectedCourt = null;
        selectedDay = null;
        selectedTime = null;
        clearAllSummary();
    } else if (stepId === 'step-day') {
        selectedDay = null;
        selectedTime = null;
        clearDayTimeSummary();
    } else if (stepId === 'step-time') {
        selectedTime = null;
        clearTimeSummary();
    }
}

function generateWeekDays() {
    const daysGrid = document.getElementById('days-grid');
    const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const fullDayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    
    daysGrid.innerHTML = '';
    
    const today = new Date();
    
    days.forEach((day, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        
        const occupiedToday = occupiedSlots[day] || [];
        const availableCount = availableHours.length - occupiedToday.length;
        const isAvailable = availableCount > 0;
        
        const dayCard = document.createElement('div');
        dayCard.className = `day-card ${isAvailable ? 'available' : 'occupied'}`;
        dayCard.onclick = isAvailable ? () => selectDay(day, fullDayNames[index], date, dayCard) : null;
        
        dayCard.innerHTML = `
            <div class="day-name">${dayNames[index]}</div>
            <div class="day-date">${date.getDate()}/${(date.getMonth() + 1).toString().padStart(2, '0')}</div>
            <div class="day-status ${isAvailable ? 'available-status' : 'occupied-status'}">
                ${isAvailable ? `${availableCount} vagas` : 'Ocupado'}
            </div>
        `;
        
        daysGrid.appendChild(dayCard);
    });
}

function selectDay(day, fullDayName, dateObj, dayElement) {
    // Remove seleção anterior
    document.querySelectorAll('.day-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Seleciona o dia
    dayElement.classList.add('selected');
    selectedDay = { key: day, name: fullDayName, date: dateObj };
    
    // Atualiza resumo
    updateDaySummary();
    
    // Avança para próximo passo
    setTimeout(() => {
        goToStep('step-time');
        generateTimeSlots(day);
    }, 500);
}

function generateTimeSlots(day) {
    const timeGrid = document.getElementById('time-grid');
    timeGrid.innerHTML = '';
    
    const occupiedToday = occupiedSlots[day] || [];
    
    availableHours.forEach(time => {
        const isOccupied = occupiedToday.includes(time);
        
        const timeSlot = document.createElement('div');
        timeSlot.className = `time-slot ${isOccupied ? 'occupied' : 'available'}`;
        timeSlot.textContent = time;
        
        if (!isOccupied) {
            timeSlot.onclick = () => selectTime(time, timeSlot);
        }
        
        timeGrid.appendChild(timeSlot);
    });
}

function selectTime(time, timeElement) {
    // Remove seleção anterior
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    
    // Seleciona o horário
    timeElement.classList.add('selected');
    selectedTime = time;
    
    // Atualiza resumo
    updateTimeSummary();
    
    // Avança para tela de login
    setTimeout(() => {
        goToStep('step-login');
    }, 500);
}

// Funções de atualização do resumo
function updateCourtSummary() {
    if (selectedCourt && courtsInfo[selectedCourt]) {
        const courtInfo = courtsInfo[selectedCourt];
        document.getElementById('court-name').textContent = courtInfo.name;
        document.getElementById('court-type').textContent = courtInfo.type;
        document.getElementById('selected-court-summary').style.display = 'block';
    }
}

function updateDaySummary() {
    if (selectedDay) {
        document.getElementById('day-name').textContent = selectedDay.name;
        document.getElementById('day-date').textContent = 
            `${selectedDay.date.getDate()}/${(selectedDay.date.getMonth() + 1).toString().padStart(2, '0')}/${selectedDay.date.getFullYear()}`;
        document.getElementById('selected-day-summary').style.display = 'block';
    }
}

function updateTimeSummary() {
    if (selectedTime) {
        document.getElementById('time-slot').textContent = selectedTime;
        document.getElementById('selected-time-summary').style.display = 'block';
        document.getElementById('price-summary').style.display = 'block';
    }
}

function clearAllSummary() {
    document.getElementById('selected-court-summary').style.display = 'none';
    document.getElementById('selected-day-summary').style.display = 'none';
    document.getElementById('selected-time-summary').style.display = 'none';
    document.getElementById('price-summary').style.display = 'none';
}

function clearDayTimeSummary() {
    document.getElementById('selected-day-summary').style.display = 'none';
    document.getElementById('selected-time-summary').style.display = 'none';
    document.getElementById('price-summary').style.display = 'none';
}

function clearTimeSummary() {
    document.getElementById('selected-time-summary').style.display = 'none';
    document.getElementById('price-summary').style.display = 'none';
}

function updateProgressSteps() {
    const steps = document.querySelectorAll('.progress-step');
    
    steps.forEach((step, index) => {
        const stepData = step.getAttribute('data-step');
        
        // Remove todas as classes
        step.classList.remove('active', 'completed');
        
        if (stepData === currentStep) {
            step.classList.add('active');
        } else {
            // Marca como completo se já passou por este passo
            const stepOrder = ['court', 'day', 'time', 'login'];
            const currentIndex = stepOrder.indexOf(currentStep);
            const stepIndex = stepOrder.indexOf(stepData);
            
            if (stepIndex < currentIndex) {
                step.classList.add('completed');
            }
        }
    });
}
