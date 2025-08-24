// Variáveis globais
let draggedElement = null;
let missaItems = [];
let canticos = {};
let allCanticos = [];

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    loadCanticos();
    initializeDragAndDrop();
    updateMissaDisplay();
    initializeCollapsibleSections();
    initializeSearch();
});

// Carregar lista de cânticos do arquivo JSON
async function loadCanticos() {
    try {
        const response = await fetch('canticos.json');
        canticos = await response.json();
        
        // Criar lista de todos os cânticos para busca
        allCanticos = [];
        Object.keys(canticos).forEach(categoria => {
            canticos[categoria].forEach(cantico => {
                allCanticos.push({
                    nome: formatCanticoName(cantico),
                    categoria: categoria,
                    arquivo: cantico
                });
            });
        });
        
        createSections();
        initializeCollapsibleSections(); // Chamar aqui para garantir que as seções existam
    } catch (error) {
        console.error("Erro ao carregar cânticos:", error);
        createFallbackSections();
    }
}

// Formatar nome do cântico (remover underscores e capitalizar)
function formatCanticoName(filename) {
    return filename
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
}

// Criar seções dinamicamente
function createSections() {
    const sectionsGrid = document.querySelector('.sections-grid');
    sectionsGrid.innerHTML = '';
    
    Object.keys(canticos).forEach(categoria => {
        const sectionCard = document.createElement('div');
        sectionCard.className = 'section-card';
        sectionCard.setAttribute('data-section', categoria);
        
        const itemsHtml = canticos[categoria].map(cantico => {
            const nomeFormatado = formatCanticoName(cantico);
            return `<div class="item" draggable="true" data-item="${cantico}" data-categoria="${categoria}" onclick="openPDF('${nomeFormatado}', '${categoria}', '${cantico}')">${nomeFormatado}</div>`;
        }).join('');
        
        sectionCard.innerHTML = `
            <div class="section-header" onclick="toggleSection(this)">
                <span class="section-title">${categoria}</span>
                <span class="expand-icon">▼</span>
            </div>
            <div class="items-container">
                <div class="items-content">
                    ${itemsHtml}
                </div>
            </div>
        `;
        
        sectionsGrid.appendChild(sectionCard);
    });
    
    // Reinicializar drag and drop após criar as seções
    setTimeout(() => {
        initializeDragAndDrop();
    }, 100);
}

// Criar seções de fallback se o JSON não carregar
function createFallbackSections() {
    const sectionsGrid = document.querySelector('.sections-grid');
    const fallbackSections = [
        'Entrada', 'Ato Penitencial', 'Gloria', 'Aclamação', 
        'Ofertório', 'Santo', 'Cordeiro', 'Comunhão', 
        'Ação de graças', 'Final', 'Marianos', 'Adoração', 'Paz', 'Amem'
    ];
    
    sectionsGrid.innerHTML = '';
    
    fallbackSections.forEach(categoria => {
        const sectionCard = document.createElement('div');
        sectionCard.className = 'section-card';
        sectionCard.setAttribute('data-section', categoria);
        
        sectionCard.innerHTML = `
            <div class="section-header" onclick="toggleSection(this)">
                <span class="section-title">${categoria}</span>
                <span class="expand-icon">▼</span>
            </div>
            <div class="items-container">
                <div class="items-content">
                    <div class="empty-state">Carregue os cânticos para esta seção</div>
                </div>
            </div>
        `;
        
        sectionsGrid.appendChild(sectionCard);
    });
}

