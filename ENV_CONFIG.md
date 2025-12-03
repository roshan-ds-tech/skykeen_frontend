# Environment Configuration

## Frontend Environment Variables

The frontend is configured to use the production API by default. If you need to override this, create a `.env` file in the root directory:

```env
# Backend API Base URL (defaults to production API)
VITE_API_BASE_URL=https://api.skykeenentreprise.com
```

**Note:** The default API URL is set to `https://api.skykeenentreprise.com` in the code. You can override it with a `.env` file for local development if needed.

## Backend CORS Configuration

The following frontend URLs will call the backend API. Configure these in your **backend** `.env` file:

```env
CORS_ALLOWED_ORIGINS=https://skykeenentreprise.com,https://www.skykeenentreprise.com,https://admin.skykeenentreprise.com,https://api.skykeenentreprise.com
```

### Frontend URLs:
- `https://skykeenentreprise.com`
- `https://www.skykeenentreprise.com`
- `https://admin.skykeenentreprise.com`
- `https://api.skykeenentreprise.com` (Backend API)

Make sure your backend CORS settings allow requests from these origins.

