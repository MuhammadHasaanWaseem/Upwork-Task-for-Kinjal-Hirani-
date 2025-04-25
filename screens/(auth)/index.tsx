import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import Layout from './_layout';

export default function SignInEmail() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    Keyboard.dismiss();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      console.error('Error sending magic link:', error.message);
      return;
    }

    // Navigate to email verification screen
    router.push({
      pathname: '/(auth)/verify',
      params: { email },
    });
  };

  return (
    <Layout onPress={handleSignIn} buttonText={loading ? <ActivityIndicator color={'black'} /> : 'Continue'}>
      <View style={styles.container}>
        <Text style={styles.title}>Login with Email</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#6B7280"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
  },
});
