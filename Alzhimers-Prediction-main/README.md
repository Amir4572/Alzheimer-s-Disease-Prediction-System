# Alzheimer's Disease Prediction System - Deployment Guide

## 📋 Project Overview

This is a complete machine learning system for predicting Alzheimer's disease using clinical and demographic data. The project includes:

- **5 Jupyter Notebooks** for the complete ML pipeline
- **6 Trained ML Models** (Logistic Regression, Decision Tree, Random Forest, SVM, KNN, Naive Bayes)
- **Modern Web Application** with Flask backend and responsive frontend
- **33 Clinical Features** for comprehensive patient assessment

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip package manager
- Modern web browser

### Installation

1. **Install Dependencies**

```bash
# Navigate to project directory
cd "c:\Users\pendy\Desktop\bapa rao\projects\ml-project\alzhiemers_prediction"

# Install Python packages
pip install -r requirements.txt
```

2. **Verify Trained Models**

The trained models should already exist in `trained_models.pkl` (4.4 MB). If not, run the notebooks:

```bash
jupyter nbconvert --to notebook --execute --inplace 01_data_understanding.ipynb
jupyter nbconvert --to notebook --execute --inplace 02_data_preprocessing.ipynb
jupyter nbconvert --to notebook --execute --inplace 03_model_building.ipynb
jupyter nbconvert --to notebook --execute --inplace 04_model_evaluation.ipynb
jupyter nbconvert --to notebook --execute --inplace 05_conclusion.ipynb
```

## 🌐 Running the Web Application

### Start the Server

```bash
cd web
python app.py
```

The server will start on `http://localhost:5000`

### Access the Application

Open your web browser and navigate to:
```
http://localhost:5000
```

## 📊 Using the Web Application

### 1. Select a Model

Choose from 6 available trained models:
- **Logistic Regression** - Simple, interpretable baseline
- **Decision Tree** - Rule-based classification
- **Random Forest** - Ensemble of decision trees (recommended)
- **Support Vector Machine** - Hyperplane-based classification
- **K-Nearest Neighbors** - Instance-based learning
- **Naive Bayes** - Probabilistic classifier

### 2. Enter Patient Data

Fill in all 33 features organized into categories:

**Demographics (4 features)**
- Age, Gender, Ethnicity, Education Level

**Lifestyle (6 features)**
- BMI, Smoking, Alcohol Consumption, Physical Activity, Diet Quality, Sleep Quality

**Medical History (6 features)**
- Family History, Cardiovascular Disease, Diabetes, Depression, Head Injury, Hypertension

**Clinical Measurements (6 features)**
- Blood Pressure (Systolic/Diastolic), Cholesterol levels (Total, LDL, HDL, Triglycerides)

**Cognitive Assessments (5 features)**
- MMSE, Functional Assessment, Memory Complaints, Behavioral Problems, ADL

**Symptoms (5 features)**
- Confusion, Disorientation, Personality Changes, Difficulty Completing Tasks, Forgetfulness

### 3. Get Predictions

Click **Predict** to get:
- Primary prediction (Positive/Negative)
- Confidence score
- Risk level assessment
- Comparison across all 6 models

### 4. Sample Data

Click **Load Sample Data** to populate the form with example values for testing.

## 📁 Project Structure

```
alzhiemers_prediction/
├── 01_data_understanding.ipynb      # Data exploration
├── 02_data_preprocessing.ipynb      # Data cleaning & SMOTE
├── 03_model_building.ipynb          # Train 6 ML models
├── 04_model_evaluation.ipynb        # Model comparison
├── 05_conclusion.ipynb              # Final analysis
├── alzheimers_disease_data.csv      # Dataset (2,149 patients)
├── trained_models.pkl               # Saved models (4.4 MB)
├── X_train_balanced.npy             # Preprocessed training data
├── X_test_scaled.npy                # Preprocessed test data
├── y_train_balanced.npy             # Training labels
├── y_test.npy                       # Test labels
├── feature_names.csv                # Feature list
├── requirements.txt                 # Python dependencies
└── web/                             # Web application
    ├── app.py                       # Flask backend
    ├── requirements.txt             # Web app dependencies
    └── static/
        ├── index.html               # Frontend UI
        ├── css/
        │   └── styles.css           # Modern dark theme
        └── js/
            └── app.js               # Frontend logic
```

