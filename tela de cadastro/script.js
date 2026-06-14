document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroForm");
    const cpfInput = document.getElementById("cpf");

    cpfInput.addEventListener("input", function (e) {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, "$1.$2");
        }
        
        e.target.value = value;
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log("Dados prontos para envio:", data);
        alert("Cadastro simulado com sucesso! Verifique o console.");
        
    });
});