// Inicializar funcionalidade de busca
function initializeSearch() {
    const searchBox = document.getElementById('searchBox');
    const searchResults = document.getElementById('searchResults');
    
    searchBox.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const filteredCanticos = allCanticos.filter(cantico => 
            cantico.nome.toLowerCase().includes(query)
        );
        
        if (filteredCanticos.length > 0) {
            searchResults.innerHTML = filteredCanticos.map(cantico => 
                `<div class="search-result-item" onclick="openPDFFromSearch('${cantico.nome}', '${cantico.categoria}', '${cantico.arquivo}')">${cantico.nome} <small>(${cantico.categoria})</small></div>`
            ).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="search-result-item">Nenhum cântico encontrado</div>';
            searchResults.style.display = 'block';
        }
    });
    
    // Fechar resultados ao clicar fora
    document.addEventListener('click', function(e) {
        if (!searchBox.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

// Abrir PDF a partir da busca
function openPDFFromSearch(nome, categoria, arquivo) {
    openPDF(nome, categoria, arquivo);
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('searchBox').value = '';
}

// Inicializar seções recolhíveis
function initializeCollapsibleSections() {
    const sectionCards = document.querySelectorAll(".section-card");
    if (sectionCards.length > 0) {
        // Expandir o primeiro quadro por padrão
        sectionCards[0].classList.add("expanded");
    }
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
    e.dataTransfer.setData('item-categoria', e.target.getAttribute('data-categoria'));
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
        const itemCategoria = e.dataTransfer.getData('item-categoria');
        
        if (itemText && itemId) {
            // Verificar se o item já existe na missa
            const existingItem = missaItems.find(item => item.id === itemId);
            if (!existingItem) {
                // Adicionar item à missa
                const newItem = {
                    id: itemId,
                    text: itemText.trim(),
                    categoria: itemCategoria,
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
            <span class="missa-item-text" onclick="openPDFFromMissa('${item.text.replace(/'/g, '\\\')}', '${item.categoria}', '${item.id}')">${item.text}</span>
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
function openPDF(title, categoria, arquivo) {
    // Prevenir que o drag interfira com o clique
    if (draggedElement) {
        return;
    }
    
    const popup = document.getElementById('popup-overlay');
    const popupTitle = document.getElementById('popup-title');
    const pdfViewer = document.getElementById('pdf-viewer');
    
    popupTitle.textContent = title;
    
    // Construir caminho do PDF
    const pdfUrl = `Letras/${categoria}/${arquivo}.pdf`;
    pdfViewer.src = pdfUrl;
    
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Abrir PDF a partir da missa
function openPDFFromMissa(title, categoria, arquivo) {
    openPDF(title, categoria, arquivo);
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

// Salvar missa no GitHub (localStorage como fallback)
async function saveMissa() {
    if (missaItems.length === 0) {
        alert('Não há itens na missa para salvar.');
        return;
    }
    
    const missaData = {
        data: new Date().toISOString(),
        itens: missaItems.map(item => ({
            id: item.id,
            text: item.text,
            categoria: item.categoria
        }))
    };
    
    try {
        // Tentar salvar no GitHub via API (requer autenticação)
        // Por enquanto, usar localStorage
        const savedMissas = JSON.parse(localStorage.getItem('missasSalvas') || '[]');
        const missaName = prompt('Nome para esta missa:', `Missa ${new Date().toLocaleDateString()}`);
        
        if (missaName) {
            missaData.nome = missaName;
            savedMissas.push(missaData);
            localStorage.setItem('missasSalvas', JSON.stringify(savedMissas));
            alert('Missa salva com sucesso!');
        }
    } catch (error) {
        console.error('Erro ao salvar missa:', error);
        alert('Erro ao salvar missa.');
    }
}

// Carregar missa salva
function loadMissa() {
    try {
        const savedMissas = JSON.parse(localStorage.getItem('missasSalvas') || '[]');
        
        if (savedMissas.length === 0) {
            alert('Nenhuma missa salva encontrada.');
            return;
        }
        
        // Criar lista de missas salvas
        const missasList = savedMissas.map((missa, index) => 
            `${index + 1}. ${missa.nome} (${new Date(missa.data).toLocaleDateString()})`
        ).join('\n');
        
        const selection = prompt(`Missas salvas:\n${missasList}\n\nDigite o número da missa que deseja carregar:`);
        const index = parseInt(selection) - 1;
        
        if (index >= 0 && index < savedMissas.length) {
            const selectedMissa = savedMissas[index];
            missaItems = selectedMissa.itens.map(item => ({
                id: item.id,
                text: item.text,
                categoria: item.categoria,
                originalElement: null
            }));
            updateMissaDisplay();
            alert('Missa carregada com sucesso!');
        } else {
            alert('Seleção inválida.');
        }
    } catch (error) {
        console.error('Erro ao carregar missa:', error);
        alert('Erro ao carregar missa.');
    }
}

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
            newItem.setAttribute('data-categoria', section);
            newItem.textContent = itemText;
            newItem.onclick = () => openPDF(itemText, section, itemId);
            
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
        text: item.text,
        categoria: item.categoria
    }));
    
    console.log('Ordem da Missa:', order);
    return order;
}

// Função para importar uma ordem de missa salva
function importMissaOrder(savedOrder) {
    missaItems = savedOrder.map(item => ({
        id: item.id,
        text: item.text,
        categoria: item.categoria,
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
                    const itemCategoria = touchItem.getAttribute('data-categoria');
                    
                    if (itemId && !missaItems.find(item => item.id === itemId)) {
                        const newItem = {
                            id: itemId,
                            text: itemText,
                            categoria: itemCategoria,
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
    if (confirm('Tem certeza que deseja limpar a missa atual?')) {
        missaItems = [];
        updateMissaDisplay();
    }
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
    
    // Ctrl/Cmd + S para salvar missa
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveMissa();
    }
    
    // Ctrl/Cmd + L para carregar missa
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        loadMissa();
    }
});

// Função para criar backup dos dados
function createBackup() {
    const backup = {
        missaItems: missaItems,
        savedMissas: JSON.parse(localStorage.getItem('missasSalvas') || '[]'),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_missa_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Função para restaurar backup
function restoreBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            if (backup.missaItems) {
                missaItems = backup.missaItems;
                updateMissaDisplay();
            }
            
            if (backup.savedMissas) {
                localStorage.setItem('missasSalvas', JSON.stringify(backup.savedMissas));
            }
            
            alert('Backup restaurado com sucesso!');
        } catch (error) {
            alert('Erro ao restaurar backup: arquivo inválido.');
        }
    };
    reader.readAsText(file);
}

