# Team Task Manager Backend

## Folder Structure

```
backend/
  src/
    config/
      db.js
    controllers/
      authController.js
      projectController.js
      taskController.js
    middleware/
      authMiddleware.js
      roleMiddleware.js
      errorMiddleware.js
    models/
      User.js
      Project.js
      Task.js
    routes/
      authRoutes.js
      projectRoutes.js
      taskRoutes.js
    utils/
      generateToken.js
    app.js
    server.js
  .env.example
  package.json
```

## Setup

1. Install dependencies:
   - `npm install`
2. Create environment file:
   - Copy `.env.example` to `.env`
3. Start development server:
   - `npm run dev`
4. Start production server:
   - `npm start`

## Important Notes

- New users signup as `Member` by default.
- Promote a user to `Admin` directly in MongoDB for first-time bootstrap.
- All API routes are prefixed with `/api`.

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`

### Projects
- `GET /api/projects`
- `POST /api/projects` (Admin only)
- `DELETE /api/projects/:id` (Admin only)
- `POST /api/projects/:id/members` (Admin only)
- `DELETE /api/projects/:id/members/:userId` (Admin only)

### Tasks
- `GET /api/tasks?projectId=<id>`
- `GET /api/tasks/dashboard`
- `POST /api/tasks` (Admin only)
- `PUT /api/tasks/:id`
