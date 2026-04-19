import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { supabase } from '../src/lib/supabase';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Kulang na Impormasyon', 'Paki-fill up ang email at password.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      );
    } catch (error: any) {
      console.error('Login Error:', error);
      let errorMessage = 'Hindi nakapag-login. Pakisubukan muli.';

      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Hindi tamang email o password.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'May problema sa internet connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/bg_login.png')}
      className="flex-1 justify-center"
      resizeMode="cover">
      <View className="absolute inset-0 bg-yellow-900/50" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 justify-center px-8" style={{ paddingTop: 80 }}>
          {/* Header */}
          <View className="mb-10 items-center">
            <Text
              className="font-script text-white drop-shadow-lg"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 56,
                lineHeight: 62,
                textAlign: 'center',
              }}>
              Noli Me Tangere
            </Text>
            <Text className="py-2 text-center font-poppins-bold text-lg text-white shadow-lg">
              Filipino Reading App
            </Text>
          </View>

          {/* Login Form */}
          <View className="w-full space-y-4">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#3e2c2c"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="mb-4 w-full rounded-full border-2 border-ink bg-parchment px-6 py-4 text-center font-poppins-bold text-lg text-ink shadow-sm"
              value={email}
              onChangeText={setEmail}
            />

            <View className="relative">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#3e2c2c"
                secureTextEntry={!showPassword}
                className="mb-6 w-full rounded-full border-2 border-ink bg-parchment px-6 py-4 pr-12 text-center font-poppins-bold text-lg text-ink shadow-sm"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-4"
                onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#3e2c2c"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              disabled={loading}
              className="w-full items-center rounded-full border-2 border-ink bg-[#f5c170] py-4 shadow-lg">
              {loading ? (
                <ActivityIndicator size="small" color="#3e2c2c" />
              ) : (
                <Text className="font-poppins-bold text-xl uppercase tracking-widest text-ink">
                  LOGIN
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Links */}
          <View className="mt-8 items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Registration')} className="py-2">
              <Text className="font-poppins-bold text-sm text-white opacity-90">
                Wala pang account? <Text className="underline">Mag-register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <StatusBar style="light" />
    </ImageBackground>
  );
}
