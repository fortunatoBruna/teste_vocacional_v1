# Teste Vocacional – UFBRA

Desenvolvemos um teste vocacional para o site da UFBRA com o objetivo de orientar futuros alunos na escolha de cursos de graduação e tecnólogo.
A solução foi inspirada no teste vocacional do Quero Bolsa, porém evoluída com melhorias estruturais em precisão de recomendação, experiência do usuário e estratégia de conversão.
O teste utiliza como base a Teoria das Inteligências Múltiplas (Howard Gardner), combinada com um algoritmo de similaridade vetorial (cosseno), que compara o perfil do usuário com perfis ideais de cursos, gerando recomendações com percentual de aderência (0 a 100%).

## Diferenciais estratégicos
- **Recomendação mais precisa (data-driven)**
Utiliza cálculo vetorial ao invés de soma simples, evitando distorções nos resultados.
- **Sistema anti-viés nas respostas**
Perguntas são randomizadas e categorias ocultadas, garantindo maior confiabilidade.
- **Experiência mobile otimizada**
Fluxo com auto-scroll, navegação guiada e interface adaptada para alta taxa de conclusão.
- **Visualização avançada de resultados**
Gráfico de radar interativo + ranking de cursos com níveis de compatibilidade.
- **Estratégia de conversão integrada (Inbound)**
Implementação de gate de conteúdo: o resultado completo é liberado após captura de lead.
- **Arquitetura modular e escalável**
Permite replicação rápida para outras Marcas (Unirios, Unialpha, Uniasp etc.), com customização de:
-- perguntas
-- cursos
-- identidade visual
-- regras de recomendação

---

## 🎯 Objetivo de negócio
- Aumentar geração de leads qualificados
- Apoiar decisão do aluno com base em perfil
- Elevar taxa de conversão no funil
- Criar uma solução padronizada para todas as Marcas

---
## ⚙️ Como funciona
1. O usuário responde a um conjunto de perguntas comportamentais
2. Cada resposta contribui para a construção de um vetor de perfil
3. Esse vetor é comparado com vetores pré-definidos dos cursos
4. É calculada a similaridade (0–100%) entre o usuário e cada curso
5. Antes de exibir a resposta, coletamos dados pessoais do usuario em um formulario
6. Após a coleta dos dados, o sistema apresenta:
- ranking de cursos recomendados
- percentual de compatibilidade
- visualização gráfica do perfil (radar)
- botão direcionador para a PDP de cada curso

### Sobre a coleta e armazenamento de dados 
O teste vocacional está integrado ao Montilla, garantindo a captura dos dados dos usuários para fins de marketing e relacionamento.

🔗 Como funciona a integração:
- O SDK do Montilla é carregado na aplicação
- O formulário de liberação de resultado é identificado automaticamente
- Os dados são capturados via autoTrack
- As informações são enviadas e armazenadas no banco via Montilla
📥 Dados coletados:
-- Nome (name)
-- Email (email)
-- Telefone (phone)
-- Curso com maior compatibilidade (curso_match)
  
🎯 Benefícios da integração:
- Geração de leads qualificados em tempo real
- Enriquecimento do CRM com dados comportamentais
- Possibilidade de ações comerciais direcionadas
- Conexão direta entre experiência do usuário e funil de conversão

---

## 🔗 Acesso ao protótipo
👉 https://preview--teste-vocacional-v1.lovable.app/

---

## 🚧 Próximos Passos (Roadmap)

### Integrações e Features
- [ ] **Integração com CRM/WhatsApp:** Conectar o formulário final a uma API real para envio dos dados, substituindo o feedback visual atual.
- [ ] **Conteúdo Educativo:** Adicionar modais explicativos (Tooltips) em palavras complexas nas perguntas.
- [ ] **Explicação das Inteligências:** Seção detalhando o que significa cada pontuação no gráfico de radar.

---

## 🛠️ Tecnologias Utilizadas

- **React** (Vite)
- **TypeScript**
- **Tailwind CSS** (Estilização)
- **Recharts** (Visualização de Dados)
- **Lucide React** (Ícones)
- **Shadcn/ui** (Componentes de Interface)
- **Montilla SDK** (Coleta de dados)

O projeto foi desenvolvido utilizando React com TypeScript e Vite, com estilização em Tailwind CSS. A lógica de recomendação utiliza um algoritmo de similaridade vetorial (cosine similarity), permitindo sugestões de cursos baseadas em dados. Atualmente, a aplicação funciona como um front-end independente, sem necessidade de backend.
