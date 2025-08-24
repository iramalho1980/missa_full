// Variáveis globais
let draggedElement = null;
let missaItems = [];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeDragAndDrop();
    updateMissaDisplay();
    initializeCollapsibleSections();
});

// Inicializar seções recolhíveis
function initializeCollapsibleSections() {
    // Todos os quadros começam recolhidos
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        card.classList.remove('expanded');
    });
}

// Alternar seção (expandir/recolher)
function toggleSection(headerElement) {
    const sectionCard = headerElement.closest('.section-card');
    const isExpanded = sectionCard.classList.contains('expanded');
    
    if (isExpanded) {
        sectionCard.classList.remove('expanded');
    } else {
        sectionCard.classList.add('expanded');
        // Reinicializar drag and drop para os novos itens visíveis
        setTimeout(() => {
            initializeDragAndDropForSection(sectionCard);
        }, 100);
    }
}

// Inicializar drag and drop para uma seção específica
function initializeDragAndDropForSection(sectionCard) {
    const items = sectionCard.querySelectorAll('.item');
    items.forEach(item => {
        // Remover listeners existentes para evitar duplicação
        item.removeEventListener('dragstart', handleDragStart);
        item.removeEventListener('dragend', handleDragEnd);
        
        // Adicionar novos listeners
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });
}

// Inicializar funcionalidade de arrastar e soltar
function initializeDragAndDrop() {
    // Adicionar event listeners para todos os itens
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Adicionar event listeners para containers
    const containers = document.querySelectorAll('.items-content, .missa-container');
    containers.forEach(container => {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragenter', handleDragEnter);
        container.addEventListener('dragleave', handleDragLeave);
    });
}

// Função chamada quando o usuário começa a arrastar um item
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    
    // Armazenar dados do item sendo arrastado
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.dataTransfer.setData('item-id', e.target.getAttribute('data-item'));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Prevenir que o clique do drag interfira com o onclick
    e.stopPropagation();
}

// Função chamada quando o usuário termina de arrastar
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

// Função chamada quando um item é arrastado sobre um container
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
}

// Função chamada quando um item entra em um container
function handleDragEnter(e) {
    e.preventDefault();
    const target = e.target;
    
    if (target.classList.contains('items-content') || target.classList.contains('missa-container')) {
        target.classList.add('drag-over');
    }
}

// Função chamada quando um item sai de um container
function handleDragLeave(e) {
    const target = e.target;
    
    if (target.classList.contains('items-content') || target.classList.contains('missa-container')) {
        // Verificar se realmente saiu do container (não apenas mudou para um filho)
        const rect = target.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            target.classList.remove('drag-over');
        }
    }
}

// Função chamada quando um item é solto em um container
function handleDrop(e) {
    e.preventDefault();
    const target = e.target;
    target.classList.remove('drag-over');
    
    // Verificar se foi solto no container da missa
    if (target.classList.contains('missa-container') || target.id === 'missa-container') {
        const itemText = e.dataTransfer.getData('text/plain');
        const itemId = e.dataTransfer.getData('item-id');
        
        if (itemText && itemId) {
            // Verificar se o item já existe na missa
            const existingItem = missaItems.find(item => item.id === itemId);
            if (!existingItem) {
                // Adicionar item à missa
                const newItem = {
                    id: itemId,
                    text: itemText.trim(),
                    originalElement: draggedElement
                };
                missaItems.push(newItem);
                updateMissaDisplay();
            }
        }
    }
}

// Atualizar a exibição da missa
function updateMissaDisplay() {
    const missaContainer = document.getElementById('missa-container');
    
    if (missaItems.length === 0) {
        missaContainer.innerHTML = '<div class="empty-state">Arraste os itens aqui para organizar a missa</div>';
        return;
    }
    
    missaContainer.innerHTML = '';
    
    missaItems.forEach((item, index) => {
        const missaItem = document.createElement('div');
        missaItem.className = 'missa-item';
        missaItem.draggable = true;
        missaItem.setAttribute('data-index', index);
        
        missaItem.innerHTML = `
            <span onclick="openPDFFromMissa('${item.text.replace(/'/g, '\\\'')}')">${item.text}</span>
            <button class="delete-btn" onclick="removeFromMissa(${index})">Remover</button>
        `;
        
        // Adicionar event listeners para reordenação
        missaItem.addEventListener('dragstart', handleMissaDragStart);
        missaItem.addEventListener('dragover', handleMissaDragOver);
        missaItem.addEventListener('drop', handleMissaDrop);
        missaItem.addEventListener('dragend', handleMissaDragEnd);
        
        missaContainer.appendChild(missaItem);
    });
}

