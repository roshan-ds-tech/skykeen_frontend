# Project Dependencies

This document lists all dependencies required to run both the frontend and backend of the Skykeen project.

## Backend Dependencies (Python/Django)

The backend is a Django REST Framework application. Install dependencies using:

```bash
cd backend
pip install -r requirements.txt
```

### Python Packages

- **Django** (>=4.2) - Web framework
- **djangorestframework** - REST API framework for Django
- **django-cors-headers** - CORS handling for cross-origin requests
- **psycopg2-binary** - PostgreSQL database adapter
- **Pillow** - Image processing library
- **python-dotenv** - Environment variable management

### System Requirements

- **Python** 3.8+ (recommended: Python 3.11+)
- **PostgreSQL** database (or SQLite for development)
- **pip** package manager

---

## Frontend Dependencies

The project has two frontend applications:

### 1. Main Frontend (Root Directory)

Install dependencies using:

```bash
npm install
```

#### Production Dependencies

- **react** (^19.2.0) - React library
- **react-dom** (^19.2.0) - React DOM renderer
- **lucide-react** (^0.475.0) - Icon library
- **@ark-ui/react** (^3.0.0) - UI component library

#### Development Dependencies

- **@eslint/js** (^9.39.1) - ESLint JavaScript configuration
- **@tailwindcss/container-queries** (^0.1.1) - Tailwind container queries plugin
- **@tailwindcss/forms** (^0.5.10) - Tailwind forms plugin
- **@types/node** (^24.10.1) - TypeScript types for Node.js
- **@types/react** (^19.2.5) - TypeScript types for React
- **@types/react-dom** (^19.2.3) - TypeScript types for React DOM
- **@vitejs/plugin-react** (^5.1.1) - Vite plugin for React
- **autoprefixer** (^10.4.22) - CSS autoprefixer
- **eslint** (^9.39.1) - JavaScript linter
- **eslint-plugin-react-hooks** (^7.0.1) - ESLint plugin for React hooks
- **eslint-plugin-react-refresh** (^0.4.24) - ESLint plugin for React refresh
- **globals** (^16.5.0) - Global variables for ESLint
- **postcss** (^8.5.6) - CSS post-processor
- **tailwindcss** (^3.4.18) - Utility-first CSS framework
- **typescript** (~5.9.3) - TypeScript compiler
- **typescript-eslint** (^8.46.4) - TypeScript ESLint integration
- **vite** (^7.2.4) - Build tool and dev server

### 2. Admin Dashboard Frontend

Install dependencies using:

```bash
cd admin-dashboard
npm install
```

#### Production Dependencies

- **react** (^18.2.0) - React library
- **react-dom** (^18.2.0) - React DOM renderer
- **react-router-dom** (^6.20.0) - React routing library
- **axios** (^1.6.2) - HTTP client library

#### Development Dependencies

- **@types/react** (^18.2.43) - TypeScript types for React
- **@types/react-dom** (^18.2.17) - TypeScript types for React DOM
- **@typescript-eslint/eslint-plugin** (^6.14.0) - TypeScript ESLint plugin
- **@typescript-eslint/parser** (^6.14.0) - TypeScript ESLint parser
- **@vitejs/plugin-react** (^4.2.1) - Vite plugin for React
- **autoprefixer** (^10.4.16) - CSS autoprefixer
- **eslint** (^8.55.0) - JavaScript linter
- **eslint-plugin-react-hooks** (^4.6.0) - ESLint plugin for React hooks
- **eslint-plugin-react-refresh** (^0.4.5) - ESLint plugin for React refresh
- **postcss** (^8.4.32) - CSS post-processor
- **tailwindcss** (^3.3.6) - Utility-first CSS framework
- **typescript** (^5.2.2) - TypeScript compiler
- **vite** (^5.0.8) - Build tool and dev server

---

## System Requirements Summary

### Backend
- Python 3.8+ (recommended: 3.11+)
- PostgreSQL (or SQLite for development)
- pip

### Frontend
- Node.js 16+ (recommended: 18+ or 20+)
- npm or yarn package manager

---

## Quick Installation Guide

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Main Frontend Setup

```bash
# From project root
npm install
```

### Admin Dashboard Setup

```bash
# Navigate to admin-dashboard directory
cd admin-dashboard
npm install
```

---

## Running the Applications

### Backend
```bash
cd backend
python manage.py runserver
```

### Main Frontend
```bash
# From project root
npm run dev
```

### Admin Dashboard
```bash
cd admin-dashboard
npm run dev
```

