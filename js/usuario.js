// Dados simulados do usuário
const userData = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(17) 99999-9999',
    plan: 'Premium',
    planExpiry: '2025-02-15'
};

// Dados simulados de reservas
const reservationsData = [
    { id: 1, court: 'Quadra 01', sport: 'Vôlei de Praia', date: '2025-01-10', time: '18:00-19:00', status: 'confirmed', price: 80 },
    { id: 2, court: 'Quadra 03', sport: 'Futevôlei', date: '2025-01-11', time: '19:00-20:00', status: 'confirmed', price: 80 },
    { id: 3, court: 'Quadra 02', sport: 'Beach Tênis', date: '2025-01-12', time: '20:00-21:00', status: 'pending', price: 80 },
    { id: 4, court: 'Quadra 04', sport: 'Vôlei de Praia', date: '2025-01-08', time: '17:00-18:00', status: 'cancelled', price: 80 }
];

// Dados simulados de times
const teamsData = [
    { id: 1, name: 'Vôlei dos Amigos', sport: 'Vôlei de Praia', players: ['João Silva', 'Maria Santos', 'Pedro Costa', 'Ana Lima'], created: '2025-01-01' },
    { id: 2, name: 'Futevôlei Master', sport: 'Futevôlei', players: ['João Silva', 'Carlos Mendes'], created: '2024-12-15' }
];

let currentPlayers = [];
let totalCost = 80; // Custo padrão da quadra

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadReservations();
    loadTeams();
    checkPlanExpiry();
});

function setupEventListeners() {
    // Navegação da sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Atualizar navegação ativa
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filtros de reservas
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterReservations(filter);
            
            // Atualizar filtro ativo
            filterButtons.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Formulário de perfil
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });

    // Formulário de criação de time
    document.getElementById('create-team-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createTeam();
    });

    // Input de total de jogadores
    document.getElementById('total-players').addEventListener('input', updateCostDivision);
}

function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById(sectionId).classList.add('active');
}

function loadReservations() {
    const reservationsList = document.getElementById('reservations-list');
    reservationsList.innerHTML = '';

    reservationsData.forEach(reservation => {
        const reservationCard = createReservationCard(reservation);
        reservationsList.appendChild(reservationCard);
    });
}

function createReservationCard(reservation) {
    const card = document.createElement('div');
    card.className = `reservation-card ${reservation.status}`;
    
    const statusText = {
        'confirmed': 'Confirmada',
        'pending': 'Pendente',
        'cancelled': 'Cancelada'
    };

    const statusIcon = {
        'confirmed': 'fas fa-check-circle',
        'pending': 'fas fa-clock',
        'cancelled': 'fas fa-times-circle'
    };

    card.innerHTML = `
        <div class="reservation-header">
            <h4>${reservation.court} - ${reservation.sport}</h4>
            <span class="status ${reservation.status}">
                <i class="${statusIcon[reservation.status]}"></i>
                ${statusText[reservation.status]}
            </span>
        </div>
        <div class="reservation-details">
            <p><i class="fas fa-calendar"></i> ${formatDate(reservation.date)}</p>
            <p><i class="fas fa-clock"></i> ${reservation.time}</p>
            <p><i class="fas fa-money-bill"></i> R$ ${reservation.price}</p>
        </div>
        <div class="reservation-actions">
            ${reservation.status === 'confirmed' ? 
                '<button class="btn-cancel-reservation" onclick="cancelReservation(' + reservation.id + ')">Cancelar</button>' :
                ''
            }
            <button class="btn-details" onclick="showReservationDetails(' + reservation.id + ')">Detalhes</button>
        </div>
    `;

    return card;
}

function filterReservations(filter) {
    const cards = document.querySelectorAll('.reservation-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const hasStatus = card.classList.contains(filter);
            card.style.display = hasStatus ? 'block' : 'none';
        }
    });
}

function loadTeams() {
    const teamsList = document.getElementById('teams-list');
    teamsList.innerHTML = '';

    teamsData.forEach(team => {
        const teamCard = createTeamCard(team);
        teamsList.appendChild(teamCard);
    });
}

function createTeamCard(team) {
    const card = document.createElement('div');
    card.className = 'team-card';
    
    card.innerHTML = `
        <div class="team-header">
            <h4><i class="fas fa-users"></i> ${team.name}</h4>
            <span class="team-sport">${team.sport}</span>
        </div>
        <div class="team-content">
            <p><strong>Jogadores:</strong> ${team.players.length}</p>
            <div class="team-players">
                ${team.players.map(player => `<span class="player-tag">${player}</span>`).join('')}
            </div>
            <p class="team-created">Criado em ${formatDate(team.created)}</p>
        </div>
        <div class="team-actions">
            <button class="btn-edit-team" onclick="editTeam(${team.id})">Editar</button>
            <button class="btn-delete-team" onclick="deleteTeam(${team.id})">Excluir</button>
        </div>
    `;

    return card;
}

