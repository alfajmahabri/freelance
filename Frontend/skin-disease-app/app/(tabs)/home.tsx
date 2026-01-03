// app/(tabs)/home.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { DJANGO_API } from "../constants/api";
import {
  Camera,
  Image as ImageIcon,
  RotateCcw,
  ScanLine,
  Activity as ActivityIcon,
    MapPin,
    Star,
} from "lucide-react-native";


const CLASS_FULL_FORM: Record<string, string> = {
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
};


const getSeverity = (label: string): "Low" | "Moderate" | "High" => {
  if (["AKBCC", "MNV", "VC"].includes(label)) return "High";
  if (["BD", "CIB", "ALOH", "HPV", "PD", "LUT", "NF", "PLP", "SLB", "SD", "TRF", "UH", "VT", "WMV"].includes(label)) return "Moderate";
  return "Low";
};

// ---------- Types ----------
type Severity = "Low" | "Moderate" | "High";

interface DiagnosisResult {
  diagnosis: string;
  confidence: string;
  severity: Severity;
  advice: string;
  isSafe: boolean;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  distance: string;
  image: string;
}

// ---------- Mock Data ----------
const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Sarah Lin",
    specialty: "Dermatologist",
    rating: 4.9,
    distance: "1.2 km",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=Sarah",
  },
  {
    id: 2,
    name: "Dr. James Wilson",
    specialty: "Skin Surgeon",
    rating: 4.8,
    distance: "2.5 km",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=James",
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Cosmetic Derm",
    rating: 4.7,
    distance: "3.0 km",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=Emily",
  },
];

const isWeb = Platform.OS === "web";

