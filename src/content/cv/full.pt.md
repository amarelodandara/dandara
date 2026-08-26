# CV completo (pt-BR) — o repertório, não um documento

**Este arquivo nunca é renderizado, nunca é gerado, nunca é enviado.** É a
versão superconjunto em português: todo material verdadeiro, já em linguagem de
currículo, para que adaptar seja *escolher* e não inventar.

`src/lib/cv/load.ts` só resolve `base.<lang>.md` nesta raiz ou
`tailored/<slug>.<lang>.md` abaixo dela. Um arquivo `full.pt.md` aqui não é
alcançável pela rota `/cv` nem por `npm run cv:pdf`. Isso é proposital.

**Divisão de responsabilidade com `full.en.md`:** este arquivo guarda apenas a
*redação em português*. Toda a orientação — fatos fixos, números citáveis, o que
Nicoly não pode alegar, como tratar o período sabático, notas de ângulo por
vaga — vive só em `full.en.md`, em um lugar só, para não divergir. **Leia
`full.en.md` primeiro, sempre, mesmo quando a vaga for em português.**

---

## Resumos — escolha um, depois ajuste

Cada um tem um centro de gravidade diferente. Pegue o mais próximo da vaga e
incline-o para o vocabulário dela; não empilhe dois.

### Ênfase em product design
Product Designer com perfil T, forte em UX, UI e código, projetando software
in-house em escala de consumo. Assume problemas de ponta a ponta — enquadrar,
explorar, validar, entregar, iterar — e define os critérios de sucesso pelos
quais o trabalho é julgado. Conduz pesquisa leve e experimentos de usabilidade,
lê sinal qualitativo e quantitativo em conjunto e usa ferramentas de IA
diariamente da descoberta à produção. Destila problemas ambíguos e feedback em
soluções claras e focadas, e comunica por escrito.

### Ênfase em design engineering
Product Designer que trabalha dentro do código. Projetou software de terminal de
pagamento rodando em 22+ modelos de dispositivos e 4,5 milhões de terminais
ativos, e entrega os próprios produtos em TypeScript,
React e Next.js — incluindo um sistema de animação acessível sobre a Web
Animations API e um pipeline de documentos que gera e verifica PDFs a partir do
fonte. Prototipa em padrão de produção, com marcação semântica e acessibilidade
resolvidas, atua com engenharia como par em vez de repassar entregas, e constrói
a ferramentaria interna que mantém design e engenharia no mesmo compasso.

### Ênfase em produto em escala de consumo
Product Designer que entregou software in-house em escala nacional de consumo.
Projetou software de terminal de pagamento rodando em 22+ modelos de
dispositivos e 4,5 milhões de terminais ativos, trabalhando com o design system
Android da Stone em uma suíte de 14 aplicativos, usando seus componentes onde
cobriam a superfície e desenhando as telas e fluxos que ele não cobria. Trabalha
a partir do produto entregue e atua lado a lado com engenharia para que o que
chega ao usuário seja o que foi pretendido.

### Ênfase em pesquisa e design de serviços
Product Designer com prática de design de serviços, atuando da descoberta
contínua à produção. Conduz experimentos de usabilidade e conversas com
usuários, instrumenta o próprio trabalho e lê dados qualitativos e quantitativos
juntos para decidir direção. Autora de um framework acadêmico de design de
serviços para a experiência do usuário em museus, publicado como site de
pesquisa em vez de PDF e aplicado a um estudo de campo com museus educativos de
Belo Horizonte.

### Ênfase em IA
Product Designer que usa LLMs como instrumento diário, não como demonstração.
Prototipa, redige e entrega com Claude Code da descoberta à produção, e já
construiu software funcionando com ele — um site pessoal com pipeline próprio de
documentos e um site de pesquisa publicado — mantendo as decisões de julgamento,
a acessibilidade e o craft como trabalho dela. Usa IA como alavanca, sem
depender dela.

---

## Repertório de competências

Puxe daqui; reescreva na terminologia da vaga em vez de colar a lista inteira.

**Design**
Figma · prototipação · trabalho dentro de um design system · componentes ·
mockups e telas em alta fidelidade · telas e fluxos · design de interação ·
motion e animação · tipografia · identidade visual e design de logo ·
arquitetura de informação · taxonomia · crítica de design e feedback ·
design de serviços · service blueprints · acessibilidade

