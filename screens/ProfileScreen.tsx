import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ScrollView, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import {
  getUser,
  getAllAnswers,
  clearAllData,
  getAllTalasalitaanAnswers,
  getReadChapters,
} from '../services/db';
import QRCode from 'react-native-qrcode-svg';
import { activityQuestions } from '../data/questions';
import { chaptersData } from '../data/chaptersData';

const getTotalQuestions = () => {
  return 36 + 26; // 36 from activities + 26 from talasalitaan
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [user, setUser] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [talasalitaanAnswers, setTalasalitaanAnswers] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isQRModalVisible, setQRModalVisible] = useState(false);
  const [formattedAnswers, setFormattedAnswers] = useState('');
  const [allAnswers, setAllAnswers] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [readProgress, setReadProgress] = useState({ read: 0, total: 0 });

  const totalQuestions = getTotalQuestions();

  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      setUser(userData);

      // Chapter Read Progress
      const readChaptersList = await getReadChapters();
      const totalChapters = chaptersData.length;
      setReadProgress({ read: readChaptersList.length, total: totalChapters });

      if (userData) {
        const allAnswersData = await getAllAnswers();
        setAnswers(allAnswersData);
        const allTalasalitaanAnswersData = await getAllTalasalitaanAnswers();
        setTalasalitaanAnswers(allTalasalitaanAnswersData);
        const totalAnswered = allAnswersData.length + allTalasalitaanAnswersData.length;
        const progressPercentage = totalAnswered > 0 ? (totalAnswered / totalQuestions) * 100 : 0;
        setProgress(progressPercentage);

        let readableAnswers = `User: ${userData.name}\nGrade: ${userData.grade}\nSection: ${userData.section}\n\n`;

        if (allAnswersData.length > 0) {
          readableAnswers += '--- Activity Answers ---\n\n';
          const groupedAnswers = allAnswersData.reduce((acc, ans) => {
            const activity = activityQuestions[ans.activity_id];
            if (!activity) return acc;

            if (!acc[ans.activity_id]) {
              acc[ans.activity_id] = {
                name: activity.name,
                answers: [],
              };
            }
            // For Pagsisiyasat-04-06, question_index can be a string key (e.g., 'case1_suspect1')
            const questionIdentifier = isNaN(ans.question_index)
              ? ans.question_index
              : ans.question_index;

            acc[ans.activity_id].answers.push({
              question: questionIdentifier,
              answer: ans.selected_answer,
            });
            return acc;
          }, {});

          for (const activityId in groupedAnswers) {
            const activity = groupedAnswers[activityId];
            readableAnswers += `Gawain: ${activity.name}\n`;
            activity.answers.forEach((ans) => {
              readableAnswers += `  ${ans.question} : ${ans.answer} \n`;
            });
            readableAnswers += '\n';
          }
        }

        if (allTalasalitaanAnswersData.length > 0) {
          readableAnswers += '--- Talasalitaan Answers ---\n\n';
          allTalasalitaanAnswersData.forEach((ans) => {
            readableAnswers += `Kabanata ${ans.chapter_id} (${ans.quiz_type}):\n`;
            // Simplify talasalitaan answers to just key-value pairs if it's an object
            if (typeof ans.answers === 'object' && ans.answers !== null) {
              for (const key in ans.answers) {
                readableAnswers += `  ${key}: ${ans.answers[key]}\n`;
              }
            } else {
              readableAnswers += `${ans.answers}\n`; // Fallback for non-object answers
            }
            readableAnswers += '\n';
          });
        }
        setAllAnswers(readableAnswers);
      }
    };
    if (isFocused) {
      loadData();
    }
  }, [isFocused, totalQuestions]);

  const formatAnswers = (range: '1-3' | '4-6' | 'talasalitaan') => {
    let formattedString = `Nakuha ni: ${user.name}\nGrade at Seksyon: ${user.grade} - ${user.section}\n\n`;

    if (range === 'talasalitaan') {
      if (talasalitaanAnswers.length === 0) {
        return 'Walang mga sagot para sa talasalitaan.';
      }
      formattedString += `--- TALASALITAAN ---\n`;
      talasalitaanAnswers.forEach((ans) => {
        formattedString += `Kabanata ${ans.chapter_id} (${ans.quiz_type}):\n${JSON.stringify(
          ans.answers,
          null,
          2
        )}\n\n`;
      });
      return formattedString;
    }

    const filteredAnswers = answers.filter((ans) => {
      const answerRange = ans.activity_id.split('-').slice(1).join('-');
      if (range === '1-3') {
        return answerRange === '01-03';
      }
      if (range === '4-6') {
        return answerRange === '04-06';
      }
      return false;
    });

    if (filteredAnswers.length === 0) {
      return 'Walang mga sagot para sa gawaing ito.';
    }

    let currentActivity = '';
    filteredAnswers.forEach((answer) => {
      const activityType = answer.activity_id.split('-')[0];
      if (currentActivity !== activityType) {
        currentActivity = activityType;
        formattedString += `\n--- ${currentActivity.toUpperCase()} ---\n`;
      }
      formattedString += `${answer.selected_answer}\n`;
    });

    return formattedString;
  };

  const handleExport = (range: '1-3' | '4-6' | 'talasalitaan') => {
    const answersText = formatAnswers(range);
    setFormattedAnswers(answersText);
    setModalVisible(true);
  };

  const handleShowQRCode = () => {
    setQRModalVisible(true);
  };

  const handleCopy = () => {
    Clipboard.setString(formattedAnswers);
    Alert.alert('Kinopya!', 'Ang mga sagot ay kinopya sa iyong clipboard.');
  };

  const handleClearData = () => {
    Alert.alert(
      'Burahin ang Data',
      'Sigurado ka bang nais mong burahin ang lahat ng iyong mga sagot at iskor? Hindi na ito maibabalik.',
      [
        { text: 'Kanselahin', style: 'cancel' },
        {
          text: 'Oo, Burahin',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Registration' }],
                })
              );
            } catch (error) {
              console.error('Clear Data Error:', error);
              Alert.alert('Error', 'Hindi nabura ang data. Subukan muli.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-[#4a342e]">
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="mt-4 flex-1 rounded-t-[30px] bg-[#efede6] p-6 pb-28">
          <View className="mb-8 mt-4 items-center">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full border-4 border-[#8B4513] bg-[#4a342e]">
              <Text className="font-serif text-4xl text-[#e8d4b0]">
                {user?.name?.charAt(0) || 'U'}
              </Text>
            </View>
            <Text className="font-poppins-bold text-2xl text-[#4a342e]">
              {user?.name || 'User'}
            </Text>
            <Text className="font-poppins text-[#4a342e] opacity-70">
              {user?.grade} - {user?.section}
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
            <Text className="mb-2 font-poppins-bold text-[#4a342e]">Aking Progreso (Gawain)</Text>
            <View className="h-4 w-full rounded-full bg-gray-200">
              <View style={{ width: `${progress}%` }} className="h-4 rounded-full bg-[#3e2723]" />
            </View>
            <Text className="mt-1 text-right font-poppins text-xs text-gray-500">
              {answers.length + talasalitaanAnswers.length} out of {totalQuestions} na nasagutan
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => handleExport('talasalitaan')}
            className="mt-4 items-center rounded-full bg-[#3e2723] py-3 shadow-lg active:opacity-80">
            <Text className="font-poppins-bold uppercase tracking-widest text-[#e8d4b0]">
              Talasalitaan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShowQRCode}
            className="mt-4 items-center rounded-full bg-[#8d6e63] py-3 shadow-lg active:opacity-80">
            <Text className="font-poppins-bold uppercase tracking-widest text-white">
              Ipakita ang QR
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClearData}
            className="mt-4 items-center rounded-full bg-[#b71c1c] py-3 shadow-lg active:opacity-80">
            <Text className="font-poppins-bold uppercase tracking-widest text-white">
              Burahin ang Data
            </Text>
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
                <QRCode value={allAnswers} size={200} />
              </View>
            )}
            <TouchableOpacity
              onPress={() => setQRModalVisible(false)}
              className="mt-6 rounded-full bg-[#3e2723] px-8 py-3">
              <Text className="font-poppins-bold text-white">Isara</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/50 p-8">
          <View className="w-full max-w-lg rounded-lg bg-white p-6">
            <Text className="mb-4 font-poppins-bold text-lg">Iyong mga Sagot</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              <Text className="font-poppins text-sm">{formattedAnswers}</Text>
            </ScrollView>
            <View className="mt-6 flex-row justify-around">
              <TouchableOpacity onPress={handleCopy} className="rounded-full bg-blue-500 px-8 py-3">
                <Text className="font-poppins-bold text-white">Kopyahin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="rounded-full bg-[#3e2723] px-8 py-3">
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
