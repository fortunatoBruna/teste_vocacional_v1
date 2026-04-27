# Teste Vocacional UFBRA v1

Projeto de orientação vocacional baseado na Teoria das Inteligências Múltiplas de Howard Gardner. A aplicação utiliza um algoritmo de similaridade vetorial para recomendar cursos superiores com base no perfil do usuário, integrado a uma estratégia de Inbound Marketing (Gate Content) para captação de leads.

## 📋 Especificações de Alto Nível

Utilizamos o modelo do teste vocacional do Quero Bolsa como referência para replicação no site das Marcas. O objetivo desta versão foi refatorar a lógica de cálculo para garantir precisão matemática, eliminar vieses de resposta através de randomização e otimizar a experiência do usuário (UX) em dispositivos móveis, além de implementar barreiras de entrada para visualização de resultados focadas em conversão.

---

## 🚀 Implementações e Melhorias (Changelog)

Abaixo estão os detalhes das soluções desenvolvidas para atender aos requisitos de negócio e usabilidade.

### ⚙️ Lógica e Algoritmos (Back-end Logic)
- [x] **Algoritmo de Similaridade de Cosseno:** Substituição da lógica de soma simples por cálculo vetorial. Agora, a aderência de cada curso é calculada independentemente (0-100%) baseada na proximidade entre o vetor do usuário e o vetor ideal do curso, evitando percentuais "inflados" ou dependentes.
- [x] **Sistema Anti-Viés (Randomização):** Implementação de um `Lazy State` que embaralha as questões de cada inteligência e seleciona aleatoriamente 4 perguntas (de um pool de 7) a cada novo acesso.
- [x] **Ocultação de Categorias:** Remoção dos rótulos explícitos (ex: "Inteligência Musical") durante a etapa de perguntas para evitar que o usuário enviesasse suas respostas.
- [x] **Reset Real:** Configuração do reinício do teste via `window.location.reload()` para garantir que um novo conjunto de perguntas aleatórias seja gerado.

### 📱 Experiência do Usuário (UX/UI)
- [x] **Auto-Scroll Mobile:** Implementação de um `useEffect` monitorando a mudança de etapas (`step`), forçando a rolagem para o topo da página automaticamente. Isso corrige o problema de usabilidade em celulares onde o usuário precisava rolar para cima manualmente.
- [x] **Gráfico de Radar Interativo:**
    - Ajuste do raio do gráfico (redução para 65%) para evitar cortes nas legendas em telas menores.
    - Criação de **Modo Zoom (Tela Cheia)** via Modal, facilitando a visualização e a captura de tela (print) pelo usuário.
- [x] **Lista de Resultados Expansível (Accordion):**
    - O curso Top 1 já inicia expandido com descrição completa e CTA.
    - Demais cursos (Top 2-6) listados em formato de acordeão interativo.
- [x] **Validação de Navegação:** Bloqueio dos botões "Próximo" até que todas as perguntas da etapa atual sejam respondidas.

### 🎯 Estratégia de Leads (Catalead)
- [x] **Gate Content (Conteúdo Bloqueado):** Separação da tela final em dois estados. O usuário visualiza apenas o formulário inicialmente; o gráfico e o ranking são liberados (renderizados) somente após o preenchimento dos dados.

### 🎨 Design e Conteúdo
- [x] **Identidade Visual:** Aplicação das cores e tipografia da marca (UFBRA).
- [x] **Enriquecimento de Dados:** Atualização da base de cursos (`const CURSOS`) para incluir descrições detalhadas, áreas de atuação e links diretos para as páginas dos cursos (PDP).

---

## 🚧 Próximos Passos (Roadmap)

Melhorias planejadas para as próximas versões (v2):

- [x] Implementar validação de input no campo "Nome" (impedir números).
- [x] Implementar máscara e validação estrita no campo "Celular" (mínimo de 9 dígitos).

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
