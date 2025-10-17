# Hospital Fumegator - Jogo Web3 de RPG e Ação

Bem-vindo ao Hospital Fumegator, um jogo Web3 onde você gerencia um hospital, comanda NFTs especialistas e domina um ecossistema econômico na blockchain Ronin.

Este projeto implementa elementos de RPG e Ação, incluindo classes/especializações de NFT, progressão de nível, narrativas de missões, árvore de pesquisa tecnológica, expedições ativas com mecânicas de escolha e lutas contra chefes.

## Funcionalidades Implementadas

-   **NFTs com Classes e Progressão**: Seus NFTs agora possuem classes (Surgeon, Researcher, Pharmacist, Therapist), níveis, XP, atributos (Eficiência, Resistência, Carisma) e pontos de habilidade.
-   **Árvore de Habilidades**: Cada NFT tem uma árvore de habilidades única para desbloquear bônus e novas capacidades.
-   **Missões Narrativas**: Missões por sala com diferentes dificuldades, recompensas e requisitos.
-   **Árvore de Pesquisa Tecnológica**: Invista em tecnologias médicas, de pesquisa, infraestrutura e segurança para melhorar seu hospital.
-   **Expedições com Escolhas**: Expedições dinâmicas onde suas decisões afetam o resultado e as recompensas.
-   **Lutas contra Chefes**: Enfrente chefes poderosos com sua equipe de NFTs, utilizando estratégia para vencer e obter recompensas épicas.
-   **Persistência de Dados**: Integração com Prisma ORM e SQLite para armazenar dados de jogadores, NFTs, expedições, missões e tecnologias.

## Instalação e Configuração (Para uma Nova Instalação do Zero)

Siga os passos abaixo para configurar e rodar o projeto localmente.

### Pré-requisitos

Certifique-se de ter o seguinte instalado:

-   Node.js (versão 18 ou superior)
-   npm ou Yarn (preferencialmente Yarn)
-   Git
-   Ronin Wallet (extensão do navegador)

### 1. Clonar o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd Hospital-Fumegator
```

### 2. Instalar Dependências

```bash
yarn install
# ou npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto e preencha com as variáveis necessárias. Um exemplo (`.env.example`) será fornecido.

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=""
# Outras variáveis de ambiente podem ser necessárias dependendo da sua configuração
```

-   `DATABASE_URL`: Para desenvolvimento local, `file:./dev.db` usará um banco de dados SQLite. Para produção, você pode configurar um PostgreSQL ou outro banco de dados.


### 4. Configurar o Banco de Dados (Prisma)

Primeiro, aplique as migrações do Prisma para criar o esquema do banco de dados:

```bash
npx prisma migrate dev --name init
```

Isso criará o arquivo `dev.db` (se estiver usando SQLite) e aplicará as migrações definidas no `prisma/schema.prisma`.

Em seguida, gere o cliente Prisma:

```bash
npx prisma generate
```

### 5. Gerar Metadados de NFT (Opcional, para testes)

Se você quiser gerar os 9000 arquivos JSON de metadados de NFT para testes locais, execute o script:

```bash
python3.11 generate_nft_metadata.py
```

Este script criará uma pasta `nft_metadata` com os arquivos JSON. Certifique-se de ter Python 3.11 instalado.

### 6. Rodar o Projeto

```bash
yarn dev
# ou npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`.

## Estrutura do Projeto

-   `pages/`: Páginas Next.js (frontend).
-   `pages/api/`: Rotas de API (backend).
-   `components/`: Componentes React reutilizáveis.
-   `context/`: Contextos React para gerenciamento de estado global (RoninContext, PlayerContext).
-   `lib/`: Lógica de negócio, configurações de jogo (rpg, quests, research, bosses, player, expeditions).
-   `prisma/`: Esquema do banco de dados e migrações.
-   `styles/`: Estilos CSS.
-   `public/`: Assets estáticos (imagens, música).

## Próximos Passos (Desenvolvimento)

-   **Balanceamento**: Ajustar valores de XP, recompensas, custos e atributos para uma jogabilidade equilibrada.
-   **Assets Visuais**: Substituir placeholders por imagens reais para NFTs, habilidades e tecnologias.
-   **Testes**: Realizar testes extensivos de todas as funcionalidades.

--- 

**Autor:** Manus AI
**Data:** 12 de Outubro de 2025

