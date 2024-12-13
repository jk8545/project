# server.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import mediapipe as mp

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the pre-trained model
with open(r'f:\myproject\project\src\backend\model.p', 'rb') as file:
    model_dict = pickle.load(file)
    model = model_dict['model']

# Mediapipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, min_detection_confidence=0.5, max_num_hands=1)

# label mapping
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M',
    13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y',
    25: 'Z', 26: '0', 27: '1', 28: '2', 29: '3', 30: '4', 31: '5', 32: '6', 33: '7', 34: '8', 35: '9',
    36: ' ',
    37: '.'
}
expected_features = 42

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json['data']
    data = np.array(data).reshape(1, -1)

    # Predict gesture
    prediction = model.predict(data)
    predicted_character = labels_dict[int(prediction[0])]

    return jsonify({'predicted_character': predicted_character})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)