function checkPlanExpiry() {
    const expiryDate = new Date(userData.planExpiry);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7 && diffDays > 0) {
        showPlanExpiryNotification(diffDays);
    }
}

function showPlanExpiryNotification(days) {
    const notification = document.createElement('div');
    notification.className = 'plan-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Seu plano Premium vence em ${days} dias. Renove agora para não perder os benefícios!</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.prepend(notification);
}

// Funções do modal de criar time
function showCreateTeamModal() {
    document.getElementById('createTeamModal').classList.add('show');
    currentPlayers = [];
    updatePlayersList();
    updateCostDivision();
}

function closeCreateTeamModal() {
    document.getElementById('createTeamModal').classList.remove('show');
    document.getElementById('create-team-form').reset();
    currentPlayers = [];
    updatePlayersList();
}

function addPlayer() {
    const playerNameInput = document.getElementById('player-name');
    const playerName = playerNameInput.value.trim();
    
    if (playerName && !currentPlayers.includes(playerName)) {
        currentPlayers.push(playerName);
        playerNameInput.value = '';
        updatePlayersList();
        updateCostDivision();
    }
}

function removePlayer(playerName) {
    currentPlayers = currentPlayers.filter(player => player !== playerName);
    updatePlayersList();
    updateCostDivision();
}

function updatePlayersList() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';
    
    currentPlayers.forEach(player => {
        const playerItem = document.createElement('div');
        playerItem.className = 'player-item';
        playerItem.innerHTML = `
            <span>${player}</span>
            <button onclick="removePlayer('${player}')" type="button">
                <i class="fas fa-times"></i>
            </button>
        `;
        playersList.appendChild(playerItem);
    });
}

function updateCostDivision() {
    const totalPlayersInput = document.getElementById('total-players');
    const totalPlayers = parseInt(totalPlayersInput.value) || 0;
    const costDivisionDiv = document.getElementById('cost-division');
    
    if (totalPlayers > 0) {
        const costPerPlayer = totalCost / totalPlayers;
        const remainder = totalCost % totalPlayers;
        
        costDivisionDiv.innerHTML = `
            <h4>Divisão de Custos</h4>
            <div class="cost-info">
                <p><strong>Custo total da quadra:</strong> R$ ${totalCost.toFixed(2)}</p>
                <p><strong>Custo por jogador:</strong> R$ ${costPerPlayer.toFixed(2)}</p>
                ${remainder > 0 ? `<p class="remainder-note">* ${remainder} jogador(es) pagará(ão) R$ ${(costPerPlayer + 0.01).toFixed(2)}</p>` : ''}
            </div>
        `;
    } else {
        costDivisionDiv.innerHTML = '';
    }
}

function createTeam() {
    const teamName = document.getElementById('team-name').value;
    const teamSport = document.getElementById('team-sport').value;
    const totalPlayers = document.getElementById('total-players').value;
    
    if (!teamName || !teamSport || currentPlayers.length === 0) {
        alert('Por favor, preencha todos os campos e adicione pelo menos um jogador.');
        return;
    }
    
    const newTeam = {
        id: Date.now(),
        name: teamName,
        sport: document.querySelector('#team-sport option:checked').textContent,
        players: [...currentPlayers],
        created: new Date().toISOString().split('T')[0]
    };
    
    teamsData.push(newTeam);
    loadTeams();
    closeCreateTeamModal();
    
    alert('Time criado com sucesso!');
}

// Funções auxiliares
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function saveProfile() {
    alert('Perfil atualizado com sucesso!');
}

function cancelReservation(id) {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
        const reservation = reservationsData.find(r => r.id === id);
        if (reservation) {
            reservation.status = 'cancelled';
            loadReservations();
            alert('Reserva cancelada com sucesso!');
        }
    }
}

function showReservationDetails(id) {
    const reservation = reservationsData.find(r => r.id === id);
    if (reservation) {
        alert(`Detalhes da Reserva:\n\nQuadra: ${reservation.court}\nModalidade: ${reservation.sport}\nData: ${formatDate(reservation.date)}\nHorário: ${reservation.time}\nStatus: ${reservation.status}\nPreço: R$ ${reservation.price}`);
    }
}

function editTeam(id) {
    alert('Funcionalidade de editar time em desenvolvimento.');
}

function deleteTeam(id) {
    if (confirm('Tem certeza que deseja excluir este time?')) {
        const index = teamsData.findIndex(t => t.id === id);
        if (index > -1) {
            teamsData.splice(index, 1);
            loadTeams();
            alert('Time excluído com sucesso!');
        }
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        window.location.href = 'index.html';
    }
}