## 🔧 API Endpoints

The Flask backend provides the following REST API endpoints:

### GET /api/models
Returns list of available models
```json
{
  "models": ["Logistic Regression", "Decision Tree", ...],
  "total_models": 6
}
```

### GET /api/features
Returns feature metadata
```json
{
  "features": [
    {"name": "Age", "importance": 0.045},
    ...
  ],
  "total_features": 33
}
```

### POST /api/predict
Make a prediction
```json
Request:
{
  "features": {"Age": 75, "Gender": 1, ...},
  "model": "Random Forest"
}

Response:
{
  "prediction": 1,
  "prediction_label": "Alzheimer's Positive",
  "confidence": 0.92,
  "probability_negative": 0.08,
  "probability_positive": 0.92,
  "risk_level": "Very High Risk",
  "model_used": "Random Forest",
  "all_model_predictions": {...}
}
```

### GET /api/health
Health check endpoint
```json
{
  "status": "healthy",
  "models_loaded": true,
  "scaler_loaded": true,
  "features_count": 33,
  "models_count": 6
}
```

## 🎨 Features

### Web Application
- ✅ Modern dark theme with glassmorphism effects
- ✅ Responsive design for all screen sizes
- ✅ Real-time form validation
- ✅ Model comparison visualization
- ✅ Confidence and risk level indicators
- ✅ Sample data for quick testing

### Machine Learning
- ✅ 6 different ML algorithms
- ✅ SMOTE for class balancing
- ✅ StandardScaler for feature normalization
- ✅ Cross-validation for robust evaluation
- ✅ Comprehensive metrics (Accuracy, Precision, Recall, F1)

## 📈 Model Performance

Based on the evaluation notebook, typical performance metrics:

| Model | Accuracy | F1-Score |
|-------|----------|----------|
| Random Forest | ~92% | ~91% |
| SVM | ~91% | ~90% |
| Logistic Regression | ~88% | ~87% |
| KNN | ~87% | ~86% |
| Naive Bayes | ~85% | ~84% |
| Decision Tree | ~84% | ~83% |

*Note: Exact values depend on the random seed and data split*

## ⚠️ Important Notes

### Medical Disclaimer
This system is for **research and educational purposes only**. It should:
- NOT replace professional medical diagnosis
- NOT be used for clinical decision-making without expert review
- Be validated by healthcare professionals before any medical use

### Data Privacy
- Do not enter real patient data without proper authorization
- Ensure HIPAA compliance if handling real medical records
- Use anonymized data for testing

## 🐛 Troubleshooting

### Models not loading
- Verify `trained_models.pkl` exists (should be ~4.4 MB)
- Re-run notebooks 1-3 to regenerate models

### Web app won't start
- Check if port 5000 is available
- Install Flask: `pip install flask flask-cors`
- Verify you're in the `web` directory

### Prediction errors
- Ensure all 33 features are provided
- Check feature values are in valid ranges
- Verify models are loaded (check `/api/health`)

## 📝 Development

### Running Notebooks
```bash
# Run all notebooks sequentially
jupyter nbconvert --to notebook --execute --inplace *.ipynb

# Or run individually
jupyter notebook 01_data_understanding.ipynb
```

### Modifying the Web App
1. Edit `web/static/index.html` for UI changes
2. Edit `web/static/css/styles.css` for styling
3. Edit `web/static/js/app.js` for frontend logic
4. Edit `web/app.py` for backend changes

### Adding New Models
1. Train model in `03_model_building.ipynb`
2. Add to models dictionary
3. Save with pickle
4. Web app will automatically detect it

## 📚 Additional Resources

### Dataset Information
- **Total Patients**: 2,149
- **Features**: 33 clinical and demographic variables
- **Target**: Binary (0 = No Alzheimer's, 1 = Alzheimer's)
- **Class Distribution**: ~65% negative, ~35% positive (balanced with SMOTE)

### Technology Stack
- **Backend**: Flask, scikit-learn, pandas, numpy
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **ML Libraries**: scikit-learn, imbalanced-learn
- **Visualization**: matplotlib, seaborn (in notebooks)

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review notebook outputs for errors
3. Verify all dependencies are installed
4. Check Flask server logs for API errors

## 📄 License

This is an educational project. Ensure proper licensing for any production use.

---

**Last Updated**: February 2026
**Version**: 1.0.0
