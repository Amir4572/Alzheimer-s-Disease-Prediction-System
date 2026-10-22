# 🧠 Alzheimer's Disease Prediction System

A machine learning-based healthcare prediction system that analyzes clinical and demographic data to predict the likelihood of Alzheimer's disease. The project combines six machine learning algorithms with a Flask web application to provide predictions, confidence scores, risk assessments, and model comparisons.

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Machine Learning Models](#-machine-learning-models)
- [Project Structure](#-project-structure)
- [Dataset Information](#-dataset-information)
- [Installation and Setup](#-installation-and-setup)
- [Running the Application](#-running-the-application)
- [Using the Application](#-using-the-application)
- [API Endpoints](#-api-endpoints)
- [Model Evaluation](#-model-evaluation)
- [Troubleshooting](#-troubleshooting)
- [Disclaimer](#-medical-disclaimer)
- [License](#-license)

## 📋 Project Overview

The Alzheimer's Disease Prediction System is designed to demonstrate how machine learning can be applied to healthcare-related data analysis.

The project includes:

- Five Jupyter notebooks covering the machine learning pipeline.
- Six trained classification models.
- A Flask backend with REST API endpoints.
- A responsive web interface built using HTML, CSS, and JavaScript.
- Clinical and demographic feature analysis.
- Prediction confidence, risk indicators, and model comparison.

## ✨ Key Features

### 🖥️ Web Application
- Modern dark-themed user interface with glassmorphism effects.
- Responsive layout for desktop and mobile devices.
- Patient data entry with form validation.
- Sample data loading for testing.
- Prediction results with confidence scores.
- Risk-level indicators.
- Comparison of predictions from all six models.

### 🤖 Machine Learning
- Six classification algorithms.
- Data preprocessing and feature scaling.
- SMOTE-based class balancing.
- Cross-validation for model evaluation.
- Performance analysis using accuracy, precision, recall, and F1-score.

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Programming Language | Python |
| Machine Learning | Scikit-learn |
| Data Processing | Pandas, NumPy |
| Class Balancing | Imbalanced-learn (SMOTE) |
| Backend | Flask, Flask-CORS |
| Frontend | HTML5, CSS3, JavaScript |
| Visualization | Matplotlib, Seaborn |
| Development Environment | Jupyter Notebook |

## 🧪 Machine Learning Models

The system supports the following classification algorithms:

| Model | Description |
|---|---|
| Logistic Regression | Interpretable classification baseline |
| Decision Tree | Rule-based classification |
| Random Forest | Ensemble learning using multiple decision trees |
| Support Vector Machine (SVM) | Classification using decision boundaries |
| K-Nearest Neighbors (KNN) | Classification based on neighboring samples |
| Naive Bayes | Probabilistic classification |

## 📁 Project Structure

```text
alzhiemers_prediction/
│
├── 01_data_understanding.ipynb
├── 02_data_preprocessing.ipynb
├── 03_model_building.ipynb
├── 04_model_evaluation.ipynb
├── 05_conclusion.ipynb
│
├── alzheimers_disease_data.csv
├── trained_models.pkl
├── X_train_balanced.npy
├── X_test_scaled.npy
├── y_train_balanced.npy
├── y_test.npy
├── feature_names.csv
├── requirements.txt
│
└── web/
    ├── app.py
    ├── requirements.txt
    └── static/
        ├── index.html
        ├── css/
        │   └── styles.css
        └── js/
            └── app.js
```

*Note: The tree above reflects the described project structure. Include only files and directories that actually exist in your repository.*

## 📊 Dataset Information

| Property | Details |
|---|---|
| Dataset Size | 2,149 patient records |
| Input Features | 33 clinical and demographic features |
| Prediction Type | Binary classification |
| Target Classes | 0 = No Alzheimer's, 1 = Alzheimer's |

### Feature Categories

- **Demographics:** Age, gender, ethnicity, education level.
- **Lifestyle:** BMI, smoking, alcohol consumption, physical activity, diet, sleep.
- **Medical History:** Family history, cardiovascular disease, diabetes, depression, head injury, hypertension.
- **Clinical Measurements:** Blood pressure and cholesterol measurements.
- **Cognitive Assessments:** MMSE, functional assessment, memory complaints, behavioral problems, ADL.
- **Symptoms:** Confusion, disorientation, personality changes, difficulty completing tasks, forgetfulness.

Verify the feature count and names against your actual dataset and application before publishing.

## 🚀 Installation and Setup

### Prerequisites

Ensure the following are installed:

- Python 3.8 or higher
- pip package manager
- A modern web browser
- Git (optional, for cloning the repository)

### Step 1: Clone the Repository

Replace the URL with your actual GitHub repository URL.

```bash
git clone https://github.com/YOUR_USERNAME/Alzheimers-Disease-Prediction.git
cd Alzheimers-Disease-Prediction
```

### Step 2: Create a Virtual Environment (Recommended)

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

On macOS or Linux:

```bash
source venv/bin/activate
```

### Step 3: Install Dependencies

Install the main project dependencies:

```bash
pip install -r requirements.txt
```

Install the web application dependencies if needed:

```bash
pip install -r web/requirements.txt
```

## 🌐 Running the Application

### Step 1: Verify Trained Models

Confirm that `trained_models.pkl` and any required preprocessing artifacts are present.

If the trained models are missing, run the relevant notebooks in sequence:

1. `01_data_understanding.ipynb`
2. `02_data_preprocessing.ipynb`
3. `03_model_building.ipynb`
4. `04_model_evaluation.ipynb`
5. `05_conclusion.ipynb`

The notebooks may require Jupyter and the project's installed dependencies.

### Step 2: Start the Flask Server

From the project root directory, run:

```bash
python web/app.py
```

Alternatively, enter the web directory:

```bash
cd web
python app.py
```

### Step 3: Open the Application

Navigate to:

```text
http://localhost:5000
```

The web interface should appear if the server starts successfully and the required files are available.

## 📝 Using the Application

1. **Select a Model:** Choose one of the six available machine learning models.
2. **Enter Patient Data:** Provide the required clinical and demographic feature values.
3. **Load Sample Data:** Use the sample-data option to test the interface, if available.
4. **Generate Prediction:** Click the Predict button.
5. **Review Results:** Examine the predicted class, confidence score, risk indicator, and model comparison.

Predictions are experimental outputs from the trained models and should not be interpreted as medical diagnoses.

## 🔌 API Endpoints

The Flask backend exposes the following endpoints, as described by the project implementation.

### 1. Get Available Models

```http
GET /api/models
```

Returns the available machine learning models.

Example response:

```json
{
  "models": [
    "Logistic Regression",
    "Decision Tree",
    "Random Forest",
    "SVM",
    "KNN",
    "Naive Bayes"
  ],
  "total_models": 6
}
```

### 2. Get Feature Information

```http
GET /api/features
```

Returns feature metadata, such as feature names and importance values, if implemented.

### 3. Predict Alzheimer's Disease

```http
POST /api/predict
Content-Type: application/json
```

Example request:

```json
{
  "features": {
    "Age": 75,
    "Gender": 1
  },
  "model": "Random Forest"
}
```

This is an illustrative request only. The actual endpoint may require all 33 features and their exact expected names and value formats.

The response may include the predicted class, confidence score, risk indicator, selected model, and predictions from other models.

### 4. Health Check

```http
GET /api/health
```

Returns the application's health and model-loading status, if implemented.

## 📈 Model Evaluation

The models are evaluated using standard classification metrics:

- **Accuracy:** Overall proportion of correct predictions.
- **Precision:** Proportion of positive predictions that are correct.
- **Recall:** Proportion of actual positive cases identified.
- **F1-score:** Harmonic mean of precision and recall.
- **Confusion Matrix:** Summary of correct and incorrect classifications.

Add your verified evaluation results to this section.

Do not report illustrative or estimated scores as actual experimental results. Use the results produced by your evaluation notebook and, where appropriate, document the train/test split and validation method.

## 🐛 Troubleshooting

| Issue | Possible Solution |
|---|---|
| Models fail to load | Check the model file path and required preprocessing artifacts. |
| Flask server fails to start | Install the dependencies and check whether port 5000 is in use. |
| Prediction returns an error | Verify the feature names, input types, and required fields. |
| Missing Python packages | Install dependencies from the appropriate requirements file. |
| Incorrect prediction behavior | Check feature order, preprocessing consistency, and model serialization. |

## ⚠️ Medical Disclaimer

This project is intended for educational and research purposes only.

- It is not a clinically validated diagnostic tool.
- It must not replace professional medical assessment.
- Predictions should not be used to make treatment decisions.
- Any real-world healthcare use would require appropriate clinical validation, privacy safeguards, and expert oversight.

Do not upload identifiable patient information or sensitive medical records to a public repository.

## 🤝 Contributing

Contributions and suggestions are welcome. You can improve the project by enhancing preprocessing, adding evaluation visualizations, improving the user interface, or testing additional machine learning models.

## 📄 License

This project is intended for educational use. Add an appropriate open-source license, such as the MIT License, if you wish to permit reuse under its terms.




