import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LogIn, UserPlus } from "lucide-react-native";

const isWeb = Platform.OS === "web";

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Skin-AI</Text>
        <Text style={styles.subtitle}>
          Your personal AI-powered skin health assistant.
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/auth/login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <LogIn size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/auth/register" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <UserPlus size={18} color="#0f766e" />
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    maxWidth: 400,
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0f766e",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#0f766e",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  secondaryButtonText: {
    color: "#0f766e",
    fontSize: 16,
    fontWeight: "700",
  },
});
