CLASS_NAMES = ['ACE', 'AKBCC', 'ATD', 'BD', 'CIB', 'ECZ', 'EXD', 'ALOH', 'HPV', 'PD', 'LUT', 'MNV', 'NF', 'PID', 'PLP', 'SLB', 'SKB', 'SD', 'TRF', 'UH', 'VT', 'VC', 'WMV']

# User-friendly full names for the 23 classes
CLASS_FULL_FORMS = {
    'ACE': 'Acne and Rosacea',
    'AKBCC': 'Actinic Keratosis, Basal Cell Carcinoma & other malignant lesions',
    'ATD': 'Atopic Dermatitis',
    'BD': 'Bullous Disease',
    'CIB': 'Cellulitis, Impetigo & other Bacterial infections',
    'ECZ': 'Eczema',
    'EXD': 'Exanthems & Drug eruptions',
    'ALOH': 'Hair loss, Alopecia & other hair diseases',
    'HPV': 'Herpes, HPV & other STDs',
    'PD': 'Light diseases & Disorders of Pigmentation',
    'LUT': 'Lupus & other Connective Tissue Diseases',
    'MNV': 'Melanoma, Skin cancer, Nevi & Moles',
    'NF': 'Nail fungus & other Nail diseases',
    'PID': 'Poison Ivy & other Contact Dermatitis',
    'PLP': 'Psoriasis, Lichen Planus & related diseases',
    'SLB': 'Scabies, Lyme disease & other Infestations and Bites',
    'SKB': 'Seborrheic Keratoses & other Benign Tumors',
    'SD': 'Systemic Disease affecting Skin',
    'TRF': 'Tinea, Ringworm, Candidiasis & other Fungal infections',
    'UH': 'Urticaria / Hives',
    'VT': 'Vascular Tumors',
    'VC': 'Vasculitis',
    'WMV': 'Warts, Molluscum & other Viral infections',
}


import numpy as np
from io import BytesIO
from PIL import Image

try:
    from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
    from tensorflow.keras.preprocessing.image import load_img, img_to_array
except Exception:
    from keras.applications.mobilenet_v2 import preprocess_input
    from keras.preprocessing.image import load_img, img_to_array

IMAGE_SIZE = (224, 224)

def preprocess_image_from_bytes(image_bytes):
    
    img = Image.open(BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMAGE_SIZE)
    x = img_to_array(img)
    x = np.expand_dims(x, axis=0)
    x = preprocess_input(x)
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
