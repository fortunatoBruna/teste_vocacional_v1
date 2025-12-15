import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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

// Apenas as 8 categorias usadas no teste (nao tem a existencial)
const CATEGORIAS_TESTE = [
  'Naturalista', 'Musical', 'Lógico-matemático', 'Interpessoal', 'Corporal-Cinestésica', 'Linguística', 'Intrapessoal', 'Espacial'
];

const PERGUNTAS: Record<string, string[]> = {
  'Lógico-matemático': [
    "Usar números e símbolos numéricos é fácil para mim",
    "Costumo desenvolver equações para descrever relacionamentos e / ou para explicar minhas observações",
    "Muitas vezes vejo sentidos matemáticos no mundo ao meu redor",
    "Matemática sempre foi uma das minhas aulas favoritas",
    "Eu gosto de pensar sobre questões numéricas e examinar as estatísticas",
    "Eu costumo entender as coisas ao meu redor através de um sentido matemático",
    "Gosto de solucionar quebra-cabeças"
  ],
  'Naturalista': [
    "O mundo de plantas e animais é importante para mim",
    "Eu gosto de animais de estimação",
    "Eu gosto de aprender sobre a natureza",
    "Gosto de cuidar das minhas plantas em casa",
    "Gosto de caça e pesca",
    "Gosto de caminhar em lugares naturais",
    "Fico ansioso ao visitar o zoológico"
  ],
  'Musical': [
    "Minha educação musical começou quando eu era mais jovem e continua ainda hoje",
    "Eu sou bom em tocar um instrumento e cantar",
    "Lembro-me a melodia de uma canção quando perguntado",
    "Orgulho-me de minhas realizações musicais",
    "A música é muito importante para mim na vida diária",
    "Tenho amplos e variados interesses musicais, incluindo clássicos e contemporâneos",
    "Eu tenho um bom senso de afinação, tempo e ritmo"
    
  ],
  'Interpessoal': [
    "Eu sinto que as pessoas de todas as idades gostam de mim",
    "Eu gosto de estar com todos os diferentes tipos de pessoas",
    "Eu respondo a todas as pessoas com entusiasmo, livre de viés ou preconceito",
    "Gosto de situações sociais novas ou únicas",
    "Gosto de elogiar os outros quando eles fizeram bem",
    "Sou rápido para sentir nos outros desonestidade e desejo de me manipular",
    "Sinto-me seguro quando estou com estranhos"
  ],
  'Linguística': [
    "Gosto de ouvir discursos",
    "Eu gosto de manter um diário de minhas experiências",
    "Eu leio e aprecio a poesia e, ocasionalmente, escrevo a minha própria",
    "Eu falo muito e gosto de contar histórias",
    "Eu me orgulho de ter um grande vocabulário",
    "Eu gosto de aprender novas palavras e faço isso facilmente",
    "Gosto de ler e leio diariamente"
  ],
  'Intrapessoal': [
    "Eu tento não perder meu tempo com perseguições sem importância",
    "Muitas vezes penso sobre os problemas em minha comunidade, estado e / ou mundo e que eu posso fazer para ajudar a corrigir qualquer um deles",
    "Eu sou sempre totalmente honesto comigo mesmo",
    "Eu gosto de estar sozinho e pensar sobre a minha vida",
    "Costumo procurar fraquezas em mim que eu vejo nos outros",
    "Muitas vezes penso sobre a influência que tenho sobre os outros",
    "Eu acredito que eu sou responsável por meus atos e quem eu sou"
  ],
  'Corporal-Cinestésica': [
    "Eu me considero um atleta",
    "Eu gosto de estar fisicamente apto",
    "Eu tenho um bom equilíbrio e coordenação olho-mão e me sinto confortável em esportes que usam uma bola",
    "Minha coordenação me destaca em atividades de alta velocidade",
    "Gosto de estar ao ar livre e praticar deferentes esportes",
    "Eu gosto da emoção da competição pessoal e da equipe",
    "Eu gosto de me movimentar muito"
  ],
  'Espacial': [
    "Eu sempre sei onde estou em relação à minha casa",
    "Eu não me perco facilmente e posso me orientar tanto com mapas ou marcos",
    "Sei direções com facilidade",
    "Eu tenho a capacidade de representar o que eu vejo pelo desenho ou pintura",
    "Minha capacidade de desenhar é reconhecida e elogiada por outros",
    "Eu posso facilmente reproduzir cor, forma, sombreamento e textura em desenhos",
    "Ver as coisas em três dimensões é fácil para mim, e eu gosto de fazer as coisas em três dimensões"
  ]
};

