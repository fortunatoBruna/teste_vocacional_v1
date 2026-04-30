import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { X, Maximize2 } from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

// ============== DADOS DO TESTE ==============
const CATEGORIAS = [
  'Naturalista', 'Musical', 'Lógico-matemático', 'Existencial',
  'Interpessoal', 'Corporal-Cinestésica', 'Linguística', 'Intrapessoal', 'Espacial'
];

// 9 categorias usadas no teste (no teste do QB não tem a existencial)
const CATEGORIAS_TESTE = [
  'Naturalista', 'Musical', 'Lógico-matemático', 'Existencial', 'Interpessoal', 'Corporal-Cinestésica', 'Linguística', 'Intrapessoal', 'Espacial'
];

const PERGUNTAS: Record<string, string[]> = {
  'Lógico-matemático': [
    "Tenho facilidade para lidar com números, cálculos e raciocínio lógico.",
    "Gosto de transformar problemas em fórmulas, padrões ou soluções lógicas.",
    "Costumo perceber padrões, relações ou lógica nas situações do dia a dia.",
    "Matemática sempre foi uma das minhas aulas favoritas.",
    "Eu gosto de pensar sobre questões numéricas e examinar as estatísticas.",
    "Eu costumo entender as coisas ao meu redor através de um sentido matemático.",
    "Gosto de solucionar quebra-cabeças."
  ],
  'Naturalista': [
    "O mundo de plantas e animais é importante para mim.",
    "Tenho interesse por temas ligados a animais, plantas, meio ambiente ou saúde.",
    "Eu gosto de aprender sobre a natureza.",
    "Gosto de cuidar das minhas plantas em casa.",
    "Tenho interesse por temas ligados à preservação ambiental e sustentabilidade.",
    "Gosto de caminhar em lugares naturais.",
    "Tenho curiosidade em observar animais, plantas e ambientes naturais."
  ],
  'Musical': [
    "A música, os sons ou o ritmo fazem parte importante da minha rotina.",
    "Tenho facilidade para perceber ritmo, harmonia, sons ou padrões sonoros.",
    "Lembro-me a melodia de uma canção quando perguntado.",
    "Gosto de atividades que envolvem música, áudio, produção sonora ou expressão criativa.",
    "A música é muito importante para mim na vida diária.",
    "Tenho amplos e variados interesses musicais, incluindo clássicos e contemporâneos.",
    "Eu tenho um bom senso de afinação, tempo e ritmo."
  ],
  'Interpessoal': [
    "Tenho facilidade para me relacionar com pessoas de diferentes perfis.",
    "Eu gosto de estar com todos os diferentes tipos de pessoas.",
    "Procuro ouvir e compreender pessoas com opiniões ou realidades diferentes da minha.",
    "Gosto de situações sociais novas ou únicas.",
    "Gosto de elogiar os outros quando eles fizeram bem.",
    "Tenho facilidade para perceber intenções, emoções ou necessidades das pessoas.",
    "Sinto-me seguro quando estou com estranhos."
  ],
  'Linguística': [
    "Gosto de ouvir discursos.",
    "Eu gosto de manter um diário de minhas experiências.",
    "Gosto de ler, escrever ou criar textos para expressar ideias.",
    "Tenho facilidade para explicar ideias, contar histórias ou me comunicar verbalmente.",
    "Tenho facilidade para encontrar as palavras certas ao me comunicar.",
    "Eu gosto de aprender novas palavras e faço isso facilmente.",
    "Gosto de ler e leio diariamente."
  ],
  'Intrapessoal': [
    "Costumo refletir sobre minhas escolhas, prioridades e objetivos.",
    "Costumo refletir sobre problemas da sociedade e sobre como posso contribuir para melhorá-los.",
    "Procuro reconhecer meus pontos fortes e meus pontos de melhoria.",
    "Eu gosto de estar sozinho e pensar sobre a minha vida.",
    "Tenho interesse em entender melhor meu comportamento e minhas emoções.",
    "Muitas vezes penso sobre a influência que tenho sobre os outros.",
    "Eu acredito que eu sou responsável por meus atos e quem eu sou."
  ],
  'Corporal-Cinestésica': [
    "Tenho facilidade em atividades práticas, manuais ou que envolvem movimento.",
    "Eu gosto de estar fisicamente apto.",
    "Eu tenho um bom equilíbrio e coordenação olho-mão e me sinto confortável em esportes que usam uma bola.",
    "Minha coordenação me destaca em atividades de alta velocidade.",
    "Gosto de aprender fazendo, colocando a mão na massa ou experimentando na prática.",
    "Sinto-me motivado em atividades que envolvem ação, prática ou trabalho em equipe.",
    "Eu gosto de me movimentar muito."
  ],
  'Espacial': [
    "Tenho facilidade para me orientar em espaços, mapas ou ambientes novos.",
    "Eu não me perco facilmente e posso me orientar tanto com mapas ou marcos.",
    "Sei direções com facilidade.",
    "Eu tenho a capacidade de representar o que eu vejo pelo desenho ou pintura.",
    "Tenho facilidade para imaginar formas, imagens, layouts ou objetos visualmente.",
    "Percebo detalhes visuais como cor, forma, proporção, espaço ou composição.",
    "Ver as coisas em três dimensões é fácil para mim, e eu gosto de fazer as coisas em três dimensões."
  ],
  'Existencial': [
  "Gosto de refletir sobre o propósito das minhas escolhas e da minha carreira.",
  "Tenho interesse por questões éticas, sociais, filosóficas ou humanas.",
  "Costumo pensar sobre como meu trabalho pode impactar positivamente outras pessoas.",
  "Busco entender o sentido das situações antes de tomar decisões importantes.",
  "Me interesso por temas ligados à sociedade, comportamento humano, justiça ou transformação social.",
  "Gosto de discutir ideias profundas sobre vida, futuro, valores ou propósito.",
  "Tenho vontade de atuar em uma área que esteja conectada a impacto, cuidado, educação ou transformação."
  ]
};

