// Alzheimer's Disease Prediction System - Frontend JavaScript

const API_BASE = 'http://localhost:5000/api';

let availableModels = [];
let features = [];
let selectedModel = 'Random Forest';

// Feature categories for organization
const FEATURE_CATEGORIES = {
    demographics: ['Age', 'Gender', 'Ethnicity', 'EducationLevel'],
    lifestyle: ['BMI', 'Smoking', 'AlcoholConsumption', 'PhysicalActivity', 'DietQuality', 'SleepQuality'],
    medical: ['FamilyHistoryAlzheimers', 'CardiovascularDisease', 'Diabetes', 'Depression', 'HeadInjury', 'Hypertension'],
    clinical: ['SystolicBP', 'DiastolicBP', 'CholesterolTotal', 'CholesterolLDL', 'CholesterolHDL', 'CholesterolTriglycerides'],
    cognitive: ['MMSE', 'FunctionalAssessment', 'MemoryComplaints', 'BehavioralProblems', 'ADL'],
    symptoms: ['Confusion', 'Disorientation', 'PersonalityChanges', 'DifficultyCompletingTasks', 'Forgetfulness']
};

// Initialize the application
async function init() {
    await loadModels();
    await loadFeatures();
    createFeatureInputs();
}

// Load available models
async function loadModels() {
    try {
        const response = await fetch(`${API_BASE}/models`);
        const data = await response.json();

        if (data.models) {
            availableModels = data.models;
            renderModelSelection();
        }
    } catch (error) {
        console.error('Error loading models:', error);
        document.getElementById('modelGrid').innerHTML = '<p class="error">Failed to load models</p>';
    }
}

// Load features
async function loadFeatures() {
    try {
        const response = await fetch(`${API_BASE}/features`);
        const data = await response.json();

        if (data.features) {
            features = data.features;
        }
    } catch (error) {
        console.error('Error loading features:', error);
    }
}

// Render model selection cards
function renderModelSelection() {
    const modelGrid = document.getElementById('modelGrid');

    modelGrid.innerHTML = availableModels.map(model => `
        <div class="model-card ${model === selectedModel ? 'selected' : ''}" 
             onclick="selectModel('${model}')">
            <div class="model-name">${model}</div>
        </div>
    `).join('');
}

// Select a model
function selectModel(model) {
    selectedModel = model;
    renderModelSelection();
}

// Create feature input fields
function createFeatureInputs() {
    Object.keys(FEATURE_CATEGORIES).forEach(category => {
        const container = document.getElementById(`${category}Inputs`);
        const categoryFeatures = FEATURE_CATEGORIES[category];

        container.innerHTML = categoryFeatures.map(featureName => {
            const feature = features.find(f => f.name === featureName) || { name: featureName };
            return createInputField(feature);
        }).join('');
    });
}

// Create individual input field
function createInputField(feature) {
    const isBinary = ['Gender', 'Ethnicity', 'EducationLevel', 'Smoking', 'FamilyHistoryAlzheimers',
        'CardiovascularDisease', 'Diabetes', 'Depression', 'HeadInjury', 'Hypertension',
        'MemoryComplaints', 'BehavioralProblems', 'Confusion', 'Disorientation',
        'PersonalityChanges', 'DifficultyCompletingTasks', 'Forgetfulness'].includes(feature.name);

    if (isBinary) {
        return `
            <div class="input-group">
                <label class="input-label">${formatFeatureName(feature.name)}</label>
                <select class="input-field" id="input_${feature.name}" required>
                    <option value="">Select...</option>
                    <option value="0">No</option>
                    <option value="1">Yes</option>
                </select>
            </div>
        `;
    } else {
        const placeholder = getPlaceholder(feature.name);
        return `
            <div class="input-group">
                <label class="input-label">${formatFeatureName(feature.name)}</label>
                <input type="number" 
                       class="input-field" 
                       id="input_${feature.name}" 
                       placeholder="${placeholder}"
                       step="0.01"
                       required>
            </div>
        `;
    }
}

// Format feature name for display
function formatFeatureName(name) {
    return name.replace(/([A-Z])/g, ' $1').trim();
}

// Get placeholder text for numeric inputs
function getPlaceholder(featureName) {
    const placeholders = {
        'Age': '60-90',
        'BMI': '15-40',
        'AlcoholConsumption': '0-20',
        'PhysicalActivity': '0-10',
        'DietQuality': '0-10',
        'SleepQuality': '4-10',
        'SystolicBP': '90-180',
        'DiastolicBP': '60-120',
        'CholesterolTotal': '150-300',
        'CholesterolLDL': '50-200',
        'CholesterolHDL': '20-100',
        'CholesterolTriglycerides': '50-400',
        'MMSE': '0-30',
        'FunctionalAssessment': '0-10',
        'ADL': '0-10'
    };
    return placeholders[featureName] || 'Enter value';
}

