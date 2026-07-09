Render deployment guide for ecoKin backend

1) Create a GitHub repo and push the project (already done):
   - https://github.com/benjaminmososu-sys/ecoKin.git

2) Create a Postgres database on Render or another provider:
   - In Render dashboard, go to Databases → New Database → PostgreSQL.
   - Choose a name and free plan.
   - Copy the `DATABASE_URL` from Render when the database is created.

3) Deploy the backend service on Render:
   - In Render dashboard, click New → Web Service.
   - Connect GitHub and select `benjaminmososu-sys/ecoKin`.
   - Choose branch `main`.
   - Environment: Docker.
   - Dockerfile path: `Dockerfile` (project root).
   - Leave build/start commands blank because Dockerfile handles it.

4) Configure environment variables:
   - `DATABASE_URL` = the Render Postgres URL.
   - `APP_URL` = your future frontend URL, for example `https://votre-frontend.infinityfreeapp.com`.
   - `GEMINI_API_KEY` = optional if you use AI analysis.

5) Deploy and test:
   - Click "Create Web Service".
   - Wait for Render to build the Docker container.
   - Test the API using the public URL, for example:
     ```bash
     curl https://<your-render-service>.onrender.com/api/incidents
     ```

6) Frontend deployment note:
   - After backend is live, rebuild the frontend with the public backend URL:
     ```powershell
     $env:VITE_API_URL="https://<your-render-service>.onrender.com"
     npm run build
     ```
   - Upload `dist/` content to InfinityFree `htdocs/`.

7) CORS:
   - Your backend already allows all origins for development.
   - For production, set `allow_origins` to your frontend domain only.
