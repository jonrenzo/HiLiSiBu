import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ActivitiesMenuScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Reusable Large Feature Card
  const ActivityCard = ({
    title,
    rangeId,
    icon,
    subtitle,
    accentColor,
  }: {
    title: string;
    rangeId: string;
    icon: string;
    subtitle: string;
    accentColor: string;
  }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate('ActivityContainer', { rangeId, title })}
      className="mb-6 w-full overflow-hidden rounded-3xl border-b-8 border-r-4 border-[#3e2723] bg-[#efede6] shadow-lg"
      style={{ elevation: 5 }} // Android shadow
    >
      {/* Card Header Decoration */}
      <View className={`h-2 w-full ${accentColor}`} />

      <View className="p-6">
        <View className="flex-row items-start justify-between">
          {/* Left Side: Icon & Title */}
          <View>
            <View className="mb-2 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-[#5d4037]/10">
                {/* @ts-ignore */}
                <MaterialCommunityIcons name={icon} size={22} color="#5d4037" />
              </View>
              <Text className="font-poppins-bold text-xs uppercase tracking-widest text-[#8d6e63]">
                Saklaw na Kabanata
              </Text>
            </View>

            {/* Big Number Typography */}
            <Text className="mb-1 font-serif text-5xl text-[#3e2723]">{rangeId}</Text>
            <Text className="font-poppins-bold text-lg text-[#5d4037]">{subtitle}</Text>
          </View>

          {/* Right Side: Decorative Arrow Circle */}
          <View className="h-12 w-12 items-center justify-center rounded-full bg-[#3e2723] shadow-sm">
            <Feather name="arrow-right" size={24} color="#e8d4b0" />
          </View>
        </View>

        {/* Divider */}
        <View className="my-4 h-[1px] w-full bg-[#3e2723]/10" />

        {/* Footer: Tags */}
        <View className="flex-row flex-wrap gap-2">
          {['Paghihinuha', 'Pagsisiyasat', 'Paglilinaw', 'Pagbubuod'].map((tag, i) => (
            <View
              key={i}
              className="rounded-md border border-[#5d4037]/10 bg-[#5d4037]/5 px-2 py-1">
              <Text className="font-poppins text-[10px] text-[#5d4037]">{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-[#4f2b21]">
      {/* Decorative Background Circles */}
      <View className="absolute right-[-50] top-[-50] h-64 w-64 rounded-full bg-[#5d4037] opacity-20" />
      <View className="absolute bottom-[100] left-[-30] h-40 w-40 rounded-full bg-[#3e2723] opacity-30" />

      <SafeAreaView className="flex-1">
        {/* Header Section */}
        <View className="px-6 pb-2 pt-6">
          <Text className="mb-1 font-poppins text-sm uppercase tracking-widest text-[#e8d4b0] opacity-80">
            Noli Me Tangere
          </Text>
          <Text className="mb-2 font-poppins-bold text-3xl text-white">Mga Gawain</Text>
          <Text className="w-4/5 font-poppins text-sm leading-5 text-[#bcaaa4]">
            Piliin ang pangkat ng kabanata upang simulan ang iyong pagsusulit at aktibidad.
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Card 1 */}
          <ActivityCard
            title="Kabanata 1-3"
            rangeId="01-03"
            subtitle="Isang Pagtitipon - Ang Hapunan"
            icon="book-open-page-variant"
            accentColor="bg-[#8d6e63]"
          />

          {/* Card 2 */}
          <ActivityCard
            title="Kabanata 4-6"
            rangeId="04-06"
            subtitle={'Erehe at Pilibustero - \n Ang Hapunan'}
            icon="brain"
            accentColor="bg-[#f5c170]" // Gold accent for variety
          />
        </ScrollView>
      </SafeAreaView>
      <StatusBar style="light" backgroundColor="#4a342e" />
    </View>
  );
}
