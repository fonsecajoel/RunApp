# RunApp · Lisboa

Corrida + episódios educativos por GPS (ou simulação) em percursos delineados em Lisboa.

**Última versão com login, perfil e percursos:** commit `b7d37e5` em `main`.

## Onde está o código

| Local | Caminho |
|--------|---------|
| Pasta no teu PC | `Área de Trabalho/idea` |
| GitHub | https://github.com/fonsecajoel/RunApp |

Isto **não** altera o projeto Bora em `RepoBora/` — é outro repositório.

## Correr no teu PC (obrigatório para ver a app)

```bash
cd "/home/joel/Área de Trabalho/idea"
git pull origin main
npm install
npm run dev
```

Abre **http://localhost:5173/login** — não uses só a página do GitHub (isso é código, não a app).

## Site publicado (GitHub Pages)

Depois do workflow `Deploy to GitHub Pages` correr em Actions:

**https://fonsecajoel.github.io/RunApp/**

(Em Repo → Settings → Pages, a origem deve ser **GitHub Actions**.)

## Fluxo para testar

1. Criar conta → **Percursos** → escolher rota → **Simular percurso**
2. Ou **Correr com GPS** no telemóvel em Lisboa

## Atualizar noutro clone

```bash
git fetch origin
git checkout main
git pull origin main
git log -1 --oneline   # deve mostrar b7d37e5 ou mais recente
```
