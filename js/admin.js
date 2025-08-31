// Dados simulados para administração
const adminData = {
    reservations: [
        { id: 1, court: 'Quadra 01', sport: 'Vôlei de Praia', date: '2025-01-10', time: '18:00-19:00', status: 'pending', price: 80, user: { name: 'João Silva', email: 'joao.silva@email.com', phone: '(17) 99999-9999', whatsapp: '5517999999999' }, players: 4, paymentMethod: 'pix', created: '2025-01-09T10:30:00' },
        { id: 2, court: 'Quadra 03', sport: 'Futevôlei', date: '2025-01-11', time: '19:00-20:00', status: 'confirmed', price: 80, user: { name: 'Maria Santos', email: 'maria.santos@email.com', phone: '(17) 88888-8888', whatsapp: '5517888888888' }, players: 2, paymentMethod: 'cartao', created: '2025-01-08T15:20:00' },
        { id: 3, court: 'Quadra 02', sport: 'Beach Tênis', date: '2025-01-12', time: '20:00-21:00', status: 'pending', price: 80, user: { name: 'Pedro Costa', email: 'pedro.costa@email.com', phone: '(17) 77777-7777', whatsapp: '5517777777777' }, players: 4, paymentMethod: 'dinheiro', created: '2025-01-09T09:15:00' },
        { id: 4, court: 'Quadra 04', sport: 'Vôlei de Praia', date: '2025-01-13', time: '17:00-18:00', status: 'pending', price: 80, user: { name: 'Ana Lima', email: 'ana.lima@email.com', phone: '(17) 66666-6666', whatsapp: '5517666666666' }, players: 6, paymentMethod: 'pix', created: '2025-01-09T14:45:00' }
    ],
    courts: [
        { id: 1, name: 'QUADRA 01', sport: 'Vôlei de Praia', status: 'active', price: 80 },
        { id: 2, name: 'QUADRA 02', sport: 'Beach Tênis', status: 'active', price: 80 },
        { id: 3, name: 'QUADRA 03', sport: 'Futevôlei', status: 'active', price: 80 },
        { id: 4, name: 'QUADRA 04', sport: 'Vôlei de Praia', status: 'maintenance', price: 80 }
    ],
    sports: [
        { id: 1, name: 'Vôlei de Praia', icon: 'fas fa-volleyball-ball' },
        { id: 2, name: 'Beach Tênis', icon: 'fas fa-table-tennis-paddle-ball' },
        { id: 3, name: 'Futevôlei', icon: 'fas fa-futbol' }
    ],
    users: [
        { id: 1, name: 'João Silva', email: 'joao.silva@email.com', phone: '(17) 99999-9999', plan: 'Premium', created: '2024-12-01' },
        { id: 2, name: 'Maria Santos', email: 'maria.santos@email.com', phone: '(17) 88888-8888', plan: 'Básico', created: '2024-11-15' },
        { id: 3, name: 'Pedro Costa', email: 'pedro.costa@email.com', phone: '(17) 77777-7777', plan: 'Premium', created: '2024-10-20' }
    ],
    settings: {
        hourlyPrice: 80,
        monthlyPrice: 89.90,
        premiumDiscount: 20
    }
};

let currentSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadDashboard();
    updateDashboardCounts();
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

    // Filtro de reservas
    document.getElementById('reservation-filter').addEventListener('change', function() {
        filterReservations(this.value);
    });
}

function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
    
    // Carregar conteúdo específico da seção
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'reservas':
            loadReservations();
            break;
        case 'quadras':
            loadCourts();
            break;
        case 'precos':
            loadPrices();
            break;
        case 'horarios':
            loadSchedules();
            break;
        case 'modalidades':
            loadModalities();
            break;
        case 'usuarios':
            loadUsers();
            break;
    }
}

