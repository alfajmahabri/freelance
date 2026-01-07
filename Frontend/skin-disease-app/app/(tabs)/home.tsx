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
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { DJANGO_API } from "../constants/api";
import { useRouter } from "expo-router";
import {
  Camera,
  Image as ImageIcon,
  RotateCcw,
  ScanLine,
  Activity as ActivityIcon,
  MapPin,
  Star,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Wind,
  Droplets,
  Phone,
} from "lucide-react-native";

const getSeverity = (label: string): "Low" | "Moderate" | "High" => {
  if (["MEL", "BCC"].includes(label)) return "High";
  if (["WMV", "PLP", "TRF"].includes(label)) return "Moderate";
  return "Low";
};

type Severity = "Low" | "Moderate" | "High";

interface DiagnosisResult {
  diagnosis: string;
  confidence: string;
  severity: Severity;
  advice: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  clinic: string;
  image: string;
  city: string;
}

const DOCTORS: Doctor[] = [
  {
    id: 21,
    name: "Dr. Vishwavardhan Chougle",
    specialty: "Dermatologist",
    phone: "+91 8080568410",
    clinic: "Kolhapur",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=VishwavardhanChougle",
    city: "Kolhapur",
  },
  {
    id: 1,
    name: "Dr. Rajiv Joshi",
    specialty: "Consultant Dermatology",
    phone: "+91 22 1234 5678",
    clinic: "P.D. Hinduja Hospital, Mahim, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=RajivJoshi",
    city: "Mumbai",
  },
  {
    id: 2,
    name: "Dr. Nina Madnani",
    specialty: "Aesthetic Dermatologist",
    phone: "+91 22 2345 6789",
    clinic: "P.D. Hinduja Hospital, Mahim, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=NinaMadnani",
    city: "Mumbai",
  },
  {
    id: 3,
    name: "Dr. Sushil Tahiliani",
    specialty: "Consultant Dermatologist",
    phone: "+91 22 3456 7890",
    clinic: "P.D. Hinduja Hospital, Mahim, Mumbai",
    image: "https://api.dicebear.com/7x/avataaars/png?seed=SushilTahiliani",
    city: "Mumbai",
  },
  {
    id: 4,
    name: "Dr. Yuti Nakhwa",
    specialty: "Dermatologist",
    phone: "+91 22 4567 8901",
    clinic: "Dadar, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=YutiNakhwa",
    city: "Mumbai",
  },
  {
    id: 5,
    name: "Dr. Priti Shenai",
    specialty: "Dermatologist & Cosmetologist",
    phone: "+91 22 5678 9012",
    clinic: "Juhu/Vile Parle, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=PritiShenai",
    city: "Mumbai",
  },
  {
    id: 6,
    name: "Dr. Subhangi Mahajan",
    specialty: "Dermatologist",
    phone: "+91 22 6789 0123",
    clinic: "Manubhai Shah Medical & Research Centre, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=SubhangiMahajan",
    city: "Mumbai",
  },
  {
    id: 7,
    name: "Dr. N.S.V Chari",
    specialty: "Dermatologist",
    phone: "+91 22 7890 1234",
    clinic: "Manubhai Shah Medical & Research Centre, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=NSVChari",
    city: "Mumbai",
  },
  {
    id: 8,
    name: "Dr. Hershada S Mithari",
    specialty: "Hair Restoration Surgeon",
    phone: "+91 22 8901 2345",
    clinic: "Manubhai Shah Medical & Research Centre, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=HershadaMithari",
    city: "Mumbai",
  },
  {
    id: 9,
    name: "Dr. Jamuna Pai",
    specialty: "Celebrity Dermatologist",
    phone: "+91 22 9012 3456",
    clinic: "Dr. Jamuna Pai's Skin Clinic, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=JamunaPai",
    city: "Mumbai",
  },
  {
    id: 10,
    name: "Dr. Rathi",
    specialty: "Dermatologist",
    phone: "+91 22 0123 4567",
    clinic: "Dr. Rathi's Clinic, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=Rathi",
    city: "Mumbai",
  },
  {
    id: 11,
    name: "Dr. Bina Nair",
    specialty: "Dermatologist",
    phone: "+91 20 1234 5678",
    clinic: "Pune",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=BinaNair",
    city: "Pune",
  },
  {
    id: 12,
    name: "Dr. Jaishree Sharad",
    specialty: "Dermatologist",
    phone: "+91 20 2345 6789",
    clinic: "Pune",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=JaishreeSharad",
    city: "Pune",
  },
  {
    id: 13,
    name: "Dr. Rachita Dhurat",
    specialty: "Dermatologist",
    phone: "+91 20 3456 7890",
    clinic: "Pune",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=RachitaDhurat",
    city: "Pune",
  },
  {
    id: 14,
    name: "Dr. Jawaharlal Mansukhani",
    specialty: "Dermatologist",
    phone: "+91 22 1122 3344",
    clinic: "Kokilaben Hospital, Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=JawaharlalMansukhani",
    city: "Mumbai",
  },
  {
    id: 15,
    name: "Dr. Amit Gulati",
    specialty: "Dermatologist",
    phone: "+91 22 2233 4455",
    clinic: "Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=AmitGulati",
    city: "Mumbai",
  },
  {
    id: 16,
    name: "Dr. Pallavi Rathi",
    specialty: "Dermatologist",
    phone: "+91 22 3344 5566",
    clinic: "Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=PallaviRathi",
    city: "Mumbai",
  },
  {
    id: 17,
    name: "Dr. Raina Nahar",
    specialty: "Dermatologist",
    phone: "+91 22 4455 6677",
    clinic: "Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=RainaNahar",
    city: "Mumbai",
  },
  {
    id: 18,
    name: "Dr. Suraj Shetty",
    specialty: "Dermatologist",
    phone: "+91 22 5566 7788",
    clinic: "Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=SurajShetty",
    city: "Mumbai",
  },
  {
    id: 19,
    name: "Dr. Sonia Tekchandani",
    specialty: "Dermatologist",
    phone: "+91 22 6677 8899",
    clinic: "Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=SoniaTekchandani",
    city: "Mumbai",
  },
  {
    id: 20,
    name: "Dr. Pooja Chopra",
    specialty: "Dermatologist",
    phone: "+91 22 7788 9900",
    clinic: "Mumbai",
    image: "https://api.dicebear.com/7.x/avataaars/png?seed=PoojaChopra",
    city: "Mumbai",
  },
];

