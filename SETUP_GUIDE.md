# Setup Guide - ExoPredict

This guide will walk you through setting up the ExoPredict application on your local machine.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Verification](#verification)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Python**: Version 3.8 or higher
  - Download from [python.org](https://www.python.org/downloads/)
  - Verify: `python --version`

- **Node.js**: Version 16 or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify: `node --version`

- **npm**: Usually comes with Node.js
  - Verify: `npm --version`

### Optional Tools
- **Git**: For version control
- **VS Code**: Recommended IDE
- **Postman**: For API testing

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment (Recommended)

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
python -m venv venv
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

**Dependencies installed:**
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `scikit-learn` - Machine learning utilities
- `xgboost` - ML model
- `joblib` - Model serialization
- `python-multipart` - File upload support
- `huggingface_hub` - Model hosting

### Step 4: Verify Model File
Make sure `exoplanet_xgb.joblib` exists in the backend directory. This file contains:
- Trained XGBoost model
- List of 41 required features

### Step 5: Verify Dataset
Ensure `cumulative.csv` exists - this is the NASA Kepler dataset.

### Step 6: Start the Backend Server
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

**Parameters explained:**
- `--host 0.0.0.0`: Accept connections from any IP
- `--port 8000`: Run on port 8000
- `--reload`: Auto-reload on code changes (development only)

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Step 7: Test Backend
Open browser and navigate to:
- `http://localhost:8000` - Root endpoint
- `http://localhost:8000/docs` - Interactive API documentation (Swagger UI)
- `http://localhost:8000/features` - View all required features

## Frontend Setup

### Step 1: Navigate to Frontend Directory
Open a **new terminal** (keep backend running) and run:
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

**Dependencies installed:**
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `vite` - Build tool
- `tailwindcss` - CSS framework
- And various dev dependencies

### Step 3: Verify Configuration Files
Check that these files exist:
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind configuration
- `package.json` - Dependencies and scripts

### Step 4: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
  VITE v7.1.7  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Note:** If port 5173 is busy, Vite will automatically use the next available port (5174, 5175, etc.)

### Step 5: Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```

You should see the ExoPredict home page.

## Verification

### Backend Verification Checklist
- [ ] Server starts without errors
- [ ] Can access `http://localhost:8000`
- [ ] Can access `http://localhost:8000/docs`
- [ ] `/features` endpoint returns 41 features
- [ ] No CORS errors in console

### Frontend Verification Checklist
- [ ] Development server starts successfully
- [ ] Can access `http://localhost:5173`
- [ ] Home page loads correctly
- [ ] Navigation between pages works
- [ ] No console errors

### Integration Testing

1. **Test KepID Prediction:**
   - Navigate to Predict page
   - Click "Search by KepID" tab
   - Enter: `10854555`
   - Click "Predict"
   - Should show prediction result

2. **Test Custom Features:**
   - Click "Custom Features" tab
   - Click "Fill Sample Data"
   - Click "Predict with Custom Features"
   - Should show prediction result

3. **Test CSV Upload:**
   - Click "Upload CSV" tab
   - Click "Download Sample CSV Template"
   - Upload the downloaded CSV
   - Click "Upload & Get Predictions"
   - Should download results CSV

## Troubleshooting

### Backend Issues

#### Issue: Module not found
```
ModuleNotFoundError: No module named 'xxx'
```
**Solution:**
```bash
pip install -r requirements.txt
```

#### Issue: Port 8000 already in use
```
ERROR:    [Errno 48] Address already in use
```
**Solution:**
- Change port: `uvicorn app:app --port 8001 --reload`
- Or stop the process using port 8000

#### Issue: Model file not found
```
FileNotFoundError: exoplanet_xgb.joblib
```
**Solution:**
- Ensure you're in the backend directory
- Check if model file exists
- Re-download or regenerate model if missing

### Frontend Issues

#### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Port 5173 in use
**Solution:**
- Vite will automatically use next available port
- Or manually specify port in `vite.config.js`:
```javascript
export default {
  server: {
    port: 3000
  }
}
```

#### Issue: CORS errors in browser console
```
Access to fetch at 'http://localhost:8000/predict' has been blocked by CORS policy
```
**Solution:**
- Ensure backend is running
- Check backend CORS configuration in `app.py`
- Make sure frontend URL is in allowed origins
- Update if using different port:
```python
allow_origins=["http://localhost:5173", "http://localhost:5174"]
```

#### Issue: Build fails
```
ERROR: Build failed with errors
```
**Solution:**
```bash
# Check Node version
node --version  # Should be 16+

# Clear cache and rebuild
rm -rf node_modules .vite dist
npm install
npm run dev
```

### Common Issues

#### Issue: Predictions not working
**Checklist:**
1. Is backend running? Check `http://localhost:8000`
2. Is frontend running? Check browser console for errors
3. Are both using correct ports?
4. Check network tab for API call errors

#### Issue: Slow predictions
**Possible causes:**
- First prediction loads model (slow)
- Subsequent predictions should be fast
- Check CPU usage
- Ensure model file is not corrupted

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- **Backend**: Changes to `app.py` auto-reload server
- **Frontend**: Changes to `.jsx` files auto-update browser

### Environment Variables
Create `.env` files for different configurations:

**Backend `.env`:**
```env
API_HOST=0.0.0.0
API_PORT=8000
MODEL_PATH=exoplanet_xgb.joblib
```

**Frontend `.env`:**
```env
VITE_API_URL=http://localhost:8000
```

### VS Code Setup
Recommended extensions:
- Python
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier

## Next Steps

After successful setup:
1. Explore the code structure
2. Read the [API Documentation](README.md#api-documentation)
3. Test all features
4. Make your first prediction!

## Getting Help

If you encounter issues not covered here:
1. Check the [README.md](README.md)
2. Look at browser console for errors
3. Check terminal output for error messages
4. Open an issue on GitHub

---

**Setup successful? Start predicting exoplanets! 🚀🌌**