const CURSOS = [
  { nome: 'Administração', vetor: [1.7,1.7,7.9,1.7,8.9,1.6,7.3,6.4,2.2] },
  { nome: 'Pedagogia', vetor: [6.3,1.7,6.3,7.4,10.0,1.5,8.9,7.4,5.7] },
  { nome: 'Ciências Contábeis', vetor: [1.7,1.7,8.7,1.7,7.1,1.6,6.5,2.6,2.2] },
  { nome: 'Educação Física', vetor: [2.8,5.4,5.2,1.5,6.5,8.8,6.4,2.6,8.1] },
  { nome: 'Enfermagem', vetor: [9.6,1.7,4.0,1.5,6.5,2.1,4.9,2.6,2.1] },
  { nome: 'Engenharia Civil', vetor: [1.8,1.5,8.1,1.5,4.0,1.5,2.4,1.5,9.5] },
  { nome: 'Agronomia', vetor: [9.8,1.5,7.2,2.1,6.5,2.5,5.4,3.2,4.8] },
  { nome: 'Criminologia', vetor: [1.7,1.6,6.8,3.5,8.4,2.8,7.6,7.2,3.1] },
  { nome: 'Energias Renováveis', vetor: [7.3,1.5,8.5,2.2,6.2,1.8,4.9,4.1,7.9] },
  { nome: 'Engenharia de Software', vetor: [1.6,1.6,9.8,1.5,5.4,1.5,7.3,2.1,3.2] },
  { nome: 'Estética e Cosmética', vetor: [4.2,1.7,5.6,2.1,7.1,7.8,5.2,3.4,6.5] },
  { nome: 'Gestão de Recursos Humanos', vetor: [1.7,1.7,6.4,3.2,9.6,1.6,6.8,6.9,1.9] },
  { nome: 'Gestão Hospitalar', vetor: [3.8,1.6,7.1,4.5,8.7,2.4,6.5,5.8,2.6] },
  { nome: 'Investigação Forense e Perícia Criminal', vetor: [2.1,1.5,8.2,3.8,7.4,3.5,7.9,6.7,5.4] },
  { nome: 'Produção Audiovisual', vetor: [1.8,6.8,5.9,2.4,6.3,2.2,7.2,4.1,8.9] },
  { nome: 'Segurança do Trabalho', vetor: [4.1,1.6,6.7,3.1,7.5,5.8,5.3,4.9,4.2] },
  { nome: 'Segurança Pública', vetor: [2.5,1.7,5.4,4.2,9.2,6.4,6.1,5.6,3.8] },
  { nome: 'Terapia Ocupacional', vetor: [5.6,2.1,4.8,4.9,8.9,7.2,6.4,6.3,4.7] },
  { nome: 'Logística', vetor: [1.6,1.7,4.3,1.6,4.5,1.5,6.5,1.9,3.3] },
  { nome: 'Fisioterapia', vetor: [7.3,1.7,3.2,1.5,4.2,7.3,6.4,2.6,4.4] },
  { nome: 'Serviço Social', vetor: [1.7,1.7,1.9,5.4,7.6,1.6,6.5,2.6,2.2] },
  { nome: 'Psicologia', vetor: [6.2,1.7,1.7,6.6,9.8,1.7,6.6,6.5,1.9] },
  { nome: 'Nutrição', vetor: [8.8,1.7,4.7,1.5,7.2,2.1,6.4,4.8,2.1] },
  { nome: 'Análise e Desenvolvimento de Sistemas', vetor: [1.6,1.5,8.4,1.5,2.2,1.5,7.2,1.5,2.3] },
  { nome: 'Marketing', vetor: [1.6,3.9,6.5,1.6,9.8,1.5,6.5,4.9,1.8] },
  { nome: 'Farmácia', vetor: [8.8,1.7,7.0,1.5,5.7,2.1,6.4,3.3,2.1] },
  { nome: 'Gestão Financeira', vetor: [1.6,1.7,6.5,1.6,6.8,1.5,6.5,4.9,1.8] },
  { nome: 'Processos Gerenciais', vetor: [1.6,1.7,7.3,1.6,8.3,1.5,6.5,1.9,1.8] },
  { nome: 'Biomedicina', vetor: [8.4,1.6,7.1,1.5,6.5,1.7,5.6,1.6,1.8] },
  { nome: 'Engenharia de Produção', vetor: [1.8,1.5,8.3,1.5,7.7,1.5,5.4,1.5,6.5] },
  { nome: 'Sistemas de Informação', vetor: [1.6,1.6,7.5,1.5,2.4,1.5,6.4,1.7,2.3] },
  { nome: 'Gestão Comercial', vetor: [1.6,1.7,6.5,1.6,8.3,1.5,6.5,1.9,1.8] },
  { nome: 'Engenharia Mecânica', vetor: [1.8,1.5,9.3,1.5,5.5,1.5,5.4,1.5,8.0] },
  { nome: 'Publicidade e Propaganda', vetor: [1.8,5.5,5.5,2.2,9.3,1.5,6.6,2.1,1.9] },
  { nome: 'Ciência da Computação', vetor: [1.6,1.6,9.3,1.5,5.4,1.5,7.2,1.7,2.3] },
  { nome: 'Gestão Ambiental', vetor: [7.3,1.6,6.3,1.6,6.7,1.6,5.6,1.7,6.2] },
  { nome: 'Engenharia Elétrica', vetor: [1.8,1.5,10.3,1.5,5.5,1.5,5.4,1.5,5.8] },
  { nome: 'Design Gráfico', vetor: [1.7,1.7,6.4,1.7,6.1,1.6,5.8,1.9,8.2] },
  { nome: 'Gastronomia', vetor: [5.4,1.7,5.7,1.7,6.9,3.1,2.8,1.9,5.9] },
  { nome: 'Redes de Computadores', vetor: [1.6,1.5,9.6,1.5,5.2,1.5,5.7,1.5,5.3] },
  { nome: 'Gestão da Qualidade', vetor: [1.6,1.7,7.3,1.6,6.8,1.5,5.7,1.9,1.8] },
  { nome: 'Automação Industrial', vetor: [1.6,1.5,8.4,1.5,5.5,1.5,2.3,1.5,6.9] },
  { nome: 'Letras - Português e Inglês', vetor: [1.6,1.6,5.6,1.6,7.6,1.5,9.1,1.7,1.8] },
  { nome: 'Gestão de Tecnologia da Informação', vetor: [1.6,1.6,8.3,1.5,6.2,1.5,7.2,1.7,2.3] }
];

