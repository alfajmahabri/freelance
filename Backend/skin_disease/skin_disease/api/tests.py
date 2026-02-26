from django.test import TestCase, Client
from django.urls import reverse
from pathlib import Path
import json

class SkinDiseasePredictionTest(TestCase):

    def setUp(self):
        self.client = Client()
        self.prediction_url = reverse("predict-skin-disease")
        self.test_image_path = Path(__file__).parent / "test_image.png"

    def test_prediction_endpoint_success(self):
        """
        Tests a successful prediction request to the skin disease endpoint.
        """
        self.assertTrue(self.test_image_path.exists(), "Test image is missing!")

        with open(self.test_image_path, "rb") as fp:
            response = self.client.post(self.prediction_url, {"image": fp})

        # Check for a successful response
        self.assertEqual(response.status_code, 200)

        # Parse the JSON response
        try:
            response_data = response.json()
        except json.JSONDecodeError:
            self.fail("Response was not valid JSON.")

        # Check for expected keys in the response
        self.assertIn("predicted_label", response_data)
        self.assertIn("predicted_disease", response_data)
        self.assertIn("confidence", response_data)
        self.assertIn("confidence_percent", response_data)
        self.assertIn("explanation", response_data)
        self.assertIn("all_predictions", response_data)

        # Check that the prediction values are reasonable
        self.assertIsInstance(response_data["predicted_label"], str)
        self.assertTrue(len(response_data["predicted_label"]) > 0)
        self.assertIsInstance(response_data["predicted_disease"], str)
        self.assertIsInstance(response_data["confidence"], float)
        self.assertTrue(0 <= response_data["confidence"] <= 1)
        self.assertIsInstance(response_data["all_predictions"], dict)
        self.assertEqual(len(response_data["all_predictions"]), 10)

        print("\n✅ API endpoint test passed successfully.")
        print(f"Predicted Disease: {response_data['predicted_disease']} with {response_data['confidence_percent']}% confidence.")

    def test_prediction_endpoint_no_image(self):
        """
        Tests the endpoint's error handling when no image is provided.
        """
        response = self.client.post(self.prediction_url, {})
        self.assertEqual(response.status_code, 400)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Image not provided")

    def test_prediction_endpoint_wrong_method(self):
        """
        Tests the endpoint's behavior for non-POST requests.
        """
        response = self.client.get(self.prediction_url)
        self.assertEqual(response.status_code, 405)
        response_data = response.json()
        self.assertIn("error", response_data)
        self.assertEqual(response_data["error"], "Only POST allowed")