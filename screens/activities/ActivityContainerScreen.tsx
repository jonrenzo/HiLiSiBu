import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Paghihinuha, Paglilinaw, Pagsisiyasat, Pagbubuod, Paghihinuha4to6 } from './ActivityComponents';
import { areChaptersRead } from '../../services/db';

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

  // STATE: Controls if post-reading activities are locked
  const [isLocked, setIsLocked] = useState(true);

  // EFFECT: Check database when screen loads
  useEffect(() => {
    const checkChapterProgress = async () => {
      try {
        // 1. Convert rangeId "01-03" into an array of numbers [1, 2, 3]
        const [startStr, endStr] = rangeId.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        const chaptersToCheck: number[] = [];
        for (let i = start; i <= end; i++) {
          chaptersToCheck.push(i);
        }

        // 2. Check DB if all these chapters are read
        const allRead = await areChaptersRead(chaptersToCheck);

        // 3. If all read, unlock. If not, keep locked.
        setIsLocked(!allRead);
      } catch (error) {
        console.error('Error checking progress:', error);
        setIsLocked(true); // Default to locked on error
      }
    };

    checkChapterProgress();
  }, [rangeId]);

  // HANDLER: Controls tab switching
  const handleTabPress = (tab: typeof activeTab) => {
    // 'paghihinuha' is PRE-reading, so it's always allowed.
    // The other tabs are POST-reading, so check lock status.
    if (tab !== 'paghihinuha' && isLocked) {
      Alert.alert(
        'Naka-lock ang Gawain',
        'Kailangan munang basahin ang lahat ng kabanata sa saklaw na ito bago buksan ang gawaing ito.'
      );
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'paghihinuha':
        // Only show the specific component if the range is 01-03
        if (rangeId === '01-03') return <Paghihinuha />;
        if (rangeId === '04-06') return <Paghihinuha4to6/>;
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
          {/* Paghihinuha (Always Unlocked) */}
          <TabButton
            active={activeTab === 'paghihinuha'}
            onPress={() => handleTabPress('paghihinuha')}
            icon="search"
            label="Paghihinuha"
          />

          {/* Locked Tabs */}
          <TabButton
            active={activeTab === 'pagsisiyasat'}
            onPress={() => handleTabPress('pagsisiyasat')}
            icon="eye"
            label="Pagsisiyasat"
            locked={isLocked}
          />
          <TabButton
            active={activeTab === 'paglilinaw'}
            onPress={() => handleTabPress('paglilinaw')}
            icon="projector-screen"
            label="Paglilinaw"
            isMaterialIcon
            locked={isLocked}
          />
          <TabButton
            active={activeTab === 'pagbubuod'}
            onPress={() => handleTabPress('pagbubuod')}
            icon="file-alt"
            label="Pagbubuod"
            locked={isLocked}
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

// Updated TabButton to handle visual locking
const TabButton = ({
  active,
  onPress,
  icon,
  label,
  isMaterialIcon = false,
  locked = false,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={locked ? 1 : 0.7} // Remove click effect if locked
    className={`relative flex-1 items-center rounded-xl p-2 ${
      active ? 'bg-[#efede6]' : ''
    } ${locked ? 'opacity-50' : 'opacity-100'}`} // Dim if locked
  >
    {isMaterialIcon ? (
      <MaterialCommunityIcons name={icon} size={18} color={active ? '#3e2723' : '#e8d4b0'} />
    ) : (
      <FontAwesome5 name={icon} size={16} color={active ? '#3e2723' : '#e8d4b0'} />
    )}

    <Text className={`mt-1 text-xs font-bold ${active ? 'text-[#3e2723]' : 'text-[#e8d4b0]'}`}>
      {label}
    </Text>

    {/* Lock Icon Overlay */}
    {locked && (
      <View className="absolute right-2 top-1">
        <FontAwesome5 name="lock" size={10} color="#e8d4b0" />
      </View>
    )}
  </TouchableOpacity>
);
