import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
import os
from PIL import Image

def load_dataset(image_directory, csv_path):
    labels_df = pd.read_csv(csv_path)
    
    images = []
    for image_name in labels_df['filename']:
        image_path = os.path.join(image_directory, image_name)
        img = Image.open(image_path)
        img_array = np.array(img)
        images.append(img_array)
    
    images = np.array(images)
    labels = labels_df['region_attributes'].values
    
    return images, labels

def train_model():
    images, labels = load_dataset('train', 'train.csv')
    
    # Verify image dimensions
    print(f"Image shape: {images[0].shape}")
    assert images[0].shape == (416, 416, 3), "Images must be 416x416x3"
    
    images = images / 127.5 - 1
    
    X_train, X_test, y_train, y_test = train_test_split(
        images, 
        labels,
        test_size=0.2,
        random_state=42
    )

    model = models.Sequential([
        layers.Conv2D(64, (3, 3), activation='relu', input_shape=(416, 416, 3)),
        layers.MaxPooling2D((2, 2), strides=(2, 2)),  # Output: 207x207x64
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2), strides=(2, 2)),  # Output: 103x103x128
        layers.Conv2D(256, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2), strides=(2, 2)),  # Output: 51x51x256
        layers.Conv2D(512, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2), strides=(2, 2)),  # Output: 25x25x512
        layers.Conv2D(512, (3, 3), activation='relu'),
        layers.MaxPooling2D((2, 2), strides=(2, 2)),  # Output: 12x12x512
        # Vectorization
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.Dense(len(np.unique(labels)), activation='softmax')
    ])

    model.compile(optimizer='adam',
                 loss='sparse_categorical_crossentropy',
                 metrics=['accuracy'])
    
    model.summary()
    
    history = model.fit(X_train, y_train, 
                       epochs=10,
                       batch_size=32,
                       validation_data=(X_test, y_test))

    test_loss, test_accuracy = model.evaluate(X_test, y_test)
    print(f'Test accuracy: {test_accuracy*100:.2f}%')

    model.save("model_416x416.keras")

def main():
    train_model()

if __name__ == "__main__":
    main()
