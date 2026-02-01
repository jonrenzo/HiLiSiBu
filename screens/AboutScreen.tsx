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
      resizeMode="cover">
      <View className="flex-1 bg-black/40 px-6 pb-6 pt-12">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-center">
          <Text className="font-poppins-bold text-2xl tracking-widest text-white shadow-md">
            Tungkol sa App
          </Text>
        </View>

        {/* Content Container */}
        <View className="mb-4 flex-1 overflow-hidden rounded-3xl border-4 border-[#8B4513] bg-parchment shadow-2xl">
          <View className="items-center bg-[#8B4513] py-3">
            <Text className="font-poppins-bold text-lg italic text-[#E8D4B0]">HiLiSiBu</Text>
          </View>

          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            {/* Logo */}
            <View className="mb-6 items-center">
              {/* Reduced size to w-20 h-20 (80px). Change to w-16 h-16 (64px) if still too big. */}
              <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-parchment">
                <Image
                  source={require('../assets/newLogo.png')}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              </View>
            </View>

            <Text className="mb-6 text-justify font-poppins text-sm leading-6 text-ink">
              Isang digital na kasangkapan na idinisenyo upang linangin ang kakayahan ng mga
              mag-aaral sa masusing pang-unawa at pagsusuri ng Nobelang Noli Me Tangere. Sa
              pamamagitan ng mga gawaing nakatuon sa paghihinuha, paglilinaw, pagsisiyasat, at
              pagbubuod, inaasahang malinang ang kritikal na pag-iisip, mapalawak ang pananaw, at
              mapalalim ang kakayahang umunawa ng mga akdang pampanitikan. Layunin nitong gawing
              makabuluhan, makabago, at interaktibo ang karanasan sa pagkatuto sa pamamagitan ng
              digital na plataporma.
            </Text>

            <View className="mb-6 h-[1px] w-full bg-ink/20" />

            <Text className="mb-3 font-poppins-bold text-base text-ink">Mga Mananaliksik</Text>

            <View className="mb-8 space-y-2">
              <Text className="font-poppins text-sm text-ink">• Diaz, Althea Ashley O. </Text>
              <Text className="font-poppins text-sm text-ink">• Dombrique, Ashley Nicole D.</Text>
              <Text className="font-poppins text-sm text-ink">• Gonzalez, Justine</Text>
              <Text className="font-poppins text-sm text-ink">• King, Sheena N. </Text>
              <Text className="font-poppins text-sm text-ink">• Torio, Princess B.</Text>
            </View>

            <Text className="mb-3 font-poppins-bold text-base text-ink">Bersyon</Text>
            <Text className="mb-10 font-poppins text-sm text-ink">v1.0.0 (Alpha)</Text>
          </ScrollView>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleContinue}
          className="w-full items-center rounded-full border-2 border-ink bg-[#f5c170] py-4 shadow-lg">
          <Text className="font-poppins-bold text-xl uppercase tracking-widest text-ink">
            MAGPATULOY
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}
