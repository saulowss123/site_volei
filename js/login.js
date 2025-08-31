document.addEventListener('DOMContentLoaded', function() {
    // Alternar entre login e cadastro
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Ativar aba clicada
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Mostrar formulário correspondente
            authForms.forEach(form => {
                if (form.id === `${tabId}-form`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        });
    });
    
    // Validação de formulários
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Validação simples
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        // Simulação de login bem-sucedido
        alert('Login realizado com sucesso! Redirecionando para sua conta...');
        // Redirecionar para tela de usuário
        setTimeout(() => {
            window.location.href = 'usuario.html';
        }, 1000);
    });
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        // Validações
        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Por favor, preencha todos os campos.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('As senhas não coincidem.');
            return;
        }
        
        if (!terms) {
            alert('Você deve aceitar os termos de uso.');
            return;
        }
        
        // Simulação de cadastro bem-sucedido
        alert('Conta criada com sucesso! Redirecionando para sua conta...');
        // Redirecionar para tela de usuário
        setTimeout(() => {
            window.location.href = 'usuario.html';
        }, 1000);
    });
    
    // Máscara para telefone
    const phoneInput = document.getElementById('register-phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            if (value.length > 10) {
                value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            }
        }
        
        e.target.value = value;
    });
});
