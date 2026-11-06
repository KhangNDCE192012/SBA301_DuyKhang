# Assignment-3 — FU Mini Hotel Management System

**Student:** Nguyen Duy Khang  
**Student ID:** CE192012  
**Course:** SBA301 — Assignment 03: Securing REST Services with Spring Boot

This project implements the assignment brief using Spring Boot 3, Spring Security + JWT, Spring Data JPA, Microsoft SQL Server, ReactJS and Axios.

> The folder is named `Assignment-3` as requested. The Spring Boot artifact and SQL Server database currently use `A3NguyenDuyKhang_CE192012`. The PDF asks for `A3StudentName_ClassCode`; CE192012 was supplied as the student ID, so replace this suffix if your actual class code is different.

**Vietnamese step-by-step guide:** see [`HUONG_DAN_CHI_TIET.md`](HUONG_DAN_CHI_TIET.md). For Postman, see [`HUONG_DAN_POSTMAN.md`](HUONG_DAN_POSTMAN.md).

---

## 1. Features

### Public visitor
- View active room information without logging in.
- Search rooms by room number, room type, guest capacity and price range.

### Customer
- Register an account and log in with email/password.
- Receive a JWT after successful login.
- Create one reservation with one or more rooms.
- View their own reservation history and room details.
- View and update their profile; optionally change their password.
- Cannot view another customer's profile or reservation history.

### Staff
- Log in with the Staff account configured in `src/main/resources/application.properties`.
- Create, view, search, update and remove customer information.
- Create, view, search, update and remove room information.
- Manage reservations, including their room details and status.
- Create offline reservations for walk-in customers.

### Assignment-specific room deletion rule
- If a room has never been used in `BookingDetail`, Staff can physically delete it.
- If a room is already referenced by a booking detail, Staff cannot physically delete it. The application changes `RoomStatus` to `0` (Inactive) so the booking history remains valid.

---

## 2. Technologies

| Part | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.5.7 |
| REST API | Spring Web |
| Database access | Spring Data JPA / Hibernate |
| Database | Microsoft SQL Server |
| Security | Spring Security, JWT, BCrypt |
| Validation | Jakarta Bean Validation |
| Frontend | React 18 + Vite 5 |
| HTTP client | Axios |
| Automated tests | JUnit 5, Mockito, Spring Boot Test, H2 |

---

## 3. Project structure

```text
Assignment-3/
├── src/main/java/com/ce192012/assignment3/
│   ├── config/          # Initial sample data
│   ├── controller/      # REST endpoints
│   ├── dto/              # Request/response objects
│   ├── entity/           # JPA entities (database tables)
│   ├── exception/        # Error handling
│   ├── repository/       # Database queries
│   ├── security/         # JWT filter, token and Spring Security
│   └── service/           # Business rules
├── src/main/resources/application.properties
├── src/test/             # Unit and integration tests
├── frontend/src/
│   ├── api/              # Axios configuration
│   ├── components/       # Header, modal, notices and loading UI
│   ├── pages/            # Customer, Staff and public pages
│   ├── App.jsx
│   └── index.css
├── database/create_database.sql
├── pom.xml
└── README.md
```

The backend follows the required 3-Layer architecture:

```text
ReactJS page
    │ Axios + JWT (Authorization: Bearer ...)
    ▼
Controller  →  Service  →  Repository  →  SQL Server
                  │
                  └── validates business rules
```

- **Controller:** receives HTTP requests and returns HTTP responses.
- **Service:** performs the application logic and checks the assignment rules.
- **Repository:** reads and writes records using Spring Data JPA.

---

## 4. Database design

The relational database contains the five tables from the assignment diagram:

1. `Customer`
2. `RoomType`
3. `RoomInformation`
4. `BookingReservation`
5. `BookingDetail`

Relationships:

- One `RoomType` has many `RoomInformation` records.
- One `Customer` can have many `BookingReservation` records.
- One `BookingReservation` has one or more `BookingDetail` records.
- One `RoomInformation` can appear in many `BookingDetail` records over time.
- `BookingDetail` uses the composite primary key `(BookingReservationID, RoomID)` to implement the many-to-many relationship between bookings and rooms.

### Create the database

1. Open SQL Server Management Studio (SSMS).
2. Connect to your local SQL Server instance.
3. Open `database/create_database.sql`.
4. Execute the script.
5. Confirm that `A3NguyenDuyKhang_CE192012` appears under Databases.

When the backend starts for the first time, Hibernate creates or updates the five tables because `spring.jpa.hibernate.ddl-auto=update` is configured.

---

## 5. Configure the backend

### Prerequisites

- JDK 21 (check with `java -version`).
- IntelliJ IDEA.
- Microsoft SQL Server with TCP/IP enabled and listening on port `1433`.
- SQL Server authentication enabled, with a login that can access the new database.

### Configure `application.properties`

Open:

`src/main/resources/application.properties`

Find this line:

```properties
spring.datasource.password=${DB_PASSWORD:YourStrong!Passw0rd}
```

Replace `YourStrong!Passw0rd` with the password of your SQL Server login. If your SQL Server uses a different username or port, update `spring.datasource.username` and `spring.datasource.url` as well.

The Staff account is configured in the same file, as required by the assignment:

```properties
hotel.staff.email=staff@fuminihotel.com
hotel.staff.password=Staff@123
```