**Código e craft**
TypeScript · React · Next.js (App Router) · HTML e marcação semântica · CSS ·
Tailwind CSS · Web Animations API · MDX · Playwright · ESLint · Git e GitHub ·
Vercel · Android (lado de design, dentro do código) · APIs e integrações ·
prototipação em código em padrão de produção

**IA**
Claude Code diariamente, da descoberta à produção · prototipação assistida por
LLM · skills e ferramentas de agente · construção de ferramentas internas sobre
modelos

**Pesquisa e processo**
Testes e experimentos de usabilidade · descoberta contínua · análise qualitativa
e quantitativa · conversas com usuários · definição de critérios de sucesso e
métricas · escopo e priorização · comunicação escrita assíncrona · documentação
· falar em público

**Domínio**
Pagamentos e fintech · ponto de venda e hardware de terminal · Pix ·
marketplaces e locação · escala de consumo · museologia e instituições culturais
· publicação e editorial

---

## Experiência Profissional

### Stone Co. — Product Designer
Remoto, Brasil | 06/2022 - 03/2026

**Escala, e trabalho com o design system**
- Projetou software de terminal de pagamento rodando em 22+ modelos de
  dispositivos e 4,5 milhões de terminais ativos, com experiência de pagamento
  consistente e de alta qualidade em todo o país.
- Trabalhou com o design system Android da Stone em uma suíte de 14 aplicativos
  de terminal — pagamento, Pix e Pix NFC, comprovantes, fechamento, relatórios,
  pré-autorização, cancelamento, a loja de aplicativos e o launcher do sistema —
  usando seus componentes onde cobriam a superfície que ela estava desenhando.
- Projetou sob restrição de hardware — telas pequenas, forte fragmentação de
  dispositivos, comprovantes em impressão térmica — onde uma tela precisava se
  sustentar no terminal mais antigo da frota, não no mais novo.

**Não escrever, conforme a Nicoly, 26/08/2026:** que ela construiu, manteve ou
foi dona do design system da Stone; que sustentou a paridade design-código; que
trabalhou dentro do código dos componentes ou revisou sua implementação em PRs.
Ela era consumidora do sistema, ele não cobria toda a área dela na empresa, e
isso era inferência de um rascunho anterior, não o relato dela.

**Autonomia, zero-a-um e escopo**
- Liderou 2 produtos zero-a-um em 3 plataformas e 4 organizações, escopando e
  propondo o trabalho, destilando problemas ambíguos em soluções focadas e
  alinhando stakeholders multidisciplinares.
- Propôs trabalho que não lhe foi atribuído, conduziu até a aprovação e
  acompanhou até produção — os lançamentos nasceram do enquadramento dela do
  problema, não de um briefing recebido.
- Coordenou quatro organizações distintas dentro da empresa para entregar um
  único produto, negociando escopo e sequência entre times que não compartilhavam
  roadmap.

**Craft sob pressão de tempo**
- Refinou telas e fluxos centrais de uma nova tecnologia de pagamento como única
  designer, definindo critérios de sucesso e entregando especificações prontas
  para produção dentro de uma janela comprimida, combinando velocidade com craft.
- Era a única designer daquela superfície: enquadramento, exploração, detalhe de
  interação, especificação e acompanhamento com engenharia ficaram com ela.
- Sustentou qualidade nos detalhes que um processo apressado costuma abandonar —
  estados, casos de borda, textos de erro e o que o terminal faz quando a rede
  não responde.

**Pesquisa, dados e critérios de sucesso**
- Definiu os critérios de sucesso pelos quais o próprio trabalho seria medido, em
  vez de herdá-los, e ajustou direção pelo que os números mostraram depois do
  lançamento.
- Usou sinal qualitativo e quantitativo em conjunto — temas de atendimento,
  retorno de campo dos lojistas e analytics de produto — para escolher entre
  alternativas.

**Comunicação e influência**
- Comunicou decisões de design por escrito para uma audiência assíncrona e
  multidisciplinar, usando a escrita como mecanismo de alinhamento em vez da
  presença em reunião.
- Apresentou a Stone Terminal Store no palco, explicando o produto e a razão de
  suas decisões de design para uma audiência fora do próprio time.
- Deu e recebeu crítica de design como prática de rotina, tratando a revisão como
  lugar onde o trabalho melhora e não como portão a atravessar.

### Independente — Design e Engenharia
Remoto, Brasil | 03/2026 - Presente

Consulte *The current period* em `full.en.md` antes de escrever isto em um
currículo — o enquadramento depende da vaga, e uma das opções é omitir.

