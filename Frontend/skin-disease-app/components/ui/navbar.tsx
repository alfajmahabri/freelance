import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Home, ShieldCheck, Zap, UserPlus, LogIn } from "lucide-react-native";

export default function Navbar() {
  return (
    <View style={styles.navContainer}>
      <Link href="/landing" asChild>
        <TouchableOpacity style={styles.navLink}>
          <Home size={18} color="#0f766e" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/landing#features" asChild>
        <TouchableOpacity style={styles.navLink}>
          <ShieldCheck size={18} color="#0f766e" />
          <Text style={styles.navText}>Features</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/(tabs)/home" asChild>
        <TouchableOpacity style={styles.navLink}>
          <Zap size={18} color="#0f766e" />
          <Text style={styles.navText}>Use AI</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/auth/register" asChild>
        <TouchableOpacity style={styles.navLink}>
          <UserPlus size={18} color="#0f766e" />
          <Text style={styles.navText}>Sign Up</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/auth/login" asChild>
        <TouchableOpacity style={styles.navLink}>
          <LogIn size={18} color="#0f766e" />
          <Text style={styles.navText}>Log In</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingVertical: 10,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navLink: {
    alignItems: "center",
  },
  navText: {
    color: "#0f766e",
    fontSize: 12,
    fontWeight: "600",
  },
});
