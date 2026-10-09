# AI Resume Analyzer

Upload your resume (PDF) and paste a job description. The app gives you an ATS-style match score, matched and missing keywords, strengths, and specific improvements. Past analyses are saved in MySQL and can be reopened from the History page.

## Tech stack

- **Frontend:** React, TypeScript, Tailwind CSS, Vite, React Router
- **Backend:** Node.js, Express, TypeScript (MVC architecture)
- **Database:** MySQL (optional, stores analysis history)
- **AI:** Claude API for resume-vs-job-description analysis
- **PDF parsing:** pdf-parse, **uploads:** multer

## Project structure

```
ai-resume-analyzer/
├── server/                     # Backend (MVC)
│   └── src/
│       ├── config/             # env + MySQL connection
│       ├── models/             # DB queries (AnalysisModel)
│       ├── controllers/        # request handling logic
│       ├── routes/             # URL -> controller mapping
│       ├── services/           # AI API call, PDF text extraction
│       ├── middlewares/        # file upload, error handling
│       ├── utils/              # ApiError, asyncHandler
│       ├── app.ts              # Express app setup
│       └── server.ts           # entry point
└── client/                     # Frontend
    └── src/
        ├── api/                # fetch helpers
        ├── components/         # Navbar, Layout, Loader, ResultView...
        ├── context/            # shared analysis result state
        ├── pages/              # Home, Result, History, HistoryDetail, NotFound
        ├── types/              # shared TypeScript types
        ├── App.tsx             # routes (lazy-loaded pages)
        └── main.tsx
```

## How it works

1. The React app sends the resume PDF (or text) and job description to `POST /api/analyses`.
2. Route -> upload middleware -> controller. The controller uses `pdf.service` to extract text and `ai.service` to get a JSON analysis from the AI model.
3. `AnalysisModel` saves it to MySQL, and the result is shown on the Result page.

## Frontend routes

| Path | Page |
|---|---|
| `/` | Upload form (loading spinner on submit) |
| `/result` | Analysis result |
| `/history` | List of past analyses |
| `/history/:id` | One saved analysis |
| `*` | 404 page |

## Run locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # add your ANTHROPIC_API_KEY (and MySQL details, optional)
npm run dev              # http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev              # http://localhost:5173
```

### 3. MySQL (optional)
Set the `DB_*` values in `server/.env` and the table is created automatically (or run `server/schema.sql`). Without MySQL the app still works, only history is disabled.

## API

| Method | Route | Description |
|---|---|---|
| POST | `/api/analyses` | multipart: `resume` (PDF) or `resumeText`, `jobTitle`, `jobDescription` |
| GET | `/api/analyses` | last 20 analyses |
| GET | `/api/analyses/:id` | one saved analysis |
| GET | `/api/health` | health check |

## Author

Het Rathod, https://github.com/HetRathod03
