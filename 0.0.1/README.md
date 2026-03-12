# Personal Finance Manager — Full Stack

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Recharts, React Query
- **Backend**: Java 21, Spring Boot 3, Spring Security, Spring Data JPA
- **Database**: PostgreSQL 16
- **Migration**: Liquibase
- **Auth**: JWT

## Architecture
```
financeapp/
├── backend/          # Spring Boot app
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/financeapp/
│   │   │   │   ├── config/
│   │   │   │   ├── controller/
│   │   │   │   ├── dto/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── security/
│   │   │   └── resources/
│   │   │       ├── db/changelog/
│   │   │       └── application.yml
│   └── pom.xml
└── frontend/         # React Vite app
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   └── utils/
    └── package.json
```

## Running Locally
```bash
# 1. Start PostgreSQL
docker run -d --name finance-pg \
  -e POSTGRES_DB=financeapp \
  -e POSTGRES_USER=finance \
  -e POSTGRES_PASSWORD=finance123 \
  -p 5432:5432 postgres:16

# 2. Backend
cd backend && mvn spring-boot:run

# 3. Frontend
cd frontend && npm install && npm run dev
```
