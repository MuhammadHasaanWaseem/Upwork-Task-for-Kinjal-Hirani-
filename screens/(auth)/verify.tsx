import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import Layout from './_layout';
import { OtpInput } from 'react-native-otp-entry';

export default function VerifyEmail() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const handleVerify = async () => {
    setLoading(true);
    setErrorMessage('');
    const { data, error } = await supabase.auth.verifyOtp({
      email: email as string,
      token,
      type: 'email',
    });
    setLoading(false);

    if (error) {
      setErrorMessage('OTP is incorrect. Please try again.');
    } else {
      setErrorMessage('Verified Successfully!');
      router.push('/(auth)/username');
    }
  };

  return (
    <Layout onPress={handleVerify} buttonText={loading ? <ActivityIndicator color={'black'} /> : 'Continue'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.innerContainer}>
          <View style={styles.content}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>Sent to your email{email ? `: ${email}` : ''}</Text>

            <OtpInput
              numberOfDigits={6}
              autoFocus
              onTextChange={setToken}
              theme={{
                containerStyle: styles.otpContainer,
                inputsContainerStyle: styles.otpInputsContainer,
                pinCodeContainerStyle: styles.pinCodeContainer,
                pinCodeTextStyle: styles.pinCodeText,
                focusStickStyle: styles.focusStick,
                focusedPinCodeContainerStyle: styles.focusedPinCodeContainer
              }}
            />

            <View style={[styles.statusContainer, { flexDirection: 'row' }]}>  
              {loading && <ActivityIndicator size="small" color="#3B82F6" />}
              <Text style={styles.progressText}>{loading ? 'Verifying...' : ''}</Text>
            </View>

            {errorMessage !== '' && (
              <Text style={errorMessage.includes('Verified') ? styles.successText : styles.errorText}>
                {errorMessage}
              </Text>
            )}
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010118',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    marginBottom: 12,
  },
  otpInputsContainer: {
    gap: 6,
  },
  pinCodeContainer: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    height: 40,
    width: 40,
  },
  pinCodeText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  focusStick: {
    backgroundColor: '#3B82F6',
    width: 2,
  },
  focusedPinCodeContainer: {
    borderColor: '#3B82F6',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  successText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
});
