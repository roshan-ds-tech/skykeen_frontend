# Quick Start Guide

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Activate virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Create `.env` file** (copy from `.env.example` if available):
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

4. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE skykeen_db;
   ```

5. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create admin user:**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start the server:**
   ```bash
   python manage.py runserver
   ```

Backend will run at `http://localhost:8000`

## Admin Dashboard Setup

1. **Navigate to admin-dashboard directory:**
   ```bash
   cd admin-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

Admin dashboard will run at `http://localhost:5174`

## Testing the Flow

1. **Create a registration** (via main frontend or API):
   - POST to `http://localhost:8000/api/registrations/`
   - Include all required fields and payment screenshot

2. **Login to admin dashboard:**
   - Go to `http://localhost:5174`
   - Use the superuser credentials you created

3. **View registrations:**
   - All registrations will appear in the dashboard table
   - Click "View Details" to see full information

4. **Verify payment:**
   - Open registration details
   - Click "Mark Payment as Verified"
   - Add admin notes if needed

## API Endpoints

- `POST /api/registrations/` - Create registration (public)
- `GET /api/registrations/` - List all (admin only)
- `GET /api/registrations/<id>/` - Get details (admin only)
- `PATCH /api/registrations/<id>/verify/` - Verify payment (admin only)
- `POST /api/admin/login/` - Admin login
- `POST /api/admin/logout/` - Admin logout
- `GET /api/admin/check/` - Check auth status

## Notes

- File uploads are limited to 10MB
- Only JPG, PNG, and WEBP formats are accepted
- Session cookies are configured for cross-origin requests
- Update CORS settings in `settings.py` for production

