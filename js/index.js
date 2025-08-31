document.addEventListener('DOMContentLoaded', function() {
    // Filtros de serviços
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona a classe active ao botão clicado
            button.classList.add('active');
            
            // Aqui iria a lógica para filtrar os serviços
            // Por simplicidade, não implementei a funcionalidade completa
        });
    });
});
