import tensorflowjs as tfjs
import tensorflow as tf

# Load your model
model = tf.keras.models.load_model('model_104x104.keras')

# Convert and save directly to tfjs format
tfjs.converters.save_keras_model(model, './output')

