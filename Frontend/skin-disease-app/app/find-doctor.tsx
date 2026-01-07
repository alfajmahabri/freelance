import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Phone } from "lucide-react-native";

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

const isWeb = Platform.OS === "web";

export default function FindDoctorScreen() {
  const { city } = useLocalSearchParams<{ city: string }>();

  const doctorsInCity = DOCTORS.filter((doc) => doc.city === city);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Top Dermatologists in {city}</Text>

      {doctorsInCity.length > 0 ? (
        doctorsInCity.map((doc) => (
          <View key={doc.id} style={styles.doctorCard}>
            <Image source={{ uri: doc.image }} style={styles.doctorImage} />
            <View style={{ flex: 1 }}>
              <Text style={styles.doctorName}>{doc.name}</Text>
              <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
              <Text style={styles.doctorClinic}>{doc.clinic}</Text>
            </View>
            <View style={styles.doctorRight}>
              <TouchableOpacity style={styles.callButton} onPress={() => {}}>
                <Phone size={16} color="#0f766e" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDoctorsText}>
          No doctors found in your city.
        </Text>
      )}
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 16,
  },
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
  noDoctorsText: {
    textAlign: "center",
    marginTop: 32,
    fontSize: 16,
    color: "#64748b",
  },
});
