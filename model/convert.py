import tensorflow as tf
import tensorflowjs as tfjs

# Load your model
model = tf.keras.models.load_model("model_104x104.keras")

# Convert and save directly to tfjs format
tfjs.converters.save_keras_model(model, "../backend/src/model")
