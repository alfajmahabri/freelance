# api/ml_state.py
import os
from django.conf import settings
from pathlib import Path
import tensorflow as tf
from tensorflow.keras import layers, models

model = None

def get_model():
    """Lazily load and return the ML model."""
    global model
    if model is None:
        model_path = Path(settings.BASE_DIR) / "ml_models" / "my_model.h5"

        IMG_SIZE = (224, 224)
        base_model = tf.keras.applications.MobileNetV2(
            input_shape=IMG_SIZE + (3,),
            include_top=False,
            weights=None, # We are loading from a file, so we dont need pretrained weights
        )
        base_model.trainable = False

        model = models.Sequential([
            base_model,
            layers.GlobalAveragePooling2D(),
            layers.Dropout(0.3),
            layers.Dense(23, activation='softmax') # 23 classes, as indicated by the weights file
        ])
        
        model.load_weights(str(model_path)) # Make sure to pass a string
        
        print("✅ Skin disease model reconstructed and weights loaded successfully")
    return model
