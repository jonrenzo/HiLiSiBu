import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { getUser, clearUser } from '../services/db';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = async () => {
            const userData = await getUser();
            setUser(userData);
        };
        loadUser();
    }, []);

    const handleReset = () => {
        Alert.alert(
            "I-reset ang Data",
            "Sigurado ka bang nais mong burahin ang lahat ng iyong impormasyon? Hindi na ito maibabalik.",
            [
                { text: "Kanselahin", style: "cancel" },
                {
                    text: "Oo, Burahin",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await clearUser();
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Registration' }],
                                })
                            );
                        } catch (error) {
                            console.error("Reset Error:", error);
                            Alert.alert("Error", "Hindi nabura ang data. Subukan muli.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-[#4a342e]">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* ADDED 'pb-28' HERE to push content up above the Tab Bar */}
                <View className="flex-1 bg-[#efede6] rounded-t-[30px] mt-4 p-6 pb-28">

                    <View className="items-center mb-8 mt-4">
                        <View className="w-24 h-24 bg-[#4a342e] rounded-full items-center justify-center mb-4 border-4 border-[#8B4513]">
                            <Text className="text-[#e8d4b0] font-serif text-4xl">{user?.name?.charAt(0) || 'U'}</Text>
                        </View>
                        <Text className="text-[#4a342e] font-poppins-bold text-2xl">{user?.name || 'User'}</Text>
                        <Text className="text-[#4a342e] font-poppins opacity-70">{user?.grade} - {user?.section}</Text>
                    </View>

                    <View className="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-200">
                        <Text className="text-[#4a342e] font-poppins-bold mb-1">Aking Progreso</Text>
                        <Text className="text-gray-500 font-poppins text-xs">Wala pang datos.</Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleReset}
                        className="bg-[#4a342e] py-3 rounded-full items-center mt-auto shadow-lg active:opacity-80"
                    >
                        <Text className="text-[#e8d4b0] font-poppins-bold uppercase tracking-widest">
                            I-reset ang Data
                        </Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
            <StatusBar style="light" backgroundColor="#4a342e" />
        </View>
    );
}
