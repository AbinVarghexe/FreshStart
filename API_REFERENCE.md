# API Reference - ExoPredict Backend

Complete API documentation for the ExoPredict FastAPI backend.

## Base URL
```
http://localhost:8000
```

## API Overview

The ExoPredict API provides endpoints for:
- Exoplanet prediction using KepID lookup
- Custom feature-based prediction
- Batch CSV predictions
- Feature list retrieval
- Health checks

## Authentication
Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All responses are in JSON format unless otherwise specified.

**Success Response:**
```json
{
  "data": {...},
  "status": "success"
}
```

**Error Response:**
```json
{
  "detail": "Error message here"
}
```

---

## Endpoints

### 1. Root Endpoint

**GET** `/`

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
  },
  "version": "1.0.0",
  "model": "XGBoost Classifier"
}
```

---

### 2. Get Features List

**GET** `/features`

Returns the complete list of all 41 features required for prediction.

**Response:**
```json
{
  "count": 41,
  "features": [
    "koi_period",
    "koi_period_err1",
    "koi_period_err2",
    "koi_time0bk",
    "koi_time0bk_err1",
    "koi_time0bk_err2",
    "koi_impact",
    "koi_impact_err1",
    "koi_impact_err2",
    "koi_duration",
    "koi_duration_err1",
    "koi_duration_err2",
    "koi_depth",
    "koi_depth_err1",
    "koi_depth_err2",
    "koi_prad",
    "koi_prad_err1",
    "koi_prad_err2",
    "koi_teq",
    "koi_teq_err1",
    "koi_teq_err2",
    "koi_insol",
    "koi_insol_err1",
    "koi_insol_err2",
    "koi_model_snr",
    "koi_steff",
    "koi_steff_err1",
    "koi_steff_err2",
    "koi_slogg",
    "koi_slogg_err1",
    "koi_slogg_err2",
    "koi_srad",
    "koi_srad_err1",
    "koi_srad_err2",
    "ra",
    "dec",
    "koi_kepmag",
    "koi_gmag",
    "koi_rmag",
    "koi_imag",
    "koi_zmag"
  ]
}
```

**Feature Descriptions:**

| Feature | Description | Unit |
|---------|-------------|------|
| `koi_period` | Orbital period | days |
| `koi_period_err1` | Orbital period upper uncertainty | days |
| `koi_period_err2` | Orbital period lower uncertainty | days |
| `koi_time0bk` | Transit epoch | BJD - 2,454,833.0 |
| `koi_impact` | Impact parameter | - |
| `koi_duration` | Transit duration | hours |
| `koi_depth` | Transit depth | ppm |
| `koi_prad` | Planetary radius | Earth radii |
| `koi_teq` | Equilibrium temperature | Kelvin |
| `koi_insol` | Insolation flux | Earth flux |
| `koi_model_snr` | Signal to noise ratio | - |
| `koi_steff` | Stellar effective temperature | Kelvin |
| `koi_slogg` | Stellar surface gravity | log10(cm/s²) |
| `koi_srad` | Stellar radius | Solar radii |
| `ra` | Right ascension | degrees |
| `dec` | Declination | degrees |
| `koi_kepmag` | Kepler magnitude | mag |
| `koi_gmag` | g-band magnitude | mag |
| `koi_rmag` | r-band magnitude | mag |
| `koi_imag` | i-band magnitude | mag |
| `koi_zmag` | z-band magnitude | mag |

---

### 3. Get Data by KepID

**GET** `/kepid/{kepid}`

Retrieve feature data for a specific Kepler Object of Interest.

**Parameters:**
- `kepid` (path parameter, integer): Kepler ID number

**Example Request:**
```http
GET /kepid/10854555
```

**Success Response (200):**
```json
{
  "kepid": 10854555,
  "features": {
    "koi_period": 2.788491,
    "koi_period_err1": 0.000012,
    "koi_period_err2": -0.000012,
    "koi_time0bk": 134.46753,
    "koi_depth": 56.7,
    "koi_prad": 0.89,
    "koi_teq": 1523.0,
    "koi_steff": 5455.0,
    // ... all 41 features
  },
  "exists": true
}
```

**Error Response (404):**
```json
{
  "detail": "KepID 12345678 not found in database"
}
```

---

### 4. Make Prediction

**POST** `/predict`

Make a prediction for a single exoplanet candidate.

**Request Body (Option 1 - Using KepID):**
```json
{
  "kepid": 10854555
}
```

**Request Body (Option 2 - Custom Features):**
```json
{
  "features": {
    "koi_period": 2.788491,
    "koi_period_err1": 0.000012,
    "koi_period_err2": -0.000012,
    // ... all 41 features required
  }
}
```

**Success Response (200):**
```json
{
  "probability": 0.8734567,
  "prediction": 1,
  "verdict": "PLANET",
  "confidence": "high"
}
```

**Response Fields:**
- `probability` (float): Probability that the object is a planet (0.0 - 1.0)
- `prediction` (int): Binary prediction (0 = NOT_PLANET, 1 = PLANET)
- `verdict` (string): Human-readable result ("PLANET" or "NOT_PLANET")
- `confidence` (string): Confidence level based on probability

**Confidence Levels:**
- `very_high`: probability > 0.9 or < 0.1
- `high`: probability > 0.75 or < 0.25
- `medium`: probability > 0.6 or < 0.4
- `low`: otherwise

**Error Responses:**

**400 - Missing Features:**
```json
{
  "detail": "Missing required features: ['koi_period', 'koi_depth']"
}
```

**400 - Invalid KepID:**
```json
{
  "detail": "KepID 12345 not found in database"
}
```

**400 - No Input Provided:**
```json
{
  "detail": "Must provide either 'kepid' or 'features'"
}
```

---

### 5. Batch CSV Prediction

**POST** `/predict-csv`

Upload a CSV file and get predictions for multiple entries.

**Request:**
- Content-Type: `multipart/form-data`
- Form field name: `file`
- File type: `.csv`

**CSV Requirements:**
1. Must contain all 41 required features as columns
2. Can have any number of rows
3. Column names must match feature names exactly
4. Numeric values only

**Example CSV Input:**
```csv
koi_period,koi_period_err1,koi_period_err2,...
2.788491,0.000012,-0.000012,...
5.123456,0.000020,-0.000020,...
```

**cURL Example:**
```bash
curl -X POST "http://localhost:8000/predict-csv" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@your_data.csv"
```

**Success Response (200):**
- Content-Type: `text/csv`
- Returns CSV file with original data plus 3 new columns:

**Added Columns:**
1. `probability_of_planet`: Probability score (0.0 - 1.0)
2. `prediction`: Binary prediction (0 or 1)
3. `verdict`: Text verdict ("PLANET" or "NOT_PLANET")

**Example Output CSV:**
```csv
koi_period,koi_depth,...,probability_of_planet,prediction,verdict
2.788491,56.7,...,0.8734567,1,PLANET
5.123456,23.4,...,0.1234567,0,NOT_PLANET
```

**Error Responses:**

**400 - Missing Features:**
```json
{
  "detail": "CSV missing required features: ['koi_period', 'koi_depth']"
}
```

**400 - Invalid File:**
```json
{
  "detail": "Invalid CSV format"
}
```

**400 - Empty File:**
```json
{
  "detail": "CSV file is empty"
}
```

---

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently, there are no rate limits. This may change in production.

---

## CORS Configuration

The API accepts requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)
- `http://localhost:5174` (Vite alternative)

