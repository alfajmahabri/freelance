# api/ml_state.py
import tensorflow as tf
from django.conf import settings
from pathlib import Path

print("🔥 ml_state.py LOADED")

_model = None

def get_model():
    global _model
    if _model is None:
        model_path = Path(settings.BASE_DIR) / ".." / ".." / ".." / "BACKUP" / "my_model.h5"

        # Load the full model directly from the .h5 file.
        # This is the correct approach since the file was saved with model.save()
        _model = tf.keras.models.load_model(str(model_path))
        
        print("✅ Skin disease model loaded successfully")

    return _model
