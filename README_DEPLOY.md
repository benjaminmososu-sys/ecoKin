Deployment notes

This project contains a React + Vite frontend and a FastAPI backend located in `app/`.

Backend (Render/Heroku/Railway recommended):
- Use `requirements.txt` to install dependencies.
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT` (Procfile provided).
- Add environment variables: `DATABASE_URL` (Postgres), `GEMINI_API_KEY` (optional), `APP_URL`.
- Ensure CORS origins include the frontend URL.

Frontend (InfinityFree static hosting):
1. Build production assets with the backend URL set:

PowerShell
```
$env:VITE_API_URL="https://api.yourdomain.tld"
npm run build
```

Bash
```
VITE_API_URL="https://api.yourdomain.tld" npm run build
```

2. Upload contents of `dist/` to InfinityFree `htdocs/` via FTP or File Manager.
3. If using client-side routing, prefer hash routing or configure a fallback to `index.html`.

Archiving:
- A `dist.zip` is created after build for easy upload.

If you want, I can also:
- Prepare a `Dockerfile` for containerized deployment.
- Deploy the backend to Render (requires linking your GitHub) and configure env vars.
