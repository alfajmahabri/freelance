
# Correct class names and codes based on the training notebook order
CLASS_CODES = [
    'ECZ', 'MEL', 'ATD', 'BCC', 'NV', 'BKL', 'PLP', 'SKB', 'TRF', 'WMV'
]

CODE_TO_FULL_NAME = {
    'ECZ': "Eczema",
    'MEL': "Melanoma",
    'ATD': "Atopic Dermatitis",
    'BCC': "Basal Cell Carcinoma (BCC)",
    'NV': "Melanocytic Nevi (NV)",
    'BKL': "Benign Keratosis-like Lesions (BKL)",
    'PLP': "Psoriasis pictures Lichen Planus and related diseases",
    'SKB': "Seborrheic Keratoses and other Benign Tumors",
    'TRF': "Tinea Ringworm Candidiasis and other Fungal Infections",
    'WMV': "Warts Molluscum and other Viral Infections"
}

# The full list of names, in order, for reference
CLASS_DESCRIPTIONS = [CODE_TO_FULL_NAME[code] for code in CLASS_CODES]

# Detailed Medical Info for each class
DISEASE_INFO = {
    'ECZ': {
        "causes": "Genetic factors, immune system overreaction, environmental triggers (soap, stress, weather).",
        "medicines": {
            "child": "Emollients (moisturizers), mild hydrocortisone cream (consult pediatrician).",
            "adult": "Corticosteroid creams, antihistamines (Cetirizine), moisturizers."
        },
        "plan": "Keep skin hydrated. Avoid triggers. Use prescribed creams twice daily."
    },
    'MEL': {
        "causes": "UV radiation (sun exposure), tanning beds, genetic susceptibility, fair skin.",
        "medicines": {
            "child": "URGENT: Surgical excision, immunotherapy (under strict specialist care).",
            "adult": "Surgical removal, chemotherapy, radiation therapy, immunotherapy."
        },
        "plan": "Immediate consultation with an oncologist/dermatologist is required. Do not delay."
    },
    'ATD': {
        "causes": "Genetics, dry skin, immune system dysfunction, bacteria/allergens.",
        "medicines": {
            "child": "Fragrance-free moisturizers, topical calcineurin inhibitors.",
            "adult": "Topical steroids (Betamethasone), oral antihistamines, biologic drugs (Dupixent)."
        },
        "plan": "Daily moisturizing. Bleach baths (diluted) to reduce bacteria. Avoid scratching."
    },
    'BCC': {
        "causes": "Long-term sun exposure, fair skin, radiation therapy history.",
        "medicines": {
            "child": "Rare in children. Surgical removal is standard.",
            "adult": "Mohs surgery, excisional surgery, topical chemotherapy (Fluorouracil)."
        },
        "plan": "Surgical removal is the primary treatment. Regular skin checks."
    },
    'NV': {
        "causes": "Clumping of melanocytes. mostly genetic and harmless (Moles).",
        "medicines": {
            "child": "No treatment needed unless changing shape/color.",
            "adult": "No treatment needed. Removal for cosmetic reasons or if suspicious."
        },
        "plan": "Monitor for ABCDE changes (Asymmetry, Border, Color, Diameter, Evolving)."
    },
    'BKL': {
        "causes": "Aging, sun exposure (Seborrheic Keratosis, Solar Lentigo).",
        "medicines": {
            "child": "Observation. Cryotherapy if bothersome.",
            "adult": "Cryotherapy (freezing), laser therapy, curettage."
        },
        "plan": "Usually benign. Removal is optional for cosmetic reasons."
    },
    'PLP': {
        "causes": "Autoimmune reaction (Psoriasis), Hepatitis C link (Lichen Planus).",
        "medicines": {
            "child": "Topical steroids, coal tar, vitamin D analogues.",
            "adult": "Systemic treatments (Methotrexate), phototherapy, biologics."
        },
        "plan": "Manage stress. Avoid skin injury. Topical treatments as prescribed."
    },
    'SKB': {
        "causes": "Non-cancerous skin growth, aging, genetics.",
        "medicines": {
            "child": "Monitoring.",
            "adult": "Cryosurgery, electrocautery (burning off)."
        },
        "plan": "Benign. No medical treatment strictly necessary unless irritated."
    },
    'TRF': {
        "causes": "Fungal infection (Dermatophytes), warm/moist environments.",
        "medicines": {
            "child": "Topical antifungals (Clotrimazole, Miconazole).",
            "adult": "Topical antifungals (Terbinafine), oral antifungals (Fluconazole) for severe cases."
        },
        "plan": "Keep area dry. Wash clothes in hot water. Use antifungal powder."
    },
    'WMV': {
        "causes": "Human Papillomavirus (HPV), Poxvirus (Molluscum).",
        "medicines": {
            "child": "Salicylic acid paints, cryotherapy (can be painful), observation (often clear up).",
            "adult": "Cryotherapy, laser removal, prescription creams (Imiquimod)."
        },
        "plan": "Highly contagious. Do not share towels. Treatment can take weeks."
    }
}