// Fill sample data for testing
function fillSampleData() {
    const sampleData = {
        Age: 75,
        Gender: 1,
        Ethnicity: 0,
        EducationLevel: 1,
        BMI: 28.5,
        Smoking: 0,
        AlcoholConsumption: 5,
        PhysicalActivity: 3,
        DietQuality: 6,
        SleepQuality: 6,
        FamilyHistoryAlzheimers: 1,
        CardiovascularDisease: 1,
        Diabetes: 0,
        Depression: 0,
        HeadInjury: 0,
        Hypertension: 1,
        SystolicBP: 140,
        DiastolicBP: 85,
        CholesterolTotal: 220,
        CholesterolLDL: 150,
        CholesterolHDL: 45,
        CholesterolTriglycerides: 180,
        MMSE: 22,
        FunctionalAssessment: 5,
        MemoryComplaints: 1,
        BehavioralProblems: 1,
        ADL: 6,
        Confusion: 1,
        Disorientation: 0,
        PersonalityChanges: 1,
        DifficultyCompletingTasks: 1,
        Forgetfulness: 1
    };

    Object.keys(sampleData).forEach(key => {
        const input = document.getElementById(`input_${key}`);
        if (input) {
            input.value = sampleData[key];
        }
    });
}

// Make prediction
async function makePrediction() {
    try {
        // Collect all input values
        const inputData = {};
        let hasError = false;

        features.forEach(feature => {
            const input = document.getElementById(`input_${feature.name}`);
            if (input) {
                const value = input.value;
                if (value === '' || value === null) {
                    hasError = true;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
                    inputData[feature.name] = parseFloat(value);
                }
            }
        });

        if (hasError) {
            alert('Please fill in all fields');
            return;
        }

        // Make API call
        const response = await fetch(`${API_BASE}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                features: inputData,
                model: selectedModel
            })
        });

        const result = await response.json();

        if (response.ok) {
            displayResults(result);
        } else {
            alert('Error: ' + (result.error || 'Prediction failed'));
        }

    } catch (error) {
        console.error('Prediction error:', error);
        alert('Failed to make prediction. Please try again.');
    }
}

// Display prediction results
function displayResults(result) {
    const resultsSection = document.getElementById('resultsSection');
    const resultMain = document.getElementById('resultMain');
    const confidenceCard = document.getElementById('confidenceCard');
    const riskCard = document.getElementById('riskCard');
    const modelComparison = document.getElementById('modelComparison');

    // Main result
    const isPositive = result.prediction === 1;
    resultMain.innerHTML = `
        <div class="result-label ${isPositive ? 'positive' : 'negative'}">
            ${result.prediction_label}
        </div>
        <p style="color: var(--text-secondary); margin-top: 0.5rem;">
            Model: ${result.model_used}
        </p>
    `;

    // Confidence
    confidenceCard.innerHTML = `
        <div class="result-card-title">Confidence</div>
        <div class="result-card-value" style="color: var(--primary);">
            ${(result.confidence * 100).toFixed(1)}%
        </div>
    `;

    // Risk level
    const riskColors = {
        'Very Low Risk': 'var(--success)',
        'Low Risk': 'var(--success)',
        'Moderate Risk': 'var(--warning)',
        'High Risk': 'var(--danger)',
        'Very High Risk': 'var(--danger)'
    };

    riskCard.innerHTML = `
        <div class="result-card-title">Risk Assessment</div>
        <div class="result-card-value" style="color: ${riskColors[result.risk_level]};">
            ${result.risk_level}
        </div>
    `;

    // Model comparison
    if (result.all_model_predictions) {
        const comparisonHTML = `
            <h3 class="comparison-title">All Models Comparison</h3>
            <div class="comparison-grid">
                ${Object.entries(result.all_model_predictions).map(([modelName, pred]) => `
                    <div class="comparison-item">
                        <span class="comparison-model">${modelName}</span>
                        <div class="comparison-result">
                            <span class="comparison-prediction" style="background: ${pred.prediction === 1 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}; color: ${pred.prediction === 1 ? 'var(--danger)' : 'var(--success)'};">
                                ${pred.prediction === 1 ? 'Positive' : 'Negative'}
                            </span>
                            <span class="comparison-confidence">
                                ${(pred.confidence * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        modelComparison.innerHTML = comparisonHTML;
    }

    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
