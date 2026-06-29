"""
Alzheimer's Disease Prediction Web Application
Flask backend server with trained ML model integration
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pandas as pd
import numpy as np
import pickle
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__, static_folder='static')
CORS(app)

# Global variables for models and scaler
models = None
scaler = None
feature_names = None

def load_trained_models():
    """Load the pre-trained models from notebooks"""
    global models, feature_names
    
    try:
        # Load trained models
        models_path = os.path.join(os.path.dirname(__file__), '..', 'trained_models.pkl')
        logger.info(f"Loading trained models from: {models_path}")
        
        with open(models_path, 'rb') as f:
            models = pickle.load(f)
        
        # Load feature names
        feature_names_path = os.path.join(os.path.dirname(__file__), '..', 'feature_names.csv')
        feature_names_df = pd.read_csv(feature_names_path)
        feature_names = feature_names_df['feature_name'].tolist()
        
        logger.info(f"Loaded {len(models)} models: {list(models.keys())}")
        logger.info(f"Features: {len(feature_names)}")
        
        return True
        
    except Exception as e:
        logger.error(f"Error loading models: {str(e)}")
        return False


def load_scaler():
    """Load or create scaler from the dataset"""
    global scaler
    
    try:
        from sklearn.preprocessing import StandardScaler
        from sklearn.model_selection import train_test_split
        
        # Load dataset
        data_path = os.path.join(os.path.dirname(__file__), '..', 'alzheimers_disease_data.csv')
        df = pd.read_csv(data_path)
        
        # Remove non-feature columns
        columns_to_drop = ['Diagnosis', 'PatientID', 'DoctorInCharge']
        columns_to_drop = [col for col in columns_to_drop if col in df.columns]
        
        X = df.drop(columns_to_drop, axis=1)
        y = df['Diagnosis']
        
        # Split data (same as in notebooks)
        X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Fit scaler on training data
        scaler = StandardScaler()
        scaler.fit(X_train)
        
        logger.info("Scaler created successfully")
        return True
        
    except Exception as e:
        logger.error(f"Error creating scaler: {str(e)}")
        return False


@app.route('/')
def index():
    """Serve the main HTML page"""
    return send_from_directory('static', 'index.html')


@app.route('/css/<path:filename>')
def serve_css(filename):
    """Serve CSS files"""
    return send_from_directory('static/css', filename)


@app.route('/js/<path:filename>')
def serve_js(filename):
    """Serve JavaScript files"""
    return send_from_directory('static/js', filename)


@app.route('/favicon.ico')
def favicon():
    """Serve favicon or return 204 if not found"""
    return '', 204


@app.route('/api/features', methods=['GET'])
def get_features():
    """Return feature names and their metadata"""
    if feature_names is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    # Get feature importance from Random Forest model
    feature_importance = {}
    if models and 'Random Forest' in models:
        rf_model = models['Random Forest']
        feature_importance = dict(zip(feature_names, rf_model.feature_importances_))
    
    # Build feature metadata
    features_metadata = []
    for feature in feature_names:
        metadata = {
            'name': feature,
            'importance': feature_importance.get(feature, 0)
        }
        features_metadata.append(metadata)
    
    # Sort by importance
    features_metadata.sort(key=lambda x: x['importance'], reverse=True)
    
    return jsonify({
        'features': features_metadata,
        'total_features': len(feature_names)
    })


@app.route('/api/models', methods=['GET'])
def get_models():
    """Return available models"""
    if models is None:
        return jsonify({'error': 'Models not loaded'}), 500
    
    return jsonify({
        'models': list(models.keys()),
        'total_models': len(models)
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    """Make prediction based on input features"""
    try:
        if models is None or scaler is None:
            return jsonify({'error': 'Models not loaded'}), 500
        
        # Get input data
        data = request.get_json()
        
        if not data or 'features' not in data:
            return jsonify({'error': 'No features provided'}), 400
        
        input_features = data['features']
        selected_model = data.get('model', 'Random Forest')
        
        # Validate model selection
        if selected_model not in models:
            return jsonify({'error': f'Model {selected_model} not found'}), 400
        
        # Create DataFrame with feature names
        input_df = pd.DataFrame([input_features], columns=feature_names)
        
        # Check for missing features
        missing_features = set(feature_names) - set(input_features.keys())
        if missing_features:
            return jsonify({
                'error': f'Missing features: {", ".join(missing_features)}'
            }), 400
        
        # Scale input
        input_scaled = scaler.transform(input_df)
        
        # Make prediction with selected model
        model = models[selected_model]
        prediction = model.predict(input_scaled)[0]
        
        # Get probability if available
        try:
            prediction_proba = model.predict_proba(input_scaled)[0]
            confidence = float(max(prediction_proba))
            probability_negative = float(prediction_proba[0])
            probability_positive = float(prediction_proba[1])
        except:
            confidence = 1.0
            probability_negative = 1.0 if prediction == 0 else 0.0
            probability_positive = 1.0 if prediction == 1 else 0.0
        
        # Get predictions from all models for comparison
        all_predictions = {}
        for model_name, model_obj in models.items():
            pred = model_obj.predict(input_scaled)[0]
            try:
                proba = model_obj.predict_proba(input_scaled)[0]
                all_predictions[model_name] = {
                    'prediction': int(pred),
                    'confidence': float(max(proba)),
                    'probability_positive': float(proba[1])
                }
            except:
                all_predictions[model_name] = {
                    'prediction': int(pred),
                    'confidence': 1.0,
                    'probability_positive': 1.0 if pred == 1 else 0.0
                }
        
        # Prepare response
        response = {
            'prediction': int(prediction),
            'prediction_label': "Alzheimer's Positive" if prediction == 1 else "Alzheimer's Negative",
            'confidence': confidence,
            'probability_negative': probability_negative,
            'probability_positive': probability_positive,
            'risk_level': get_risk_level(confidence, prediction),
            'model_used': selected_model,
            'all_model_predictions': all_predictions
        }
        
        logger.info(f"Prediction made with {selected_model}: {response['prediction_label']} (confidence: {confidence:.2%})")
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500


def get_risk_level(confidence, prediction):
    """Determine risk level based on confidence and prediction"""
    if prediction == 0:
        if confidence > 0.9:
            return 'Very Low Risk'
        elif confidence > 0.7:
            return 'Low Risk'
        else:
            return 'Moderate Risk'
    else:
        if confidence > 0.9:
            return 'Very High Risk'
        elif confidence > 0.7:
            return 'High Risk'
        else:
            return 'Moderate Risk'


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'models_loaded': models is not None,
        'scaler_loaded': scaler is not None,
        'features_count': len(feature_names) if feature_names else 0,
        'models_count': len(models) if models else 0
    })


if __name__ == '__main__':
    logger.info("Starting Alzheimer's Disease Prediction Web Application...")
    
    # Load trained models and scaler
    models_loaded = load_trained_models()
    scaler_loaded = load_scaler()
    
    if models_loaded and scaler_loaded:
        logger.info("Models and scaler loaded successfully!")
        logger.info("Starting Flask server on http://localhost:5000")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        logger.error("Failed to load models or scaler. Exiting.")
