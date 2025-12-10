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

type RegistrationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>;

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
        initDatabase().catch(e => console.error("DB Init Error:", e));
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
            console.error("Registration Error:", error);
            Alert.alert("Error", "Hindi nai-save ang impormasyon. Pakisubukan muli.");
        }
    };

    // Helper component for Checkbox to keep code clean
    const CustomCheckbox = ({ label, isSelected, onSelect }: { label: string, isSelected: boolean, onSelect: () => void }) => (
        <TouchableOpacity onPress={onSelect} className="flex-row items-start mb-4">
            <View className={`w-6 h-6 border-2 border-ink mr-3 items-center justify-center ${isSelected ? 'bg-ink' : 'bg-transparent'}`}>
                {isSelected && <Text className="text-white font-bold text-xs">✓</Text>}
            </View>
            <Text className="flex-1 text-ink font-poppins text-xs leading-4">{label}</Text>
        </TouchableOpacity>
    );

    return (
        <ImageBackground
            source={require('../assets/images/noli_bg.png')}
            className="flex-1 justify-center"
            resizeMode="cover"
        >
            <View className="flex-1 bg-black/30 px-8 pt-20 pb-10 justify-between">

                {/* Header */}
                <View className="items-center mt-56">
                    <Text className="text-white text-6xl font-poppins-bold shadow-lg py-2">
                        HiLiSiBu
                    </Text>
                    <View className="mt-4">
                        <Text className="text-white text-center font-poppins-bold text-lg">
                            Simulan Natin!
                        </Text>
                        <Text className="text-white text-center text-sm opacity-80 px-4 font-poppins">
                            Ilagay ang inyong mga impormasyon upang makapagsimula
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="w-full space-y-4"
                >
                    <TextInput
                        placeholder="Pangalan"
                        placeholderTextColor="#3e2c2c"
                        className="w-full bg-parchment border-2 border-ink rounded-full py-4 px-6 text-center font-poppins-bold text-ink text-lg mb-4 shadow-sm"
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />

                    <TextInput
                        placeholder="Baitang"
                        placeholderTextColor="#3e2c2c"
                        className="w-full bg-parchment border-2 border-ink rounded-full py-4 px-6 text-center font-poppins-bold text-ink text-lg mb-4 shadow-sm"
                        value={formData.grade}
                        onChangeText={(text) => setFormData({ ...formData, grade: text })}
                    />

                    <TextInput
                        placeholder="Seksyon"
                        placeholderTextColor="#3e2c2c"
                        className="w-full bg-parchment border-2 border-ink rounded-full py-4 px-6 text-center font-poppins-bold text-ink text-lg mb-8 shadow-sm"
                        value={formData.section}
                        onChangeText={(text) => setFormData({ ...formData, section: text })}
                    />

                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleStart}
                        className="w-full bg-[#f5c170] border-2 border-ink rounded-full py-4 items-center shadow-lg transform active:scale-95 transition-transform"
                    >
                        <Text className="text-ink font-poppins-bold text-xl tracking-widest uppercase">
                            SIMULAN
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>

                {/* Footer Link to Modal */}
                <View className="items-center mb-4">
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Text className="text-white text-sm underline opacity-80 font-poppins-bold">
                            Mga Tuntunin at Kondisyon
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Terms and Conditions Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/60 p-6">
                    <View className="bg-parchment w-full h-[85%] rounded-3xl border-4 border-[#8B4513] overflow-hidden">

                        {/* Modal Header */}
                        <View className="bg-[#8B4513] p-4 items-center">
                            <Text className="text-[#E8D4B0] font-poppins-bold text-lg text-center">
                                Mga Tuntunin at Kondisyon
                            </Text>
                        </View>

                        {/* Modal Content Scroll */}
                        <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={true}>
                            <Text className="font-poppins-bold text-ink text-sm mb-1">I. Layunin</Text>
                            <Text className="font-poppins text-ink text-xs mb-3 text-justify">
                                Ang aplikasyon ay isinagawa upang tulungan ang mga mag-aaral sa kanilang pagbabasa na may pang-unawa. Ito ay nakatuon sa mga kasanayang paghinuha, paglilinaw, pagsisiyasat, at pagbubuod upang mapaunlad ang kanilang pang-unawa at kritikal na pag-iisip.
                            </Text>

                            <Text className="font-poppins-bold text-ink text-sm mb-1">II. Saklaw ng Paggamit</Text>
                            <Text className="font-poppins text-ink text-xs mb-3 text-justify">
                                • Ang aplikasyon ay gagamitin lamang para sa mga gawaing pang-akademiko at hindi para sa personal, komersyal, o libangan.{'\n'}
                                • Ang mga mag-aaral ay inaasahang gagamit ng aplikasyon sa tamang paraan at ayon sa itinakdang layunin ng pananaliksik.
                            </Text>

                            <Text className="font-poppins-bold text-ink text-sm mb-1">III. Pagkapribado at Kumpidensyalidad</Text>
                            <Text className="font-poppins text-ink text-xs mb-3 text-justify">
                                • Ang lahat ng datos na ilalagay ng mag-aaral sa aplikasyon ay mananatiling pribado at kumpidensyal.{'\n'}
                                • Hindi isasapubliko ang mga sagot o impormasyon maliban kung bahagi ng pagsusuri sa pananaliksik.{'\n'}
                                • Walang personal na pagkakakilanlan ang ilalantad sa anumang ulat o presentasyon.{'\n'}
                                • Sa paggamit ng aplikasyon, ang mag-aaral ay nagbibigay ng pahintulot na gamitin ang kanyang mga sagot para sa layunin ng pananaliksik.
                            </Text>

                            <Text className="font-poppins-bold text-ink text-sm mb-1">IV. Pananagutan ng Gumagamit</Text>
                            <Text className="font-poppins text-ink text-xs mb-3 text-justify">
                                • Ang mag-aaral ay inaasahang magbibigay ng tapat, malinaw, at makabuluhang sagot.{'\n'}
                                • Ang mag-aaral ay may pananagutan na huwag maglagay ng maling impormasyon o anumang hindi angkop na sagot.
                            </Text>

                            <Text className="font-poppins-bold text-ink text-sm mb-1">V. Pagbabago ng Tuntunin</Text>
                            <Text className="font-poppins text-ink text-xs mb-4 text-justify">
                                • Maaaring baguhin o i-update ng mananaliksik ang mga tuntunin at kundisyon kung kinakailangan.
                            </Text>

                            {/* Privacy Notice */}
                            <Text className="font-poppins text-ink text-xs mb-2 text-justify italic opacity-80">
                                Ang aplikasyon na ito ay nangongolekta ng datos ng iyong paggamit (mga sagot, progreso, atbp.) na nakaugnay sa iyong pagkakakilanlan para sa layunin ng pananaliksik.
                            </Text>

                            <View className="h-[1px] bg-ink/20 my-4" />

                            <Text className="font-poppins-bold text-ink text-xs mb-4">
                                Lagyan ng tsek ( ✓ ) ang kahon na naaayon sa iyong desisyon/pahintulot bago magpatuloy:
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
                            className="bg-ink p-4 items-center justify-center"
                            onPress={() => setModalVisible(false)}
                        >
                            <Text className="text-white font-poppins-bold uppercase tracking-widest">Isara</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <StatusBar style="light" />
        </ImageBackground>
    );
}
