# Skykeen Backend API

Django REST API backend for event registration management.

## Setup Instructions

### 1. Prerequisites

- Python 3.11+
- PostgreSQL database
- pip (Python package manager)

### 2. Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

### 3. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE skykeen_db;
```

2. Create a `.env` file in the `backend/` directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True

DB_NAME=skykeen_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
```

3. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create a superuser (admin user):
```bash
python manage.py createsuperuser
```

### 4. Run the Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Public Endpoints

- `POST /api/registrations/` - Create a new event registration

### Admin Endpoints (Require Authentication)

- `GET /api/registrations/` - List all registrations
- `GET /api/registrations/<id>/` - Get registration details
- `PATCH /api/registrations/<id>/verify/` - Verify payment and update notes
- `POST /api/admin/login/` - Admin login
- `POST /api/admin/logout/` - Admin logout
- `GET /api/admin/check/` - Check authentication status

## File Uploads

- Payment screenshots are stored in `media/payments/`
- Parent signatures are stored in `media/signatures/`
- Maximum file size: 10MB
- Allowed formats: JPG, PNG, WEBP

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Main frontend)
- `http://localhost:5174` (Admin dashboard)

Update `CORS_ALLOWED_ORIGINS` in `settings.py` for production.