You may change these credentials before running the project. Do not put the Staff account in the `Customer` table.

### Run the backend

Open PowerShell in the `Assignment-3` folder:

```powershell
.\mvnw.cmd spring-boot:run
```

If the application starts successfully, the REST API is available at:

`http://localhost:8080`

The first startup inserts sample room types, rooms and one sample customer if the corresponding tables are empty.

---

## 6. Configure and run the frontend

Prerequisites: Node.js and npm.

Open a **second** PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally:

`http://localhost:5173`

The frontend sends HTTP requests to `http://localhost:8080/api` through Axios. If the backend URL changes, create a `.env` file inside `frontend`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 7. Demo accounts

These credentials are sample values for local development. Change them before using the application outside a classroom demo.

| Role | Email | Password |
|---|---|---|
| Staff | `staff@fuminihotel.com` | `Staff@123` |
| Customer | `customer@fuminihotel.com` | `Customer@123` |

The sample Customer is created only when the `Customer` table is empty. Customer passwords are stored as BCrypt hashes.

---

## 8. Main REST API endpoints

All paths below are relative to `http://localhost:8080`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/rooms` | Public | View active rooms |
| GET | `/api/rooms/search` | Public | Search active rooms |
| GET | `/api/room-types` | Public | View room types |
| POST | `/api/auth/customer/register` | Public | Register Customer |
| POST | `/api/auth/customer/login` | Public | Customer login; returns JWT |
| POST | `/api/auth/staff/login` | Public | Staff login; returns JWT |
| GET | `/api/customer/profile` | Customer | View own profile |
| PUT | `/api/customer/profile` | Customer | Update own profile |
| POST | `/api/customer/bookings` | Customer | Create a reservation with multiple rooms |
| GET | `/api/customer/bookings` | Customer | View own reservation history |
| GET | `/api/staff/customers` | Staff | View/search customers |
| POST | `/api/staff/customers` | Staff | Create customer |
| PUT | `/api/staff/customers/{id}` | Staff | Update customer |
| DELETE | `/api/staff/customers/{id}` | Staff | Delete/deactivate customer |
| GET | `/api/staff/rooms` | Staff | View all rooms |
| POST | `/api/staff/rooms` | Staff | Create room |
| PUT | `/api/staff/rooms/{id}` | Staff | Update room |
| DELETE | `/api/staff/rooms/{id}` | Staff | Apply safe room deletion rule |
| GET | `/api/staff/bookings` | Staff | View all reservations |
| POST | `/api/staff/bookings` | Staff | Create offline reservation |
| PUT | `/api/staff/bookings/{id}` | Staff | Update reservation and room details |
| PUT | `/api/staff/bookings/{id}/status` | Staff | Change reservation status |
| DELETE | `/api/staff/bookings/{id}` | Staff | Delete reservation |

For protected endpoints, send this HTTP header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

Reservation status values:

- `1` = Confirmed
- `2` = Completed
- `0` = Cancelled

---

## 9. Test with Postman

1. Open Postman.
2. Select **Import**.
3. Import `postman_collection.json` from the project root.
4. Run the public `GET /api/rooms` request first.
5. Register a Customer or use the seeded demo Customer.
6. Run Customer Login. The collection stores the returned JWT in `customerToken`.
7. Run the Customer requests. They use `customerToken` automatically.
8. Run Staff Login. The collection stores the returned JWT in `staffToken`.
9. Run Staff requests. They use `staffToken` automatically.
10. Test the room deletion rule twice: delete a room without booking details, then delete a room that has appeared in a booking detail.

See `API_TESTING_GUIDE.md` for example JSON request bodies.

---

## 10. Run automated tests

Tests use an in-memory H2 database through the `test` profile, so they do not need a running SQL Server.

```powershell
.\mvnw.cmd test
```

The tests cover login, duplicate registration, booking totals, date overlap checks, customer booking ownership, and the room deletion rule. The integration tests use the H2 test profile and verify that a reservation can persist multiple room details.

---

## 11. Common problems

### Backend cannot connect to SQL Server

- Confirm the SQL Server service is running.
- Confirm TCP/IP is enabled and the port is `1433`.
- Confirm the database exists.
- Confirm the username and password in `application.properties` are correct.

### `Login failed for user 'sa'`

The password in `application.properties` does not match your SQL Server `sa` password, or SQL Server authentication is not enabled. Update the credentials or use another SQL Server login.

### Frontend says it cannot connect to the server

- Start the backend first.
- Confirm the backend is running on port `8080`.
- Confirm `app.cors.allowed-origin` is `http://localhost:5173`.

### API returns 401

Log in again and make sure the request includes `Authorization: Bearer <token>`.

### Port 8080 or 5173 is already in use

Stop the other application using that port or change the corresponding port configuration.

---

## 12. Important learning note

Do not submit code that you cannot explain. Be ready to explain:

1. How React sends an Axios request to a Spring Boot Controller.
2. How the Controller calls the Service and the Service calls the Repository.
3. How Customer passwords are encoded with BCrypt.
4. How the JWT is generated after login and checked by `JwtAuthenticationFilter`.
5. How `SecurityConfig` allows public room viewing but protects Customer and Staff endpoints.
6. Why `BookingDetail` has a composite primary key.
7. Why a room with booking history is marked inactive instead of physically deleted.
