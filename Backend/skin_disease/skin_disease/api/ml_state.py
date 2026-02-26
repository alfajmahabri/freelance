import os
import numpy as np
import tensorflow as tf
from django.conf import settings

# GLOBAL STATE
model = None

# CONFIGURATION
NUM_CLASSES = 10
IMG_HEIGHT = 224
IMG_WIDTH = 224

def load_model():
    """
    Loads the Keras model from the specified path.
    """
    global model
    try:
        model_path = os.path.join(settings.BASE_DIR, 'ml_models', 'skin_disease_model.h5')
        print(f"🔄 Loading model from: {model_path}")

        if not os.path.exists(model_path):
            print("❌ Model file not found!")
            return None

        model = tf.keras.models.load_model(model_path, compile=False)
        print("✅ Model loaded successfully!")
        
        return model

    except Exception as e:
        print(f"❌ Critical Error loading model: {e}")
        import traceback
        traceback.print_exc()
        return None

def get_model():
    global model
    if model is None:
        model = load_model()
    return model

def predict_image(image_array):
    local_model = get_model()
    if local_model is None:
        return None

    try:
        # --- PREPROCESSING IS KEY HERE ---
        image_array = image_array.astype('float32')
        
        # FIX: EfficientNet in Keras expects [0, 255] range.
        # Your image loader might be giving [0, 1].
        # If the max value is small (like 1.0), we scale it up.
        if image_array.max() <= 1.5:
            # print("DEBUG: Scaling image up from [0-1] to [0-255]")
            image_array *= 255.0
            
        # Add batch dimension
        if len(image_array.shape) == 3:
            image_array = np.expand_dims(image_array, axis=0)

        # Predict
        predictions = local_model.predict(image_array, verbose=0)
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        
        return {
            "class_id": int(class_idx),
            "confidence": confidence,
            "probabilities": predictions[0].tolist() 
        }
    except Exception as e:
        print(f"Prediction Error: {e}")
        return None