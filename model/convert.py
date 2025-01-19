import tensorflow as tf
import tensorflowjs as tfjs
import tf2onnx
import onnx

# # Load your model
model = tf.keras.models.load_model("model_104x104.keras")

# # Convert and save directly to tfjs format
# tfjs.converters.save_keras_model(model, "../backend/src/model")

model_path = "base_model.h5"
input_signature = [tf.TensorSpec(model.inputs[0].shape, model.inputs[0].dtype, name='digit')]

model.output_names=['output']

onnx_model, _ = tf2onnx.convert.from_keras(model, input_signature, opset=13)
onnx.save(onnx_model, "./model.onnx")
