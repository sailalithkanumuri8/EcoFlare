import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import os
from PIL import Image

def load_dataset(image_directory, csv_path):
    labels_df = pd.read_csv(csv_path)
    
    # labels_df = df[df['region_attributes'].value() != ""]
    images = []
    valid_extensions = {'.jpg', '.jpeg', '.png'}
    
    for image_name in labels_df['filename']:
        image_path = os.path.join(image_directory, image_name)
        if os.path.splitext(image_path)[1].lower() in valid_extensions:
            try:
                img = Image.open(image_path)
                img_array = np.array(img)
                if img_array.shape == (416, 416, 3):  # Verify dimensions
                    images.append(img_array)
                else:
                    print(f"Skipping {image_name}: incorrect dimensions {img_array.shape}")
            except Exception as e:
                print(f"Error loading {image_name}: {str(e)}")
    
    images = np.array(images)
    labels = labels_df['region_attributes'].values[:len(images)]  # Match labels to valid images
    
    return images, labels

def train_model():
    # Load and preprocess data
    images, labels = load_dataset('train', 'train.csv')
    
    print(f"Image shape: {images[0].shape}")
    print(f"Number of images loaded: {len(images)}")
    print(f"Unique labels before encoding: {np.unique(labels)}")
    
    # Encode labels
    label_encoder = LabelEncoder()
    labels_encoded = label_encoder.fit_transform(labels)
    num_classes = len(label_encoder.classes_)
    print(f"Number of classes: {num_classes}")
    print(f"Classes: {label_encoder.classes_}")
    
    # Normalize images
    images = images / 127.5 - 1
    
    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        images, 
        labels_encoded,
        test_size=0.5,
        random_state=42
    )

    model = models.Sequential([
        # Input Block
        layers.Conv2D(64, (3, 3), padding='same', activation='relu', input_shape=(416, 416, 3)),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Second Block
        layers.Conv2D(128, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(128, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Third Block
        layers.Conv2D(256, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(256, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(256, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Fourth Block
        layers.Conv2D(512, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(512, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.Conv2D(512, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Dense Layers
        layers.Flatten(),
        layers.Dense(4096, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(1024, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Display model summary
    model.summary()
    
    # Train model
    history = model.fit(
        X_train, 
        y_train,
        epochs=10,
        batch_size=32,
        validation_data=(X_test, y_test),
        verbose=1
    )

    # Evaluate model
    test_loss, test_accuracy = model.evaluate(X_test, y_test)
    print(f'Test accuracy: {test_accuracy*100:.2f}%')

    # Save model and label encoder
    model.save("model_416x416.keras")
    np.save('label_encoder_classes.npy', label_encoder.classes_)

    # Plot training history
    plt.figure(figsize=(12, 4))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('training_history.png')
    plt.close()

    # Example prediction
    sample_predictions = model.predict(X_test[:5])
    predicted_labels = label_encoder.inverse_transform(np.argmax(sample_predictions, axis=1))
    true_labels = label_encoder.inverse_transform(y_test[:5])
    
    print("\nSample Predictions:")
    for true, pred in zip(true_labels, predicted_labels):
        print(f"True: {true}, Predicted: {pred}")

def main():
    train_model()

if __name__ == "__main__":
    main()