// ============== COMPONENTES ==============

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Container da imagem (mantive as dimensões e arredondamento) */}
        <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
          <img 
            src="http://cdn.mcauto-images-production.sendgrid.net/1f39d6e45c56e7d9/df9f1508-d98e-4e5e-840d-baff32ba42bd/4558x1200.png" 
            alt="Logo" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Texto "TESTE VOCACIONAL" removido daqui */}
        
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </span>
        <span className="text-success text-sm font-medium hidden sm:inline">Teste vocacional online e gratuito</span>
        <span className="text-success text-sm font-medium sm:hidden">Online</span>
      </div>
    </div>
  </header>
);

const Hero = ({ onStart }: { onStart: () => void }) => (
  <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-hero"></div>
    
    {/* Floating shapes - UFBRA colors */}
    <div className="absolute top-32 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl animate-float"></div>
    <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-float-delayed"></div>
    <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-accent/15 rounded-full blur-3xl animate-float"></div>
    
    <div className="relative z-10 container mx-auto px-4 text-center">
      <div className="inline-block mb-6 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full">
        <span className="text-primary text-sm font-semibold">🎓 Baseado na Teoria das Inteligências Múltiplas</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
        Descubra seu <br />
        <span className="text-gradient-ufbra">
          curso ideal
        </span>
        <br /> em 3 minutos
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
        Responda 32 perguntas rápidas baseadas em suas habilidades e preferências 
        e receba seu ranking personalizado de cursos universitários.
      </p>
      
      <Button 
        onClick={onStart} 
        size="lg" 
        className="text-lg px-10 py-7 rounded-full bg-gradient-blue hover:opacity-90 shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
      >
        Começar Teste Gratuito →
      </Button>
      
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="text-success font-bold">✓</span> 100% Gratuito
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success font-bold">✓</span> Resultado Imediato
        </div>
        <div className="flex items-center gap-2">
          <span className="text-success font-bold">✓</span> 19 Cursos Analisados
        </div>
      </div>
    </div>
  </section>
);