Additional origins can be configured in `app.py`.

---

## Model Information

**Model Type:** XGBoost Classifier  
**Training Data:** NASA Kepler Exoplanet Search Results  
**Features:** 41 astronomical measurements  
**Output:** Binary classification (Planet vs. Not Planet)  
**Threshold:** 0.5 probability  

---

## Testing the API

### Using cURL

**Get Features:**
```bash
curl http://localhost:8000/features
```

**Get KepID Data:**
```bash
curl http://localhost:8000/kepid/10854555
```

**Make Prediction:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"kepid": 10854555}'
```

### Using Python

```python
import requests

# Base URL
base_url = "http://localhost:8000"

# Get features
response = requests.get(f"{base_url}/features")
print(response.json())

# Make prediction
data = {"kepid": 10854555}
response = requests.post(f"{base_url}/predict", json=data)
print(response.json())
```

### Using JavaScript/Fetch

```javascript
// Make prediction
fetch('http://localhost:8000/predict', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ kepid: 10854555 })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## Interactive Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

These interfaces allow you to:
- View all endpoints
- See request/response schemas
- Test endpoints directly in the browser
- Download OpenAPI specification

---

## Best Practices

1. **Always validate input** before sending to API
2. **Handle errors gracefully** in your application
3. **Cache feature list** instead of fetching repeatedly
4. **Use batch CSV endpoint** for multiple predictions
5. **Monitor response times** for performance
6. **Check model version** for compatibility

---

## Future Enhancements

Planned features:
- [ ] API authentication
- [ ] Rate limiting
- [ ] Prediction history
- [ ] Model versioning
- [ ] Confidence intervals
- [ ] Feature importance scores
- [ ] Batch prediction with streaming
- [ ] WebSocket support for real-time predictions

---

**For more information, visit the [GitHub repository](https://github.com/yourusername/exopredict)**
