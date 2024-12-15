from flask import Flask, request, jsonify
import cv2
import mediapipe as mp
import numpy as np
import pickle
import base64
from io import BytesIO
from PIL import Image
from flask_cors import CORS
import time
import logging
from threading import Lock

# Logging configuration
logging.basicConfig(level=logging.DEBUG)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:3000"}})  # Replace with your frontend's URL

# Load the trained model
try:
    model_dict = pickle.load(open(r'f:\new\simplle\model.p', 'rb'))
    model = model_dict['model']
except FileNotFoundError:
    logging.error("Model file not found. Please check the path.")
    raise
except Exception as e:
    logging.error(f"Error loading model: {str(e)}")
    raise

# Label mapping
labels_dict = {
    0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H', 8: 'I', 9: 'J', 10: 'K', 11: 'L', 12: 'M',
    13: 'N', 14: 'O', 15: 'P', 16: 'Q', 17: 'R', 18: 'S', 19: 'T', 20: 'U', 21: 'V', 22: 'W', 23: 'X', 24: 'Y',
    25: 'Z', 26: '0', 27: '1', 28: '2', 29: '3', 30: '4', 31: '5', 32: '6', 33: '7', 34: '8', 35: '9',
    36: ' ',
    37: '.'
}

# Mediapipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, min_detection_confidence=0.5, max_num_hands=1)

# Expected number of features
expected_features = 42

# Thread-safe frame counter
frame_counter = 0
frame_counter_lock = Lock()

@app.route('/predict', methods=['POST'])
def predict():
    global frame_counter
    try:
        # Validate the request
        data = request.json
        if not data or 'image' not in data:
            raise ValueError("Invalid request: 'image' field is required.")

        image_data = data['image']
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))
        image = np.array(image)

        # Convert the image to RGB
        try:
            image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        except Exception as e:
            raise ValueError(f"Error converting image to RGB: {str(e)}")

        # Process the image with Mediapipe
        results = hands.process(image_rgb)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                data_aux = []
                x_ = []
                y_ = []

                # Extract hand landmarks
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    x_.append(x)
                    y_.append(y)

                if not x_ or not y_:
                    raise ValueError("No landmarks detected for normalization.")

                # Normalize landmarks
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    data_aux.append(x - min(x_))
                    data_aux.append(y - min(y_))

                # Ensure the input has the expected number of features
                if len(data_aux) < expected_features:
                    data_aux.extend([0] * (expected_features - len(data_aux)))
                elif len(data_aux) > expected_features:
                    data_aux = data_aux[:expected_features]

                # Predict the gesture
                try:
                    prediction = model.predict([np.asarray(data_aux)])
                    predicted_character = labels_dict[int(prediction[0])]
                except Exception as e:
                    raise ValueError(f"Error during model prediction: {str(e)}")

                with frame_counter_lock:
                    frame_counter += 1

                return jsonify({
                    'prediction': predicted_character,
                    'timestamp': frame_counter
                })

        with frame_counter_lock:
            frame_counter += 1
        return jsonify({'error': 'No hand detected', 'timestamp': frame_counter})

    except Exception as e:
        logging.error(f"Error: {str(e)}")
        with frame_counter_lock:
            frame_counter += 1
        return jsonify({'error': 'An unexpected error occurred. Please try again.', 'timestamp': frame_counter})

if __name__ == '__main__':
    app.run(debug=True)