// Funções para reordenação dentro da missa
function handleMissaDragStart(e) {
    e.dataTransfer.setData('missa-index', e.target.getAttribute('data-index'));
    e.target.style.opacity = '0.5';
    e.stopPropagation();
}

function handleMissaDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleMissaDragOver(e) {
    e.preventDefault();
}

function handleMissaDrop(e) {
    e.preventDefault();
    const draggedIndex = parseInt(e.dataTransfer.getData('missa-index'));
    const targetElement = e.target.closest('.missa-item');
    
    if (targetElement) {
        const targetIndex = parseInt(targetElement.getAttribute('data-index'));
        
        if (draggedIndex !== targetIndex && !isNaN(draggedIndex) && !isNaN(targetIndex)) {
            // Reordenar itens
            const draggedItem = missaItems[draggedIndex];
            missaItems.splice(draggedIndex, 1);
            missaItems.splice(targetIndex, 0, draggedItem);
            updateMissaDisplay();
        }
    }
}

// Remover item da missa
function removeFromMissa(index) {
    if (index >= 0 && index < missaItems.length) {
        missaItems.splice(index, 1);
        updateMissaDisplay();
    }
}

// Abrir PDF em popup
function openPDF(title) {
    // Prevenir que o drag interfira com o clique
    if (draggedElement) {
        return;
    }
    
    const popup = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const pdfViewer = document.getElementById('pdf-viewer');
    
    popupTitle.textContent = title;
    
    // Como não temos PDFs reais, vamos simular com uma página de exemplo
    const pdfUrl = generatePDFUrl(title);
    pdfViewer.src = pdfUrl;
    
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Abrir PDF a partir da missa
function openPDFFromMissa(title) {
    openPDF(title);
}

// Gerar URL do PDF (simulação)
function generatePDFUrl(title) {
    const encodedTitle = encodeURIComponent(title);
    return `data:text/html,<html><head><title>${encodedTitle}</title><style>body{font-family:'Ubuntu',Arial,sans-serif;padding:40px;background:linear-gradient(135deg,#f8f9fa 0%,#e9ecef 100%);margin:0;min-height:100vh;}</style></head><body><div style="max-width:800px;margin:0 auto;"><h1 style="color:#333;text-align:center;margin-bottom:30px;font-weight:300;font-size:2.5rem;background:linear-gradient(135deg,#ffd700 0%,#ffed4e 50%,#ffd700 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">${title}</h1><div style="background:rgba(255,255,255,0.9);backdrop-filter:blur(10px);padding:40px;border-radius:20px;box-shadow:0 8px 32px rgba(0,0,0,0.1);border:1px solid rgba(255,255,255,0.2);"><h2 style="color:#666;border-bottom:2px solid #ffd700;padding-bottom:15px;margin-bottom:25px;font-weight:400;">Letra da Música</h2><div style="line-height:2;color:#444;font-size:16px;"><p><strong>Verso 1:</strong></p><p style="margin-left:20px;font-style:italic;">Esta é uma simulação da letra da música "<strong>${title}</strong>".</p><p style="margin-left:20px;font-style:italic;">Em uma implementação real, aqui seria exibido</p><p style="margin-left:20px;font-style:italic;">o conteúdo do PDF correspondente à música selecionada.</p><br><p><strong>Refrão:</strong></p><p style="margin-left:20px;font-style:italic;">Você pode substituir este conteúdo</p><p style="margin-left:20px;font-style:italic;">pelos PDFs reais das músicas</p><p style="margin-left:20px;font-style:italic;">do seu repertório litúrgico.</p><br><p><strong>Verso 2:</strong></p><p style="margin-left:20px;font-style:italic;">Para uma experiência completa,</p><p style="margin-left:20px;font-style:italic;">adicione os arquivos PDF reais</p><p style="margin-left:20px;font-style:italic;">na pasta do projeto.</p></div><div style="margin-top:40px;padding:25px;background:rgba(255,215,0,0.1);border-left:4px solid #ffd700;border-radius:0 10px 10px 0;"><p style="margin:0;font-style:italic;color:#666;font-size:14px;"><strong>Nota:</strong> Para implementar com PDFs reais, substitua a função <code>generatePDFUrl()</code> no arquivo <code>script.js</code> pelos caminhos corretos dos seus arquivos PDF.</p></div></div></div></body></html>`;
}

// Fechar popup
function closePopup() {
    const popup = document.getElementById('popup-overlay');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fechar popup ao clicar fora do conteúdo
document.addEventListener('DOMContentLoaded', function() {
    const popupOverlay = document.getElementById('popup-overlay');
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
    }
});

// Fechar popup com a tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
});

