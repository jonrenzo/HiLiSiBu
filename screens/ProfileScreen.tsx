import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ScrollView, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import { useAuth } from '../src/hooks/useAuth';
import {
  getChapterProgress,
  getAllTalasalitaanAnswers,
  getAllActivityAnswers,
} from '../src/services/supabase';
import type { ChapterProgress, TalasalitaanAnswer, ActivityAnswer } from '../src/services/supabase';
import { chaptersData } from '../data/chaptersData';

const getTotalQuestions = () => {
  return 36 + 26;
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user, profile, signOut } = useAuth();

  const [answers, setAnswers] = useState<ActivityAnswer[]>([]);
  const [talasalitaanAnswers, setTalasalitaanAnswers] = useState<TalasalitaanAnswer[]>([]);
  const [isQRModalVisible, setQRModalVisible] = useState(false);
  const [formattedAnswers, setFormattedAnswers] = useState('');
  const [allAnswers, setAllAnswers] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [readProgress, setReadProgress] = useState({ read: 0, total: 0 });

  const totalQuestions = getTotalQuestions();
  const studentName = profile?.name || 'User';

  const loadData = useCallback(async () => {
    if (!user || !user.id || user.id === 'undefined') {
      console.log('No valid user session');
      return;
    }

    try {
      const userId = user.id;
      console.log('Loading profile data for userId:', userId, typeof userId);

      const chapterProgress: ChapterProgress[] = await getChapterProgress(userId);
      const readChaptersList = chapterProgress.filter((p) => p.is_read).map((p) => p.chapter_id);
      const totalChapters = chaptersData.length;
      setReadProgress({ read: readChaptersList.length, total: totalChapters });

      const allTalasalitaan = await getAllTalasalitaanAnswers(userId);
      setTalasalitaanAnswers(allTalasalitaan);

      const allActivities = await getAllActivityAnswers(userId);
      setAnswers(allActivities);

      const totalAnswered = allActivities.length + allTalasalitaan.length;
      const progressPercentage = totalAnswered > 0 ? (totalAnswered / totalQuestions) * 100 : 0;
      setProgress(progressPercentage);

      let readableAnswers = `User: ${studentName}\nGrade: ${profile?.grade || '-'}\nSection: ${profile?.section || '-'}\n\n`;

      if (allTalasalitaan.length > 0) {
        readableAnswers += '--- Talasalitaan Answers ---\n\n';
        allTalasalitaan.forEach((ans) => {
          readableAnswers += `Kabanata ${ans.chapter_id} (${ans.quiz_type}): Score: ${ans.score}\n`;
          if (typeof ans.answers === 'object' && ans.answers !== null) {
            for (const key in ans.answers) {
              readableAnswers += `  ${key}: ${ans.answers[key]}\n`;
            }
          }
          readableAnswers += '\n';
        });
      }

      setAllAnswers(readableAnswers);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }, [user, studentName, profile?.grade, profile?.section, totalQuestions]);

  useEffect(() => {
    if (isFocused && user) {
      loadData();
    }
  }, [isFocused, user, loadData]);

  const handleLogout = () => {
    Alert.alert('Logout', 'Sigurado ka bang nais mong mag-logout?', [
      { text: 'Kanselahin', style: 'cancel' },
      {
        text: 'Oo, Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          } catch (error) {
            console.error('Logout Error:', error);
            Alert.alert('Error', 'Hindi nagawang mag-logout.');
          }
        },
      },
    ]);
  };

  const handleShowQRCode = () => {
    setQRModalVisible(true);
  };

  const handleCopy = () => {
    if (allAnswers) {
      Clipboard.setString(allAnswers);
      Alert.alert('Kinopya!', 'Ang mga sagot ay kinopya sa iyong clipboard.');
    }
  };

  return (
    <View className="flex-1 bg-[#4a342e]">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="mt-4 flex-1 rounded-t-[30px] bg-[#efede6] p-6 pb-28">
          <View className="mb-8 mt-4 items-center">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full border-4 border-[#8B4513] bg-[#4a342e]">
              <Text className="font-serif text-4xl text-[#e8d4b0]">
                {studentName?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text className="font-poppins-bold text-2xl text-[#4a342e]">{studentName}</Text>
            <Text className="font-poppins text-[#4a342e] opacity-70">
              {profile?.role === 'teacher' ? 'Guro' : 'Mag-aaral'} • {profile?.grade || '-'} -{' '}
              {profile?.section || '-'}
            </Text>
          </View>

          <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="mb-2 font-poppins-bold text-[#4a342e]">Nabasa na Kabanata</Text>
            <View className="h-4 w-full rounded-full bg-gray-200">
              <View
                style={{
                  width: `${readProgress.total > 0 ? (readProgress.read / readProgress.total) * 100 : 0}%`,
                }}
                className="h-4 rounded-full bg-[#3e2723]"
              />
            </View>
            <Text className="mt-1 text-right font-poppins text-xs text-gray-500">
              {readProgress.read} out of {readProgress.total} na kabanata ang nabasa
            </Text>
          </View>

          <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="mb-2 font-poppins-bold text-[#4a342e]">Aking Progreso</Text>
            <View className="h-4 w-full rounded-full bg-gray-200">
              <View style={{ width: `${progress}%` }} className="h-4 rounded-full bg-[#3e2723]" />
            </View>
            <Text className="mt-1 text-right font-poppins text-xs text-gray-500">
              {answers.length + talasalitaanAnswers.length} out of {totalQuestions} na nasagutan
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleShowQRCode}
            className="mt-4 items-center rounded-full bg-[#8d6e63] py-3 shadow-lg active:opacity-80">
            <Text className="font-poppins-bold uppercase tracking-widest text-white">
              Ipakita ang QR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            className="mt-4 items-center rounded-full bg-[#b71c1c] py-3 shadow-lg active:opacity-80">
            <Text className="font-poppins-bold uppercase tracking-widest text-white">Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isQRModalVisible}
        onRequestClose={() => setQRModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 p-8">
          <View className="w-full max-w-lg items-center rounded-lg bg-white p-6">
            <Text className="mb-4 font-poppins-bold text-lg">Lahat ng mga Sagot</Text>
            {allAnswers && (
              <View className="rounded-lg bg-white p-4">
                <ScrollView style={{ maxHeight: 300 }}>
                  <Text className="font-poppins text-xs">{allAnswers}</Text>
                </ScrollView>
              </View>
            )}
            <View className="mt-4 flex-row justify-around">
              <TouchableOpacity onPress={handleCopy} className="rounded-full bg-blue-500 px-6 py-2">
                <Text className="font-poppins-bold text-white">Kopyahin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setQRModalVisible(false)}
                className="rounded-full bg-[#3e2723] px-6 py-2">
                <Text className="font-poppins-bold text-white">Isara</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" backgroundColor="#4a342e" />
    </View>
  );
}
