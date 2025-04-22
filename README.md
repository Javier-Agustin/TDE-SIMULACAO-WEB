# Bolas Esportivas Animadas - Angular

Este projeto é uma simulação interativa de bolas esportivas (futebol, rugby e basquete) desenvolvida em Angular. As bolas se movem, colidem e produzem efeitos sonoros.

## Funcionalidades

- Animações Interativas: Bolas com movimentos realistas e colisões
- Múltiplos Esportes: Suporte para bolas de futebol, rugby e basquete
- Efeitos Sonoros: Sons específicos para cada tipo de bola
- Controle de Volume: Ajuste do volume dos efeitos sonoros
- Interface Intuitiva: Design moderno e responsivo

## Tecnologias Utilizadas

- Angular 17
- p5.js para animações e física
- TypeScript
- SCSS para estilização
- HTML5 Audio API

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)
- Angular CLI (instalado globalmente)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Javier-Agustin/TDE-SIMULACAO-WEB.git
cd TDE-SIMULACAO-WEB
```

2. Instale o Angular CLI globalmente:
```bash
npm install -g @angular/cli
```

3. Instale as dependências do projeto:
```bash
npm install
```

## Executando o Projeto

1. Inicie o servidor de desenvolvimento:
```bash
ng serve
```

2. Abra seu navegador e acesse:
```
http://localhost:4200
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── app.component.ts    # Lógica principal e integração com p5.js
│   ├── app.component.html  # Template da interface
│   └── app.component.scss  # Estilos do componente
├── assets/
│   ├── Imagens/           # Imagens das bolas
│   └── Som/              # Arquivos de áudio
└── styles.scss           # Estilos globais
```

## Como Usar

1. Clique nos botões para adicionar diferentes tipos de bolas
2. Ajuste o volume usando o controle deslizante
3. Observe as colisões e interações entre as bolas
4. Use o botão "Limpar Tudo" para reiniciar a simulação

## Autor

Javier Agustin 