- Projetou e entregou dois sites em produção de ponta a ponta — conceito,
  identidade visual, design de interação, implementação front-end,
  acessibilidade e deploy — trabalhando sozinha no código, do repositório vazio
  à URL no ar.
- Construiu o adandara.com, portfólio pessoal desenhado como uma exposição de
  museu, com sistema de zoom interrompível sobre a Web Animations API, uma
  camada de modais acessível e um pipeline local que gera e verifica PDFs
  legíveis por ATS a partir de markdown.
- Construiu e publicou o servico-museu.vercel.app, publicando uma pesquisa
  acadêmica de design de serviços em andamento como experiência de leitura em vez
  de PDF, com busca das instituições dentro do recorte do estudo.
- Desenhou a operação de campo da pesquisa: materiais de recrutamento, o convite
  de participação e o instrumento que permite ao museu verificar se está na
  amostra.
- Usou Claude Code como ambiente de trabalho diário nos dois produtos, do
  primeiro rascunho ao deploy.

### QuintoAndar — Product Designer
Remoto, Brasil | 12/2021 - 04/2022

- Projetou e iterou mockups, protótipos de alta fidelidade e funcionalidades em
  produção para a maior plataforma de aluguel do Brasil, em descoberta e entrega
  contínuas com engenharia e produto, conduzindo experimentos de usabilidade e
  usando dados qualitativos, quantitativos e feedback de usuários para embasar
  decisões.
- Atuou em descoberta e entrega contínuas em paralelo, de modo que a pesquisa
  alimentava a próxima iteração e não um projeto futuro.
- Conduziu experimentos de usabilidade em fluxos em produção e usou os
  resultados para decidir entre alternativas concorrentes.
- Trabalhou lado a lado com engenheiros e product managers dentro da squad, em
  vez de entregar arquivos prontos a ela.

---

## Formação

### Universidade Estadual de Minas Gerais — Bacharelado em Design Gráfico
05/2021 - Presente

- TCC: Framework de Service Design para Experiência do Usuário em Museus — uma
  proposta de diretrizes para a instituição museo-educativa, no cruzamento entre
  museologia, design de serviços e design da informação. Em coautoria com
  Letícia França, sob orientação de Simone Souza. Pesquisa de campo entre
  09/2026 e 10/2026; defesa em seguida.
- Formação no ofício físico do design gráfico — tipografia, impressão,
  materiais, sistemas visuais — em paralelo à prática digital.
- **Ainda não graduada.** Escreva "previsão" apenas se a vaga pedir data, e
  nunca afirme conclusão.

### Centro Federal de Educação Tecnológica de Minas Gerais — Técnico em Informática
05/2017 - 03/2021

- Projeto de conclusão: Serase, um aplicativo mobile de finanças pessoais para
  pessoas de baixa renda.
- Curso técnico de quatro anos em informática, cursado junto ao ensino médio — a
  origem da fluência em código, anterior à carreira de design. Vale destacar em
  vagas de design engineering; costuma ser cortável em vagas de product design.

---

## Projetos

### adandara.com — site pessoal e pipeline de documentos
Design, front-end e infraestrutura, 2026. https://adandara.com

- Projetou e construiu um site pessoal como uma exposição de museu — a landing é
  a parede da entrada, o trabalho fica pendurado em uma parede que o visitante
  pode mover e da qual pode se aproximar, e a loja de presentes guarda tudo que
  um site pessoal precisa burocraticamente ter.
- Construiu uma parede de trabalhos posicionada por uma grade com semente: cada
  folha tem coluna e linha, vagueia dentro da própria célula ao montar e assume
  uma posição embaralhada na pilha, de modo que ler tudo exige arrastar folhas —
  a interação é o mecanismo, não o enfeite.
- Implementou uma interação de zoom e desfoque interrompível sobre a Web
  Animations API: animações canceláveis em pleno curso, folhas ampliadas
  expostas como modais ARIA uma de cada vez, fundo tornado inerte e duplo clique
  incapaz de iniciar uma segunda animação sobre a primeira.
- Construiu um pipeline de documentos disponível apenas em desenvolvimento:
  fontes de currículo em markdown lidos por uma gramática própria que falha com
  arquivo e linha, renderizados pelo sistema tipográfico do próprio site,
  impressos em PDF com Playwright e então pontuados por cobertura de
  palavras-chave para ATS e verificados quanto à legibilidade da camada de texto
  a partir do texto do PDF final — de modo que o número relatado nunca possa
  divergir do documento.