import numpy as np
from io import BytesIO
from PIL import Image
import logging
import traceback
import tensorflow as tf

print("🔥 ml_utils loaded from:", __file__)

try:
    from tensorflow.keras.preprocessing.image import img_to_array
except Exception:
    from keras.preprocessing.image import img_to_array

IMAGE_SIZE = (100, 100)

def preprocess_image_from_bytes(image_bytes):
    """
    Preprocesses image bytes to the format the model expects.
    - Decodes from bytes
    - Resizes to (100, 100)
    - Converts to grayscale
    - Converts to a float32 array
    - Normalizes pixels using L2 norm
    - Adds a batch dimension
    """
    try:
        logging.info(f"Image bytes size: {len(image_bytes)}")

        img = Image.open(BytesIO(image_bytes)).convert("L")  # Convert to grayscale
        logging.info(f"Original image mode: {img.mode}")

        img = img.resize(IMAGE_SIZE)
        logging.info(f"Resized to: {IMAGE_SIZE}")

        x = img_to_array(img)
        logging.info(f"Array shape before normalization: {x.shape}, dtype: {x.dtype}")

        x = tf.keras.utils.normalize(x, axis=1)  # Normalize like in the notebook
        logging.info(f"After normalization - min: {x.min()}, max: {x.max()}")

        x = np.expand_dims(x, axis=0)
        logging.info(f"Final shape with batch dimension: {x.shape}")

        return x

    except Exception as e:
        logging.error(f"Error in preprocessing: {e}")
        logging.error(traceback.format_exc())
        raise


def predict_skin_disease_from_bytes(model, image_bytes):
    try:
        logging.info("=" * 50)
        logging.info("Starting prediction process")
        logging.info("=" * 50)

        # Log model info
        logging.info(f"Model input shape: {model.input_shape}")
        logging.info(f"Model output shape: {model.output_shape}")

        # Preprocess image
        logging.info("Starting image preprocessing")
        x = preprocess_image_from_bytes(image_bytes)
        logging.info(f"Preprocessed image shape: {x.shape}, dtype: {x.dtype}")

        # Validate input shape matches model
        expected_shape = model.input_shape
        if x.shape[1:] != expected_shape[1:]:
            raise ValueError(
                f"Input shape mismatch! Expected {expected_shape}, got {x.shape}"
            )

        # Run prediction
        logging.info("Running model.predict()")
        preds = model.predict(x, verbose=0)
        logging.info(f"Raw predictions: {preds}")

        # Get the first (and only) prediction
        preds = preds[0]
        logging.info(f"Prediction values: {preds}")

        # Get predicted class index
        idx = int(np.argmax(preds))
        logging.info(f"Predicted class index: {idx}")

        # Map to class code and full name for the response
        label_code = CLASS_CODES[idx]
        predicted_disease = CODE_TO_FULL_NAME[label_code]
        confidence = float(preds[idx])
        
        # Get extra medical info
        info = DISEASE_INFO.get(label_code, {
            "causes": "Unknown",
            "medicines": {"child": "Consult doctor", "adult": "Consult doctor"},
            "plan": "Consult doctor"
        })

        logging.info(f"Predicted Label: {label_code}")
        logging.info(f"Predicted Disease: {predicted_disease}")
        logging.info(f"Confidence: {confidence}")

        result = {
            "predicted_label": label_code, # Add this back for frontend compatibility
            "predicted_disease": predicted_disease,
            "confidence": confidence,
            "confidence_percent": round(confidence * 100, 2),
            "explanation": f"The model predicts {predicted_disease} with {confidence*100:.2f}% confidence.",
            "disease_info": info,
            "all_predictions": {
                CLASS_CODES[i]: float(preds[i])
                for i in range(len(CLASS_CODES))
            }
        }

        logging.info("=" * 50)
        logging.info(f"Final result: {result}")
        logging.info("=" * 50)

        return result

    except Exception as e:
        logging.error("=" * 50)
        logging.error("ERROR in predict_skin_disease_from_bytes")
        logging.error(f"Error type: {type(e).__name__}")
        logging.error(f"Error message: {str(e)}")
        logging.error(traceback.format_exc())
        logging.error("=" * 50)
        raise e