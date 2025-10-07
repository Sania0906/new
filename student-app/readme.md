## Student App (Beginner Friendly)

Install and run:

```bash
# 1) Start the API server
cd server
npm run dev

# 2) Open the app
# Visit http://localhost:3000 in your browser
```

Optional: Seed example subjects/lessons (run once after first start or any time):

```bash
cd server
npm run seed
```

Environment variables (`server/.env`):

- JWT_SECRET: Token signing secret (change in production)
- PORT: Server port (default 3000)

Project structure:

```
student-app/
  public/               # static frontend (HTML/CSS/JS)
  server/
    src/
      db.js             # SQLite setup + helpers
      server.js         # Express app entry
      middleware/
        auth.js         # JWT auth middleware
      routes/
        auth.js         # /api/auth endpoints
        content.js      # subjects/lessons endpoints
      seed.js           # inserts sample data
    .env                # environment variables
    package.json        # scripts and deps
```
