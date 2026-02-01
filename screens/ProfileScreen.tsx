import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Modal, ScrollView, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import { getUser, getAllAnswers, clearAllData } from '../services/db';

const getTotalQuestions = () => {
  return 36;
};

export default function ProfileScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [user, setUser] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [formattedAnswers, setFormattedAnswers] = useState('');
  const [progress, setProgress] = useState(0);
  const totalQuestions = getTotalQuestions();

  useEffect(() => {
    const loadData = async () => {
      const userData = await getUser();
      setUser(userData);
      if (userData) {
        const allAnswers = await getAllAnswers();
        setAnswers(allAnswers);
        const progressPercentage =
          allAnswers.length > 0 ? (allAnswers.length / totalQuestions) * 100 : 0;
        setProgress(progressPercentage);
      }
    };
    if (isFocused) {
      loadData();
    }
  }, [isFocused, totalQuestions]);

  const formatAnswers = (range: '1-3' | '4-6') => {
    let formattedString = `Nakuha ni: ${user.name}\nGrade at Seksyon: ${user.grade} - ${user.section}\n\n`;

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

  const handleExport = (range: '1-3' | '4-6') => {
    const answersText = formatAnswers(range);
    setFormattedAnswers(answersText);
    setModalVisible(true);
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
            <Text className="mb-2 font-poppins-bold text-[#4a342e]">Aking Progreso</Text>
            <View className="h-4 w-full rounded-full bg-gray-200">
              <View style={{ width: `${progress}%` }} className="h-4 rounded-full bg-[#3e2723]" />
            </View>
            <Text className="mt-1 text-right font-poppins text-xs text-gray-500">
              {answers.length} out of {totalQuestions} na nasagutan
            </Text>
          </View>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => handleExport('1-3')}
              className="mr-2 mt-4 flex-1 items-center rounded-full bg-[#3e2723] py-3 shadow-lg active:opacity-80">
              <Text className="font-poppins-bold uppercase tracking-widest text-[#e8d4b0]">
                Gawain 1-3
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleExport('4-6')}
              className="ml-2 mt-4 flex-1 items-center rounded-full bg-[#3e2723] py-3 shadow-lg active:opacity-80">
              <Text className="font-poppins-bold uppercase tracking-widest text-[#e8d4b0]">
                Gawain 4-6
              </Text>
            </TouchableOpacity>
          </View>

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