function loadDashboard() {
    // Carregar reservas recentes na tabela
    const recentTable = document.getElementById('recent-reservations-table');
    recentTable.innerHTML = '';
    
    const recentReservations = adminData.reservations
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .slice(0, 5);
    
    recentReservations.forEach(reservation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reservation.user.name}</td>
            <td>${reservation.court} - ${reservation.sport}</td>
            <td>${formatDate(reservation.date)} ${reservation.time}</td>
            <td><span class="status-badge ${reservation.status}">${getStatusText(reservation.status)}</span></td>
            <td>
                <button class="btn-details" onclick="showReservationDetails(${reservation.id})">Ver</button>
            </td>
        `;
        recentTable.appendChild(row);
    });
}

function loadReservations() {
    const reservationsList = document.getElementById('admin-reservations-list');
    reservationsList.innerHTML = '';

    adminData.reservations.forEach(reservation => {
        const reservationCard = createReservationCard(reservation);
        reservationsList.appendChild(reservationCard);
    });
}

function createReservationCard(reservation) {
    const card = document.createElement('div');
    card.className = `reservation-card ${reservation.status}`;
    
    const paymentMethodText = {
        'pix': 'PIX',
        'cartao': 'Cartão de Crédito',
        'dinheiro': 'Dinheiro'
    };

    card.innerHTML = `
        <div class="reservation-header">
            <div class="reservation-info">
                <h4>${reservation.court} - ${reservation.sport}</h4>
                <span class="status-badge ${reservation.status}">${getStatusText(reservation.status)}</span>
            </div>
        </div>
        
        <div class="user-info">
            <h5><i class="fas fa-user"></i> Informações do Cliente</h5>
            <div class="user-details">
                <div><strong>Nome:</strong> ${reservation.user.name}</div>
                <div><strong>Email:</strong> ${reservation.user.email}</div>
                <div><strong>Telefone:</strong> ${reservation.user.phone}</div>
                <div><strong>WhatsApp:</strong> ${reservation.user.whatsapp}</div>
            </div>
        </div>

        <div class="reservation-details">
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span><strong>Data:</strong> ${formatDate(reservation.date)}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span><strong>Horário:</strong> ${reservation.time}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-users"></i>
                <span><strong>Jogadores:</strong> ${reservation.players}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-credit-card"></i>
                <span><strong>Pagamento:</strong> ${paymentMethodText[reservation.paymentMethod]}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-dollar-sign"></i>
                <span><strong>Valor:</strong> R$ ${reservation.price}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar-plus"></i>
                <span><strong>Solicitado:</strong> ${formatDateTime(reservation.created)}</span>
            </div>
        </div>

        <div class="reservation-actions">
            ${reservation.status === 'pending' ? `
                <button class="btn-accept" onclick="acceptReservation(${reservation.id})">
                    <i class="fas fa-check"></i> Aceitar
                </button>
                <button class="btn-reject" onclick="rejectReservation(${reservation.id})">
                    <i class="fas fa-times"></i> Recusar
                </button>
            ` : ''}
            <a href="https://api.whatsapp.com/send?phone=${reservation.user.whatsapp}&text=Olá ${reservation.user.name}! Sobre sua reserva da ${reservation.court} para o dia ${formatDate(reservation.date)} às ${reservation.time}." 
               class="btn-whatsapp" target="_blank">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </a>
            <button class="btn-details" onclick="showReservationDetails(${reservation.id})">
                <i class="fas fa-eye"></i> Detalhes
            </button>
        </div>
    `;

    return card;
}

function loadCourts() {
    const courtsManagement = document.getElementById('courts-management');
    courtsManagement.innerHTML = '';

    adminData.courts.forEach(court => {
        const courtCard = document.createElement('div');
        courtCard.className = 'price-card';
        courtCard.innerHTML = `
            <h3>${court.name}</h3>
            <p><strong>Modalidade:</strong> ${court.sport}</p>
            <p><strong>Status:</strong> 
                <span class="status-badge ${court.status === 'active' ? 'confirmed' : 'pending'}">
                    ${court.status === 'active' ? 'Ativa' : 'Manutenção'}
                </span>
            </p>
            <div class="price-input">
                <span>R$</span>
                <input type="number" value="${court.price}" min="0" step="0.01" 
                       onchange="updateCourtPrice(${court.id}, this.value)">
            </div>
            <div style="margin-top: 15px;">
                <button class="btn-save-price" onclick="toggleCourtStatus(${court.id})">
                    ${court.status === 'active' ? 'Desativar' : 'Ativar'}
                </button>
            </div>
        `;
        courtsManagement.appendChild(courtCard);
    });
}

function loadPrices() {
    document.getElementById('hourly-price').value = adminData.settings.hourlyPrice;
    document.getElementById('monthly-price').value = adminData.settings.monthlyPrice;
    document.getElementById('premium-discount').value = adminData.settings.premiumDiscount;
}

function loadModalities() {
    const modalitiesGrid = document.getElementById('modalities-grid');
    modalitiesGrid.innerHTML = '';

    adminData.sports.forEach(sport => {
        const sportCard = document.createElement('div');
        sportCard.className = 'price-card';
        sportCard.innerHTML = `
            <h3><i class="${sport.icon}"></i> ${sport.name}</h3>
            <div style="margin-top: 20px;">
                <button class="btn-save-price" onclick="editModality(${sport.id})">Editar</button>
                <button class="btn-reject" onclick="deleteModality(${sport.id})" style="margin-left: 10px;">Excluir</button>
            </div>
        `;
        modalitiesGrid.appendChild(sportCard);
    });
}

function loadUsers() {
    const usersTable = document.getElementById('users-table');
    usersTable.innerHTML = '';

    adminData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td><span class="status-badge ${user.plan === 'Premium' ? 'confirmed' : 'pending'}">${user.plan}</span></td>
            <td>${formatDate(user.created)}</td>
            <td>
                <button class="btn-details" onclick="editUser(${user.id})">Editar</button>
                <button class="btn-reject" onclick="deleteUser(${user.id})" style="margin-left: 5px;">Excluir</button>
            </td>
        `;
        usersTable.appendChild(row);
    });
}

