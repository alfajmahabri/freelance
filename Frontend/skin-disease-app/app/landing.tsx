import { Link } from "expo-router";
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  LogIn,
  UserPlus,
  ChevronRight,
  ShieldCheck,
  Heart,
  Scan,
  Sparkles,
  LineChart,
  Lock,
  Users,
} from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

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
  {
    icon: <LineChart size={32} color="#0f766e" />,
    title: "Progress Tracking",
    description:
      "Monitor your skin’s health over time with our tracking tools.",
  },
  {
    icon: <Lock size={32} color="#0f766e" />,
    title: "Secure & Private",
    description:
      "Your data is always encrypted and stored with the highest security standards.",
  },
  {
    icon: <Users size={32} color="#0f766e" />,
    title: "Community Support",
    description:
      "Connect with others and share experiences in our community forum.",
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
  {
    question: "What kind of skin conditions can the AI detect?",
    answer:
      "The AI can detect a wide range of common skin conditions, including acne, eczema, psoriasis, and various types of moles. We are continuously updating our model to cover more conditions.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes, you can try out the core features of the app for free. For advanced features and unlimited scans, we offer a premium subscription.",
  },
  {
    question: "How often should I scan my skin?",
    answer:
      "For general monitoring, we recommend scanning any new or changing spots. If you have a specific condition you are tracking, you can scan it weekly to monitor progress.",
  },
];

export default function LandingScreen() {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <ShieldCheck size={64} color="#0f766e" />
          <Animated.Text style={[styles.title, animatedStyle]}>
            Welcome to Skin-AI
          </Animated.Text>
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
    backgroundColor: "#f0fdfa",
    borderRadius: 20,
    marginBottom: 40,
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  featureCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    width: "48%", 
    aspectRatio: 1,
    justifyContent: "center",
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
    textAlign: "center",
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