const CURSOS = [
  {
    nome: 'Administração',
    area: 'Ciências sociais aplicadas',
    descricao: 'Este curso desenvolve competências essenciais para a gestão eficiente de organizações, integrando conhecimentos em finanças, estratégia, liderança, processos e sustentabilidade.',
    link: 'https://ufbra.com.br/cursos/administracao',
    vetor: [2.0, 2.0, 8.5, 4.5, 9.2, 2.5, 7.5, 6.5, 3.0]
  },
  {
    nome: 'Pedagogia',
    area: 'Ciências humanas',
    descricao: 'O curso de Pedagogia prepara profissionais para atuar na gestão, planejamento e desenvolvimento de práticas educativas eficazes, contemplando desde fundamentos históricos e sociais até o uso de tecnologias e metodologias inclusivas.',
    link: 'https://ufbra.com.br/cursos/pedagogia',
    vetor: [5.5, 2.0, 5.5, 8.8, 9.0, 3.0, 9.0, 7.8, 5.5]
  },
  {
    nome: 'Ciências Contábeis',
    area: 'Ciências sociais aplicadas',
    descricao: 'O curso de Ciências Contábeis capacita o profissional a atuar com domínio em contabilidade, finanças e gestão estratégica, integrando conhecimentos em sustentabilidade, tecnologia da informação e legislação empresarial.',
    link: 'https://ufbra.com.br/cursos/ciencias-contabeis',
    vetor: [1.8, 1.5, 9.0, 3.2, 6.5, 1.8, 6.5, 4.5, 2.5]
  },
  {
    nome: 'Educação Física',
    area: 'Ciências da saúde',
    descricao: 'O curso de Educação Física prepara profissionais capacitados a atuar na promoção da saúde, desenvolvimento motor e inclusão social por meio do movimento corporal.',
    link: 'https://ufbra.com.br/cursos/educacao-fisica',
    vetor: [3.0, 3.5, 4.8, 4.5, 7.5, 9.5, 5.5, 4.0, 5.5]
  },
  {
    nome: 'Enfermagem',
    area: 'Ciências da saúde',
    descricao: 'Este curso de Enfermagem desenvolve habilidades essenciais para a prática avançada, abrangendo desde o cuidado direto ao paciente até a gestão de serviços de saúde.',
    link: 'https://ufbra.com.br/cursos/enfermagem',
    vetor: [6.5, 1.5, 4.5, 7.8, 8.5, 5.5, 5.8, 5.5, 3.0]
  },
  {
    nome: 'Engenharia Civil',
    area: 'Engenharias',
    descricao: 'Este curso de Engenharia Civil desenvolve competências técnicas essenciais, combinando fundamentos matemáticos, físicos e tecnológicos com práticas projetuais multidisciplinares.',
    link: 'https://ufbra.com.br/cursos/engenharia-civil',
    vetor: [2.5, 1.5, 8.8, 3.0, 5.0, 3.0, 4.0, 3.5, 9.5]
  },
  {
    nome: 'Logística',
    area: 'Gestão e Negócios',
    descricao: 'Este curso de Logística capacita profissionais a planejar, implementar e otimizar operações de cadeias de suprimentos com foco em eficiência, sustentabilidade e inovação tecnológica.',
    link: 'https://ufbra.com.br/cursos/logistica',
    vetor: [2.0, 1.5, 7.0, 3.0, 6.5, 3.0, 6.0, 4.0, 5.0]
  },
  {
    nome: 'Fisioterapia',
    area: 'Ciências da saúde',
    descricao: 'O curso de Fisioterapia proporciona uma formação sólida em ciências biológicas e de saúde, integrando conhecimentos de anatomia, fisiologia, patologia e técnicas de avaliação funcional.',
    link: 'https://ufbra.com.br/cursos/fisioterapia',
    vetor: [7.5, 1.5, 4.2, 7.5, 8.2, 8.5, 5.5, 5.5, 4.5]
  },
  {
    nome: 'Psicologia',
    area: 'Ciências humanas',
    descricao: 'O curso de Psicologia oferece uma formação sólida que integra teoria e prática, capacitando o aluno a aplicar conhecimentos científicos na compreensão e intervenção sobre o comportamento humano.',
    link: 'https://ufbra.com.br/cursos/psicologia',
    vetor: [4.5, 1.8, 3.5, 9.0, 9.0, 2.5, 8.5, 9.0, 3.0]
  },
  {
    nome: 'Nutrição',
    area: 'Ciências da saúde',
    descricao: 'Este curso proporciona uma formação sólida em nutrição, integrando conhecimentos de biociências, saúde pública e técnicas alimentares aplicadas. O aluno desenvolve competências para avaliar, planejar e orientar práticas nutricionais individuais e...',
    link: 'https://ufbra.com.br/cursos/nutricao',
    vetor: [7.0, 1.5, 5.5, 7.0, 8.0, 3.5, 6.2, 6.0, 3.0]
  },
  {
    nome: 'Análise e Desenvolvimento de Sistemas',
    area: 'Informação e Comunicação',
    descricao: 'O curso de Análise e Desenvolvimento de Sistemas prepara profissionais capacitados a projetar, implementar e gerenciar soluções tecnológicas que atendem às demandas do mercado digital.',
    link: 'https://ufbra.com.br/cursos/analise-e-desenvolvimento-de-sistemas',
    vetor: [1.5, 1.5, 9.2, 2.5, 3.5, 1.8, 5.5, 4.5, 3.5]
  },
  {
    nome: 'Marketing',
    area: 'Gestão e Negócios',
    descricao: 'Este curso de Marketing capacita o aluno a desenvolver estratégias eficazes que abrangem desde o comportamento do consumidor e marketing digital até o gerenciamento de marcas e comércio eletrônico.',
    link: 'https://ufbra.com.br/cursos/marketing',
    vetor: [1.8, 3.5, 6.5, 4.5, 10.0, 2.0, 9.0, 5.5, 5.5]
  },
  {
    nome: 'Farmácia',
    area: 'Ciências da saúde',
    descricao: 'O curso de Farmácia proporciona uma formação sólida que integra conhecimentos em ciências biológicas, químicas e farmacológicas, capacitando o aluno a compreender e atuar em diferentes etapas do desenvolvimento, produção e controle de medicamentos.',
    link: 'https://ufbra.com.br/cursos/farmacia',
    vetor: [8.5, 1.5, 7.5, 6.5, 6.8, 3.0, 5.8, 5.0, 3.0]
  },
  {
    nome: 'Gestão Financeira',
    area: 'Gestão e Negócios',
    descricao: 'O curso em Gestão Financeira desenvolve competências essenciais para a análise, planejamento e controle dos recursos financeiros em organizações de diversos setores.',
    link: 'https://ufbra.com.br/cursos/gestao-financeira',
    vetor: [1.5, 1.5, 8.5, 3.0, 6.5, 1.8, 6.0, 6.0, 2.5]
  },
  {
    nome: 'Processos Gerenciais',
    area: 'Gestão e Negócios',
    descricao: 'O curso de Processos Gerenciais capacita o aluno a aplicar conhecimentos em economia, gestão, finanças e tecnologia para otimizar operações empresariais.',
    link: 'https://ufbra.com.br/cursos/processos-gerenciais',
    vetor: [1.8, 1.5, 7.5, 3.5, 8.0, 2.5, 6.8, 5.0, 3.0]
  },
  {
    nome: 'Biomedicina',
    area: 'Ciências biológicas',
    descricao: 'O curso de Biomedicina oferece uma formação sólida nas ciências biológicas e da saúde, integrando fundamentos teóricos e práticas laboratoriais essenciais para a atuação profissional.',
    link: 'https://ufbra.com.br/cursos/biomedicina',
    vetor: [7.0, 1.5, 7.8, 6.2, 6.5, 3.0, 5.5, 4.5, 3.0]
  },
  {
    nome: 'Engenharia de Produção',
    area: 'Engenharias',
    descricao: 'O curso de Engenharia de Produção desenvolve competências técnicas e analíticas essenciais para otimizar processos produtivos, integrar tecnologias e gerir projetos multidisciplinares.',
    link: 'https://ufbra.com.br/cursos/engenharia-de-producao',
    vetor: [2.0, 1.5, 8.8, 3.5, 8.5, 3.0, 5.8, 4.0, 6.8]
  },
  {
    nome: 'Sistemas de Informação',
    area: 'Ciências exatas e da terra',
    descricao: 'Este curso desenvolve competências técnicas e analíticas essenciais para atuar na área de Sistemas de Informação, capacitando o aluno a planejar, desenvolver e gerenciar soluções de tecnologia que atendam às demandas organizacionais.',
    link: 'https://ufbra.com.br/cursos/sistemas-de-informacao',
    vetor: [1.5, 1.5, 8.8, 2.5, 6.0, 1.8, 5.8, 4.5, 3.5]
  },
  {
    nome: 'Gestão Comercial',
    area: 'Gestão e Negócios',
    descricao: 'O curso em Gestão Comercial prepara profissionais para atuar de forma estratégica na condução de processos comerciais, integrando conhecimentos em economia, administração e marketing com ferramentas tecnológicas atuais.',
    link: 'https://ufbra.com.br/cursos/gestao-comercial',
    vetor: [1.8, 2.0, 6.8, 3.8, 9.0, 2.0, 7.5, 5.0, 3.5]
  },
  {
    nome: 'Engenharia Mecânica',
    area: 'Engenharias',
    descricao: 'O curso de Engenharia Mecânica oferece uma formação sólida que integra fundamentos matemáticos, físicos e tecnológicos aplicados ao desenvolvimento e gestão de projetos complexos.',
    link: 'https://ufbra.com.br/cursos/engenharia-mecanica',
    vetor: [2.0, 1.5, 9.5, 2.5, 5.0, 4.0, 4.5, 3.5, 8.5]
  },
  {
    nome: 'Ciência da Computação',
    area: 'Ciências Exatas e da Terra',
    descricao: 'Este curso de Ciência da Computação desenvolve habilidades técnicas essenciais, desde lógica matemática e programação até o domínio de sistemas operacionais, redes e bancos de dados.',
    link: 'https://ufbra.com.br/cursos/ciencia-da-computacao',
    vetor: [1.5, 1.5, 9.8, 2.5, 4.0, 1.8, 6.0, 4.8, 3.5]
  },
  {
    nome: 'Gestão Ambiental',
    area: 'Ambiente e saúde',
    descricao: 'Este curso prepara profissionais para atuar na gestão sustentável de recursos naturais e na implementação de práticas ambientais eficientes. Desenvolve habilidades em planejamento e controle ambiental, análise de impactos, recuperação de áreas...',
    link: 'https://ufbra.com.br/cursos/gestao-ambiental',
    vetor: [10.0, 1.5, 6.5, 8.0, 7.0, 3.0, 6.0, 5.0, 6.5]
  },
  {
    nome: 'Engenharia Elétrica',
    area: 'Engenharias',
    descricao: 'Este curso de Engenharia Elétrica desenvolve competências técnicas fundamentais em matemática, física aplicada, programação e materiais, preparando o aluno para atuar em projetos complexos no setor elétrico e tecnológico.',
    link: 'https://ufbra.com.br/cursos/engenharia-eletrica',
    vetor: [2.0, 1.5, 10.0, 2.5, 5.0, 3.0, 4.5, 3.5, 6.8]
  },
  {
    nome: 'Design Gráfico',
    area: 'Ciências sociais aplicadas',
    descricao: 'O curso de Design Gráfico desenvolve competências técnicas e criativas essenciais para atuação profissional em ambientes físicos e digitais. O aluno aprimora sua capacidade de criação visual, desde fundamentos filosóficos e culturais até a...',
    link: 'https://ufbra.com.br/cursos/design-grafico',
    vetor: [2.0, 3.0, 5.5, 4.5, 5.0, 2.5, 8.0, 4.5, 10.0]
  },
  {
    nome: 'Gastronomia',
    area: 'Ciências sociais aplicadas',
    descricao: 'O curso de Gastronomia proporciona uma formação ampla que desenvolve competências técnicas e gerenciais essenciais para o mercado gastronômico. O aluno aprende desde fundamentos históricos e culturais, higiene e segurança alimentar até técnicas...',
    link: 'https://ufbra.com.br/cursos/gastronomia',
    vetor: [5.5, 2.5, 5.0, 4.5, 7.0, 7.0, 4.5, 4.0, 6.5]
  },
  {
    nome: 'Redes de Computadores',
    area: 'Informação e comunicação',
    descricao: 'Este curso capacita profissionais a projetar, implementar e gerenciar redes de computadores, desenvolvendo habilidades técnicas em infraestrutura, protocolos avançados, segurança e monitoramento de redes.',
    link: 'https://ufbra.com.br/cursos/redes-de-computadores',
    vetor: [1.5, 1.5, 9.0, 2.0, 4.5, 2.5, 5.0, 4.0, 6.0]
  },
  {
    nome: 'Gestão da Qualidade',
    area: 'Gestão e Negócios',
    descricao: 'Este curso prepara profissionais para atuar na gestão da qualidade integrando conhecimentos em administração, controle estatístico, auditoria e normas ISO.',
    link: 'https://ufbra.com.br/cursos/gestao-da-qualidade',
    vetor: [2.0, 1.5, 8.0, 3.5, 6.8, 2.5, 5.8, 5.0, 4.0]
  },
  {
    nome: 'Automação Industrial',
    area: 'Controle e processos industriais',
    descricao: 'O curso de Automação Industrial desenvolve competências técnicas essenciais para projetar, implementar e gerenciar sistemas automatizados em ambientes industriais.',
    link: 'https://ufbra.com.br/cursos/automacao-industrial',
    vetor: [1.8, 1.5, 9.0, 2.0, 4.5, 4.0, 3.5, 3.5, 7.5]
  },
  {
    nome: 'Gestão de Tecnologia da Informação',
    area: 'Ciências exatas e da terra',
    descricao: 'O curso de Gestão de Tecnologia da Informação desenvolve competências essenciais para planejar, implementar e gerenciar soluções tecnológicas alinhadas às estratégias organizacionais.',
    link: 'https://ufbra.com.br/cursos/gestao-de-tecnologia-da-informacao',
    vetor: [1.5, 1.5, 8.5, 3.0, 7.5, 2.0, 7.5, 5.0, 3.5]
  },
  {
    nome: 'Agronomia',
    area: 'Ciências biológicas',
    descricao: 'O curso desenvolve competências sólidas em ciências agrárias, integrando conhecimentos sobre solo, plantas e animais para habilitar o aluno a atuar de forma prática e eficiente na agropecuária moderna.',
    link: 'https://ufbra.com.br/cursos/agronomia',
    vetor: [10.0, 1.5, 7.0, 8.0, 6.5, 4.0, 5.5, 5.0, 5.5]
  },
  {
    nome: 'Criminologia',
    area: 'Ciências humanas',
    descricao: 'O curso de Criminologia oferece uma formação sólida para compreender os fenômenos criminais a partir de múltiplas perspectivas, incluindo aspectos jurídicos, sociais e comportamentais.',
    link: 'https://ufbra.com.br/cursos/criminologia',
    vetor: [2.0, 1.5, 6.8, 9.5, 8.5, 3.0, 9.0, 8.0, 4.0]
  },
  {
    nome: 'Energias Renováveis',
    area: 'Ambiente e saúde',
    descricao: 'O curso desenvolve competências técnicas e gerenciais essenciais para atuar no setor de energias renováveis, integrando conhecimentos em gestão ambiental, inovação tecnológica e sistemas elétricos aplicados.',
    link: 'https://ufbra.com.br/cursos/energias-renovaveis',
    vetor: [9.0, 1.5, 8.8, 8.0, 6.5, 3.0, 5.0, 5.0, 8.0]
  },
  {
    nome: 'Engenharia de Software',
    area: 'Engenharias',
    descricao: 'O curso de Engenharia de Software desenvolve competências técnicas essenciais para projetar, implementar e gerenciar sistemas complexos, com foco em aplicações web, mobile e soluções integradas.',
    link: 'https://ufbra.com.br/cursos/engenharia-de-software',
    vetor: [1.5, 1.5, 9.8, 2.8, 5.0, 1.8, 6.5, 5.0, 4.5]
  },
  {
    nome: 'Gestão de Recursos Humanos',
    area: 'Gestão e Negócios',
    descricao: 'O curso de Gestão de Recursos Humanos desenvolve habilidades essenciais para atuar estrategicamente na administração de pessoas, combinando conhecimentos em economia, administração e tecnologia aplicada à gestão.',
    link: 'https://ufbra.com.br/cursos/gestao-de-recursos-humanos',
    vetor: [2.0, 1.8, 5.8, 7.8, 10.0, 2.0, 7.5, 8.0, 2.5]
  },
  {
    nome: 'Gestão Hospitalar',
    area: 'Gestão e Negócios',
    descricao: 'O curso de Gestão Hospitalar capacita profissionais para atuar na administração eficiente de instituições de saúde, integrando conhecimentos em finanças, marketing, planejamento estratégico, políticas públicas e tecnologia da informação.',
    link: 'https://ufbra.com.br/cursos/gestao-hospitalar',
    vetor: [5.5, 1.5, 7.0, 7.5, 8.8, 3.0, 6.5, 6.0, 3.5]
  },
  {
    nome: 'Investigação Forense e Perícia Criminal',
    area: 'Ciências humanas',
    descricao: 'O curso de Investigação Forense e Perícia Criminal desenvolve competências para atuar em análises técnicas e jurídicas voltadas à elucidação de crimes.',
    link: 'https://ufbra.com.br/cursos/investigacao-forense-e-pericia-criminal',
    vetor: [3.0, 1.5, 9.0, 8.5, 7.8, 4.0, 8.0, 7.5, 7.5]
  },
  {
    nome: 'Produção Audiovisual',
    area: 'Ciências sociais aplicadas',
    descricao: 'O curso de Produção Audiovisual capacita profissionais a planejar, criar e gerenciar conteúdos multimídia, desenvolvendo competências técnicas em fotografia, edição, animação e captação sonora, além de habilidades em roteirização e pós-produção.',
    link: 'https://ufbra.com.br/cursos/producao-audiovisual',
    vetor: [2.0, 8.5, 5.5, 5.5, 6.8, 3.5, 9.0, 5.0, 10.0]
  },
  {
    nome: 'Segurança do Trabalho',
    area: 'Gestão e Negócios',
    descricao: 'O curso de Segurança do Trabalho desenvolve competências práticas para a análise, prevenção e gestão de riscos no ambiente laboral, integrando conhecimentos em saúde ocupacional, ergonomia e legislação específica.',
    link: 'https://ufbra.com.br/cursos/seguranca-do-trabalho',
    vetor: [4.1, 1.6, 6.7, 6.5, 7.5, 5.8, 5.3, 4.9, 4.2]
  },
  {
    nome: 'Segurança Pública',
    area: 'Gestão e Negócios',
    descricao: 'O curso de Segurança Pública desenvolve competências essenciais para atuação integrada e eficaz no setor, abordando fundamentos jurídicos, direitos humanos, gestão de pessoas e aspectos sociais relacionados à segurança.',
    link: 'https://ufbra.com.br/cursos/seguranca-publica',
    vetor: [3.0, 1.5, 5.8, 8.5, 9.5, 8.0, 6.5, 6.5, 4.5]
  },
  {
    nome: 'Terapia Ocupacional',
    area: 'Ciências da saúde',
    descricao: 'O curso de Terapia Ocupacional forma profissionais capacitados para atuar na promoção da saúde e inclusão social, integrando conhecimentos de ciências biológicas, saúde e psicologia do desenvolvimento.',
    link: 'https://ufbra.com.br/cursos/terapia-ocupacional',
    vetor: [6.0, 2.0, 4.8, 8.8, 9.0, 8.5, 6.5, 7.0, 5.0]
  },
  
  {
    nome: 'Marketing Digital',
    area: 'Gestão e Negócios',
    descricao: 'O curso desenvolve habilidades práticas em estratégias digitais que abrangem desde o entendimento do comportamento do consumidor até a gestão de ferramentas avançadas de marketing em ambientes online e móveis.',
    link: 'https://ufbra.com.br/cursos/tecnologo-graduacao/marketing-digital?uuid=21c4665e-eda6-4913-a17c-fec56e4c0bc1',
    vetor: [1.5, 3.0, 7.5, 4.0, 8.5, 1.8, 8.5, 5.0, 6.0]
  },
  {
    nome: 'Mecatrônica Industrial',
    area: 'Engenharias',
    descricao: 'O curso de Mecatrônica Industrial prepara profissionais para atuar na integração de sistemas mecânicos, eletrônicos e computacionais, desenvolvendo habilidades em automação, controle de processos e manutenção de equipamentos industriais.',
    link: 'https://ufbra.com.br/cursos/tecnologo-graduacao/mecatronica-industrial?uuid=1e0431e4-d6f2-469e-9532-eada584f2a97',
    vetor: [1.8, 1.5, 9.5, 2.0, 4.5, 5.0, 3.5, 3.5, 8.0]
  },
  {
    nome: 'Engenharia da Computação',
    area: 'Engenharias',
    descricao: 'O curso de Engenharia da Computação desenvolve competências em matemática avançada, física aplicada e programação, essenciais para projetar e implementar soluções tecnológicas inovadoras.',
    link: 'https://ufbra.com.br/cursos/bacharelado-graduacao/engenharia-da-computacao?uuid=9955ffe7-465f-4dcc-85f0-7457e135151d',
    vetor: [1.5, 1.5, 10.0, 2.5, 4.5, 2.5, 6.0, 4.5, 5.5]
  }
];

