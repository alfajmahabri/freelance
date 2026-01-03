# api/ml_state.py
import os
from django.conf import settings
from pathlib import Path
import tensorflow as tf

model = None

def get_model():
    """Lazily load and return the ML model."""
    global model
    if model is None:
        model_path = Path(settings.BASE_DIR) / "ml_models" / "my_model.h5"

        # Load the full model directly from the .h5 file.
        # This is the correct approach since the file was saved with model.save()
        model = tf.keras.models.load_model(str(model_path))
        
        print("✅ Skin disease model loaded successfully")
    return model