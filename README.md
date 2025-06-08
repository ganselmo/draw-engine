# 🎯 DrawEngine

**DrawEngine** is a RESTful API built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/) to manage raffle draws. It allows creating, updating, listing, and managing draws, tickets, and users for a future production-ready raffle application.

---

## 🚀 Features

- ✅ Create and list raffle draws
- 🧱 Modular architecture using NestJS best practices
- 🗂️ DTO validation with `class-validator` and `class-transformer`
- 🐘 PostgreSQL integration via TypeORM
- 🐳 Docker-ready setup
- 🧪 Ready for future tests and e2e expansion

---

## 🛠️ Tech Stack

- **NestJS** – Progressive Node.js framework
- **TypeORM** – ORM for database management
- **PostgreSQL** – Relational database
- **Docker** – For containerized development
- **Class-validator** – For validating input data
- **RxJS** – For reactive programming in Nest

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/ganselmo/drawengine.git
cd drawengine

# Install dependencies
npm install
```

---

## ⚙️ Running the App

### 🧪 Development
```bash
# Start dev mode (with watch)
npm run start:dev
```

---

## 📄 Environment Variables

## Create a .env file based on the .env.example:

```dotenv
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin123
DB_NAME=test_db
```

---

## 🔀 API Endpoints

Sample endpoints from the Draw module:

| Method | Endpoint     | Description       |
|--------|--------------|-------------------|
| GET    | /draws       | Get all draws     |
| GET    | /draws/:id   | Get one draw by ID|
| POST   | /draws       | Create a new draw |
| PATCH  | /draws/:id   | Update a draw     |
| DELETE | /draws/:id   | Delete a draw     |

🧪 You can test these endpoints with Postman or any HTTP client.

---

## 🧑‍💻 Author

**Gerónimo Anselmo**  
Senior Full Stack Developer  
[LinkedIn](https://www.linkedin.com/in/geronimo-alejandro-anselmo/)  
[GitHub](https://github.com/ganselmo)
