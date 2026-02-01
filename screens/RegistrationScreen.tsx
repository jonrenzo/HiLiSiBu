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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { initDatabase, saveUser } from '../services/db';

type RegistrationData = {
  name: string;
  grade: string;
  section: string;
};

type RegistrationScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Registration'
>;

export default function RegistrationScreen() {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();

  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    grade: '',
    section: '',
  });

  // New State for Modal and Agreement
  const [modalVisible, setModalVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    initDatabase().catch((e) => console.error('DB Init Error:', e));
  }, []);

  const handleStart = async () => {
    // Validation code...
    if (!formData.name.trim() || !formData.grade.trim() || !formData.section.trim()) {
      Alert.alert('Kulang na Impormasyon', 'Paki-puno ang lahat ng patlang.');
      return;
    }

    // Agreement Validation code...
    if (!agreed) {
      Alert.alert('Paalala', 'Kinakailangan mong sumang-ayon...');
      return;
    }

    try {
      await saveUser(formData.name, formData.grade, formData.section);
      console.log('User Registered & Saved:', formData);

      // UPDATE: Navigate to About (Intro) instead of Home
      navigation.replace('About');
    } catch (error) {
      console.error('Registration Error:', error);
      Alert.alert('Error', 'Hindi nai-save ang impormasyon. Pakisubukan muli.');
    }
  };

  // Helper component for Checkbox to keep code clean
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
            paddingTop: 80,
          }}>
          {/* Header */}
          <View className="items-center">
            <Text
              className="font-script text-white drop-shadow-lg"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                fontSize: 64, // bigger than 5xl
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
                Simulan Natin!
              </Text>
              <Text className="px-4 text-center font-poppins text-sm text-white opacity-80">
                Ilagay ang inyong mga impormasyon upang makapagsimula
              </Text>
            </View>
          </View>

          {/* Form */}
          <View className="mt-8 w-full space-y-4">
            <TextInput
              placeholder="Pangalan"
              placeholderTextColor="#3e2c2c"
              className="mb-4 w-full rounded-full border-2 border-ink bg-parchment px-6 py-4 text-center font-poppins-bold text-lg text-ink shadow-sm"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <TextInput
              placeholder="Baitang"
              placeholderTextColor="#3e2c2c"
              className="mb-4 w-full rounded-full border-2 border-ink bg-parchment px-6 py-4 text-center font-poppins-bold text-lg text-ink shadow-sm"
              value={formData.grade}
              onChangeText={(text) => setFormData({ ...formData, grade: text })}
            />

            <TextInput
              placeholder="Seksyon"
              placeholderTextColor="#3e2c2c"
              className="mb-8 w-full rounded-full border-2 border-ink bg-parchment px-6 py-4 text-center font-poppins-bold text-lg text-ink shadow-sm"
              value={formData.section}
              onChangeText={(text) => setFormData({ ...formData, section: text })}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleStart}
              className="w-full transform items-center rounded-full border-2 border-ink bg-[#f5c170] py-4 shadow-lg transition-transform active:scale-95">
              <Text className="font-poppins-bold text-xl uppercase tracking-widest text-ink">
                SIMULAN
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Link to Modal */}
          <View className="mt-8 items-center">
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="font-poppins-bold text-sm text-white underline opacity-80">
                Mga Tuntunin at Kondisyon
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Terms and Conditions Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/60 p-6">
          <View className="h-[85%] w-full overflow-hidden rounded-3xl border-4 border-[#8B4513] bg-parchment">
            {/* Modal Header */}
            <View className="items-center bg-[#8B4513] p-4">
              <Text className="text-center font-poppins-bold text-lg text-[#E8D4B0]">
                Mga Tuntunin at Kondisyon
              </Text>
            </View>

            {/* Modal Content Scroll */}
            <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={true}>
              <Text className="mb-1 font-poppins-bold text-sm text-ink">I. Layunin</Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                Ang aplikasyon ay isinagawa upang tulungan ang mga mag-aaral sa kanilang pagbabasa
                na may pang-unawa. Ito ay nakatuon sa mga kasanayang paghinuha, paglilinaw,
                pagsisiyasat, at pagbubuod upang mapaunlad ang kanilang pang-unawa at kritikal na
                pag-iisip.
              </Text>

              <Text className="mb-1 font-poppins-bold text-sm text-ink">
                II. Saklaw ng Paggamit
              </Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                • Ang aplikasyon ay gagamitin lamang para sa mga gawaing pang-akademiko at hindi
                para sa personal, komersyal, o libangan.{'\n'}• Ang mga mag-aaral ay inaasahang
                gagamit ng aplikasyon sa tamang paraan at ayon sa itinakdang layunin ng
                pananaliksik.
              </Text>

              <Text className="mb-1 font-poppins-bold text-sm text-ink">
                III. Pagkapribado at Kumpidensyalidad
              </Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                • Ang lahat ng datos na ilalagay ng mag-aaral sa aplikasyon ay mananatiling pribado
                at kumpidensyal.{'\n'}• Hindi isasapubliko ang mga sagot o impormasyon maliban kung
                bahagi ng pagsusuri sa pananaliksik.{'\n'}• Walang personal na pagkakakilanlan ang
                ilalantad sa anumang ulat o presentasyon.{'\n'}• Sa paggamit ng aplikasyon, ang
                mag-aaral ay nagbibigay ng pahintulot na gamitin ang kanyang mga sagot para sa
                layunin ng pananaliksik.
              </Text>

              <Text className="mb-1 font-poppins-bold text-sm text-ink">
                IV. Pananagutan ng Gumagamit
              </Text>
              <Text className="mb-3 text-justify font-poppins text-xs text-ink">
                • Ang mag-aaral ay inaasahang magbibigay ng tapat, malinaw, at makabuluhang sagot.
                {'\n'}• Ang mag-aaral ay may pananagutan na huwag maglagay ng maling impormasyon o
                anumang hindi angkop na sagot.
              </Text>

              <Text className="mb-1 font-poppins-bold text-sm text-ink">
                V. Pagbabago ng Tuntunin
              </Text>
              <Text className="mb-4 text-justify font-poppins text-xs text-ink">
                • Maaaring baguhin o i-update ng mananaliksik ang mga tuntunin at kundisyon kung
                kinakailangan.
              </Text>

              {/* Privacy Notice */}
              <Text className="mb-2 text-justify font-poppins text-xs italic text-ink opacity-80">
                Ang aplikasyon na ito ay nangongolekta ng datos ng iyong paggamit (mga sagot,
                progreso, atbp.) na nakaugnay sa iyong pagkakakilanlan para sa layunin ng
                pananaliksik.
              </Text>

              <View className="my-4 h-[1px] bg-ink/20" />

              <Text className="mb-4 font-poppins-bold text-xs text-ink">
                Lagyan ng tsek ( ✓ ) ang kahon na naaayon sa iyong desisyon/pahintulot bago
                magpatuloy:
              </Text>

              {/* Checkboxes */}
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
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
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
