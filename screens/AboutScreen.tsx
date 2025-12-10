import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'About'>;

export default function AboutScreen() {
    const navigation = useNavigation<NavigationProp>();

    const handleContinue = () => {
        navigation.replace('MainTabs');
    };

    return (
        <ImageBackground
            source={require('../assets/images/noli_bg.png')}
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 bg-black/40 pt-12 px-6 pb-6">

                {/* Header */}
                <View className="flex-row items-center justify-center mb-6">
                    <Text className="text-white text-2xl font-poppins-bold tracking-widest shadow-md">
                        Tungkol sa App
                    </Text>
                </View>

                {/* Content Container */}
                <View className="flex-1 bg-parchment rounded-3xl border-4 border-[#8B4513] overflow-hidden shadow-2xl mb-4">
                    <View className="bg-[#8B4513] py-3 items-center">
                        <Text className="text-[#E8D4B0] font-poppins-bold italic text-lg">HiLiSiBu</Text>
                    </View>

                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        {/* Logo */}
                        <View className="items-center mb-6">
                            {/* Reduced size to w-20 h-20 (80px). Change to w-16 h-16 (64px) if still too big. */}
                            <View className="w-20 h-20 bg-ink rounded-full items-center justify-center border-4 border-[#8B4513] overflow-hidden">
                                <Image
                                    source={require("../assets/images/logo.png")}
                                    className="w-full h-full"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        <Text className="text-ink font-poppins text-justify text-sm mb-6 leading-6">
                            Isang digital na kasangkapan na idinisenyo upang linangin ang kakayahan ng mga mag-aaral sa masusing pang-unawa at pagsusuri ng Nobelang Noli Me Tangere. Sa pamamagitan ng mga gawaing nakatuon sa paghihinuha, paglilinaw, pagsisiyasat, at pagbubuod, inaasahang malinang ang kritikal na pag-iisip, mapalawak ang pananaw, at mapalalim ang kakayahang umunawa ng mga akdang pampanitikan. Layunin nitong gawing makabuluhan, makabago, at interaktibo ang karanasan sa pagkatuto sa pamamagitan ng digital na plataporma.
                        </Text>

                        <View className="h-[1px] bg-ink/20 w-full mb-6" />

                        <Text className="text-ink font-poppins-bold text-base mb-3">
                            Mga Mananaliksik
                        </Text>

                        <View className="space-y-2 mb-8">
                            <Text className="text-ink font-poppins text-sm">• Pangalan ng Mananaliksik 1</Text>
                            <Text className="text-ink font-poppins text-sm">• Pangalan ng Mananaliksik 2</Text>
                            <Text className="text-ink font-poppins text-sm">• Pangalan ng Mananaliksik 3</Text>
                        </View>

                        <Text className="text-ink font-poppins-bold text-base mb-3">
                            Bersyon
                        </Text>
                        <Text className="text-ink font-poppins text-sm mb-10">
                            v1.0.0 (Alpha)
                        </Text>
                    </ScrollView>
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleContinue}
                    className="w-full bg-[#f5c170] border-2 border-ink rounded-full py-4 items-center shadow-lg"
                >
                    <Text className="text-ink font-poppins-bold text-xl tracking-widest uppercase">
                        MAGPATULOY
                    </Text>
                </TouchableOpacity>

            </View>
            <StatusBar style="light" />
        </ImageBackground>
    );
}