// Funções de ação
function acceptReservation(id) {
    const reservation = adminData.reservations.find(r => r.id === id);
    if (reservation && confirm(`Aceitar a reserva de ${reservation.user.name}?`)) {
        reservation.status = 'confirmed';
        loadReservations();
        updateDashboardCounts();
        alert('Reserva aceita com sucesso!');
    }
}

function rejectReservation(id) {
    const reservation = adminData.reservations.find(r => r.id === id);
    if (reservation && confirm(`Recusar a reserva de ${reservation.user.name}?`)) {
        reservation.status = 'cancelled';
        loadReservations();
        updateDashboardCounts();
        alert('Reserva recusada.');
    }
}

function showReservationDetails(id) {
    const reservation = adminData.reservations.find(r => r.id === id);
    if (!reservation) return;

    const modal = document.getElementById('reservationModal');
    const detailsDiv = document.getElementById('reservation-details');
    
    const paymentMethodText = {
        'pix': 'PIX',
        'cartao': 'Cartão de Crédito',
        'dinheiro': 'Dinheiro'
    };

    detailsDiv.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <div>
                <h4>Informações da Reserva</h4>
                <p><strong>Quadra:</strong> ${reservation.court}</p>
                <p><strong>Modalidade:</strong> ${reservation.sport}</p>
                <p><strong>Data:</strong> ${formatDate(reservation.date)}</p>
                <p><strong>Horário:</strong> ${reservation.time}</p>
                <p><strong>Jogadores:</strong> ${reservation.players}</p>
                <p><strong>Valor:</strong> R$ ${reservation.price}</p>
                <p><strong>Pagamento:</strong> ${paymentMethodText[reservation.paymentMethod]}</p>
                <p><strong>Status:</strong> <span class="status-badge ${reservation.status}">${getStatusText(reservation.status)}</span></p>
            </div>
            <div>
                <h4>Dados do Cliente</h4>
                <p><strong>Nome:</strong> ${reservation.user.name}</p>
                <p><strong>Email:</strong> ${reservation.user.email}</p>
                <p><strong>Telefone:</strong> ${reservation.user.phone}</p>
                <p><strong>WhatsApp:</strong> ${reservation.user.whatsapp}</p>
                <p><strong>Solicitado em:</strong> ${formatDateTime(reservation.created)}</p>
                
                <div style="margin-top: 20px;">
                    <a href="https://api.whatsapp.com/send?phone=${reservation.user.whatsapp}&text=Olá ${reservation.user.name}! Sobre sua reserva..." 
                       class="btn-whatsapp" target="_blank" style="width: 100%; justify-content: center;">
                        <i class="fab fa-whatsapp"></i> Conversar no WhatsApp
                    </a>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

function closeReservationModal() {
    document.getElementById('reservationModal').classList.remove('show');
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

function updateDashboardCounts() {
    const pendingCount = adminData.reservations.filter(r => r.status === 'pending').length;
    const confirmedCount = adminData.reservations.filter(r => r.status === 'confirmed').length;
    
    document.getElementById('pending-count').textContent = pendingCount;
    document.getElementById('confirmed-count').textContent = confirmedCount;
}

function saveHourlyPrice() {
    const price = document.getElementById('hourly-price').value;
    adminData.settings.hourlyPrice = parseFloat(price);
    alert('Preço por hora atualizado com sucesso!');
}

function saveMonthlyPrice() {
    const price = document.getElementById('monthly-price').value;
    adminData.settings.monthlyPrice = parseFloat(price);
    alert('Preço mensal atualizado com sucesso!');
}

function savePremiumDiscount() {
    const discount = document.getElementById('premium-discount').value;
    adminData.settings.premiumDiscount = parseInt(discount);
    alert('Desconto premium atualizado com sucesso!');
}

function updateCourtPrice(courtId, newPrice) {
    const court = adminData.courts.find(c => c.id === courtId);
    if (court) {
        court.price = parseFloat(newPrice);
        alert(`Preço da ${court.name} atualizado para R$ ${newPrice}`);
    }
}

function toggleCourtStatus(courtId) {
    const court = adminData.courts.find(c => c.id === courtId);
    if (court) {
        court.status = court.status === 'active' ? 'maintenance' : 'active';
        loadCourts();
        alert(`${court.name} ${court.status === 'active' ? 'ativada' : 'desativada'} com sucesso!`);
    }
}

// Funções auxiliares
function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendente',
        'confirmed': 'Confirmada',
        'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'});
}

function logout() {
    if (confirm('Tem certeza que deseja sair do painel administrativo?')) {
        window.location.href = 'index.html';
    }
}

// Funções de placeholder para desenvolvimento futuro
function editUser(id) { alert('Funcionalidade em desenvolvimento.'); }
function deleteUser(id) { alert('Funcionalidade em desenvolvimento.'); }
function editModality(id) { alert('Funcionalidade em desenvolvimento.'); }
function deleteModality(id) { alert('Funcionalidade em desenvolvimento.'); }
function showAddCourtModal() { alert('Funcionalidade em desenvolvimento.'); }
function showAddModalityModal() { alert('Funcionalidade em desenvolvimento.'); }
function loadSchedules() { alert('Funcionalidade em desenvolvimento.'); }
