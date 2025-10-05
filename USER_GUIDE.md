# User Guide - ExoPredict

Welcome to ExoPredict! This guide will help you understand how to use the application to detect and classify exoplanets.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Understanding the Interface](#understanding-the-interface)
3. [Making Predictions](#making-predictions)
4. [Interpreting Results](#interpreting-results)
5. [Tips & Best Practices](#tips--best-practices)
6. [FAQ](#faq)

---

## Getting Started

### Accessing the Application

1. Make sure both backend and frontend servers are running
2. Open your web browser
3. Navigate to `http://localhost:5173`
4. You'll see the home page with an overview of features

### Navigation

The application has three main pages:

- **Home** (`/`): Overview and features
- **Predict** (`/predict`): Main prediction interface
- **About** (`/about`): Information about the technology

Use the navigation bar at the top to move between pages.

---

## Understanding the Interface

### Home Page

The home page provides:
- Introduction to ExoPredict
- Key features overview
- Statistics about the model
- Quick links to start predicting

### Predict Page

This is where the magic happens! The predict page has three tabs:

1. **🔍 Search by KepID**
2. **✨ Custom Features**
3. **📊 Upload CSV**

### About Page

Learn about:
- The mission and technology
- How the ML model works
- Data sources and methodology

---

## Making Predictions

### Method 1: Search by KepID

**What is KepID?**
KepID (Kepler ID) is a unique identifier for objects observed by NASA's Kepler space telescope.

**Steps:**

1. Click the **"Search by KepID"** tab
2. Enter a KepID number (e.g., `10854555`)
3. Click **"Predict"**
4. View the results below

**Example KepIDs to Try:**
- `10854555` - Known exoplanet candidate
- `10797460` - Another candidate
- `10811496` - Try this one!

**When to use:**
- You have a specific Kepler object to analyze
- You want quick results from the database
- You're researching a particular candidate

---

### Method 2: Custom Features

**What are Custom Features?**
These are 41 astronomical measurements used by the model to make predictions.

**Steps:**

1. Click the **"Custom Features"** tab
2. Option A: Click **"Fill Sample Data"** to populate with example values
3. Option B: Manually enter values for all 41 features
4. Click **"Predict with Custom Features"**
5. View the results below

**Key Features Explained:**

- **koi_period**: How long it takes to orbit the star (in days)
- **koi_depth**: How much light is blocked during transit (in ppm)
- **koi_prad**: Planet's radius (compared to Earth)
- **koi_teq**: Estimated surface temperature (in Kelvin)
- **koi_steff**: Star's temperature (in Kelvin)
- **koi_srad**: Star's radius (compared to the Sun)

**When to use:**
- You have external data not in the Kepler database
- You want to test hypothetical scenarios
- You're analyzing data from other telescopes

---

### Method 3: Upload CSV

**What is CSV Upload?**
Process multiple predictions at once by uploading a CSV file.

**Steps:**

1. Click the **"Upload CSV"** tab
2. Click **"📥 Download Sample CSV Template"**
3. Open the template and fill in your data
4. Ensure all 41 features are included for each row
5. Click **"📁 Choose CSV File"** and select your file
6. Click **"Upload & Get Predictions"**
7. Download the results CSV automatically

**CSV Requirements:**
- Must be a `.csv` file
- Must contain all 41 feature columns
- Column names must match exactly
- Numeric values only (no text)
- Can have any number of rows

**Output:**
Your original CSV plus 3 new columns:
- `probability_of_planet`: Score from 0.0 to 1.0
- `prediction`: 0 (Not Planet) or 1 (Planet)
- `verdict`: "PLANET" or "NOT_PLANET"

**When to use:**
- You have multiple candidates to analyze
- You need batch processing
- You want to export results for further analysis

---

## Interpreting Results

### Understanding the Prediction

After making a prediction, you'll see:

#### 1. Probability Score
A percentage from 0% to 100%

**Interpretation:**
- **0-25%**: Very unlikely to be a planet
- **25-50%**: Probably not a planet
- **50-75%**: Likely a planet
- **75-100%**: Very likely a planet

#### 2. Verdict
Either "✅ Likely a Planet!" or "❌ Likely Not a Planet"

**Threshold:** 50%
- Above 50% = PLANET
- Below 50% = NOT_PLANET

#### 3. Visual Indicators

**Planet Result (Green):**
```
✅ Likely a Planet!
Probability: 87.35%
```

**Not Planet Result (Gray):**
```
❌ Likely Not a Planet
Probability: 23.45%
```

### What the Model Considers

The XGBoost model analyzes patterns in:

1. **Orbital Characteristics**
   - Period and duration of transit
   - Impact parameter
   - Transit depth

2. **Physical Properties**
   - Planet radius and temperature
   - Stellar characteristics
   - Insolation flux

3. **Observational Data**
   - Signal-to-noise ratio
   - Various magnitude measurements
   - Position (RA/Dec)

### Confidence Levels

| Probability | Confidence | Meaning |
|-------------|------------|---------|
| 90-100% | Very High | Almost certainly a planet |
| 75-90% | High | Strong evidence for planet |
| 60-75% | Medium | Moderate evidence |
| 50-60% | Low | Uncertain, borderline |
| 40-50% | Low | Uncertain, borderline |
| 25-40% | Medium | Moderate evidence against |
| 10-25% | High | Strong evidence against |
| 0-10% | Very High | Almost certainly not a planet |

---

## Tips & Best Practices

### For Best Results

1. **Use KepID when possible** - Most accurate as it uses verified database values

2. **Validate custom data** - Ensure values are realistic:
   - Planet radius: 0.1 - 25 Earth radii
   - Orbital period: 0.1 - 700 days
   - Temperature: 100 - 3000 Kelvin

3. **Check your CSV carefully**:
   - Use the provided template
   - Don't change column names
   - Remove any text/non-numeric values
   - Check for missing values

4. **Understand limitations**:
   - Model is trained on Kepler data
   - May not work well for very different systems
   - Predictions are probabilities, not certainties

### Common Scenarios

#### Scenario 1: Quick Check
"I want to quickly check if a Kepler object is a planet"
- **Method**: Use KepID search
- **Time**: ~1 second

#### Scenario 2: Research Analysis
"I'm analyzing data from another telescope"
- **Method**: Use Custom Features
- **Time**: ~2-3 minutes to enter data

#### Scenario 3: Batch Processing
"I have 100 candidates to analyze"
- **Method**: Use CSV Upload
- **Time**: ~30 seconds

---

## FAQ

### General Questions

**Q: What is an exoplanet?**
A: A planet that orbits a star outside our solar system.

**Q: How accurate is the model?**
A: The XGBoost model was trained on verified Kepler data and achieves high accuracy on the test set. However, predictions are probabilities, not certainties.

**Q: What data is the model trained on?**
A: NASA's Kepler mission cumulative dataset, which includes thousands of confirmed and candidate exoplanets.

### Technical Questions

**Q: What if I don't know all 41 features?**
A: All 41 features are required for custom predictions. Use the KepID method if you only have the Kepler ID.

**Q: Can I use data from other missions (TESS, Webb)?**
A: You can try, but the model is optimized for Kepler data. Results may be less accurate for other missions.

**Q: What does "probability" mean exactly?**
A: It's the model's confidence (0-100%) that the object is a planet based on its features compared to the training data.

**Q: Why did my CSV upload fail?**
A: Common reasons:
- Missing required columns
- Non-numeric values
- Incorrect column names
- Empty file

### Usage Questions

**Q: Can I save my predictions?**
A: For CSV uploads, predictions are automatically downloaded. For single predictions, you can screenshot or manually record results.

**Q: How many predictions can I make?**
A: Currently unlimited, but use responsibly.

**Q: Does it work offline?**
A: No, you need both servers running (backend and frontend).

**Q: Can I use this for my research?**
A: Yes! But please cite the Kepler mission data and acknowledge the XGBoost framework.

### Error Messages

**Q: "Backend server not responding"**
A: Make sure the backend is running on port 8000:
```bash
cd backend
uvicorn app:app --port 8000 --reload
```

**Q: "KepID not found"**
A: The KepID might not be in the database. Try a different number or use custom features.

**Q: "Missing required features"**
A: Ensure all 41 features are provided with numeric values.

---

## Need Help?

### Troubleshooting Steps

1. **Refresh the page**
2. **Check browser console** for error messages (F12)
3. **Verify both servers are running**
4. **Check the [Setup Guide](SETUP_GUIDE.md)**
5. **Read the [API Reference](API_REFERENCE.md)**

### Getting Support

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check the README.md
- **API Docs**: Visit `http://localhost:8000/docs`

---

## Quick Reference

### Sample KepIDs
- 10854555
- 10797460
- 10811496
- 10748390
- 10602068

### Required Features (41 total)
See the complete list by clicking "Custom Features" or visiting `/features` endpoint.

### Keyboard Shortcuts
- `Tab`: Navigate between input fields
- `Enter`: Submit prediction (when in input field)
- `Ctrl/Cmd + R`: Refresh page

---

**Happy planet hunting! 🌌🔭**

Questions? Check out our [README](README.md) or [API Reference](API_REFERENCE.md) for more details.
