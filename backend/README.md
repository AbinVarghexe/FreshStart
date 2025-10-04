# Exoplanet Detection Model

This repository contains an XGBoost machine learning model for detecting exoplanets using NASA Kepler mission data.

## Model Description

- **Model Type**: XGBoost Classifier
- **Task**: Binary classification (planet vs. false positive)
- **Dataset**: NASA Kepler Exoplanet Archive
- **Format**: Joblib serialized model

## Files

- `exoplanet_xgb.joblib`: The trained XGBoost model and feature names
- `requirements.txt`: Python dependencies needed to use the model

## Usage

### Loading the Model

```python
import joblib
import xgboost as xgb
import numpy as np

# Load the model
arte = joblib.load("exoplanet_xgb.joblib")
model = arte["model"]
features = arte["features"]

# Make predictions
# Prepare your data with the required features
X = np.array([...])  # Your feature values in the correct order
dmat = xgb.DMatrix(X, feature_names=features)
predictions = model.predict(dmat)
```

### API Server

This model is also available via a FastAPI server. See the repository for `app.py`.

```bash
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

Then visit `http://localhost:8000/docs` for interactive API documentation.

## Requirements

- Python 3.8+
- xgboost
- numpy
- pandas
- joblib

## License

This model uses publicly available NASA Kepler data.

## Citation

Data Source: NASA Exoplanet Archive
