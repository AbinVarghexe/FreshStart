# Model Documentation - ExoPredict ML Model

Comprehensive documentation about the machine learning model used in ExoPredict.

## Table of Contents
1. [Model Overview](#model-overview)
2. [Dataset](#dataset)
3. [Features](#features)
4. [Model Architecture](#model-architecture)
5. [Training Process](#training-process)
6. [Performance Metrics](#performance-metrics)
7. [Prediction Process](#prediction-process)
8. [Limitations](#limitations)

---

## Model Overview

### Algorithm
**XGBoost (eXtreme Gradient Boosting) Classifier**

XGBoost is a powerful ensemble learning algorithm that:
- Uses gradient boosting framework
- Combines multiple weak learners (decision trees)
- Optimizes for prediction accuracy and computational efficiency
- Handles missing values automatically
- Prevents overfitting through regularization

### Model Type
- **Task**: Binary Classification
- **Output**: Probability score (0.0 to 1.0) and binary prediction (0 or 1)
- **Classes**: 
  - 0 = NOT_PLANET (False Positive)
  - 1 = PLANET (Confirmed Planet)

### Model File
- **Filename**: `exoplanet_xgb.joblib`
- **Format**: Joblib serialized object
- **Contents**:
  ```python
  {
      "model": XGBClassifier object,
      "features": list of 41 feature names
  }
  ```

---

## Dataset

### Source
**NASA Kepler Exoplanet Search Results**
- **File**: `cumulative.csv`
- **Origin**: NASA Exoplanet Archive
- **Mission**: Kepler Space Telescope
- **Time Period**: 2009-2018

### Dataset Statistics
- **Total Observations**: ~10,000 Kepler Objects of Interest (KOIs)
- **Confirmed Planets**: ~2,400
- **False Positives**: ~5,000
- **Candidates**: ~2,600

### Data Collection Method
The Kepler spacecraft used the **transit method**:
1. Continuously monitors 150,000+ stars
2. Detects periodic dimming of starlight
3. Measures transit depth, duration, and period
4. Records multiple transits to confirm periodicity

### Data Quality
- **High precision**: Kepler's photometric accuracy ~20 ppm
- **Long baseline**: 4+ years of continuous observation
- **Multiple transits**: Most candidates have 3+ observed transits
- **Ground truth**: Extensive follow-up observations for validation

---

## Features

### Feature Categories

#### 1. Orbital Parameters (12 features)
Transit and orbital characteristics:

| Feature | Description | Unit | Example |
|---------|-------------|------|---------|
| `koi_period` | Orbital period | days | 365.25 |
| `koi_period_err1` | Period upper uncertainty | days | 0.001 |
| `koi_period_err2` | Period lower uncertainty | days | -0.001 |
| `koi_time0bk` | Transit epoch | BJD-2454833 | 131.512 |
| `koi_time0bk_err1` | Epoch upper uncertainty | BJD | 0.002 |
| `koi_time0bk_err2` | Epoch lower uncertainty | BJD | -0.002 |
| `koi_impact` | Impact parameter | - | 0.5 |
| `koi_impact_err1` | Impact upper uncertainty | - | 0.1 |
| `koi_impact_err2` | Impact lower uncertainty | - | -0.1 |
| `koi_duration` | Transit duration | hours | 3.5 |
| `koi_duration_err1` | Duration upper uncertainty | hours | 0.2 |
| `koi_duration_err2` | Duration lower uncertainty | hours | -0.2 |

#### 2. Transit Properties (3 features)
Light curve characteristics:

| Feature | Description | Unit | Typical Range |
|---------|-------------|------|---------------|
| `koi_depth` | Transit depth | ppm | 10 - 50,000 |
| `koi_depth_err1` | Depth upper uncertainty | ppm | 1 - 1,000 |
| `koi_depth_err2` | Depth lower uncertainty | ppm | -1 - -1,000 |

#### 3. Planetary Properties (9 features)
Physical characteristics of the planet:

| Feature | Description | Unit | Typical Range |
|---------|-------------|------|---------------|
| `koi_prad` | Planet radius | Earth radii | 0.5 - 20 |
| `koi_prad_err1` | Radius upper uncertainty | Earth radii | 0.01 - 2 |
| `koi_prad_err2` | Radius lower uncertainty | Earth radii | -0.01 - -2 |
| `koi_teq` | Equilibrium temperature | Kelvin | 200 - 3000 |
| `koi_teq_err1` | Temperature upper uncertainty | Kelvin | 10 - 200 |
| `koi_teq_err2` | Temperature lower uncertainty | Kelvin | -10 - -200 |
| `koi_insol` | Insolation flux | Earth flux | 0.1 - 1000 |
| `koi_insol_err1` | Insolation upper uncertainty | Earth flux | 0.01 - 100 |
| `koi_insol_err2` | Insolation lower uncertainty | Earth flux | -0.01 - -100 |

#### 4. Stellar Properties (12 features)
Characteristics of the host star:

| Feature | Description | Unit | Typical Range |
|---------|-------------|------|---------------|
| `koi_steff` | Stellar effective temperature | Kelvin | 3500 - 7000 |
| `koi_steff_err1` | Temperature upper uncertainty | Kelvin | 50 - 500 |
| `koi_steff_err2` | Temperature lower uncertainty | Kelvin | -50 - -500 |
| `koi_slogg` | Stellar surface gravity | log10(cm/s²) | 3.5 - 5.0 |
| `koi_slogg_err1` | Gravity upper uncertainty | log10(cm/s²) | 0.01 - 0.5 |
| `koi_slogg_err2` | Gravity lower uncertainty | log10(cm/s²) | -0.01 - -0.5 |
| `koi_srad` | Stellar radius | Solar radii | 0.5 - 3.0 |
| `koi_srad_err1` | Radius upper uncertainty | Solar radii | 0.01 - 0.5 |
| `koi_srad_err2` | Radius lower uncertainty | Solar radii | -0.01 - -0.5 |
| `koi_model_snr` | Transit signal-to-noise ratio | - | 5 - 500 |

#### 5. Positional & Photometric (5 features)
Location and brightness measurements:

| Feature | Description | Unit | Range |
|---------|-------------|------|-------|
| `ra` | Right ascension | degrees | 0 - 360 |
| `dec` | Declination | degrees | -90 - 90 |
| `koi_kepmag` | Kepler-band magnitude | mag | 8 - 18 |
| `koi_gmag` | g-band magnitude | mag | 10 - 20 |
| `koi_rmag` | r-band magnitude | mag | 9 - 19 |
| `koi_imag` | i-band magnitude | mag | 9 - 19 |
| `koi_zmag` | z-band magnitude | mag | 9 - 18 |

### Feature Engineering
No additional feature engineering is performed. The model uses raw features as provided by NASA.

---

## Model Architecture

### XGBoost Hyperparameters

```python
XGBClassifier(
    max_depth=6,              # Maximum tree depth
    learning_rate=0.1,        # Step size shrinkage
    n_estimators=100,         # Number of boosting rounds
    objective='binary:logistic',  # Binary classification
    subsample=0.8,            # Row sampling
    colsample_bytree=0.8,     # Column sampling
    min_child_weight=1,       # Minimum sum of weights
    gamma=0,                  # Minimum loss reduction
    reg_alpha=0,              # L1 regularization
    reg_lambda=1,             # L2 regularization
    scale_pos_weight=1,       # Balance of positive/negative weights
    random_state=42           # Reproducibility
)
```

### Model Components

1. **Ensemble**: 100 decision trees
2. **Depth**: Each tree has maximum depth of 6
3. **Learning**: Gradient boosting with 0.1 learning rate
4. **Regularization**: L2 regularization to prevent overfitting
5. **Sampling**: 80% row and column sampling for diversity

---

## Training Process

### Data Preprocessing

1. **Load Data**:
   ```python
   df = pd.read_csv('cumulative.csv')
   ```

2. **Feature Selection**:
   - Select 41 relevant features
   - Remove features with excessive missing values
   - Keep features with physical significance

3. **Handle Missing Values**:
   - XGBoost handles missing values internally
   - Uses sparsity-aware algorithm
   - Learns optimal direction for missing values

4. **Label Preparation**:
   - Target: `koi_disposition` column
   - Map "CONFIRMED" → 1 (Planet)
   - Map "FALSE POSITIVE" → 0 (Not Planet)
   - Remove "CANDIDATE" entries (unlabeled)

### Train/Test Split

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,      # 80% train, 20% test
    random_state=42,     # Reproducibility
    stratify=y           # Maintain class distribution
)
```

### Training

```python
model = XGBClassifier(**params)
model.fit(
    X_train, 
    y_train,
    eval_set=[(X_test, y_test)],
    early_stopping_rounds=10,
    verbose=True
)
```

### Model Serialization

```python
import joblib

artifact = {
    "model": model,
    "features": feature_list
}

joblib.dump(artifact, "exoplanet_xgb.joblib")
```

---

## Performance Metrics

### Classification Metrics

Expected performance on test set:

| Metric | Value | Description |
|--------|-------|-------------|
| **Accuracy** | ~90-95% | Overall correctness |
| **Precision** | ~85-92% | True planets / Predicted planets |
| **Recall** | ~88-94% | Found planets / Actual planets |
| **F1-Score** | ~87-93% | Harmonic mean of precision & recall |
| **AUC-ROC** | ~0.95-0.98 | Area under ROC curve |

### Confusion Matrix (Example)

```
                Predicted
                0       1
Actual  0     480      20      (True Neg, False Pos)
        1      15     485      (False Neg, True Pos)
```

### Feature Importance

Top 10 most important features (typical):

1. `koi_model_snr` - Transit signal strength
2. `koi_depth` - Transit depth
3. `koi_prad` - Planet radius
4. `koi_period` - Orbital period
5. `koi_duration` - Transit duration
6. `koi_steff` - Stellar temperature
7. `koi_srad` - Stellar radius
8. `koi_teq` - Planet temperature
9. `koi_insol` - Insolation flux
10. `koi_impact` - Impact parameter

---

## Prediction Process

### Input Processing

1. **Receive Input**:
   - KepID lookup → fetch features from database
   - Custom features → validate all 41 features present

2. **Validate Features**:
   ```python
   required = set(FEATURES)
   provided = set(input_features.keys())
   missing = required - provided
   
   if missing:
       raise ValueError(f"Missing features: {missing}")
   ```

3. **Create DataFrame**:
   ```python
   X = pd.DataFrame([input_features], columns=FEATURES)
   ```

### Model Inference

1. **Predict Probability**:
   ```python
   probability = model.predict_proba(X)[0][1]
   ```
   Returns probability of class 1 (Planet)

2. **Make Binary Prediction**:
   ```python
   prediction = int(probability >= 0.5)
   ```

3. **Generate Verdict**:
   ```python
   verdict = "PLANET" if prediction == 1 else "NOT_PLANET"
   ```

### Output Format

```python
{
    "probability": 0.8734567,     # Float: 0.0 - 1.0
    "prediction": 1,              # Int: 0 or 1
    "verdict": "PLANET"           # String: PLANET or NOT_PLANET
}
```

---

## Limitations

### Model Limitations

1. **Training Data Bias**:
   - Trained only on Kepler mission data
   - May not generalize to other telescopes/missions
   - Limited to transit method detections

2. **Class Imbalance**:
   - More false positives than confirmed planets in training
   - May be conservative in predictions

3. **Feature Dependencies**:
   - Requires all 41 features
   - Cannot handle partial feature sets
   - Sensitive to measurement errors

4. **Physical Constraints**:
   - Best for planets similar to Kepler discoveries
   - May struggle with:
     - Very large planets (>20 Earth radii)
     - Very short periods (<0.5 days)
     - Very long periods (>700 days)

### Data Limitations

1. **Missing Values**:
   - Some KepIDs have incomplete data
   - Uncertainty values may be missing

2. **Measurement Errors**:
   - All features have inherent uncertainties
   - Model doesn't use uncertainty in predictions

3. **Selection Bias**:
   - Kepler preferentially detects:
     - Large planets (easier to detect)
     - Short periods (more transits observed)
     - Bright stars (better signal)

### Use Case Limitations

1. **Not a Replacement** for expert analysis
2. **Should be validated** with follow-up observations
3. **Probabilities are estimates**, not certainties
4. **Best used** as a screening tool

### Recommended Interpretation

| Probability | Recommendation |
|-------------|----------------|
| >90% | High confidence - Good candidate for follow-up |
| 70-90% | Medium-high confidence - Worth investigating |
| 50-70% | Uncertain - Requires careful analysis |
| 30-50% | Uncertain - Likely not a planet |
| <30% | Low confidence - Probably false positive |

---

## Model Updates

### Versioning
- Current Version: 1.0
- Training Date: [Date when model was trained]
- Last Updated: [Last update date]

### Future Improvements

Planned enhancements:
- [ ] Incorporate TESS mission data
- [ ] Add ensemble with other algorithms
- [ ] Include uncertainty quantification
- [ ] Feature importance in predictions
- [ ] Online learning capabilities
- [ ] Multi-class classification (planet types)
- [ ] Confidence intervals
- [ ] Anomaly detection

---

## Technical Details

### Dependencies

```python
xgboost>=1.5.0
scikit-learn>=1.0.0
pandas>=1.3.0
numpy>=1.21.0
joblib>=1.1.0
```

### Memory Requirements
- Model size: ~500 KB
- RAM for inference: <100 MB
- Prediction time: <10 ms per sample

### Computational Complexity
- Training: O(n * m * k * d)
  - n = samples
  - m = features
  - k = trees
  - d = depth
- Inference: O(k * d) per sample

---

## References

### Research Papers
- Chen, T., & Guestrin, C. (2016). XGBoost: A Scalable Tree Boosting System
- Kepler Mission Documentation (NASA)
- Exoplanet Detection Methods (various)

### Data Sources
- NASA Exoplanet Archive
- Kepler Mission Data
- MAST (Mikulski Archive for Space Telescopes)

### Related Work
- NASA Exoplanet Exploration Program
- Kepler Science Team
- XGBoost Documentation

---

**For technical questions about the model, please refer to the [API Reference](API_REFERENCE.md) or contact the development team.**
