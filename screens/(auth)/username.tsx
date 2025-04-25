import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { View, StyleSheet, Text, Keyboard, TextInput, ActivityIndicator } from "react-native";
import Layout from "./_layout";
import { useAuth } from "@/provider/AuthProviders";
import { useRouter } from "expo-router";

export default function VerifyScreen() {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, createUser } = useAuth();
  const router = useRouter();

  const handleUsername = async () => {
    Keyboard.dismiss();

    // Validation checks
    if (!username.trim()) {
      setErrorMessage("Username cannot be empty");
      return;
    }
    if (username.includes(" ")) {
      setErrorMessage("Username cannot contain spaces");
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setErrorMessage("Username must be 4-20 characters long");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setErrorMessage("Username can only contain letters and numbers");
      return;
    }

    setIsLoading(true);
    const success = await createUser(username);
    setIsLoading(false);

    if (success) {
router.push('/(tabs)')
    } else {
      setErrorMessage("Username is already taken");
    }
  };

  return (
    <Layout
      onPress={handleUsername}
      buttonText={
        isLoading ? <ActivityIndicator color="white" /> : "Create Account"
      }
      buttonDisabled={isLoading}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Create Your Username</Text>
          <Text style={styles.subtitle}>This will be your unique identity</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter username here..."
              placeholderTextColor="#6B7280"
              style={styles.input}
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                setErrorMessage("");
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : (
              <Text style={styles.note}>
                4-20 characters, letters and numbers only, no spaces
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#010118",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginTop: 8,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#1F2937",
    borderColor: "#374151",
    borderWidth: 1,
    borderRadius: 12,
    color: "white",
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 4,
    textAlign: "center",
  },
  note: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 4,
    textAlign: "left",
  },
});
