# createDataset.py
import cv2
import mediapipe as mp
import numpy as np
import pickle
import os

# Mediapipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

# Define the labels
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '.']
data = []
labels_list = []

# Process images for each label
for label in labels:
    label_dir = os.path.join('data', str(labels.index(label)))
    if not os.path.exists(label_dir):
        print(f"Warning: Directory {label_dir} does not exist. Skipping label {label}.")
        continue

    for img_path in os.listdir(label_dir):
        img_path_full = os.path.join(label_dir, img_path)
        img = cv2.imread(img_path_full)
        if img is None:
            print(f"Warning: Could not read image {img_path_full}. Skipping.")
            continue

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                x_ = []
                y_ = []

                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y

                    x_.append(x)
                    y_.append(y)

                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    data.append(x - min(x_))
                    data.append(y - min(y_))

                labels_list.append(labels.index(label))
        else:
            print(f"Warning: No hand detected in image {img_path_full}. Skipping.")

# Convert data to numpy arrays
data = np.array(data).reshape(-1, 42)
labels_list = np.array(labels_list)

# Save the dataset to a pickle file
if len(data) > 0:
    with open('data.pickle', 'wb') as f:
        pickle.dump({'data': data, 'labels': labels_list}, f)
    print(f"Dataset created and saved as data.pickle. Total samples: {len(data)}")
else:
    print("Dataset saved. Total samples: 0")