- Escreveu o parser, o pontuador, o verificador, o gerador de imagem de
  compartilhamento e a skill de agente que conduz tudo isso, mantendo o pipeline
  fora de produção por construção e não por configuração.
- Next.js App Router, TypeScript, Tailwind CSS, Inter auto-hospedada, deploy na
  Vercel, lint com ESLint mais os plugins sonarjs, unicorn, security e
  better-tailwindcss.

### A serviço do museu — pesquisa publicada como site
Pesquisa, design, front-end e identidade, 2026. https://servico-museu.vercel.app

- Coautora de um framework acadêmico de design de serviços e design da
  informação para a instituição museo-educativa, endereçando a distância entre o
  que os documentos de política dizem ao museu fazer e o como fazer e como medir.
- Projetou e construiu o site da pesquisa em Next.js, TypeScript, MDX e
  Tailwind: notas laterais ao lado do parágrafo em vez de no rodapé, glossário
  embutido para que nenhum termo da museologia custe uma aba ao leitor, tema
  claro e escuro resolvido antes da primeira pintura e um hero com shader.
- Deu a cada figura página e cartão de compartilhamento próprios, para que
  repassar uma figura repasse a figura e não a home, e adicionou exportação em
  PNG para que a figura possa sair do site como imagem.
- Construiu uma busca tolerante a erro sobre as instituições de Belo Horizonte
  dentro do recorte do estudo, para que um trabalhador museal descubra em um
  campo de texto se a pesquisa pede algo dele.
- Desenhou o caminho de recrutamento de ponta a ponta: o instrumento de
  qualificação, a explicação do que custa participar e três canais de contato,
  escolhidos porque equipes de museu não moram todas na mesma caixa de entrada.
- Desenhou a identidade e o logo do projeto — um shader de onda para uma cidade
  batizada de horizontes, emoldurado como obra pendurada.
- Publicou um resumo de 500 palavras e a versão acadêmica de 7.000 palavras como
  downloads, além de metadados JSON-LD de pesquisa, sitemap, robots e manifesto
  PWA com todo o conjunto de ícones gerado de um mestre único por uma ferramenta
  em Python.
- Escrito e publicado apenas em pt-BR, deliberadamente — sem negociação de
  idioma, o que mantém a camada de texto em um arquivo simples e síncrono.

### crayola — ferramenta de geração de assets
Design e front-end. Ferramenta pessoal.

- Construiu uma ferramenta baseada em Remotion para produzir assets amarelos,
  transformando uma tarefa manual repetida em algo programático.

### links amarelos — newsletter
Escrita, edição e design. https://linksamarelos.com · https://nydndr.substack.com

- Newsletter mensal autopublicada com curadoria de links e ensaios sobre mídia e
  cultura digital, escrita e publicada de forma assíncrona.
- Quatro anos de cadência sustentada sozinha, que é a evidência por trás de
  qualquer afirmação sobre comunicação escrita.

### ondas amarelas — podcast
Produção, sonorização e capa. https://open.spotify.com/show/043Gs7eyY2KOlotEWSTSxB

- Podcast autoproduzido de ensaios em áudio sobre mídia e cultura, com
  sonorização original e arte de capa original do programa e de cada episódio.

### hyperlinks amarelos — podcast de ensaios
Escrita e produção.

- Segundo podcast, em formato de ensaio. Cite apenas quando a vaga valorizar um
  corpo de trabalho publicado; caso contrário compete com ondas amarelas pela
  mesma linha.

### Belo Rolê — diretório público
Arquitetura de informação. https://nydndr.notion.site/belo-role

- Diretório público no Notion com 200+ lugares em Belo Horizonte, com taxonomia
  própria e arquitetura de informação.
- A taxonomia é o trabalho: os registros só são úteis porque a estrutura os
  torna encontráveis.

### Belo Museu, em números — visualização de dados
Visualização de dados.

- Dashboard construído sobre dados abertos de museus brasileiros, e a base
  quantitativa sobre a qual o TCC sobre museus se apoiou depois.

---

## Palestras e trabalho público

- Apresentou a Stone Terminal Store no palco, para uma audiência além do próprio
  time.
- Publica trabalho em andamento em público — o desenvolvimento do site da
  pesquisa foi compartilhado enquanto acontecia.
- Escreve e publica duas publicações em cadência autoimposta.
