# api/ml_state.py
import os
from django.conf import settings
from pathlib import Path
import tensorflow as tf
from tensorflow.keras import layers, models

from tensorflow.keras.applications.efficientnet import preprocess_input

model = None

def get_model():
    """Lazily load and return the ML model."""
    global model
    if model is None:
        model_path = Path(settings.BASE_DIR) / "ml_models" / "my_model.h5"

        custom_objects = {"preprocess_input": preprocess_input}
        model = tf.keras.models.load_model(str(model_path), custom_objects=custom_objects)
        
        print("✅ Skin disease model reconstructed and weights loaded successfully")
    return model