const TIPS = [
  {
    id: 1,
    tag: "Sun Care",
    title: "Wear SPF 50 today",
    text: "UV index is high. Reapply every 2 hours.",
    icon: <Sun size={16} color="#c05621" />,
    bgColor: "#ffedd5",
  },
  {
    id: 2,
    tag: "Hydration",
    title: "Hydrate your skin",
    text: "Drink at least 8 glasses of water to keep your skin hydrated.",
    icon: <Droplets size={16} color="#065f46" />,
    bgColor: "#dcfce7",
  },
  {
    id: 3,
    tag: "Cleansing",
    title: "Cleanse gently",
    text: "Use a gentle cleanser to avoid stripping your skin of its natural oils.",
    icon: <Wind size={16} color="#0c4a6e" />,
    bgColor: "#e0f2fe",
  },
  {
    id: 4,
    tag: "Protection",
    title: "Wear protective clothing",
    text: "Protect your skin from sun and environmental damage with appropriate clothing.",
    icon: <Shield size={16} color="#d97706" />,
    bgColor: "#fff7ed",
  },
  {
    id: 5,
    tag: "Diet",
    title: "Eat a balanced diet",
    text: "Nutrient-rich foods contribute to healthy skin. Focus on fruits and vegetables.",
    icon: <ActivityIcon size={16} color="#15803d" />,
    bgColor: "#f0fdf4",
  },
  {
    id: 6,
    tag: "Sleep",
    title: "Get enough sleep",
    text: "Adequate sleep allows your skin to repair and regenerate.",
    icon: <Star size={16} color="#4f46e5" />,
    bgColor: "#eef2ff",
  },
];

const isWeb = Platform.OS === "web";

