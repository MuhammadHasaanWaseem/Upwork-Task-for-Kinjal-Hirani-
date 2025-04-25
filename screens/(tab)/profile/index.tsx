import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth, User } from '@/provider/AuthProviders';
import { supabase } from '@/lib/supabase';
import { Divider } from '@rneui/themed/dist/Divider';

export default function ProfileScreen() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isEditing, setIsEditing] = useState(false); // New state to toggle modes
  const isEditingRef = useRef(isEditing); // Ref to track isEditing in subscription

  // Update ref whenever isEditing changes
  useEffect(() => {
    isEditingRef.current = isEditing;
  }, [isEditing]);

  // Initialize profile and set up real-time subscription
  useEffect(() => {
    if (!user) return;
    setProfile(user);
    setUsername(user.username);
    setName(user.name ?? '');
    setEmail(user.email ?? '');

    const channel = supabase
      .channel('public:User')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'User', filter: `id=eq.${user.id}` },
        (payload) => {
          // Only update state if not in edit mode
          if (!isEditingRef.current) {
            const updated = payload.new as User;
            setProfile(updated);
            setUsername(updated.username);
            setName(updated.name ?? '');
            setEmail(updated.email ?? '');
            setUser(updated);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Handle saving changes
  const handleSave = async () => {
    if (!profile) return;
    setLoading(true);
    setSaveError('');

    const updateData = { username: username.trim(), name, email };
    const { data, error } = await supabase
      .from<User>('User')
      .update(updateData)
      .eq('id', profile.id)
      .select()
      .single();

    setLoading(false);
    if (error) {
      setSaveError(error.message);
    } else if (data) {
      setProfile(data);
      setUser(data);
      setIsEditing(false); // Switch back to view mode after saving
    }
  };

  // Handle canceling edits
  const handleCancel = () => {
    if (profile) {
      setUsername(profile.username);
      setName(profile.name ?? '');
      setEmail(profile.email ?? '');
    }
    setIsEditing(false); // Switch back to view mode
    setSaveError(''); // Clear any error messages
  };

  // Show loading indicator if profile is not yet loaded
  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {isEditing ? (
          // Edit Mode
          <>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              placeholder="Enter your username"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              onChangeText={setUsername}
            />

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              placeholder="Enter your name"
              placeholderTextColor="#6B7280"
              onChangeText={setName}
            />

            <Text style={styles.label}>Enter Your Introduction</Text>
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Enter your introduction"
              placeholderTextColor="#6B7280"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
            />

            {saveError ? <Text style={styles.errorText}>{saveError}</Text> : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          // View Mode
          <>
            <Text style={styles.label}>Your id Username</Text>

            <View style={styles.textContainer}>
              <Text style={styles.text}>{profile.username}</Text>
            </View>
            <Divider />
            <Text style={styles.label}>Your Profile User Name</Text>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{profile.name || 'Not set'}</Text>
            </View>
            <Divider />

            <Text style={styles.label}>Your Introduction</Text>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{profile.email}</Text>
            </View>
            <Divider />

            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 24,
  },
  content: {
    flex: 1,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    color: 'white',
    marginBottom: 8,
  },
  textContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#FF4500',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: '#6B7280',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#010118',
  },
});