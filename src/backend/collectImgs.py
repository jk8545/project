# collectImg.py
import cv2
import mediapipe as mp
import numpy as np
import os

# Mediapipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3)

# Define the labels and the number of images to collect per label
labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '.']
num_images = 100

# Ensure the data directory exists
if not os.path.exists('data'):
    os.makedirs('data')

# Collect images for each label
for label in labels:
    label_dir = os.path.join('data', str(labels.index(label)))
    if not os.path.exists(label_dir):
        os.makedirs(label_dir)

    cap = cv2.VideoCapture(0)
    print(f'Collecting images for {label}...')

    img_num = 0
    while img_num < num_images:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        cv2.imshow('Collecting images for {}'.format(label), frame)

        if cv2.waitKey(1) & 0xFF == ord('s'):
            img_name = os.path.join(label_dir, '{}_{}.jpg'.format(label, img_num))
            cv2.imwrite(img_name, frame)
            print(f'{img_name} written!')
            img_num += 1

    cap.release()
    cv2.destroyAllWindows()