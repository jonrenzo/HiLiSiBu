import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../src/hooks/useAuth';
import { getChapterProgress } from '../src/services/supabase';
import type { ChapterProgress } from '../src/services/supabase';

const chapters = [
  {
    id: 1,
    tag: 'KABANATA I',
    title: 'Isang Pagtitipon',
    image: require('../assets/images/kabanata_1.png'),
  },
  {
    id: 2,
    tag: 'KABANATA II',
    title: 'Crisostomo Ibarra',
    image: require('../assets/images/kabanata_2.jpg'),
  },
  {
    id: 3,
    tag: 'KABANATA III',
    title: 'Ang Hapunan',
    image: require('../assets/images/kabanata_3.jpg'),
  },
  {
    id: 4,
    tag: 'KABANATA IV',
    title: 'Erehe at Pilibustero',
    image: require('../assets/images/kabanata_4.png'),
  },
  {
    id: 5,
    tag: 'KABANATA V',
    title: 'Isang Tala sa Gabing Madilim',
    image: require('../assets/images/kabanata_5.png'),
  },
  {
    id: 6,
    tag: 'KABANATA VI',
    title: 'Si Kapitan Tiyago',
    image: require('../assets/images/kabanata_6.png'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, profile } = useAuth();
  const [readChapters, setReadChapters] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      const userId = user?.id;

      if (!userId) {
        setReadChapters([]);
        return;
      }

      const fetchProgress = async () => {
        try {
          const progress: ChapterProgress[] = await getChapterProgress(userId);
          const readIds = progress.filter((p) => p.is_read).map((p) => p.chapter_id);
          setReadChapters(readIds);
        } catch (error) {
          console.error('Error fetching chapter progress:', error);
        }
      };

      fetchProgress();
    }, [user?.id])
  );

  const handleRead = (chapter: (typeof chapters)[0]) => {
    navigation.navigate('ChapterDetail', {
      id: chapter.id,
      title: chapter.title,
      tag: chapter.tag,
      image: chapter.image,
    });
  };

  const completedCount = readChapters.length;
  const studentName = profile?.name || 'Mag-aaral';

  return (
    <View className="flex-1 bg-[#4f2b21]">
      {/* Safe Area for Status Bar */}
      <SafeAreaView className="bg-[#4a342e]" />

      {/* User greeting */}
      <View className="mt-3 items-center">
        <Text className="font-poppins text-base text-[#e8d4b0]">
          Kumusta, <Text className="font-poppins-bold">{studentName}</Text>
        </Text>
      </View>

      {/* Main Header Title */}
      <View className={`px-4 pb-4 ${Platform.OS === 'android' ? 'pt-8' : 'pt-2'}`}>
        <View className="rounded-lg border border-[#6d4c41] bg-[#5d4037] px-6 py-3 shadow-lg">
          <Text className="text-center font-poppins-bold text-2xl tracking-wide text-[#f5f5f5]">
            Mga Piling Kabanata
          </Text>
        </View>
      </View>

      {/* White Scrollable Container */}
      <View className="mx-4 flex-1 overflow-hidden rounded-t-[30px] bg-[#efede6] shadow-2xl">
        <ScrollView
          className="flex-1 px-5 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          {chapters.map((chapter) => {
            const isRead = readChapters.includes(chapter.id);
            return (
              <View key={chapter.id} className="mb-8 bg-transparent">
                {/* Chapter Image Card */}
                <View className="mb-3 h-40 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-300 shadow-sm">
                  <Image source={chapter.image} className="h-full w-full" resizeMode="cover" />
                  {isRead && (
                    <View className="absolute right-2 top-2 h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#4f2b21]">
                      <FontAwesome5 name="check" size={20} color="#97EF4B" />
                    </View>
                  )}
                </View>

                {/* Chapter Tag (e.g. KABANATA I) */}
                <View className="mb-1 self-start rounded-sm bg-[#4e342e] px-3 py-1">
                  <Text className="font-poppins text-[10px] font-bold uppercase tracking-widest text-[#e8d4b0]">
                    {chapter.tag}
                  </Text>
                </View>

                {/* Chapter Title */}
                <Text className="mb-3 font-poppins-bold text-2xl leading-tight text-black">
                  {chapter.title}
                </Text>

                {/* Action Button */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleRead(chapter)}
                  className={`flex-row items-center justify-center rounded-full py-3 shadow-md active:opacity-90 ${isRead ? 'bg-[#5d4037]' : 'bg-[#4f2b21]'}`}>
                  <Ionicons
                    name={isRead ? 'book' : 'book-outline'}
                    size={18}
                    color="#FFFFFF"
                    className="px-2"
                  />
                  <Text className="font-poppins-bold text-sm tracking-wide text-white">
                    {isRead ? 'Basahin Muli at Sagutin' : 'Basahin at Sagutin ang Nobela'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      <StatusBar style="light" backgroundColor="#4f2b21" />
    </View>
  );
}
