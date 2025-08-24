# Organizador de Missa - Versão Atualizada

Uma aplicação web moderna para organizar os momentos da celebração da missa de forma prática e intuitiva, com design glassmorphism aprimorado e funcionalidades avançadas.

## ✨ Novidades da Versão Atualizada

### 🎨 Design Aprimorado
- **Glassmorphism Avançado**: Efeitos de vidro mais sofisticados com múltiplas camadas de transparência
- **Gradiente Refinado**: Fundo com gradiente mais suave e profundo em tons de preto/cinza
- **Detalhes Prateados**: Elementos em cinza e prateado (#c0c0c0, #a9a9a9, #808080) para maior elegância
- **Animações Fluidas**: Transições suaves e efeitos de brilho nos elementos
- **Tipografia Melhorada**: Gradientes de texto e sombras aprimoradas

### 📱 Funcionalidades Novas
- **Quadros Recolhíveis**: Todos os quadros começam recolhidos e expandem ao clicar
- **Ícones Visuais**: Setas (▼/▲) indicam o estado expandido/recolhido
- **Drag & Drop Corrigido**: Funcionalidade de arrastar e soltar totalmente funcional
- **Suporte a Toque Aprimorado**: Melhor experiência em dispositivos móveis

## 🚀 Características Principais

### Design Moderno
- **Glassmorphism Premium**: Múltiplas camadas de transparência e blur
- **Gradiente Sofisticado**: Fundo com 7 pontos de gradiente para maior profundidade
- **Detalhes Metálicos**: Elementos em tons de prata e cinza para elegância
- **Fonte Ubuntu**: Light (300) e Semibold (500) para hierarquia visual
- **Cantos Arredondados**: Design suave e moderno em todos os elementos

### Funcionalidades Interativas

#### Quadros Organizacionais
Cada momento da missa possui seu próprio quadro recolhível:
- **Entrada** - Cantos de abertura da celebração
- **Ato Penitencial** - Momentos de reflexão e perdão
- **Glória** - Cantos de louvor
- **Aclamação** - Aleluias e aclamações
- **Ofertório** - Cantos para apresentação das ofertas
- **Santo** - Santo, Santo, Santo
- **Paz** - Cantos da paz
- **Amém** - Grandes améns
- **Cordeiro** - Cordeiro de Deus
- **Comunhão** - Cantos para a comunhão
- **Ação de Graças** - Cantos de agradecimento
- **Final** - Cantos de envio
- **Marianos** - Cantos dedicados à Nossa Senhora
- **Louvor** - Cantos de louvor e adoração
- **Meditação** - Cantos contemplativos

#### Quadro "Missa de Hoje"
- **Arrastar e Soltar**: Funcionalidade totalmente corrigida
- **Reordenação**: Arraste itens para alterar a ordem da celebração
- **Remoção Individual**: Botão "Remover" para cada item
- **Estado Vazio**: Interface limpa quando não há itens

#### Visualização de PDFs
- **Popup Maximizado**: Interface elegante para visualização
- **Design Aprimorado**: Popup com glassmorphism e bordas arredondadas
- **Simulação Rica**: Conteúdo de exemplo bem formatado

## 🎯 Como Usar

### 1. Navegação pelos Quadros
1. **Visualizar**: Todos os quadros começam recolhidos para interface limpa
2. **Expandir**: Clique no cabeçalho de qualquer quadro para ver os itens
3. **Recolher**: Clique novamente para recolher o quadro
4. **Ícones**: Observe as setas ▼ (recolhido) e ▲ (expandido)

### 2. Organizando a Missa
1. **Expandir Quadros**: Clique nos quadros desejados para ver os cânticos
2. **Arrastar Itens**: Clique e arraste os cânticos para o quadro "Missa de Hoje"
3. **Reordenar**: Arraste itens dentro da missa para alterar a ordem
4. **Remover**: Use o botão "Remover" para excluir itens indesejados

### 3. Visualizando Letras
1. **Clicar em Itens**: Clique em qualquer cântico para abrir o PDF
2. **Navegação**: Use o botão "×" ou pressione ESC para fechar
3. **Responsivo**: Funciona perfeitamente em todos os dispositivos

## ⌨️ Atalhos de Teclado

- **Ctrl/Cmd + E**: Expandir todas as seções
- **Ctrl/Cmd + R**: Recolher todas as seções  
- **Ctrl/Cmd + L**: Limpar toda a programação da missa
- **ESC**: Fechar popup de visualização

## 📱 Suporte a Dispositivos

### Desktop
- **Drag & Drop**: Funcionalidade completa com mouse
- **Hover Effects**: Efeitos visuais ao passar o mouse
- **Atalhos**: Suporte completo a atalhos de teclado

### Mobile/Tablet
- **Touch Drag**: Arrastar e soltar otimizado para toque
- **Interface Responsiva**: Layout adaptável a diferentes tamanhos
- **Gestos**: Suporte a gestos nativos do dispositivo

## 🛠️ Estrutura Técnica

```
project_web_app/
├── index.html          # Interface principal com design glassmorphism
├── script.js           # Lógica JavaScript com todas as funcionalidades
└── README.md          # Documentação completa
```

## 🎨 Personalização Avançada

### Cores e Gradientes
```css
/* Gradiente principal */
background: linear-gradient(135deg, 
    #0f0f0f 0%, #1a1a1a 15%, #2d2d2d 35%, 
    #404040 50%, #2d2d2d 65%, #1a1a1a 85%, #0f0f0f 100%);

/* Detalhes prateados */
color: #c0c0c0; /* Prata claro */
color: #a9a9a9; /* Prata médio */
color: #808080; /* Prata escuro */
```

### Efeitos Glass
```css
/* Glassmorphism avançado */
background: rgba(255, 255, 255, 0.04);
backdrop-filter: blur(15px);
border: 1px solid rgba(192, 192, 192, 0.15);
box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

## 🔧 Configuração de PDFs

Para usar PDFs reais, edite a função `generatePDFUrl()` no arquivo `script.js`:

```javascript
function generatePDFUrl(title) {
    // Mapeie os títulos para URLs reais dos PDFs
    const pdfMap = {
        'Ave Maria (Entrada)': './pdfs/ave-maria-entrada.pdf',
        'Senhor, Tende Piedade': './pdfs/senhor-tende-piedade.pdf',
        // ... adicione mais mapeamentos
    };
    
    return pdfMap[title] || './pdfs/default.pdf';
}
```

## 🚀 Funcionalidades Futuras Preparadas

O código inclui funções prontas para:
- **Exportar/Importar**: Salvar e carregar ordens de missa
- **Adicionar Itens**: Função para adicionar novos cânticos dinamicamente
- **Persistência**: Base para integração com backend
- **Múltiplas Missas**: Suporte a diferentes celebrações

## 🌟 Tecnologias Utilizadas

- **HTML5**: Estrutura semântica moderna
- **CSS3**: Glassmorphism, gradientes e animações avançadas
- **JavaScript ES6+**: Funcionalidades interativas e drag & drop
- **Google Fonts**: Fonte Ubuntu em múltiplos pesos
- **Responsive Design**: Mobile-first approach

## ✅ Compatibilidade Testada

- ✅ Chrome/Chromium (Recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ iOS Safari
- ✅ Android Chrome

## 🎯 Melhorias Implementadas

1. **Design**: Glassmorphism aprimorado com detalhes prateados
2. **UX**: Quadros recolhíveis para interface mais limpa
3. **Funcionalidade**: Drag & drop totalmente corrigido
4. **Performance**: Animações otimizadas e transições suaves
5. **Acessibilidade**: Melhor contraste e navegação por teclado
6. **Mobile**: Suporte a toque aprimorado

A aplicação agora oferece uma experiência premium para organização de missas com design moderno e funcionalidades avançadas!