export default function HomeTab() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);

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
        const response = await fetch(uri);
        const blob = await response.blob();
        const file = new File([blob], "skin.jpg", { type: blob.type });
        formData.append("image", file);
      } else {
        formData.append("image", {
          uri,
          name: "skin.jpg",
          type: "image/jpeg",
        } as any);
      }

      const res = await fetch(DJANGO_API.PREDICT_URL, {
        method: "POST",
        body: formData,
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

  const handleFindDoctor = () => {
    // For now, let's assume the user is in Mumbai
    router.push({
      pathname: "/find-doctor",
      params: { city: "Mumbai" },
    });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Hi, John</Text>
          <Text style={styles.headerSubtitle}>
            Let's check your skin health.
          </Text>
        </View>
      </View>

      {!imageUri ? (
        <View style={styles.scanCard}>
          <View style={styles.scanCardInner}>
            <View style={styles.scanIconWrapper}>
              <ScanLine size={48} color="#0f766e" />
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
                <Camera size={18} color="#ffffff" />
                <Text style={styles.scanPrimaryText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.scanSecondaryButton}
                onPress={pickFromGallery}
              >
                <ImageIcon size={18} color="#0f766e" />
                <Text style={styles.scanSecondaryText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.scanResultWrapper}>
          <View style={styles.scanImageWrapper}>
            <Image source={{ uri: imageUri }} style={styles.scanImage} />
            {analyzing && (
              <View style={styles.scanImageOverlay}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.processingText}>Analyzing...</Text>
              </View>
            )}
          </View>

          {!analyzing && result && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Analysis Result</Text>
                <View
                  style={[
                    styles.severityBadge,
                    result.severity === "High" && styles.severityHigh,
                    result.severity === "Moderate" && styles.severityModerate,
                    result.severity === "Low" && styles.severityLow,
                  ]}
                >
                  {result.severity === "High" && (
                    <ShieldAlert size={14} color="#b91c1c" />
                  )}
                  {result.severity === "Moderate" && (
                    <ShieldAlert size={14} color="#d97706" />
                  )}
                  {result.severity === "Low" && (
                    <ShieldCheck size={14} color="#15803d" />
                  )}
                  <Text
                    style={[
                      styles.severityText,
                      result.severity === "High" && { color: "#b91c1c" },
                      result.severity === "Moderate" && { color: "#d97706" },
                      result.severity === "Low" && { color: "#15803d" },
                    ]}
                  >
                    {result.severity} Risk
                  </Text>
                </View>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Diagnosis</Text>
                <Text style={styles.resultValue}>{result.diagnosis}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Confidence</Text>
                <Text style={styles.resultValue}>{result.confidence}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Advice</Text>
                <Text style={styles.resultValue}>{result.advice}</Text>
              </View>

              <View style={styles.resultActionsRow}>
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={resetScan}
                >
                  <RotateCcw size={16} color="#4b5563" />
                  <Text style={styles.retakeText}>Scan Again</Text>
                </TouchableOpacity>
                {result.severity !== "Low" && (
                  <TouchableOpacity
                    style={styles.findDoctorButton}
                    onPress={handleFindDoctor}
                  >
                    <Text style={styles.findDoctorText}>Find a Doctor</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      )}

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
          {TIPS.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipHeaderRow}>
                <View
                  style={[
                    styles.tipIconWrapper,
                    { backgroundColor: tip.bgColor },
                  ]}
                >
                  {tip.icon}
                </View>
                <Text style={styles.tipTag}>{tip.tag}</Text>
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Dermatologists</Text>
        {DOCTORS.map((doc) => (
          <View key={doc.id} style={styles.doctorCard}>
            <Image source={{ uri: doc.image }} style={styles.doctorImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>{doc.name}</Text>
              <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
              <Text style={styles.doctorClinic}>{doc.clinic}</Text>
            </View>
            <View style={styles.doctorRight}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => Linking.openURL(`tel:${doc.phone}`)}
              >
                <Phone size={16} color="#0f766e" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingHorizontal: isWeb ? 64 : 20,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#64748b",
  },
  scanCard: {
    borderRadius: 24,
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  scanCardInner: { alignItems: "center" },
  scanIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  scanTitle: { fontSize: 20, fontWeight: "700", color: "#0f172a" },
  scanSubtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  scanButtonsRow: { flexDirection: "row", gap: 12, width: "100%" },
  scanPrimaryButton: {
    flex: 1,
    backgroundColor: "#0f766e",
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  scanSecondaryButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  scanPrimaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  scanSecondaryText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f766e",
  },
  scanResultWrapper: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  scanImageWrapper: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  scanImage: { width: "100%", height: 200, resizeMode: "cover" },
  scanImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  processingText: {
    marginTop: 8,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  resultCard: {
    width: "100%",
    padding: 16,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  severityBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
  },
  severityHigh: { backgroundColor: "#fee2e2" },
  severityModerate: { backgroundColor: "#ffedd5" },
  severityLow: { backgroundColor: "#dcfce7" },
  severityText: { fontSize: 12, fontWeight: "700" },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  resultLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  resultValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
    maxWidth: "70%",
  },
  resultActionsRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  retakeButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  retakeText: { fontSize: 14, fontWeight: "600", color: "#4b5563" },
  findDoctorButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#0f766e",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  findDoctorText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
  section: { marginTop: 24 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  sectionLink: { fontSize: 13, fontWeight: "600", color: "#0f766e" },
  tipCard: {
    width: 240,
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
  },
  tipTag: { fontSize: 11, fontWeight: "700", color: "#9a3412" },
  tipTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  tipText: { fontSize: 12, color: "#6b7280" },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 8,
  },
  doctorImage: {
    width: 52,
    height: 52,
    borderRadius: 999,
    marginRight: 12,
    backgroundColor: "#e5e7eb",
  },
  doctorName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  doctorSpecialty: { fontSize: 12, color: "#6b7280" },
  doctorClinic: { fontSize: 12, color: "#6b7280", fontStyle: "italic" },
  doctorRight: { alignItems: "flex-end", gap: 4 },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  doctorPhone: { fontSize: 12, color: "#0f766e", fontWeight: "600" },
});