import numpy as np
import os
from google.colab import files

from tflite_model_maker.config import ExportFormat, QuantizationConfig
from tflite_model_maker import model_spec
from tflite_model_maker import object_detector

from tflite_support import metadata

import tensorflow as tf
assert tf.__version__.startswith('2')

tf.get_logger().setLevel('ERROR')
from absl import logging
logging.set_verbosity(logging.ERROR)

# Confirm TF Version
print("\nTensorflow Version:")
print(tf.__version__)
print()

# Load the dataset
train_data, validation_data, test_data = object_detector.DataLoader.from_csv('/content/lb_characters_dataset/lb_characters_dataset.csv')

# Select a model architecture
spec = model_spec.get('efficientdet_lite4')

# Train the TensorFlow model with the training data
model = object_detector.create(train_data, model_spec=spec, batch_size=4, train_whole_model=True, epochs=20, validation_data=validation_data)

# Evaluate the model with the validation data
eval_result = model.evaluate(test_data)

# Print COCO metrics
print("COCO metrics:")
for label, metric_value in eval_result.items():
    print(f"{label}: {metric_value}")

# Add a line break after all the items have been printed
print()

# Export the model
model.export(export_dir='.', tflite_filename='lpcharacters_detection_model.tflite')

# Evaluate the tflite model
tflite_eval_result = model.evaluate_tflite('lpcharacters_detection_model.tflite', test_data)

# Print COCO metrics for tflite
print("COCO metrics tflite")
for label, metric_value in tflite_eval_result.items():
    print(f"{label}: {metric_value}")

# Download model
files.download('lpcharacters_detection_model.tflite')