export default function HomeTab() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  

  // ---------- Image pick ----------
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Gallery permission required");
      return;
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setImageUri(uri);
      await runPrediction(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission required");
      return;
    }

    const res = await ImagePicker.launchCameraAsync({ quality: 1 });

    if (!res.canceled) {
      const uri = res.assets[0].uri;
      setImageUri(uri);
      runPrediction(uri);
    }
  };


    const runPrediction = async (uri: string) => {
      setAnalyzing(true);
      setResult(null);

      try {
        const formData = new FormData();

        if (Platform.OS === "web") {
          // 🔴 REQUIRED FOR WEB
          const response = await fetch(uri);
          const blob = await response.blob();
          const file = new File([blob], "skin.jpg", { type: blob.type });

          formData.append("image", file);
        } else {
          // ✅ ANDROID / IOS
          formData.append("image", {
            uri,
            name: "skin.jpg",
            type: "image/jpeg",
          } as any);
        }

        const res = await fetch(DJANGO_API.PREDICT_URL, {
          method: "POST",
          body:formData,
        });

        const data = await res.json();
        console.log("Prediction:", data);

        if (res.ok && data.predicted_label) {
          const severity = getSeverity(data.predicted_label);
          setResult({
            diagnosis: data.predicted_disease,
            confidence: `${data.confidence_percent.toFixed(2)}%`,
            severity: severity,
            advice: data.explanation,
            isSafe: severity === "Low",
          });
        } else {
          alert(data.error || "Prediction failed");
        }
      } catch (err) {
        console.error(err);
        alert("Prediction failed");
      } finally {
        setAnalyzing(false);
      }
    };




  const resetScan = () => {
    setImageUri(null);
    setResult(null);
    setAnalyzing(false);
  };
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Scan card */}
      <View style={styles.scanCard}>
        {!imageUri ? (
          <View style={styles.scanCardInner}>
            <View style={styles.scanIconWrapper}>
              <ScanLine size={32} color="#ffffff" />
            </View>
            <Text style={styles.scanTitle}>New Skin Scan</Text>
            <Text style={styles.scanSubtitle}>
              AI-powered analysis for rashes, moles, and acne.
            </Text>

            <View style={styles.scanButtonsRow}>
              <TouchableOpacity
                style={styles.scanPrimaryButton}
                onPress={takePhoto}
              >
                <Camera size={16} color="#0f766e" />
                <Text style={styles.scanPrimaryText}>Scan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scanSecondaryButton}
                onPress={pickFromGallery}
              >
                <ImageIcon size={16} color="#ffffff" />
                <Text style={styles.scanSecondaryText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.scanResultWrapper}>
            <View style={styles.scanImageWrapper}>
              <Image source={{ uri: imageUri }} style={styles.scanImage} />
              {analyzing && (
                <View style={styles.scanImageOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={styles.processingText}>Processing...</Text>
                </View>
              )}
            </View>

            {!analyzing && result && (
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultDiagnosis}>{result.diagnosis}</Text>
                  <View style={styles.resultConfidenceBadge}>
                    <Text style={styles.resultConfidenceText}>
                      {result.confidence}
                    </Text>
                  </View>
                </View>
                <Text style={styles.resultAdvice}>{result.advice}</Text>
                <View style={styles.resultActionsRow}>
                  <TouchableOpacity
                    style={styles.retakeButton}
                    onPress={resetScan}
                  >
                    <RotateCcw size={14} color="#4b5563" />
                    <Text style={styles.retakeText}>Retake</Text>
                  </TouchableOpacity>
                  {result.severity !== "Low" && (
                    <TouchableOpacity style={styles.findDoctorButton}>
                      <Text style={styles.findDoctorText}>Find Doctor</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Daily tips */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Tips</Text>
          <Text style={styles.sectionLink}>View all</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.tipCard}>
              <View style={styles.tipHeaderRow}>
                <View style={styles.tipIconWrapper}>
                  <ActivityIcon size={16} color="#c05621" />
                </View>
                <Text style={styles.tipTag}>Sun Care</Text>
              </View>
              <Text style={styles.tipTitle}>Wear SPF 50 today</Text>
              <Text style={styles.tipText}>
                UV index is high today. Reapply every 2 hours if outside.
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Top doctors */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Dermatologists</Text>
        {DOCTORS.map((doc) => (
          <View key={doc.id} style={styles.doctorCard}>
            <Image source={{ uri: doc.image }} style={styles.doctorImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>{doc.name}</Text>
              <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
            </View>
            <View style={styles.doctorRight}>
              <View style={styles.doctorRatingRow}>
                <Star size={12} color="#fbbf24" />
                <Text style={styles.doctorRatingText}>{doc.rating}</Text>
              </View>
              <View style={styles.doctorDistanceRow}>
                <MapPin size={10} color="#9ca3af" />
                <Text style={styles.doctorDistanceText}>{doc.distance}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#e2e8f0",
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  appContainer: {
    flex: 1,
    width: "100%",
    maxWidth: isWeb ? "100%" : 400,
    alignSelf: "center",
    backgroundColor: "#f8fafc",
    borderRadius: isWeb ? 0 : 40,
    borderWidth: isWeb ? 0 : 8,
    borderColor: "#ffffff",
    overflow: "hidden",
  },
  statusBar: {
    height: 24,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusTime: { fontSize: 12, fontWeight: "600", color: "#111827" },
  statusDots: { flexDirection: "row", gap: 4 },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
  },

  // Header
  header: {
    paddingHorizontal: isWeb ? 64 : 24,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  appTitle: { fontSize: 20, fontWeight: "800", color: "#0f766e" },
  appSubtitle: { fontSize: 12, color: "#64748b" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  bellDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#ef4444",
    position: "absolute",
    top: 6,
    right: 6,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#ccfbf1",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  avatarImage: { width: "100%", height: "100%" },

  // (rest of styles are same as you already had: scrollContent, scanCard, sections,
  // history, profile, tabBar, etc.)

  scrollContent: {
    paddingHorizontal: isWeb ? 64 : 20,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  scanCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: "#0f766e",
    marginBottom: 16,
  },
  scanCardInner: { alignItems: "center" },
  scanIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  scanTitle: { fontSize: 20, fontWeight: "700", color: "#ffffff" },
  scanSubtitle: {
    fontSize: 13,
    color: "#d1fae5",
    textAlign: "center",
    marginBottom: 16,
  },
  scanButtonsRow: { flexDirection: "row", gap: 10, width: "100%" },
  scanPrimaryButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  scanSecondaryButton: {
    flex: 1,
    backgroundColor: "rgba(15,118,110,0.7)",
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  scanPrimaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f766e",
  },
  scanSecondaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  scanResultWrapper: { alignItems: "center" },
  scanImageWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 10,
  },
  scanImage: { width: "100%", height: 190, resizeMode: "cover" },
  scanImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  processingText: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  resultCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 12,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  resultDiagnosis: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  resultConfidenceBadge: {
    backgroundColor: "#ccfbf1",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resultConfidenceText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#0f766e",
  },
  resultAdvice: { fontSize: 12, color: "#6b7280", marginBottom: 8 },
  resultActionsRow: { flexDirection: "row", gap: 8 },
  retakeButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  retakeText: { fontSize: 12, fontWeight: "600", color: "#4b5563" },
  findDoctorButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#0f766e",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  findDoctorText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },

  section: { marginTop: 8 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  sectionLink: { fontSize: 11, fontWeight: "600", color: "#0f766e" },

  tipCard: {
    width: 220,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tipHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  tipIconWrapper: {
    padding: 4,
    borderRadius: 10,
    backgroundColor: "#ffedd5",
  },
  tipTag: { fontSize: 10, fontWeight: "700", color: "#9a3412" },
  tipTitle: { fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 2 },
  tipText: { fontSize: 11, color: "#6b7280" },

  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  doctorImage: {
    width: 48,
    height: 48,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: "#e5e7eb",
  },
  doctorName: { fontSize: 13, fontWeight: "700", color: "#111827" },
  doctorSpecialty: { fontSize: 11, color: "#6b7280" },
  doctorRight: { alignItems: "flex-end", gap: 4 },
  doctorRatingRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  doctorRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#374151",
  },
  doctorDistanceRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  doctorDistanceText: { fontSize: 11, color: "#9ca3af" },

});
