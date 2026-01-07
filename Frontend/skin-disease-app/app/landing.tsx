import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  LogIn,
  UserPlus,
  ChevronRight,
  ShieldCheck,
  Heart,
  Scan,
  Sparkles,
} from "lucide-react-native";

const isWeb = Platform.OS === "web";

const FEATURES = [
  {
    icon: <Scan size={32} color="#0f766e" />,
    title: "AI-Powered Scans",
    description:
      "Get instant insights on skin issues by scanning with your phone's camera.",
  },
  {
    icon: <Heart size={32} color="#0f766e" />,
    title: "Find Specialists",
    description: "Easily locate and connect with dermatologists in your area.",
  },
  {
    icon: <Sparkles size={32} color="#0f766e" />,
    title: "Personalized Tips",
    description:
      "Receive daily tips to maintain and improve your skin health.",
  },
];

const FAQS = [
  {
    question: "How accurate is the AI?",
    answer:
      "Our AI is trained on a vast dataset of skin conditions and provides a high level of accuracy. However, it should not be considered a substitute for a professional medical diagnosis.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes, we take data privacy and security very seriously. All your data is encrypted and stored securely.",
  },
  {
    question: "Can I use this to replace a doctor?",
    answer:
      "No, this app is an informational tool and does not provide medical advice. It's designed to assist you in understanding your skin health but does not replace a consultation with a qualified dermatologist.",
  },
];

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ShieldCheck size={64} color="#0f766e" />
          <Text style={styles.title}>Welcome to Skin-AI</Text>
          <Text style={styles.subtitle}>
            Your personal AI-powered skin health assistant.
          </Text>
          <Link href="/auth/register" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <ChevronRight size={18} color="#ffffff" />
            </TouchableOpacity>
          </Link>
          <Link href="/auth/login" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                I already have an account
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>{feature.icon}</View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {FAQS.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Skin-AI. All rights reserved.
          </Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacy Policy</Text>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  // Hero
  heroSection: {
    alignItems: "center",
    paddingVertical: 40,
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
    marginTop: 16,
  },
  secondaryButtonText: {
    color: "#0f766e",
    fontSize: 14,
    fontWeight: "600",
  },

  // Sections
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },

  // Features
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  featureIcon: {
    marginBottom: 16,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ecfdf5",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },

  // FAQ
  faqItem: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#64748b",
  },

  // Footer
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  footerText: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: "row",
    gap: 16,
  },
  footerLink: {
    fontSize: 12,
    color: "#0f766e",
    fontWeight: "600",
  },
});