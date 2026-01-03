# api/ml_state.py
import os
from django.conf import settings
from pathlib import Path
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.applications import EfficientNetB3 # Corrected import
from tensorflow.keras.applications.efficientnet import preprocess_input

model = None

def get_model():
    """Lazily load and return the ML model."""
    global model
    if model is None:
        model_path = Path(settings.BASE_DIR) / "ml_models" / "my_model.h5"

        # --- Recreate the EfficientNetB3 model architecture exactly as in the notebook ---
        IMAGE_SIZE = (224, 224)
        NUM_CLASSES = 8 # From the notebook, there are 8 classes

        base_model = EfficientNetB3(
            include_top=False,
            weights="imagenet",
            input_shape=IMAGE_SIZE + (3,)
        )
        base_model.trainable = False

        inputs = tf.keras.Input(shape=IMAGE_SIZE + (3,))
        x = base_model(inputs, training=False)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.BatchNormalization()(x)
        x = layers.Dense(256, activation="relu")(x) # First Dense layer
        x = layers.Dropout(0.4)(x)
        outputs = layers.Dense(NUM_CLASSES, activation="softmax")(x) # Second Dense layer ('dense_1')

        model = tf.keras.Model(inputs, outputs)
        # --- End of architecture recreation ---

        # Load only the weights into the perfectly matched architecture
        model.load_weights(str(model_path))

        print("✅ Skin disease model (EfficientNetB3) architecture recreated and weights loaded successfully")
    return model