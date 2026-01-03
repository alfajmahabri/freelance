from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Local ML helpers
from . import ml_state, ml_utils

import logging

@csrf_exempt
def predict_skin_disease(request):

    # ✅ Allow preflight
    if request.method == "OPTIONS":
        response = JsonResponse({"status": "ok"})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "*"
        return response

    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    logging.info(f"FILES: {request.FILES}")
    logging.info(f"POST: {request.POST}")

    image = request.FILES.get("image")
    if not image:
        return JsonResponse({
            "error": "Image not provided",
            "received_files": list(request.FILES.keys())
        }, status=400)

    # Load model (lazily) and run prediction
    try:
        model = ml_state.get_model()
    except Exception as exc:
        logging.error(f"Failed to load model: {exc}")
        return JsonResponse({"error": "Failed to load model", "details": str(exc)}, status=500)

    try:
        image_bytes = image.read()
        result = ml_utils.predict_skin_disease_from_bytes(model, image_bytes)
        logging.info(f"Prediction result: {result}")

        # Log prediction to a file
        with open("prediction_log.txt", "a") as f:
            f.write(f"{result}\n")
            
    except Exception as exc:
        logging.error(f"Prediction failed: {exc}")
        return JsonResponse({"error": "Prediction failed", "details": str(exc)}, status=500)

    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    return response
