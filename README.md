# ExoPredict - AI-Powered Exoplanet Detection System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-19.1.1-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)

## 🌌 Overview

ExoPredict is a modern web application that uses machine learning to detect and classify exoplanets using NASA's Kepler mission data. The system leverages an XGBoost classifier trained on thousands of verified planetary candidates to provide accurate predictions in real-time.

## ✨ Features

- **🔍 KepID Search**: Look up specific exoplanet candidates from the Kepler database
- **✨ Custom Feature Input**: Enter your own astronomical measurements for prediction
- **📊 Batch CSV Processing**: Upload CSV files for bulk predictions
- **⚡ Real-time Predictions**: Get results in milliseconds
- **🎨 Modern UI**: Clean, responsive interface with minimal design
- **📱 Mobile Friendly**: Works seamlessly on all devices

## 🏗️ Architecture

### Frontend
- **React 19.1.1**: Modern UI library with hooks
- **Vite 7.1.7**: Lightning-fast build tool
- **Tailwind CSS 4.1.14**: Utility-first styling
- **React Router DOM**: Client-side routing for multi-page navigation

### Backend
- **FastAPI**: High-performance Python API framework
- **XGBoost**: Gradient boosting machine learning model
- **Pandas & NumPy**: Data processing and manipulation
- **Joblib**: Model serialization
- **Uvicorn**: ASGI server

## 📊 Machine Learning Model

### Model Details
- **Algorithm**: XGBoost Classifier
- **Dataset**: NASA Kepler Exoplanet Search Results (cumulative.csv)
- **Features**: 41 astronomical measurements including:
  - Orbital period (koi_period)
  - Transit depth (koi_depth)
  - Planet radius (koi_prad)
  - Stellar temperature (koi_steff)
  - And 37 more features...

### Model Performance
The XGBoost model was trained on verified Kepler candidates with optimized hyperparameters to achieve high accuracy in distinguishing between confirmed planets and false positives.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📖 API Documentation

### Endpoints

#### GET `/`
Returns API information and available endpoints.

**Response:**
```json
{
  "message": "Exoplanet Prediction API",
  "endpoints": {
    "/predict": "POST - Predict exoplanet probability",
    "/predict-csv": "POST - Batch predictions from CSV",
    "/features": "GET - List all required features",
    "/kepid/{kepid}": "GET - Get data for specific KepID"
  }
}
```

#### GET `/features`
Returns the list of all 41 required features for prediction.

**Response:**
```json
{
  "features": ["koi_period", "koi_depth", "koi_prad", ...]
}
```

#### GET `/kepid/{kepid}`
Retrieve data for a specific Kepler Object of Interest.

**Parameters:**
- `kepid` (int): Kepler ID number

**Response:**
```json
{
  "kepid": 10854555,
  "features": {...},
  "exists": true
}
```

#### POST `/predict`
Make a prediction for a single set of features.

**Request Body:**
```json
{
  "kepid": 10854555  // Optional: KepID for lookup
  // OR
  "features": {
    "koi_period": 2.788491,
    "koi_depth": 56.7,
    // ... other features
  }
}
```

**Response:**
```json
{
  "probability": 0.87,
  "prediction": 1,
  "verdict": "PLANET"
}
```

#### POST `/predict-csv`
Upload a CSV file for batch predictions.

**Request:**
- Multipart form data with CSV file
- CSV must contain all 41 required features

**Response:**
- CSV file download with added columns:
  - `probability_of_planet`
  - `prediction` (0/1)
  - `verdict` (PLANET/NOT_PLANET)

## 🎨 UI Components

### Pages
- **Home** (`/`): Landing page with features and statistics
- **Predict** (`/predict`): Main prediction interface
- **About** (`/about`): Information about the project and technology

### Components
- **Navbar**: Sticky navigation with routing
- **Footer**: Reusable footer component
- **ExoPredict**: Main prediction component with three input methods

### Color Scheme
- **Primary Blue**: `#2563eb`
- **White**: `#ffffff`
- **Black**: `#000000`
- **Light Gray**: `#f3f4f6`

## 📁 Project Structure

```
FreshStart/
├── backend/
│   ├── app.py                 # FastAPI application
│   ├── hugging.py            # Model upload to Hugging Face
│   ├── requirements.txt      # Python dependencies
│   ├── cumulative.csv        # Kepler dataset
│   └── exoplanet_xgb.joblib # Trained model
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ExoPredict.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   └── PredictPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Backend Configuration
- **Host**: `0.0.0.0`
- **Port**: `8000`
- **CORS Origins**: `http://localhost:5173`, `http://localhost:3000`

### Frontend Configuration
- **Dev Server Port**: `5173`
- **API Base URL**: `http://localhost:8000`

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -c "import app; print('Backend imports successful')"
```

### Frontend Testing
```bash
cd frontend
npm run lint
npm run build
```

## 🚢 Deployment

### Backend Deployment
1. Use a production ASGI server like Gunicorn with Uvicorn workers
2. Set environment variables for production
3. Deploy to platforms like:
   - Heroku
   - Railway
   - AWS EC2
   - Google Cloud Run

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```

2. Deploy the `dist` folder to:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront

## 📝 How It Works

### Prediction Flow

1. **Data Input**: User provides either:
   - A KepID to lookup from database
   - Manual feature values
   - CSV file with multiple entries

2. **Data Processing**: 
   - Backend validates input
   - Ensures all 41 features are present
   - Normalizes data if needed

3. **Model Inference**:
   - XGBoost model processes features
   - Returns probability score (0-1)
   - Classifies as planet if probability > 0.5

4. **Result Display**:
   - Shows probability percentage
   - Displays verdict (PLANET/NOT_PLANET)
   - For CSV: Downloads results file

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **NASA Kepler Mission** for providing the exoplanet dataset
- **XGBoost** for the powerful machine learning framework
- **FastAPI** for the excellent API framework
- **React** and **Vite** for modern frontend development tools

## 📞 Contact

For questions or support, please open an issue on GitHub.

## 🔗 Useful Links

- [NASA Kepler Mission](https://www.nasa.gov/mission_pages/kepler/main/index.html)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for space exploration and machine learning**