interface StepProps {
  step: number;
  categoria: string;
  perguntas: string[];
  respostas: Record<string, number[]>;
  onSelect: (categoria: string, index: number, valor: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepSection = ({ step, categoria, perguntas, respostas, onSelect, onNext, onPrev }: StepProps) => {
  const progress = (step / 8) * 100;
  const currentRespostas = respostas[categoria] || [];
  const allAnswered = currentRespostas.filter(r => r !== undefined).length === 4;

  return (
    <section className="min-h-screen bg-muted/30 py-12 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Passo {step} de 8
            </span>
            <span className="text-sm font-semibold text-primary">
              {categoria}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Category Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Inteligência {categoria}
          </h2>
          <p className="text-muted-foreground">
            Avalie de 1 a 5 o quanto cada afirmação descreve você
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {perguntas.map((texto, i) => (
            <Card key={i} className="border-border/50 bg-card/90 backdrop-blur transition-all duration-300 hover:shadow-card">
              <CardContent className="p-6">
                <p className="text-foreground mb-4 font-medium">
                  {i + 1}. {texto}
                </p>
                <div className="flex justify-center gap-2 md:gap-4">
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => onSelect(categoria, i, v)}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl font-bold text-lg transition-all duration-200 
                        ${currentRespostas[i] === v 
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
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-10 gap-4">
          <Button 
            variant="outline" 
            onClick={onPrev}
            disabled={step === 1}
            className="px-8"
          >
            ← Voltar
          </Button>
          <Button 
            onClick={onNext}
            disabled={!allAnswered}
            className="px-8 bg-gradient-blue hover:opacity-90"
          >
            {step === 8 ? 'Ver Resultado' : 'Próxima →'}
          </Button>
        </div>
      </div>
    </section>
  );
};

interface ResultadoProps {
  resultado: { nome: string; aderencia: string }[];
  respostas: Record<string, number[]>;
  onRestart: () => void;
}

const ResultadoSection = ({ resultado, respostas, onRestart }: ResultadoProps) => {
  const [formData, setFormData] = useState({ nome: '', email: '', whatsapp: '' });

  // Calculate radar data
  const radarData = CATEGORIAS.map(cat => {
    const catRespostas = respostas[cat] || [0, 0, 0, 0];
    const score = catRespostas.reduce((a, b) => a + (b || 0), 0);
    return {
      categoria: cat.length > 10 ? cat.slice(0, 10) + '...' : cat,
      fullCategoria: cat,
      score: score,
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Resultado enviado para seu WhatsApp!', {
      description: 'Em breve você receberá os detalhes completos.'
    });
    setFormData({ nome: '', email: '', whatsapp: '' });
  };

  return (
    <section className="min-h-screen bg-gradient-result py-12 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-5 py-2.5 bg-success/10 border border-success/20 rounded-full">
            <span className="text-success text-sm font-semibold">✓ Teste Concluído</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Seu Resultado Personalizado
          </h2>
          <p className="text-muted-foreground">
            Baseado nas suas respostas, identificamos os cursos mais compatíveis com seu perfil
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <Card className="bg-card/90 backdrop-blur border-border/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                Seu Perfil de Inteligências
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="categoria" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 20]} 
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Radar
                      name="Seu Perfil"
                      dataKey="score"
                      stroke="hsl(204 76% 44%)"
                      fill="hsl(204 76% 44%)"
                      fillOpacity={0.4}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top 6 Courses */}
          <Card className="bg-card/90 backdrop-blur border-border/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                🏆 Top 6 Cursos Recomendados
              </h3>
              <div className="space-y-3">
                {resultado.map((curso, i) => (
                  <div 
                    key={i}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all
                      ${i === 0 
                        ? 'bg-gradient-to-r from-primary/15 to-success/15 border-2 border-primary/30' 
                        : 'bg-muted/50 border border-border/50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${i === 0 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted-foreground/20 text-muted-foreground'
                        }`}>
                        {i + 1}
                      </span>
                      <span className={`font-medium ${i === 0 ? 'text-foreground' : 'text-foreground/80'}`}>
                        {curso.nome}
                      </span>
                    </div>
                    <div className={`font-bold ${i === 0 ? 'text-primary text-lg' : 'text-muted-foreground'}`}>
                      {curso.aderencia}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Form */}
        <Card className="mt-8 bg-gradient-to-br from-primary/5 to-success/5 border-primary/20">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
              📱 Receba os detalhes no seu WhatsApp
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Enviaremos informações completas sobre os cursos recomendados
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <Input
                placeholder="Seu nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
                className="h-12"
              />
              <Input
                type="email"
                placeholder="Seu e-mail"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                className="h-12"
              />
              <Input
                placeholder="WhatsApp (com DDD)"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                required
                className="h-12"
              />
              <Button type="submit" className="w-full h-12 text-lg bg-gradient-blue hover:opacity-90">
                Enviar Resultado →
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Restart Button */}
        <div className="text-center mt-8">
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
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-tricolor rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xs">UF</span>
        </div>
        <span className="text-xl font-bold">UFBRA</span>
      </div>
      <p className="text-background/60 text-sm">
        Universidade Federal do Brasil — Todos os direitos reservados
      </p>
      <p className="text-background/40 text-xs mt-4">
        © {new Date().getFullYear()} — Teste Vocacional baseado na Teoria das Inteligências Múltiplas
      </p>
    </div>
  </footer>
);

// ============== PÁGINA PRINCIPAL ==============

const Index = () => {
  const [step, setStep] = useState(0); // 0 = hero, 1-8 = steps, 9 = resultado
  const [respostas, setRespostas] = useState<Record<string, number[]>>({});
  const [resultado, setResultado] = useState<{ nome: string; aderencia: string }[]>([]);

  const handleStart = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelect = (categoria: string, index: number, valor: number) => {
    setRespostas(prev => {
      const catRespostas = [...(prev[categoria] || [])];
      catRespostas[index] = valor;
      return { ...prev, [categoria]: catRespostas };
    });
  };

  const calcularResultado = () => {
    const scores = CATEGORIAS.map(cat => {
      const catRespostas = respostas[cat] || [0, 0, 0, 0];
      return catRespostas.reduce((a, b) => a + (b || 0), 0);
    });

    const norma = Math.sqrt(scores.reduce((a, b) => a + b * b, 0));
    const vetorUsuario = scores.map(s => (s * 100) / norma);

    const rankings = CURSOS.map(curso => {
      const erro = Math.sqrt(
        vetorUsuario.reduce(
          (soma, val, i) => soma + Math.pow(val - curso.vetor[i], 2),
          0
        )
      );
      return {
        nome: curso.nome,
        aderencia: (100 - erro).toFixed(1)
      };
    })
    .sort((a, b) => parseFloat(b.aderencia) - parseFloat(a.aderencia))
    .slice(0, 6);

    return rankings;
  };

  const handleNext = () => {
    const categoria = CATEGORIAS_TESTE[step - 1];
    const currentRespostas = respostas[categoria] || [];
    
    if (currentRespostas.filter(r => r !== undefined).length < 4) {
      toast.error('Responda todas as perguntas antes de avançar.');
      return;
    }

    if (step < 8) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const rankings = calcularResultado();
      setResultado(rankings);
      setStep(9);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setStep(0);
    setRespostas({});
    setResultado([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    document.title = 'Teste Vocacional UFBRA - Descubra seu curso ideal';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {step === 0 && <Hero onStart={handleStart} />}
      
      {step >= 1 && step <= 8 && (
        <StepSection
          step={step}
          categoria={CATEGORIAS_TESTE[step - 1]}
          perguntas={PERGUNTAS[CATEGORIAS_TESTE[step - 1]]}
          respostas={respostas}
          onSelect={handleSelect}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      
      {step === 9 && (
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
