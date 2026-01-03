CLASS_NAMES = ['ECZ', 'WMV', 'MEL', 'ATD', 'BCC', 'NV', 'BKL', 'PLP', 'SKB', 'TRF']

# User-friendly full names for the 10 classes
CLASS_FULL_FORMS = {
    'ECZ': 'Eczema',
    'WMV': 'Warts Molluscum and other Viral Infections',
    'MEL': 'Melanoma',
    'ATD': 'Atopic Dermatitis',
    'BCC': 'Basal Cell Carcinoma (BCC)',
    'NV': 'Melanocytic Nevi (NV)',
    'BKL': 'Benign Keratosis-like Lesions (BKL)',
    'PLP': 'Psoriasis, Lichen Planus and related diseases',
    'SKB': 'Seborrheic Keratoses and other Benign Tumors',
    'TRF': 'Tinea, Ringworm, Candidiasis and other Fungal Infections',
}


import numpy as np
from io import BytesIO
from PIL import Image

try:
    from tensorflow.keras.preprocessing.image import load_img, img_to_array
except Exception:
    from keras.preprocessing.image import load_img, img_to_array

IMAGE_SIZE = (224, 224)

def preprocess_image_from_bytes(image_bytes):
    """
    Preprocesses image bytes to the format the model expects.
    - Decodes from bytes
    - Resizes to (224, 224)
    - Converts to a float32 array
    - Rescales pixels from [0, 255] to [0, 1]
    - Adds a batch dimension
    """
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMAGE_SIZE)
    x = img_to_array(img)
    x = x / 255.0  # Rescale to [0, 1] as done in training
    x = np.expand_dims(x, axis=0)
    return x


import logging
import traceback

def predict_skin_disease_from_bytes(model, image_bytes):
    try:
        logging.info("Starting image preprocessing")
        x = preprocess_image_from_bytes(image_bytes)
        logging.info(f"Image preprocessed, shape: {x.shape}")

        logging.info("Running model prediction")
        preds = model.predict(x)[0]
        logging.info(f"Raw predictions: {preds}")

        idx = int(np.argmax(preds))
        logging.info(f"Predicted class index: {idx}")

        label_code = CLASS_NAMES[idx]
        full_form = CLASS_FULL_FORMS[label_code]
        confidence = float(preds[idx])
        logging.info(f"Predicted label: {label_code}, Confidence: {confidence}")

        result = {
            "predicted_label": label_code,
            "predicted_disease": full_form,
            "confidence": confidence,
            "confidence_percent": round(confidence * 100, 2),
            "explanation": f"The model predicts {full_form} with {confidence*100:.2f}% confidence."
        }
        logging.info(f"Final result: {result}")
        return result
    except Exception as e:
        logging.error("Error in predict_skin_disease_from_bytes")
        logging.error(traceback.format_exc())
        raise e
