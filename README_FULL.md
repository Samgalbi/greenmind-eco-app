# GreenMind – Full Project Overview

## Stack
- Frontend: React 18 + TypeScript, Vite, Tailwind CSS, Radix UI, Recharts, Lucide.
- Backend: Spring Boot 3.5.7 (Java 17), JPA/Hibernate, Spring Security (permits all for now), MySQL/MariaDB (via XAMPP), Lombok.

## Project Structure
- `src/` (frontend)
  - `App.tsx`: global state, navigation, auth mock, tab rendering.
  - `components/`: pages (Dashboard, Quizzes, Missions, EcoTips, UserProfile, AdminDashboard), auth forms, UI primitives.
  - `services/`, `hooks/`, `styles/`: ancillary frontend code.
- `greenmind-backend/greenmind-backend/` (backend)
  - `src/main/java/com/greenmind/`: config, controllers, services, repositories, models, DTOs, exceptions, handlers.
  - `src/main/resources/application.properties`: DB config (`greenminddb`, user `root`, empty password), port 8080.

## Backend Entities (main ones)
- User, Mission, MissionAssignment (per-user progress), Quiz, Question, Answer, QuizAttempt, Badge, UserBadge, EcoTip, EcoTipLike, ActivityLog.

## Backend API Endpoints (summary)
- Users: `POST/GET /api/users`, `GET /api/users/{id}`.
- Missions: `POST/GET /api/missions`, `GET /api/missions/{id}`, `PUT /api/missions/{id}`, `DELETE /api/missions/{id}`.
- Mission assignments: `POST /api/mission-assignments` (assign user/mission), `GET /api/mission-assignments?userId=...`, `GET /api/mission-assignments/{id}`, `PUT /api/mission-assignments/{id}/progress`, `POST /api/mission-assignments/{id}/complete`.
- Quizzes: `POST /api/quizzes`, `GET /api/quizzes`, `GET /api/quizzes/{id}`, `POST /api/quizzes/{id}/submit`.
- Badges: `POST /api/badges`, `GET /api/badges`, `POST /api/badges/{id}/award`, `GET /api/badges/user/{userId}`.
- Eco tips: `POST /api/tips`, `GET /api/tips`, `GET /api/tips/{id}`, `POST /api/tips/{id}/like`.

## Backend Error Handling
- GlobalExceptionHandler returns JSON `{ status, message, errors? }` for validation/NotFound/BadRequest; catch-all 500 returns a generic message.

## Running the Backend (Windows/XAMPP)
1. Start MySQL in XAMPP.
2. Reset DB if needed:
   ```sql
   DROP DATABASE IF EXISTS greenminddb;
   CREATE DATABASE greenminddb;
   ```
3. From `greenmind-backend/greenmind-backend`:
   ```powershell
   ./mvnw.cmd spring-boot:run
   ```
   Backend runs on `http://localhost:8080`.

## Quick HTTPie Tests
- Create user:
  ```bash
  http POST :8080/api/users name="Alice" email="alice@example.com"
  ```
- Create mission:
  ```bash
  http POST :8080/api/missions \
    title="Reduce water usage" description="Take 5-minute showers" \
    category="WATER" duration="3 days" points:=50 co2Impact:=5 \
    difficulty="Easy" progress:=0 total:=3
  ```
- Assign mission:
  ```bash
  http POST :8080/api/mission-assignments userId:=<userId> missionId:=<missionId>
  ```
- Complete mission:
  ```bash
  http POST :8080/api/mission-assignments/<assignmentId>/complete
  ```
- Create quiz:
  ```bash
  http POST :8080/api/quizzes \
    title="Recycling basics" category="Recycling" difficulty="Easy" \
    rewardPoints:=40 co2Impact:=3 \
    questions:='[{
      "text":"Can glass be recycled?",
      "explanation":"Most glass bottles can be recycled.",
      "answers":[{"text":"Yes","correct":true},{"text":"No","correct":false}]
    }]'
  ```
- Submit quiz:
  ```bash
  http POST :8080/api/quizzes/<quizId>/submit \
    userId:=<userId> \
    answers:='[{"questionId":<questionId>,"answerId":<answerIdForYes>}]'
  ```
- Create badge / award:
  ```bash
  http POST :8080/api/badges code="ECO_START" name="Eco Starter" tier="Bronze"
  http POST :8080/api/badges/<badgeId>/award userId:=<userId> context="Completed first mission"
  ```
- Create tip / like:
  ```bash
  http POST :8080/api/tips title="Turn off lights" category="Energy" description="Switch off unused lights" impactCo2:=1.5
  http POST :8080/api/tips/<tipId>/like userId:=<userId>
  ```

## Running the Frontend
From project root:
```bash
npm install
npm run dev
```
App runs on `http://localhost:3000` (uses mock auth; admin = `admin@greenmind.com` / `admin123`).

## Notes
- Security is currently permissive (all requests allowed); JWT/auth can be added later.
- DB schema is managed by Hibernate (`ddl-auto=update`); for a clean rebuild, drop/recreate `greenminddb` before starting the backend.