// ============== COMPONENTES ==============

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <a 
          href="https://ufbra.com.br/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-10 flex items-center hover:opacity-80 transition-opacity"
          title="Ir para o site da UFBRA"
        >
          <img
            src="http://cdn.mcauto-images-production.sendgrid.net/1f39d6e45c56e7d9/df9f1508-d98e-4e5e-840d-baff32ba42bd/4558x1200.png"
            alt="Logo UF"
            className="h-full w-auto object-contain"
          />
        </a>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="text-success text-sm font-medium hidden sm:inline">Online e gratuito</span>
        <span className="text-success text-sm font-medium sm:hidden">Online e gratuito</span>
      </div>
    </div>
  </header>
);

const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
    <div className="absolute inset-0 bg-gradient-hero"></div>
    <div className="absolute top-32 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-float-delayed"></div>
    <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-float"></div>
    
    <div className="relative z-10 container mx-auto px-4 text-center">
      <div className="inline-block mb-6 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full">
        <span className="text-primary text-sm font-semibold">🎓 Baseado na teoria das Inteligências Múltiplas de Howard Gardner</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
        Descubra seu <br />
        <span className="text-gradient-ufbra">
          curso ideal
        </span>
        <br /> em 4 minutos
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
        Responda 36 perguntas rápidas baseadas em suas habilidades e preferências 
        e receba seu ranking personalizado de cursos universitários.
      </p>
      
      <Button 
        onClick={onStart} 
        size="lg" 
        className="text-lg px-10 py-7 rounded-full bg-gradient-blue hover:opacity-90 shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
      >
        Começar teste vocacional →
      </Button>
      
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-success font-bold">✓</span> 100% Gratuito
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success font-bold">✓</span> Resultado Imediato
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success font-bold">✓</span> + de 40 Cursos Analisados
        </div>
      </div>
    </div>
  </section>
);

