# Hospital Management System (HMS)

Enterprise-grade Hospital Management System tailored specifically for hospitals, clinics, diagnostic centers, and HMOs in Nigeria.

## 🎯 Features

### Core Modules
- **Patient Management** - Patient registration, unique hospital ID, QR codes
- **Appointments & Queue** - Doctor scheduling, queue management, SMS reminders
- **Electronic Medical Records** - Consultation notes, vital signs, medical history
- **Doctor Portal** - Patient consultation, prescriptions, test requests
- **Laboratory** - Test requests, results, reports
- **Pharmacy** - Drug inventory, dispensing, expiry tracking
- **Billing & Payments** - Invoicing, payment tracking, HMO claims
- **Admin Dashboard** - Multi-branch management, analytics, reports
- **Real-time Features** - WebSocket queue updates, notifications

### Nigeria-Specific Features
- NHIS/NHIA compatibility
- Naira (₦) currency support
- SMS integration (Twilio)
- WhatsApp notifications
- Offline-first architecture
- Multi-branch support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/ugwutobychuks/hospital-management-system.git
cd hospital-management-system
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Configure your database and other services in `.env`

5. Run migrations
```bash
npm run migrate
```

6. Start the server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Using Docker

```bash
docker-compose up -d
```

This will start:
- PostgreSQL
- Redis
- Node.js application

## 📚 API Documentation

### Authentication

**Register User**
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "doctor",
  "phone": "+2341234567890"
}
```

**Login**
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Get Current User**
```
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### Patient Management

**Create Patient**
```
POST /api/v1/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "dateOfBirth": "1990-01-01",
  "gender": "F",
  "phone": "+2341234567890",
  "email": "jane@example.com",
  "bloodType": "O+",
  "genotype": "AA",
  "allergies": "Penicillin",
  "nextOfKin": "John Smith",
  "nextOfKinPhone": "+2341234567891"
}
```

**Get All Patients**
```
GET /api/v1/patients?page=1&limit=10
Authorization: Bearer <token>
```

**Get Patient Details**
```
GET /api/v1/patients/:id
Authorization: Bearer <token>
```

**Search Patients**
```
GET /api/v1/patients/search/john
Authorization: Bearer <token>
```

### Appointments

**Create Appointment**
```
POST /api/v1/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2024-01-15T10:00:00Z",
  "notes": "Follow-up consultation"
}
```

### Billing

**Create Bill**
```
POST /api/v1/billing
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "description": "Consultation Fee",
  "amount": 5000
}
```

**Process Payment**
```
PUT /api/v1/billing/:id/payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentMethod": "cash"
}
```

## 🏗️ Project Structure

```
src/
├── config/              # Configuration files
│   ├── database.js
│   ├── logger.js
│   └── redis.js
├── middlewares/         # Express middlewares
│   ├── auth.js
│   ├── errorHandler.js
│   └── requestLogger.js
├── routes/              # API routes
│   ├── auth.js
│   ├── patients.js
│   ├── doctors.js
│   ├── appointments.js
│   ├── billing.js
│   ├── pharmacy.js
│   ├── laboratory.js
│   └── admin.js
├── database/            # Database files
│   └── schema.sql
└── server.js            # Main application file
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Environment variable configuration
- CORS enabled
- Helmet.js security headers
- Request validation
- Audit logging

## 📊 Database Schema

The system uses PostgreSQL with the following main tables:
- **users** - System users
- **patients** - Patient records
- **doctors** - Doctor profiles
- **appointments** - Appointment scheduling
- **consultations** - Consultation records
- **prescriptions** - Drug prescriptions
- **lab_tests** - Laboratory tests
- **pharmacy_inventory** - Drug inventory
- **billing** - Bill records
- **hmo_plans** - HMO plans
- **claims** - Insurance claims
- **audit_logs** - System audit trail

## 🚀 Deployment

### Docker Deployment

```bash
docker build -t hms:latest .
docker run -p 3000:3000 --env-file .env hms:latest
```

### Kubernetes Deployment

See `k8s/` directory for Kubernetes manifests.

### Environment Variables

Key environment variables:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `REDIS_HOST` - Redis host
- `JWT_SECRET` - JWT signing key
- `AWS_S3_BUCKET` - S3 bucket for file storage

## 📈 Performance

- Caching with Redis
- Database connection pooling
- Response compression
- Indexed queries
- Pagination support
- Load balancing ready

## 🧪 Testing

```bash
npm test
```

## 📝 Logging

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📧 Support

For support, email support@hospitalmanagementsystem.ng or create an issue on GitHub.

## 🎉 Acknowledgments

Built with ❤️ for Nigerian healthcare institutions.
