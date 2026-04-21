import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { initDatabase } from '../services/db';
import { supabase } from '../src/lib/supabase';

type RegistrationData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  classCode: string;
  role: 'student' | 'teacher';
};

type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Registration'
>;

export default function RegistrationScreen() {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();

  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    classCode: '',
    role: 'student',
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    initDatabase().catch((e) => console.error('DB Init Error:', e));
  }, []);

  const handleStart = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Kulang na Impormasyon', 'Paki-enter ang pangalan.');
      return;
    }

    if (!formData.email.trim() || !formData.password) {
      Alert.alert('Kulang na Impormasyon', 'Paki-enter ang email at password.');
      return;
    }

    if (formData.role === 'student' && !formData.classCode.trim()) {
      Alert.alert('Kulang na Impormasyon', 'Kinakailangan ang class code upang makapag-register.');
      return;
    }

    if (!agreed) {
      Alert.alert('Paalala', 'Kinakailangan mong sumang-ayon sa mga tuntunin.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Hindi tumutugma ang password.');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Dapat ang password ay Hindi bababa sa 6 characters.');
      return;
    }

    setLoading(true);
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://4pmodel.vercel.app';

    try {
      let classId = null;
      let className = '';

      // 1. Validate class code if student
      if (formData.role === 'student') {
        const validateUrl = `${backendUrl}/api/validate-class?code=${encodeURIComponent(formData.classCode.trim())}`;
        console.log('Validating class at:', validateUrl);
        const classRes = await fetch(validateUrl);


        if (!classRes.ok) {
          Alert.alert('Error', 'Hindi mahanap ang klase. Suriin ang iyong class code.');
          setLoading(false);
          return;
        }

        const classData = await classRes.json();
        classId = classData.id;
        className = classData.name;
      }

      // 2. Supabase Sign Up
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
            role: formData.role,
            class_id: classId,
          },
        },
      });

      if (signupError) throw signupError;

      if (data.user) {
        // 3. Create profile via server API to bypass RLS
        const registerProfileUrl = `${backendUrl}/api/auth/register-profile`;
        console.log('Registering profile at:', registerProfileUrl);
        const profileRes = await fetch(registerProfileUrl, {

          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            name: formData.name.trim(),
            classId: classId,
            role: formData.role,
          }),
        });

        if (!profileRes.ok) {
          console.error('Failed to create profile via backend');
        }

        const successMsg =
          formData.role === 'student'
            ? `Matagumpay na nakarehistro! Ikaw ay naka-enroll sa klase: ${className}`
            : 'Matagumpay na nakarehistro bilang Guro!';

        Alert.alert('Tagumpay', successMsg);
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      let errorMessage = 'Hindi nakarehistro. Pakisubukan muli.';

      if (error.message.includes('already registered')) {
        errorMessage = 'Ang email na ito ay naka-register na.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const CustomCheckbox = ({
    label,
    isSelected,
    onSelect,
  }: {
    label: string;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <TouchableOpacity onPress={onSelect} className="mb-4 flex-row items-start">
      <View
        className={`mr-3 h-6 w-6 items-center justify-center border-2 border-ink ${isSelected ? 'bg-ink' : 'bg-transparent'}`}>
        {isSelected && <Text className="text-xs font-bold text-white">✓</Text>}
      </View>
      <Text className="flex-1 font-poppins text-xs leading-4 text-ink">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/images/bg_login.png')}
      className="flex-1 justify-center"
      resizeMode="cover">
      <View className="absolute inset-0 bg-yellow-900/50" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
            paddingBottom: 40,
            paddingTop: 60,
          }}>
          {/* Header */}
          <View className="items-center">
            <Text
              className="font-script text-white drop-shadow-lg"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 64,
                lineHeight: 70,
                textAlign: 'center',
              }}>
              Noli Me Tangere
            </Text>
            <Text className="py-2 text-center font-poppins-bold text-lg text-white shadow-lg">
              Paghihinuha, Paglilinaw, Pagsisiyasat, at Pagbubuod
            </Text>
            <View className="mt-4">
              <Text className="text-center font-poppins-bold text-lg text-white">
                Gumawa ng Account
              </Text>
              <Text className="px-4 text-center font-poppins text-sm text-white opacity-80">
                Ilagay ang inyong mga impormasyon upang makapagsimula
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="mt-6 w-full space-y-3">
            <TextInput
              placeholder="Pangalan"
              placeholderTextColor="#3e2c2c"
              className="mb-2 w-full rounded-full border-2 border-ink bg-parchment px-6 py-3 text-center font-poppins-bold text-lg text-ink shadow-sm"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#3e2c2c"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className="mb-2 w-full rounded-full border-2 border-ink bg-parchment px-6 py-3 text-center font-poppins-bold text-lg text-ink shadow-sm"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />

            <View className="relative">
              <TextInput
                placeholder="Password"
                placeholderTextColor="#3e2c2c"
                secureTextEntry={!showPassword}
                className="mb-2 w-full rounded-full border-2 border-ink bg-parchment px-6 py-3 pr-12 text-center font-poppins-bold text-lg text-ink shadow-sm"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#3e2c2c"
                />
              </TouchableOpacity>
            </View>

            <View className="relative">
              <TextInput
                placeholder="Konfirmahin ang Password"
                placeholderTextColor="#3e2c2c"
                secureTextEntry={!showConfirmPassword}
                className="mb-2 w-full rounded-full border-2 border-ink bg-parchment px-6 py-3 pr-12 text-center font-poppins-bold text-lg text-ink shadow-sm"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              />
              <TouchableOpacity
                className="absolute right-4 top-3"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="#3e2c2c"
                />
              </TouchableOpacity>
            </View>

            {formData.role === 'student' && (
              <TextInput
                placeholder="Class Code (Hal. ABC123)"
                placeholderTextColor="#3e2c2c"
                autoCapitalize="characters"
                className="mb-2 w-full rounded-full border-2 border-ink bg-parchment px-6 py-3 text-center font-poppins-bold text-lg text-ink shadow-sm"
                value={formData.classCode}
                onChangeText={(text) => setFormData({ ...formData, classCode: text.toUpperCase() })}
              />
            )}

            {/* Role Selection */}
            <View className="mb-4 flex-row justify-center space-x-4">
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, role: 'student' })}
                className={`flex-1 rounded-full border-2 py-2 ${formData.role === 'student' ? 'border-ink bg-ink' : 'border-ink bg-transparent'}`}>
                <Text
                  className={`text-center font-poppins-bold ${formData.role === 'student' ? 'text-white' : 'text-ink'}`}>
                  Mag-aaral
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, role: 'teacher' })}
                className={`flex-1 rounded-full border-2 py-2 ${formData.role === 'teacher' ? 'border-ink bg-ink' : 'border-ink bg-transparent'}`}>
                <Text
                  className={`text-center font-poppins-bold ${formData.role === 'teacher' ? 'text-white' : 'text-ink'}`}>
                  Guro
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleStart}
              disabled={loading}
              className="w-full items-center rounded-full border-2 border-ink bg-[#f5c170] py-4 shadow-lg">
              {loading ? (
                <ActivityIndicator size="small" color="#3e2c2c" />
              ) : (
                <Text className="font-poppins-bold text-xl uppercase tracking-widest text-ink">
                  REGISTER
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Link to Modal */}
          <View className="mt-6 items-center">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="font-poppins-bold text-sm text-white underline opacity-80">
                Mga Tuntunin at Kondisyon
              </Text>
            </TouchableOpacity>
          </View>

          {/* Already have account */}
          <View className="mt-4 items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="font-poppins-bold text-sm text-white">
                May account na? <Text className="underline">Mag-login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Terms Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/60 p-6">
          <View className="h-[85%] w-full overflow-hidden rounded-3xl border-4 border-[#8B4513] bg-parchment">
            <View className="items-center bg-[#8B4513] p-4">
              <Text className="text-center font-poppins-bold text-lg text-[#E8D4B0]">
                Mga Tuntunin at Kondisyon
              </Text>
            </View>
            <ScrollView className="flex-1 p-5">
              <Text className="mb-1 font-poppins-bold text-sm text-ink">I. Layunin</Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                Ang aplikasyon ay isinagawa upang tulungan ang mga mag-aaral sa kanilang pagbabasa na may pang-unawa. Ito ay nakatuon sa mga kasanayang paghihinuha, paglilinaw, pagsisiyasat, at pagbubuod upang mapaunlad ang kanilang pang-unawa at kritikal na pag-iisip.
              </Text>
              <Text className="mb-1 font-poppins-bold text-sm text-ink">II. Saklaw ng Paggamit</Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                Ang aplikasyon ay gagamitin lamang para sa mga gawaing pang-akademiko at hindi para sa personal, komersyal, o libangan. Ang mga mag-aaral ay inaasahang gagamit ng aplikasyon sa tamang paraan at ayon sa itinakdang layunin ng pananaliksik.
              </Text>
              <Text className="mb-1 font-poppins-bold text-sm text-ink">III. Pagkapribado at Kumpidensyalidad</Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                Ang lahat ng datos na ilalagay ng mag-aaral sa aplikasyon ay mananatiling pribado at kumpidensyal. Hindi isasapubliko ang mga sagot o impormasyon maliban kung bahagi ng pagsusuri sa pananaliksik. Walang personal na pagkakakilanlan ang ilalantad sa anumang ulat o presentasyon. Sa paggamit ng aplikasyon, ang mag-aaral ay nagbibigay ng pahintulot na gamitin ang kanyang mga sagot para sa layunin ng pananaliksik. May karapatan ang mag-aaral na tumigil o huwag ipagpatuloy ang paggamit ng aplikasyon anumang oras.
              </Text>
              <Text className="mb-1 font-poppins-bold text-sm text-ink">IV. Pananagutan ng Gumagamit</Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                Ang mag-aaral ay inaasahang magbibigay ng tapat, malinaw, at makabuluhang sagot. Ang mag-aaral ay may pananagutan na huwag maglagay ng maling impormasyon, panlilibak, o anumang hindi angkop na sagot. Ang mananaliksik ay may tungkuling pangalagaan ang datos at tiyakin ang tamang paggamit nito. Ang mananaliksik ay magbibigay ng malinaw na gabayan at paliwanag sa mga mag-aaral hinggil sa aplikasyon. Ang mananaliksik ay hindi gagamit ng datos para sa layuning labas sa pananaliksik.
              </Text>
              <Text className="mb-1 font-poppins-bold text-sm text-ink">V. Pagbabago ng Tuntunin</Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                Maaaring baguhin o i-update ng mananaliksik ang mga tuntunin at kundisyon kung kinakailangan. Ang anumang pagbabago ay ipaaalam sa mga mag-aaral bago ipatupad.
              </Text>
              <Text className="mb-4 text-justify font-poppins text-[10px] italic text-ink opacity-80">
                Ang aplikasyon na ito ay nangongolekta ng datos ng iyong paggamit (mga sagot, progreso, atbp.) na nakaugnay sa iyong pagkakakilanlan para sa layunin ng pananaliksik. Ang iyong mga datos ay mananatiling kumpidensyal at gagamitin lamang sa pag-aaral. Ang paglahok ay boluntaryo.
              </Text>
              <View className="my-4 h-[1px] bg-ink/20" />
              <Text className="mb-4 font-poppins-bold text-xs text-ink">
                Lagyan ng tsek ( ✓ ) ang kahon na naaayon sa iyong desisyon/pahintulot bago magpatuloy:
              </Text>
              <CustomCheckbox
                label="Ako ay pumapayag na kolektahin at gamitin ang aking mga datos para sa akademikong pananaliksik"
                isSelected={agreed === true}
                onSelect={() => setAgreed(true)}
              />
              <CustomCheckbox
                label="Hindi ako pumapayag na kolektahin at gamitin ang aking mga datos para sa akademikong pananaliksik"
                isSelected={agreed === false}
                onSelect={() => setAgreed(false)}
              />
              <View className="h-10" />
            </ScrollView><TouchableOpacity
              className="items-center justify-center bg-ink p-4"
              onPress={() => setModalVisible(false)}>
              <Text className="font-poppins-bold uppercase tracking-widest text-white">Isara</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" />
    </ImageBackground>
  );
}
