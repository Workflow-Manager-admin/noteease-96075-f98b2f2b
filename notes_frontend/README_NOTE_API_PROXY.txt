# If running frontend (React) and backend (FastAPI) on different ports
# you may want to set a proxy or environment variable to point the frontend to the correct backend API.

## Recommended for development:
1. Add a file `.env` in `notes_frontend/`:
    ```
    REACT_APP_API_BASE=http://localhost:3001
    ```

2. Or, edit `package.json` to add:
    ```
    "proxy": "http://localhost:3001",
    ```

3. Or, when deploying, set the environment variable:
    ```
    export REACT_APP_API_BASE=https://your-backend-url
    ```

Default fallback API base is http://localhost:3001. Adjust as needed.

The app expects the backend to provide:
- POST   /auth/login  {username, password} → {access_token, user}
- POST   /auth/register {username, password} → {access_token, user}
- GET    /notes (auth required)
- CRUD   /notes/{id} (auth required)
