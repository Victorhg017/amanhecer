document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const scene = document.getElementById('sunrise-scene');
    const romanticTextElement = document.getElementById('romantic-text');
    const editBtn = document.getElementById('edit-btn');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const copyBtn = document.getElementById('copy-btn');
    const copyFeedback = document.getElementById('copy-feedback');

    // Modal de Edição
    const editModal = document.getElementById('edit-modal');
    const textEditor = document.getElementById('text-editor');
    const charCounter = document.getElementById('char-counter');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    // Canvas para Renderização
    const canvas = document.getElementById('render-canvas');
    const ctx = canvas.getContext('2d');

    // --- CONFIGURAÇÃO INICIAL ---
    // ##################################################################
    // ## PARA ALTERAR A FRASE PADRÃO, EDITE O TEXTO ABAIXO ##
    // ##################################################################
    const defaultText = "Quando meus olhos repousaram sobre sua figura, senti irradiar dela uma luz tão intensa que lembrei o próprio sol em seu auge. E então me perguntei: como poderia um simples mortal ousar estender a mão para conquistar o astro que todos veneram? Se os deuses me concedessem tal graça, cada aurora seria diferente; ao despertar, não veria o nascer do sol que banha montes e templos, mas sim o fulgor da jovem cuja beleza se iguala ao próprio astro.";
    
    romanticTextElement.innerText = defaultText;

    // --- GERAÇÃO DE PARTÍCULAS ---
    function createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particle.style.animationDuration = `${Math.random() * 3 + 4}s`;
            scene.appendChild(particle);
        }
    }
    createParticles();

    // --- FUNCIONALIDADE DE EDIÇÃO ---
    editBtn.addEventListener('click', () => {
        textEditor.value = romanticTextElement.innerText;
        updateCharCounter();
        editModal.style.display = 'flex';
    });

    cancelEditBtn.addEventListener('click', () => {
        editModal.style.display = 'none';
    });

    saveEditBtn.addEventListener('click', () => {
        romanticTextElement.innerText = textEditor.value;
        editModal.style.display = 'none';
    });

    textEditor.addEventListener('input', updateCharCounter);

    function updateCharCounter() {
        charCounter.textContent = `${textEditor.value.length} / ${textEditor.maxLength}`;
    }

    // --- FUNCIONALIDADE DE COPIAR ---
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(romanticTextElement.innerText).then(() => {
            copyFeedback.textContent = 'Copiado!';
            copyBtn.style.borderColor = '#28a745';
            copyBtn.style.color = '#28a745';
            setTimeout(() => {
                copyFeedback.textContent = 'Copiar';
                copyBtn.style.borderColor = '';
                copyBtn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Falha ao copiar texto: ', err);
            alert('Não foi possível copiar o texto.');
        });
    });

    // --- FUNCIONALIDADE DE COMPARTILHAMENTO (WHATSAPP) ---
    shareBtn.addEventListener('click', () => {
        const text = encodeURIComponent(romanticTextElement.innerText);
        
        if (navigator.share) {
            navigator.share({
                title: 'Uma Mensagem Para Você',
                text: romanticTextElement.innerText,
            }).catch(console.error);
        } else {
            const whatsappUrl = `https://api.whatsapp.com/send?text=${text}`;
            window.open(whatsappUrl, '_blank');
        }
    });

    // --- FUNCIONALIDADE DE DOWNLOAD (RENDERIZAÇÃO NO CANVAS) ---
    downloadBtn.addEventListener('click', () => {
        renderSceneToCanvas().then(() => {
            const link = document.createElement('a');
            link.download = 'declaracao_aurora.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Efeito de flash
            document.body.classList.add('flash');
            setTimeout(() => document.body.classList.remove('flash'), 300);
        });
    });

    async function renderSceneToCanvas() {
        const width = 1200;
        const height = 800;
        canvas.width = width;
        canvas.height = height;

        // 1. Desenhar o fundo (gradiente estático do nascer do sol)
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#f3904f');
        gradient.addColorStop(0.25, '#f9ac63');
        gradient.addColorStop(0.5, '#fde68a');
        gradient.addColorStop(1, '#e0e1dd');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // 2. Desenhar o sol
        const sunX = width / 2;
        const sunY = height * 0.75;
        const sunRadius = 75;
        
        const sunGradient = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.5, sunX, sunY, sunRadius);
        sunGradient.addColorStop(0, '#fff7b3');
        sunGradient.addColorStop(1, 'rgba(255, 204, 0, 0)');
        ctx.fillStyle = sunGradient;
        ctx.fillRect(0, 0, width, height); // Preenche a área com o brilho
        
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius / 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffcc00';
        ctx.fill();

        // 3. Desenhar a névoa
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(0, height - 100, width, 100);
        ctx.fillRect(0, height - 120, width, 70);


        // 4. Desenhar o texto sobre uma caixa translúcida
        const text = romanticTextElement.innerText;
        const padding = 40;
        const textContainerMaxWidth = 600;
        const boxX = (width - textContainerMaxWidth) / 2;
        const boxY = height * 0.15;
        const boxHeight = height * 0.55;

        // Caixa de texto
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        // A função roundRect não é universal, então desenhamos manualmente
        ctx.beginPath();
        ctx.moveTo(boxX + 15, boxY);
        ctx.lineTo(boxX + textContainerMaxWidth - 15, boxY);
        ctx.quadraticCurveTo(boxX + textContainerMaxWidth, boxY, boxX + textContainerMaxWidth, boxY + 15);
        ctx.lineTo(boxX + textContainerMaxWidth, boxY + boxHeight - 15);
        ctx.quadraticCurveTo(boxX + textContainerMaxWidth, boxY + boxHeight, boxX + textContainerMaxWidth - 15, boxY + boxHeight);
        ctx.lineTo(boxX + 15, boxY + boxHeight);
        ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - 15);
        ctx.lineTo(boxX, boxY + 15);
        ctx.quadraticCurveTo(boxX, boxY, boxX + 15, boxY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Configurações do texto
        ctx.fillStyle = '#ffffff';
        ctx.font = "22px 'Cinzel', serif";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Quebra de linha manual para o texto
        const words = text.split(' ');
        let line = '';
        const lines = [];
        const maxWidth = textContainerMaxWidth - (padding * 2);

        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        
        const lineHeight = 35;
        const startY = boxY + (boxHeight / 2) - (lines.length * lineHeight / 2);

        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i].trim(), width / 2, startY + (i * lineHeight));
        }
    }
});