// Função para adicionar novos itens dinamicamente
function addNewItem(section, itemText, itemId) {
    const sectionCard = document.querySelector(`[data-section="${section}"]`);
    if (sectionCard) {
        const itemsContent = sectionCard.querySelector('.items-content');
        if (itemsContent) {
            const newItem = document.createElement('div');
            newItem.className = 'item';
            newItem.draggable = true;
            newItem.setAttribute('data-item', itemId);
            newItem.textContent = itemText;
            newItem.onclick = () => openPDF(itemText);
            
            // Adicionar event listeners
            newItem.addEventListener('dragstart', handleDragStart);
            newItem.addEventListener('dragend', handleDragEnd);
            
            itemsContent.appendChild(newItem);
        }
    }
}

// Função para exportar a ordem da missa
function exportMissaOrder() {
    const order = missaItems.map(item => ({
        id: item.id,
        text: item.text
    }));
    
    console.log('Ordem da Missa:', order);
    return order;
}

// Função para importar uma ordem de missa salva
function importMissaOrder(savedOrder) {
    missaItems = savedOrder.map(item => ({
        id: item.id,
        text: item.text,
        originalElement: null
    }));
    updateMissaDisplay();
}

// Função para expandir todas as seções
function expandAllSections() {
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        card.classList.add('expanded');
        initializeDragAndDropForSection(card);
    });
}

// Função para recolher todas as seções
function collapseAllSections() {
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        card.classList.remove('expanded');
    });
}

// Adicionar funcionalidade de toque para dispositivos móveis
function addTouchSupport() {
    let touchItem = null;
    let touchOffset = { x: 0, y: 0 };
    let isDragging = false;
    
    document.addEventListener('touchstart', function(e) {
        const item = e.target.closest('.item, .missa-item');
        if (item && item.draggable) {
            touchItem = item;
            isDragging = false;
            const touch = e.touches[0];
            const rect = item.getBoundingClientRect();
            touchOffset.x = touch.clientX - rect.left;
            touchOffset.y = touch.clientY - rect.top;
        }
    });
    
    document.addEventListener('touchmove', function(e) {
        if (touchItem) {
            e.preventDefault();
            isDragging = true;
            const touch = e.touches[0];
            
            touchItem.style.position = 'fixed';
            touchItem.style.zIndex = '1000';
            touchItem.style.pointerEvents = 'none';
            touchItem.style.left = (touch.clientX - touchOffset.x) + 'px';
            touchItem.style.top = (touch.clientY - touchOffset.y) + 'px';
            touchItem.classList.add('dragging');
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (touchItem) {
            if (isDragging) {
                const touch = e.changedTouches[0];
                const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
                const dropTarget = elementBelow?.closest('.missa-container');
                
                if (dropTarget && touchItem.classList.contains('item')) {
                    const itemText = touchItem.textContent.trim();
                    const itemId = touchItem.getAttribute('data-item');
                    
                    if (itemId && !missaItems.find(item => item.id === itemId)) {
                        const newItem = {
                            id: itemId,
                            text: itemText,
                            originalElement: touchItem
                        };
                        missaItems.push(newItem);
                        updateMissaDisplay();
                    }
                }
            }
            
            // Resetar estilos
            touchItem.style.position = '';
            touchItem.style.zIndex = '';
            touchItem.style.left = '';
            touchItem.style.top = '';
            touchItem.style.pointerEvents = '';
            touchItem.classList.remove('dragging');
            
            // Se não foi um drag, tratar como clique
            if (!isDragging && touchItem.onclick) {
                touchItem.onclick();
            }
            
            touchItem = null;
            isDragging = false;
        }
    });
}

// Inicializar suporte a toque
addTouchSupport();

// Função para limpar a missa
function clearMissa() {
    missaItems = [];
    updateMissaDisplay();
}

// Adicionar atalhos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E para expandir todas as seções
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        expandAllSections();
    }
    
    // Ctrl/Cmd + R para recolher todas as seções
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        collapseAllSections();
    }
    
    // Ctrl/Cmd + L para limpar a missa
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        if (confirm('Deseja limpar toda a programação da missa?')) {
            clearMissa();
        }
    }
});

