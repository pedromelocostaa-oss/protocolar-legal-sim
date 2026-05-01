# e-Proc — Simulador Educacional

**Faculdade Milton Campos / Grupo Anima Educação**

> Simulador do sistema e-Proc (TRF1) para uso acadêmico. Permite que professores de Direito atribuam tarefas práticas de peticionamento eletrônico e que os alunos as realizem em ambiente controlado.

## ⚠️ Aviso Legal

Este sistema **não possui vínculo** com a Justiça Federal, TRF1 ou qualquer órgão oficial do Poder Judiciário. Os processos, partes e documentos são **totalmente fictícios**, criados exclusivamente para fins pedagógicos.

---

## Credenciais de Demonstração (Modo Demo)

| Perfil | CPF | Senha |
|--------|-----|-------|
| Aluno | `121.572.976-69` | `Milton@2025` |
| Professor | `000.000.000-01` | `Milton@2025` |

---

## Setup Rápido

```bash
npm install
cp .env.example .env.local   # configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

**Sem Supabase?** O sistema roda em Modo Demo com dados locais (localStorage). Ideal para demonstração da interface.

## Com Supabase (Produção)

1. Crie projeto em https://supabase.com
2. Execute `supabase/migrations/001_initial_schema.sql` no SQL Editor
3. Configure variáveis no `.env.local`
4. Crie usuários via Supabase Auth e execute `supabase/seed.sql`

## Funcionalidades

### Alunos
- Login com CPF + troca obrigatória de senha no 1º acesso
- Dashboard com tarefas, processos e intimações
- **Petição Inicial** — wizard 5 etapas com geração de número CNJ
- Distribuição automática a vara fictícia
- Acompanhamento de processos com timeline
- Petição Incidental (contestação, recurso, etc.)
- Caixa de intimações com ciência registrada

### Professores
- Criação de tarefas com enunciado e documentos obrigatórios
- Fila de petições para correção
- Interface de correção com nota (0–10), feedback e três ações
- Importação de alunos via CSV

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Supabase · React Router v6

## Projeto original

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