const TheorySection = () => (
  <section className="py-16 md:py-24 bg-white relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent opacity-50"></div>

    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <div className="space-y-4 order-1 md:col-start-2 md:row-start-1 animate-in slide-in-from-right duration-700 delay-200">
            <div className="inline-block px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-2">
              <span className="text-[#1880c4] text-sm font-bold uppercase tracking-wide">Metodologia Científica</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Entenda a teoria por trás do seu resultado
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed text-justify">
              Inspirado na teoria do psicólogo <strong>Howard Gardner</strong>, este teste ajuda você a identificar suas principais habilidades entre nove tipos de inteligência: lógico-matemática, linguística, musical, espacial, corporal, interpessoal, intrapessoal, naturalista e existencial.
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed text-justify">
              Com apenas <strong>36 perguntas estratégicas</strong>, nosso algoritmo gera um mapa personalizado que conecta seu perfil cognitivo aos cursos da UFBRA com maior afinidade.
            </p>
          </div>

          <div className="flex justify-center order-2 md:col-start-1 md:row-start-1 md:row-span-2 self-center">
            <div className="relative">
              <div className="absolute inset-0 bg-success/5 rounded-full blur-3xl transform scale-110"></div>
              
              {/* === ANIMAÇÃO APLICADA AQUI === */}
              <img 
                src="/teste-vocacional-gratis-ufbra.png" 
                alt="Mandala das Inteligências Múltiplas de Howard Gardner"
                className="relative w-full max-w-md drop-shadow-xl 
                           animate-in zoom-in-50 fade-in duration-1000 delay-300 
                           hover:scale-105 transition-transform duration-500"
              />
              {/* Explicação das classes novas:
                  - animate-in: Ativa a animação de entrada.
                  - zoom-in-50: Começa com 50% do tamanho e cresce até 100%.
                  - fade-in: Começa transparente e fica visível.
                  - duration-1000: A entrada dura 1 segundo (bem suave).
                  - delay-300: Espera um pouquinho para começar (fica elegante).
              */}

            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm order-3 md:col-start-2 md:row-start-2 animate-in slide-in-from-right duration-700 delay-200">
            <h3 className="mb-4 text-[#1880c4] font-semibold text-lg">
              Passos para uma escolha de carreira segura:
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-[#1880c4] text-xl mt-[-2px]">•</span>
                <span><strong>Faça o teste:</strong> Descubra suas inclinações naturais e profissões compatíveis.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-[#009444] text-xl mt-[-2px]">•</span>
                <span><strong>Autoconhecimento:</strong> Entenda seus valores, interesses e personalidade.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-[#fab71b] text-xl mt-[-2px]">•</span>
                <span><strong>Mercado:</strong> Explore as áreas de atuação e habilidades valorizadas.</span>
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-[#1880c4] text-xl mt-[-2px]">•</span>
                <span><strong>Conexão:</strong> Converse com profissionais da área para validar sua escolha.</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </section>
);

// Tipo para controlar cada pergunta individualmente
type Pergunta = {
  categoria: string;
  texto: string;
  index: number; // Índice usado para armazenar a resposta da pergunta sorteada
};

interface StepProps {
  step: number;
  perguntas: Pergunta[];
  respostas: Record<string, number[]>;
  onSelect: (categoria: string, index: number, valor: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepSection = ({ step, perguntas, respostas, onSelect, onNext, onPrev }: StepProps) => {
  const progress = (step / 9) * 100;
  
  // Verifica se TODAS as 4 perguntas aleatórias da tela atual têm resposta
  const allAnswered = perguntas.every((q) => {
    const respCat = respostas[q.categoria];
    return respCat && respCat[q.index] !== undefined;
  });
  
  return (
    <section className="min-h-screen bg-muted/30 py-12 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Passo {step} de 9
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Instructions */}
        <div className="text-center mb-10">
          <p className="text-muted-foreground text-lg">
            Avalie de 1 a 5 o quanto cada afirmação descreve você
          </p>
        </div>

        {/* Questions - Agora renderiza perguntas mistas */}
        <div className="space-y-4">
          {perguntas.map((p, i) => {
            // Recupera o valor respondido para esta pergunta específica
            const valorRespondido = respostas[p.categoria]?.[p.index];

            return (
              // CORREÇÃO AQUI: Mudamos 'key={i}' para uma chave única composta.
              // Isso força o React a recriar o componente do zero, evitando o "glitch" de texto no iPhone.
              <Card 
                key={`${p.categoria}-${p.index}`} 
                className="border-border/50 bg-card/90 backdrop-blur transition-all duration-300 hover:shadow-card"
              >
                <CardContent className="p-6">
                  <p className="text-foreground mb-4 font-medium">
                    {p.texto}
                  </p>
                  <div className="flex justify-center gap-2 md:gap-4">
                    {[1, 2, 3, 4, 5].map((v) => (
                      <button
                        key={v}
                        onClick={() => onSelect(p.categoria, p.index, v)}
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-xl font-bold text-lg transition-all duration-200 
                          ${valorRespondido === v 
                            ? 'bg-primary text-primary-foreground shadow-glow scale-110' 
                            : 'bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary'
                          }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                    <span>Discordo</span>
                    <span>Concordo</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between mt-10 gap-4">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={step === 1}
          >
            ← Voltar
          </Button>
        
          <Button
            onClick={onNext}
            disabled={!allAnswered}
          >
            {step === 9 ? 'Finalizar teste' : 'Próximo →'}
          </Button>
        </div>

      </div>
    </section>
  );
};

interface ResultadoProps {
  resultado: { 
    nome: string; 
    aderencia: string; 
    area?: string; 
    descricao?: string; 
    link?: string; 
  }[];
  respostas: Record<string, number[]>;
  onRestart: () => void;
}

const ResultadoSection = ({ resultado, respostas, onRestart }: ResultadoProps) => {
  const [formData, setFormData] = useState({ nome: '', email: '', whatsapp: '', situacao: '' }); // campo de situação do lead
  const [liberado, setLiberado] = useState(false);
  const [itemAberto, setItemAberto] = useState<number | null>(0);
  const [graficoExpandido, setGraficoExpandido] = useState(false);

  const formatarTelefone = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    const limitado = apenasNumeros.slice(0, 11);
    if (limitado.length <= 2) return limitado;
    if (limitado.length <= 7) return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
    return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
  };

  const radarData = CATEGORIAS.map(cat => {
    const catRespostas = respostas[cat] || [0, 0, 0, 0];
    const score = catRespostas.reduce((a, b) => a + (b || 0), 0);
    
    // CORREÇÃO DE TEXTO CORTADO:
    // Cria um label abreviado apenas para exibição no gráfico
    let labelDisplay = cat;
    if (cat === 'Lógico-matemático') labelDisplay = 'Lóg. Matem.';
    if (cat === 'Corporal-Cinestésica') labelDisplay = 'Corp. Cinest.';
    if (cat === 'Interpessoal') labelDisplay = 'Interpess.';
    if (cat === 'Intrapessoal') labelDisplay = 'Intrapess.';

    return {
      categoria: labelDisplay, // Usa o nome abreviado
      fullCategoria: cat,      // Mantém o nome original se precisar
      score: score,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const numerosLimpos = formData.whatsapp.replace(/\D/g, '');

    if (numerosLimpos.length < 10) {
      toast.error('Número de WhatsApp inválido', {
        description: 'Por favor, insira o DDD e o número completo (ex: 11 99999-9999).'
      });
      return; 
    }

    toast.success('Análise realizada!', {
      description: 'Seu resultado foi liberado.'
    });
    setLiberado(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAccordion = (index: number) => {
    if (itemAberto === index) {
      setItemAberto(null); 
    } else {
      setItemAberto(index);
    }
  };

  const GraficoRadar = ({ expandido = false }) => (
    <ResponsiveContainer width="100%" height="100%">
      {/* CORREÇÃO DE RAIO:
         Reduzimos de 60% para 50% no mobile (normal) e 70% para 60% no expandido.
         Isso cria a margem necessária para os textos caberem.
      */}
      <RadarChart cx="50%" cy="50%" outerRadius={expandido ? "60%" : "50%"} data={radarData}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis 
          dataKey="categoria" 
          tick={{ 
            fill: 'hsl(var(--foreground))', 
            fontSize: expandido ? 12 : 10, // Fonte levemente reduzida para segurança
            fontWeight: 500
          }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 20]} 
          tick={{ fill: 'transparent' }} 
          axisLine={false}
        />
        <Radar
          name="Seu Perfil"
          dataKey="score"
          stroke="hsl(204 76% 44%)"
          fill="hsl(204 76% 44%)"
          fillOpacity={0.5}
          strokeWidth={3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  if (!liberado) {
    // Pega o nome do primeiro curso (Top 1) ou string vazia se der erro
    const topCurso = resultado[0]?.nome || "";

    return (
      <section className="min-h-screen bg-gradient-result py-12 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-primary text-sm font-semibold">🔒 RESULTADO PRONTO</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Análise Concluída!
            </h2>
            <p className="text-muted-foreground">
              Para liberar seu ranking exclusivo e o gráfico de competências, preencha seus dados de contato abaixo.
            </p>
          </div>
          <Card className="bg-card/90 backdrop-blur border-primary/20 shadow-glow-lg">
            <CardContent className="p-8">
              <form id="lead-collector-teste-vocacional" onSubmit={handleSubmit} className="space-y-4">
                
                {/* CAMPO OCULTO COM O TOP 1 CURSO */}
                <input type="hidden" name="curso_match" value={topCurso} />
                
                <Input
                  name="name"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={(e) => {
                    const apenasLetras = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
                    setFormData(prev => ({ ...prev, nome: apenasLetras }));
                  }}
                  required
                  className="h-12"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Seu e-mail"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="h-12"
                />
                <Input
                  name="phone"
                  placeholder="WhatsApp (com DDD)"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: formatarTelefone(e.target.value) }))}
                  required
                  className="h-12"
                  maxLength={15}
                  inputMode="numeric"
                />
                <select
                  name="situacao"
                  value={formData.situacao}
                  onChange={(e) => setFormData(prev => ({ ...prev, situacao: e.target.value }))}
                  required
                  className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione sua situação atual</option>
                  <option value="inicio_de_carreira">Início de carreira</option>
                  <option value="transicao_de_carreira">Transição de carreira</option>
                </select>
                
                <Button type="submit" className="w-full h-12 text-lg bg-gradient-blue hover:opacity-90 font-bold shadow-md">
                  Liberar resultado agora 🔓
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-result py-12 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {graficoExpandido && (
          <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl border border-border p-6 md:p-10 h-[80vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-foreground">Seu mapa de Inteligências</h3>
                <Button variant="ghost" size="icon" onClick={() => setGraficoExpandido(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-1 w-full min-h-0">
                <GraficoRadar expandido={true} />
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Para salvar: Tire um print desta tela (Captura de tela)
                </p>
                <Button onClick={() => setGraficoExpandido(false)} className="w-full sm:w-auto">
                  Fechar Visualização
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-12 animate-in fade-in duration-700">
          <div className="inline-block mb-4 px-5 py-2.5 bg-success/10 border border-success/20 rounded-full">
            <span className="text-success text-sm font-semibold">✓ ACESSO LIBERADO</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Seu resultado personalizado
          </h2>
          <p className="text-muted-foreground">
            Baseado nas suas respostas, identificamos os cursos mais compatíveis com seu perfil
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700">
          <Card className="bg-card/90 backdrop-blur border-border/50 h-fit relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4 relative">
                <h3 className="text-xl font-bold text-foreground text-center w-full">
                  Mapa de Inteligências
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-[-8px] text-muted-foreground hover:text-primary"
                  onClick={() => setGraficoExpandido(true)}
                  title="Expandir Gráfico"
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="h-[350px] relative">
                <GraficoRadar expandido={false} />
                <div 
                  className="absolute inset-0 cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-background/10 backdrop-blur-[1px]"
                  onClick={() => setGraficoExpandido(true)}
                >
                  <span className="bg-background/80 px-3 py-1 rounded-full text-xs font-medium shadow-sm border">
                    Clique para ampliar
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90 backdrop-blur border-border/50 h-fit">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                🏆 Top 6 cursos recomendados
              </h3>
              <div className="space-y-3">
                {resultado.map((curso, i) => {
                  const isOpen = itemAberto === i;
                  return (
                    <div 
                      key={i}
                      className={`rounded-xl transition-all duration-300 overflow-hidden border
                        ${i === 0 
                          ? 'bg-gradient-to-r from-primary/10 to-success/10 border-primary/30' 
                          : 'bg-muted/30 border-border/50 hover:bg-muted/50'
                        }`}
                    >
                      <div 
                        onClick={() => toggleAccordion(i)}
                        className="flex items-center justify-between p-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                            ${i === 0 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted-foreground/20 text-muted-foreground'
                            }`}>
                            {i + 1}
                          </span>
                          <div className="flex flex-col">
                            <span className={`font-medium leading-tight ${i === 0 ? 'text-foreground' : 'text-foreground/80'}`}>
                              {curso.nome}
                            </span>
                            {curso.area && (
                              <span className="text-xs text-muted-foreground font-normal mt-0.5">
                                {curso.area}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`font-bold ${i === 0 ? 'text-primary text-lg' : 'text-muted-foreground'}`}>
                            {curso.aderencia}%
                          </div>
                          <span className={`text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 fade-in duration-300">
                          <div className="pl-[3rem]">
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed border-t border-border/50 pt-3">
                              {curso.descricao || "Descrição do curso indisponível no momento."}
                            </p>
                            <a href={curso.link || "#"} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">
                                Quero saber mais →
                              </Button>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 animate-in fade-in delay-300 duration-700">
          <Button variant="ghost" onClick={onRestart} className="text-muted-foreground hover:text-primary">
            ↻ Refazer o teste
          </Button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-foreground text-background py-12">
    <div className="container mx-auto px-4 text-center">
      <div className="flex items-center justify-center gap-6 mb-6">
        <a 
          href="https://www.facebook.com/ufbra.oficial" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="https://d375w6nzl58bw0.cloudfront.net/uploads/e85a7300c4fa63e6cc4b9d2e688918fc81394819c725e4ebf06e0d68283d2817407eaca52ec2eb471f739d1c7d61136ae8e3ccbde25b712dd41d1ecaad20c19e.png" 
            alt="Facebook" 
            className="w-8 h-8 object-contain"
          />
        </a>

        <a 
          href="https://www.instagram.com/ufbra.oficial/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="https://d375w6nzl58bw0.cloudfront.net/uploads/4631bb4169e92ecf685f4cb18beca5156fa4e0693a7033064c371d7fed01565e1879cd6c89075ae44e29f6b6d6e9ce201bfa8875149c8cc979ea61cfbdb4fe3b.png" 
            alt="Instagram" 
            className="w-8 h-8 object-contain"
          />
        </a>

        <a 
          href="https://www.youtube.com/channel/UCRhEKT5tvrJxM8PgT54vyPQ" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="https://d375w6nzl58bw0.cloudfront.net/uploads/54999ad5cc1f5542c1d3fed472320e7f02659917bbfcc8fab7fb458e1513a8edc871ddd9d1f82f828355accac972471d07cee8b7df756621a6823c56c3d6c1d3.png" 
            alt="Youtube" 
            className="w-8 h-8 object-contain"
          />
        </a>
      </div>

      <p className="text-background/60 text-sm">
        UFBRA • R. Dolzani Ricardo, 335 • São José dos Campos • SP
      </p>
      <p className="text-background/40 text-xs mt-4">
        © {new Date().getFullYear()} — Este teste é uma ferramenta de orientação inicial gratuita.
      </p>
    </div>
  </footer>
);

// ============== PÁGINA PRINCIPAL ==============

const Index = () => {
  const [step, setStep] = useState(0); // 0 = hero, 1-9 = steps, 10 = resultado
  const [respostas, setRespostas] = useState<Record<string, number[]>>({});
  const [resultado, setResultado] = useState<{ 
    nome: string; 
    aderencia: string;
    area?: string;
    descricao?: string;
    link?: string;
  }[]>([]);

  // 1. Gera um array único com 36 perguntas embaralhadas (4 de cada categoria)
  const [perguntasDoTeste] = useState<Pergunta[]>(() => {
    const todasAsPerguntas: Pergunta[] = [];
    
    CATEGORIAS_TESTE.forEach(cat => {
      // Pega 4 perguntas aleatórias desta categoria
      const perguntasDaCategoria = [...PERGUNTAS[cat]]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
        
      // Cria o objeto Pergunta com índice usado para armazenar a resposta da pergunta sorteada
      perguntasDaCategoria.forEach((texto, index) => {
        todasAsPerguntas.push({
          categoria: cat,
          texto: texto,
          index: index // Importante para salvar no slot correto do array de respostas
        });
      });
    });

    // Embaralha TODAS as perguntas para misturar as categorias nos passos
    return todasAsPerguntas.sort(() => 0.5 - Math.random());
  });

  // Scroll automático sempre que mudar de etapa
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleStart = () => {
    setStep(1);
  };

  const handleSelect = (categoria: string, index: number, valor: number) => {
    setRespostas(prev => {
      const catRespostas = [...(prev[categoria] || [])];
      catRespostas[index] = valor;
      return { ...prev, [categoria]: catRespostas };
    });
  };

  const calcularResultado = () => {
    const userVector = CATEGORIAS.map(cat => {
      const catRespostas = respostas[cat] || []; 
      return catRespostas.reduce((a, b) => a + (b || 0), 0);
    });

    const userMag = Math.sqrt(userVector.reduce((sum, val) => sum + (val * val), 0));

    if (userMag === 0) return [];

    const rankings = CURSOS.map(curso => {
      const dotProduct = userVector.reduce((sum, val, i) => {
        return sum + (val * (curso.vetor[i] || 0));
      }, 0);

      const courseMag = Math.sqrt(curso.vetor.reduce((sum, val) => sum + (val * val), 0));

      let similarity = 0;
      if (courseMag > 0) {
        similarity = dotProduct / (userMag * courseMag);
      }

      return {
        nome: curso.nome,
        area: curso.area,
        descricao: curso.descricao,
        link: curso.link,
        aderencia: (similarity * 100).toFixed(1)
      };
    })
    .sort((a, b) => parseFloat(b.aderencia) - parseFloat(a.aderencia))
    .slice(0, 6);

    return rankings;
  };

  const handleNext = () => {
    // Pega as 4 perguntas da tela atual
    const perguntasAtuais = perguntasDoTeste.slice((step - 1) * 4, step * 4);
    
    // Verifica se TODAS elas foram respondidas
    const tudoRespondido = perguntasAtuais.every(q => {
       const resp = respostas[q.categoria];
       return resp && resp[q.index] !== undefined;
    });

    if (!tudoRespondido) {
      toast.error('Responda todas as perguntas antes de avançar.');
      return;
    }

    if (step < 9) {
      setStep(step + 1);
    } else {
      const rankings = calcularResultado();
      setResultado(rankings);
      setStep(10);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  useEffect(() => {
    document.title = 'Teste Vocacional UFBRA - Descubra seu curso ideal';
  }, []);

  // Seleciona o "lote" de 4 perguntas para o passo atual
  const perguntasAtuais = perguntasDoTeste.slice((step - 1) * 4, step * 4);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {step === 0 && (
        <>
          <Hero onStart={handleStart} />
          <TheorySection />
        </>
      )}
      
      {step >= 1 && step <= 9 && (
        <StepSection
          step={step}
          perguntas={perguntasAtuais}
          respostas={respostas}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      
      {step === 10 && (
        <ResultadoSection
          resultado={resultado}
          respostas={respostas}
          onRestart={handleRestart}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
