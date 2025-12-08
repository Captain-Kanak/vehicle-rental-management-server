# Vehicle Rental System – Backend API

A complete, modular, and secure backend API for managing a vehicle rental platform.  
Features include user authentication, role-based access control, vehicle inventory management, and full booking operations.

---

## Overview

This backend system supports:

- Vehicle management with availability tracking
- Customer and admin account management
- Rental booking creation, cancellation, return handling
- Secure authentication using JWT
- Clean, scalable modular architecture

---

## Technology Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- bcrypt
- JSON Web Tokens (JWT)

---

## Project Structure (Modular Pattern)

Each module contains its own routes, controllers, services, and validation logic.

---

## Database Schema

### Users Table

| Field    | Description                  |
| -------- | ---------------------------- |
| id       | Auto-generated               |
| name     | Required                     |
| email    | Unique, lowercase, required  |
| password | Hashed, minimum 6 characters |
| phone    | Required                     |
| role     | "admin" or "customer"        |

### Vehicles Table

| Field               | Description             |
| ------------------- | ----------------------- |
| id                  | Auto-generated          |
| vehicle_name        | Required                |
| type                | car, bike, van, SUV     |
| registration_number | Unique, required        |
| daily_rent_price    | Positive, required      |
| availability_status | "available" or "booked" |

### Bookings Table

| Field           | Description                        |
| --------------- | ---------------------------------- |
| id              | Auto-generated                     |
| customer_id     | FK → Users                         |
| vehicle_id      | FK → Vehicles                      |
| rent_start_date | Required                           |
| rent_end_date   | Required, must be after start date |
| total_price     | Required                           |
| status          | active, cancelled, returned        |

---

## Authentication & Authorization

### Flow

1. User signs up → password hashed with bcrypt
2. User logs in → receives JWT
3. Protected routes require the header:  
   `Authorization: Bearer <token>`
4. Token is verified and role permissions are checked
5. Unauthorized access yields 401 or 403

### Roles

- **Admin** – full access
- **Customer** – limited to own profile and bookings

---

## API Endpoints

All endpoints follow the exact structure defined in `API_REFERENCE.md`.

---

## Authentication

| Method | Endpoint            | Access | Description           |
| ------ | ------------------- | ------ | --------------------- |
| POST   | /api/v1/auth/signup | Public | Register new user     |
| POST   | /api/v1/auth/signin | Public | Login + receive token |

---

## Vehicles

| Method | Endpoint                    | Access | Description                               |
| ------ | --------------------------- | ------ | ----------------------------------------- |
| POST   | /api/v1/vehicles            | Admin  | Add new vehicle                           |
| GET    | /api/v1/vehicles            | Public | Get all vehicles                          |
| GET    | /api/v1/vehicles/:vehicleId | Public | Get vehicle details                       |
| PUT    | /api/v1/vehicles/:vehicleId | Admin  | Update vehicle information                |
| DELETE | /api/v1/vehicles/:vehicleId | Admin  | Delete (only if no active bookings exist) |

---

## Users

| Method | Endpoint              | Access      | Description                              |
| ------ | --------------------- | ----------- | ---------------------------------------- |
| GET    | /api/v1/users         | Admin       | View all users                           |
| PUT    | /api/v1/users/:userId | Admin/Owner | Update user role or personal info        |
| DELETE | /api/v1/users/:userId | Admin       | Delete user (only if no active bookings) |

---

## Bookings

| Method | Endpoint                    | Access         | Description                                                |
| ------ | --------------------------- | -------------- | ---------------------------------------------------------- |
| POST   | /api/v1/bookings            | Customer/Admin | Create a booking (validates availability, calculates cost) |
| GET    | /api/v1/bookings            | Role-based     | Admin: all bookings, Customer: own only                    |
| PUT    | /api/v1/bookings/:bookingId | Role-based     | Customer: cancel, Admin: mark returned                     |

---

## Installation

git clone <repository-url>
cd vehicle-rental-system
npm install

---

## Environment Variables

Create a `.env` file:

DATABASE_URL=postgres://user:password@localhost:5432/vehicle_rental
JWT_SECRET=your_jwt_secret_here

---

## Running the App

### Development Mode

npm run dev

### Production Build

npm run build
npm start

---

## License

This project is intended for educational and demonstration purposes.
