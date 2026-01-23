import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';

// UPDATED IMPORT: Pointing to the file in the SAME folder based on your screenshot
import { Paghihinuha, Paglilinaw, Pagsisiyasat, Pagbubuod } from './ActivityComponents';

type ActivityScreenRouteProp = RouteProp<RootStackParamList, 'ActivityContainer'>;

// Placeholder in case a component fails to load
const Placeholder = ({ name }: { name: string }) => (
  <View className="items-center justify-center p-10">
    <FontAwesome5 name="tools" size={40} color="#8d6e63" />
    <Text className="mt-4 text-center font-poppins-bold text-[#5d4037]">{name}</Text>
    <Text className="text-center font-poppins text-xs text-[#8d6e63]">Wala pang laman.</Text>
  </View>
);

export default function ActivityContainerScreen() {
  const navigation = useNavigation();
  const route = useRoute<ActivityScreenRouteProp>();
  const { title, rangeId } = route.params;

  const [activeTab, setActiveTab] = useState<
    'paghihinuha' | 'pagsisiyasat' | 'paglilinaw' | 'pagbubuod'
  >('paghihinuha');

  const renderContent = () => {
    switch (activeTab) {
      case 'paghihinuha':
        // Only show the specific component if the range is 01-03
        if (rangeId === '01-03') return <Paghihinuha />;
        return <Placeholder name="Paghihinuha (Ibang Kabanata)" />;
      case 'pagsisiyasat':
        return <Pagsisiyasat />;
      case 'paglilinaw':
        return <Paglilinaw />;
      case 'pagbubuod':
        return <Pagbubuod />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-[#3e2723]">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pb-2 pt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="rounded-full bg-[#5d4037] p-2">
            <Feather name="arrow-left" size={24} color="#e8d4b0" />
          </TouchableOpacity>
          <View className="rounded-full border border-[#bcaaa4] bg-[#8d6e63] px-6 py-2">
            <Text className="font-poppins-bold text-sm text-white">Gawain: {title}</Text>
          </View>
          <View className="w-10" />
        </View>

        {/* Navigation Tabs */}
        <View className="mx-4 mt-4 flex-row justify-between rounded-2xl border border-[#8d6e63] bg-[#6d4c41] p-2">
          <TabButton
            active={activeTab === 'paghihinuha'}
            onPress={() => setActiveTab('paghihinuha')}
            icon="search"
            label="Paghihinuha"
          />
          <TabButton
            active={activeTab === 'pagsisiyasat'}
            onPress={() => setActiveTab('pagsisiyasat')}
            icon="eye"
            label="Pagsisiyasat"
          />
          <TabButton
            active={activeTab === 'paglilinaw'}
            onPress={() => setActiveTab('paglilinaw')}
            icon="projector-screen"
            label="Paglilinaw"
            isMaterialIcon
          />
          <TabButton
            active={activeTab === 'pagbubuod'}
            onPress={() => setActiveTab('pagbubuod')}
            icon="file-alt"
            label="Pagbubuod"
          />
        </View>

        {/* Content Container */}
        <View className="mx-4 mb-4 mt-4 flex-1 overflow-hidden rounded-3xl border border-[#8d6e63] bg-[#d7ccc8]">
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
            {renderContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
      <StatusBar style="light" backgroundColor="#3e2723" />
    </View>
  );
}

const TabButton = ({ active, onPress, icon, label, isMaterialIcon = false }: any) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 items-center rounded-xl p-2 ${active ? 'bg-[#efede6]' : ''}`}>
    {isMaterialIcon ? (
      <MaterialCommunityIcons name={icon} size={18} color={active ? '#3e2723' : '#e8d4b0'} />
    ) : (
      <FontAwesome5 name={icon} size={16} color={active ? '#3e2723' : '#e8d4b0'} />
    )}
    <Text className={`mt-1 text-xs font-bold ${active ? 'text-[#3e2723]' : 'text-[#e8d4b0]'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);
