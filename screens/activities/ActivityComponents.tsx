import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, Animated, Modal, Easing } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { getUser, saveAnswer, saveScore, getAnswers } from '../../services/db';

// ==================================================
// 1. PAGHIHINUHA (Inference) - Character Analysis (Kabanata 1-3)
// ==================================================
export const Paghihinuha = ({ rangeId }: { rangeId: string }) => {
  const allCharacters = [
    {
      id: 1,
      name: 'Ibarra',
      question:
        'Batay sa kanyang kasuotan at ekspresyon, paano mo ilalarawan ang kanyang papel sa lipunang ginagalawan niya?',
      image: require('../../assets/images/ibarra.png'),
    },
    {
      id: 2,
      name: 'Maria Clara',
      question:
        'Ano ang ipinapakita ng kanyang postura kung siya ba ay mahinhin, mahiyain, o matapang? Ipaliwanag.',
      image: require('../../assets/images/maria.png'),
    },
    {
      id: 3,
      name: 'Padre Damaso',
      question:
        'Tingnan ang ekspresyon ng pari. Sa iyong palagay, siya ba ay isang prayleng mapagpakumbaba o isang taong madaling magalit? Bakit?',
      image: require('../../assets/images/damaso.png'),
    },
    {
      id: 4,
      name: 'Tiya Isabel',
      question:
        'Batay sa kanyang postura, paano mo ilalarawan ang katangian na namamayani sa kanya?',
      image: require('../../assets/images/pia.png'),
    },
    {
      id: 5,
      name: 'Teniente',
      question:
        'Ano ang maaaring ipahiwatig ng kanyang ekspresyon sa mata o mukha tungkol sa kanyang pag-iisip o damdamin?',
      image: require('../../assets/images/tiago.png'),
    },
    {
      id: 6,
      name: 'Matandang Babae',
      question:
        'Batay sa kaniyang pananamit, anong hinuha ang mabubuo mo tungkol sa kaniyang katayuan sa lipunan at ang kaniyang partikular na tungkulin sa loob ng pamilya?',
      image: require('../../assets/images/tiya.png'),
    },
  ];

  const activityId = `paghihinuha-${rangeId}`;

  // State management
  const [availableCharacters, setAvailableCharacters] = useState(allCharacters);
  const [clawedCharacter, setClawedCharacter] = useState(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isClawing, setIsClawing] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState<{ [key: number]: string }>({});

  // Animation values
  const clawY = useRef(new Animated.Value(0)).current;
  const clawRotate = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const characterPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadProgress();
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const loadProgress = async () => {
    // Uncomment when integrating with your backend
    // const savedAnswers = await getAnswers(activityId);
    // const answersMap = savedAnswers.reduce((acc, item) => {
    //   acc[item.question_index] = item.selected_answer;
    //   return acc;
    // }, {});
    // setSavedAnswers(answersMap);
    // const completedIds = Object.keys(answersMap).map(Number);
    // setAvailableCharacters(allCharacters.filter(c => !completedIds.includes(c.id)));
    // setCompletedCount(completedIds.length);
  };

  const handleClawClick = () => {
    if (availableCharacters.length === 0) {
      Alert.alert('Tapos na!', 'Nakuha mo na ang lahat ng karakter!');
      return;
    }

    if (isClawing) return;

    setIsClawing(true);

    // Claw animation sequence
    Animated.sequence([
      // Move down
      Animated.parallel([
        Animated.timing(clawY, {
          toValue: 200,
          duration: 1500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(clawRotate, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Grab pause
      Animated.delay(500),
      // Move up with character
      Animated.parallel([
        Animated.timing(clawY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(clawRotate, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Randomly select a character
      const randomIndex = Math.floor(Math.random() * availableCharacters.length);
      const selected = availableCharacters[randomIndex];

      setClawedCharacter(selected);
      setIsClawing(false);

      // Animate character appearance
      Animated.sequence([
        Animated.timing(characterPulse, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(characterPulse, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowQuestionModal(true);
      });
    });
  };

  const handleSaveAnswer = async () => {
    if (!currentAnswer.trim()) {
      Alert.alert('Kulang', 'Mangyaring sagutin ang tanong.');
      return;
    }

    try {
      // Uncomment when integrating with backend
      // const user = await getUser();
      // if (!user) {
      //   Alert.alert('Error', 'Hindi mahanap ang user.');
      //   return;
      // }

      // await saveAnswer(activityId, clawedCharacter.id, currentAnswer, false);

      // Update local state
      setSavedAnswers((prev) => ({
        ...prev,
        [clawedCharacter.id]: currentAnswer,
      }));

      // Remove character from available pool
      setAvailableCharacters((prev) =>
        prev.filter((char) => char.id !== clawedCharacter.id)
      );

      const newCount = completedCount + 1;
      setCompletedCount(newCount);

      // await saveScore(user.id, activityId, newCount);

      // Reset and close modal
      setCurrentAnswer('');
      setShowQuestionModal(false);
      setClawedCharacter(null);

      // Check if all completed
      if (newCount === allCharacters.length) {
        Alert.alert(
          '🎉 Binabati kita!',
          'Natapos mo na ang lahat ng mga karakter! Mahusay!',
          [{ text: 'Salamat!' }]
        );
      } else {
        Alert.alert('✓ Galing!', 'Nakuha mo ang karakter! Kumuha ng isa pa.', [
          { text: 'Sige' },
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'May problema sa pag-save ng sagot.');
      console.error(error);
    }
  };

  const handleSkipCharacter = () => {
    Alert.alert(
      'Laktawan?',
      'Sigurado ka bang gusto mong laktawan ang karakterng ito? Maaari mo pa itong makuha mamaya.',
      [
        { text: 'Hindi', style: 'cancel' },
        {
          text: 'Oo',
          onPress: () => {
            setCurrentAnswer('');
            setShowQuestionModal(false);
            setClawedCharacter(null);
          },
        },
      ]
    );
  };

  const spin = clawRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex-1 pb-8">
      {/* Header Section */}
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <FontAwesome5 name="search" size={20} color="#3e2723" />
          <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">
            Paghihinuha
          </Text>
        </View>
        <View className="rounded-full bg-[#3e2723] px-4 py-2 shadow-md">
          <Text className="font-poppins-bold text-sm text-white">
            {completedCount}/{allCharacters.length}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      <View className="mb-4 rounded-xl bg-[#f5e6d3] p-4 shadow-sm">
        <Text className="text-justify font-poppins text-xs leading-5 text-[#3e2723]">
          <Text className="font-poppins-bold">Panuto: </Text>
          Pindutin ang pulang bilog sa gitna upang simulan ang gawain. Pagmasdan
          ang mabuti ang anyo, pananamit, at ekspresyon ng mga karakter sa
          larawan. Gamit ang mga detalyang ito, maghigay ng iyong hinuha tungkol
          sa kanilang pagkatao at maaaring papel sa nobela.
        </Text>
      </View>

      {/* Claw Machine Container */}
      <View className="items-center rounded-2xl bg-gradient-to-b from-[#cba294] to-[#b08968] p-6 shadow-xl">
        {/* Machine Frame */}
        <View className="w-full rounded-t-xl border-4 border-[#3e2723] bg-[#8d6e63] p-2">
          <View className="h-64 rounded-lg border-2 border-[#d4af37] bg-[#f5e6d3]/30">
            {/* Claw System */}
            <View className="absolute left-1/2 top-0 -ml-8 items-center">
              <Animated.View
                style={{
                  transform: [{ translateY: clawY }, { rotate: spin }],
                }}
                className="items-center">
                {/* Cable */}
                <View className="w-1 bg-[#424242]" style={{ height: 40 }} />
                {/* Claw mechanism */}
                <View className="relative h-20 w-20 items-center justify-center">
                  {/* You can replace this with an actual claw image */}
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-[#757575] shadow-lg">
                    <FontAwesome5 name="hand-rock" size={24} color="#3e2723" />
                  </View>
                  {/* Grabbed character preview during animation */}
                  {isClawing && clawY._value > 100 && clawedCharacter && (
                    <View className="absolute -bottom-16 h-12 w-12 overflow-hidden rounded-full border-2 border-white">
                      <Image
                        source={clawedCharacter.image}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                  )}
                </View>
              </Animated.View>
            </View>

            {/* Character Pool Display */}
            <View className="absolute bottom-4 left-0 right-0 items-center">
              <View className="flex-row flex-wrap justify-center px-4">
                {availableCharacters.slice(0, 6).map((char, index) => (
                  <View
                    key={char.id}
                    className="m-1 h-14 w-14 overflow-hidden rounded-full border-2 border-[#d4af37] bg-white shadow-md"
                    style={{
                      opacity: isClawing ? 0.5 : 1,
                    }}>
                    <Image
                      source={char.image}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Control Panel */}
        <View className="mt-4 w-full items-center rounded-b-xl border-4 border-t-0 border-[#3e2723] bg-[#8d6e63] p-4">
          <Animated.View
            style={{
              transform: [{ scale: isClawing ? 1 : pulseAnim }],
            }}>
            <TouchableOpacity
              onPress={handleClawClick}
              disabled={isClawing || availableCharacters.length === 0}
              className={`h-24 w-24 items-center justify-center rounded-full shadow-xl ${
                isClawing
                  ? 'bg-gray-400'
                  : availableCharacters.length === 0
                    ? 'bg-gray-500'
                    : 'bg-red-600'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 8,
              }}>
              <FontAwesome5
                name={isClawing ? 'spinner' : 'play'}
                size={32}
                color="white"
              />
              <Text className="mt-1 font-poppins-bold text-xs text-white">
                {isClawing ? 'KUMUHA...' : 'SIMULA'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Status Display */}
          <View className="mt-4 rounded-lg bg-[#3e2723] px-6 py-2">
            <Text className="text-center font-poppins text-xs text-white">
              Natitirang Karakter: {availableCharacters.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Question Modal */}
      <Modal
        visible={showQuestionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSkipCharacter}>
        <View className="flex-1 items-center justify-center bg-black/70 px-4">
          <Animated.View
            style={{
              transform: [{ scale: characterPulse }],
            }}
            className="w-full max-w-md">
            <View className="rounded-2xl bg-white p-6 shadow-2xl">
              {/* Character Header */}
              {clawedCharacter && (
                <>
                  <View className="mb-4 items-center">
                    <View className="mb-3 h-28 w-28 overflow-hidden rounded-full border-4 border-[#d4af37] shadow-lg">
                      <Image
                        source={clawedCharacter.image}
                        className="h-full w-full"
                        resizeMode="cover"
                      />
                    </View>
                    <View className="rounded-full bg-[#3e2723] px-4 py-1">
                      <Text className="font-serif text-lg font-bold text-white">
                        {clawedCharacter.name}
                      </Text>
                    </View>
                  </View>

                  {/* Question */}
                  <View className="mb-4 rounded-xl bg-[#f5e6d3] p-4">
                    <View className="mb-2 flex-row items-center">
                      <FontAwesome5 name="question-circle" size={16} color="#3e2723" />
                      <Text className="ml-2 font-poppins-bold text-sm text-[#3e2723]">
                        Tanong:
                      </Text>
                    </View>
                    <Text className="text-justify font-poppins text-sm leading-5 text-black">
                      {clawedCharacter.question}
                    </Text>
                  </View>

                  {/* Answer Input */}
                  <View className="mb-4">
                    <View className="mb-2 flex-row items-center">
                      <FontAwesome5 name="pen" size={14} color="#3e2723" />
                      <Text className="ml-2 font-poppins-bold text-sm text-[#3e2723]">
                        Iyong Sagot:
                      </Text>
                    </View>
                    <TextInput
                      className="min-h-[120px] rounded-xl border-2 border-[#3e2723] bg-white p-3 font-poppins text-sm text-[#3e2723]"
                      placeholder="Isulat ang iyong paghihinuha dito..."
                      placeholderTextColor="#bcaaa4"
                      multiline
                      textAlignVertical="top"
                      value={currentAnswer}
                      onChangeText={setCurrentAnswer}
                    />
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row justify-between space-x-2">
                    <TouchableOpacity
                      onPress={handleSkipCharacter}
                      className="flex-1 items-center rounded-full border-2 border-[#3e2723] bg-white py-3 shadow-sm">
                      <Text className="font-poppins-bold text-[#3e2723]">
                        Laktawan
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveAnswer}
                      className="flex-1 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3 shadow-md">
                      <FontAwesome5 name="save" size={16} color="white" />
                      <Text className="ml-2 font-poppins-bold text-white">
                        I-save
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

// ==================================================
// 2. PAGSISIYASAT (Investigation) - PLACEHOLDER
// ==================================================
export const Pagsisiyasat = ({ rangeId }: { rangeId: string }) => {
  const questions = [
    {
      id: 1,
      text: 'Batay sa mga naging pahayag at kilos ng mga panauhin sa piging na idinaos ni Kapitan Tiago. Paano mo mapatutunayan na mayroong hindi pantay na katayuan sa lipunan ang mga tauhang naroon? Magbigay ng mga tiyak na patunay mula sa kabanata upang suportahan ang iyong ideya.',
    },
    {
      id: 2,
      text: 'Paano inilalarawan sa teksto ang pagtrato kay Ibarra, at ano ang ipinahihiwatig nito tungkol sa umiiral na sistema ng kapangyarihan?',
    },
    {
      id: 3,
      text: 'Paano inilalarawan sa nobela ang mga gawi at pamamaraan ng mga prayle, at sa iyong pagsusuri, masasabi mo bang makatarungan ang mga ito? Patunayan ang iyong sagot gamit ang mga sitwasyon at implikasyon ipinakita sa akda.',
    },
    {
      id: 4,
      text: 'Paano nahahayag ang tunay na pagkatao ni Crisostomo Ibarra sa Kabanata 2 sa pamamagitan ng kanyang pananalita at pakikitungo sa bawat taong kanyang nakasalamuha?',
    },
    {
      id: 5,
      text: 'Paano masasabing ang handaan sa bahay ni Kapitan Tiago ay isang maliit na salamin ng lipunang Pilipino noong panahon ng Espanyol? Magbigay ng mga patunay mula sa kabanata na nagpapakita ng ugnayan ng kapangyarihan sa pagitan ng pamahalaan at simbahan',
    },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const activityId = `pagsisiyasat-${rangeId}`;

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getAnswers(activityId);
      const answersMap = savedAnswers.reduce((acc, item) => {
        acc[item.question_index] = item.selected_answer;
        return acc;
      }, {});
      setAnswers(answersMap);
    };
    loadAnswers();
  }, [activityId]);

  const handleAnswerChange = (id: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleSave = async () => {
    const user = await getUser();
    if (!user) {
      Alert.alert('Error', 'Hindi mahanap ang user.');
      return;
    }

    let score = 0;

    for (const q of questions) {
      const answer = answers[q.id];
      if (answer) {
        await saveAnswer(activityId, q.id, answer, false);
        score++;
      }
    }

    await saveScore(user.id, activityId, score);
    Alert.alert('Galing!', 'Ang iyong mga sagot ay nai-save na.');
  };

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <FontAwesome5 name="eye" size={20} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Pagsisiyasat</Text>
      </View>

      {/* Questions Loop */}
      {questions.map((q) => (
        <View key={q.id} className="mb-6 flex-row items-start">
          {/* Left: Wooden Door Graphic (CSS-based to avoid missing assets) */}
          <View className="mr-3 items-center">
            <View className="relative h-24 w-16 items-center justify-center rounded-sm border-2 border-[#3e2723] bg-[#8d6e63] shadow-md">
              {/* Door Panels/Detail */}
              <View className="absolute h-20 w-12 border border-dashed border-[#5d4037] opacity-50" />

              {/* Door Knob */}
              <View className="absolute right-2 top-12 h-2 w-2 rounded-full bg-yellow-400 shadow-sm" />

              {/* Number Badge */}
              <View className="h-8 w-8 items-center justify-center rounded-full border border-yellow-400 bg-black/30 p-2">
                <Text className="font-poppins text-2xl font-bold" style={{ color: '#FFD700' }}>
                  {q.id}
                </Text>
              </View>
            </View>
          </View>

          {/* Right: Question & Answer Area */}
          <View className="flex-1">
            {/* Question Bubble */}
            <View className="relative mb-2 rounded-xl border-2 border-[#3e2723] bg-white p-3 shadow-sm">
              {/* Little triangle pointing to door */}
              <View className="absolute -left-2 top-8 h-4 w-4 rotate-45 border-b-2 border-l-2 border-[#3e2723] bg-white" />

              <Text className="text-justify font-poppins text-[10px] leading-4 text-[#3e2723]">
                {q.text}
              </Text>
            </View>

            {/* Answer Input Area (Added as requested) */}
            <View className="rounded-lg border border-[#bcaaa4] bg-[#efede6] p-2">
              <TextInput
                placeholder="Isulat ang iyong sagot dito..."
                placeholderTextColor="#a1887f"
                multiline
                className="min-h-[60px] font-poppins text-xs text-[#3e2723]"
                textAlignVertical="top"
                onChangeText={(text) => handleAnswerChange(q.id, text)}
                value={answers[q.id] || ''}
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3">
        <FontAwesome5 name="save" size={16} color="white" />
        <Text className="ml-2 font-poppins-bold text-white">I-save ang mga Sagot</Text>
      </TouchableOpacity>
    </View>
  );
};

// ==================================================
// 3. PAGLILINAW (Clarification) - PLACEHOLDER
// ==================================================
export const Paglilinaw = ({ rangeId }: { rangeId: string }) => {
  const characters = [
    {
      id: 1,
      // Ensure you have this image asset
      image: require('../../assets/images/tiago.png'),
      question:
        'Sang-ayon ka ba na si Kapitan Tiago ay maituturing na isang "oportunista" dahil sa kanyang pakikipag-ugnayan sa kapwa makapangyarihang prayle at opisyal ng pamahalaan upang mapanatili ang kanyang sariling interes?',
    },
    {
      id: 2,
      image: require('../../assets/images/ibarra.png'),
      question:
        'Sa iyong palagay, ang kawalan ba ng marahas na reaksyon ni Ibarra ay tanda ng kanyang pagiging edukado, o maaari itong tingnan bilang isang estratehikong pag-iwas sa gulo?',
    },
    {
      id: 3,
      // You might need to add a 'sibyla.png' or use a placeholder
      image: require('../../assets/images/hernando.png'), // Using Damaso as placeholder if Sibyla missing
      question:
        'Sang-ayon ka ba kay Padre Sibyla nang palihim niyang pinupuna o sinusuri ang mga kilos ni Ibarra sa halip na harapin ito nang direkta, na nagpapakita ng kanyang pagiging maingat at mapanuri?',
    },
    {
      id: 4,
      // You might need to add 'rafael.png'
      image: require('../../assets/images/don.png'), // Using Ibarra as placeholder if Rafael missing
      question:
        'Sa iyong pagsusuri, maaari mo bang ipaliwanag kung paanong ang matibay na prinsipyo at sariling paninindigan ni Don Rafael ang naging pangunahing mitsa ng kanyang tunggalian sa mga makapangyarihan sa San Diego?',
    },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const activityId = `paglilinaw-${rangeId}`;

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getAnswers(activityId);
      const answersMap = savedAnswers.reduce((acc, item) => {
        acc[item.question_index] = item.selected_answer;
        return acc;
      }, {});
      setAnswers(answersMap);
    };
    loadAnswers();
  }, [activityId]);

  const handleAnswerChange = (id: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleSave = async () => {
    const user = await getUser();
    if (!user) {
      Alert.alert('Error', 'Hindi mahanap ang user.');
      return;
    }

    let score = 0;

    for (const char of characters) {
      const answer = answers[char.id];
      if (answer) {
        await saveAnswer(activityId, char.id, answer, false);
        score++;
      }
    }

    await saveScore(user.id, activityId, score);
    Alert.alert('Galing!', 'Ang iyong mga sagot ay nai-save na.');
  };

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-2 flex-row items-center">
        <MaterialCommunityIcons name="file-document-edit-outline" size={24} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Paglilinaw</Text>
      </View>

      <Text className="mb-1 font-poppins-bold text-lg text-black">Sino sila?</Text>

      <Text className="mb-6 text-justify font-poppins text-xs leading-4 text-[#5d4037]">
        <Text className="font-bold">Panuto:</Text> Tukuyin ang katangiang ipinakikita ng bawat
        tauhan at bigyang katuwiran ang mga ito.
      </Text>

      {/* Character Loop */}
      {characters.map((char) => (
        <View key={char.id} className="mb-6 flex-row items-start">
          {/* Left: Golden Frame Portrait */}
          <View className="mr-3 shadow-lg">
            {/* Outer Gold Frame */}
            <View className="h-28 w-24 items-center justify-center rounded-sm border-4 border-[#d4af37] bg-[#bcaaa4] p-1 shadow-md">
              {/* Inner Detail & Image */}
              <View className="h-full w-full border border-[#8d6e63] bg-[#5d4037]">
                <Image
                  source={char.image}
                  className="h-full w-full"
                  resizeMode="cover"
                  defaultSource={{ uri: 'https://via.placeholder.com/100' }}
                />
              </View>
            </View>
          </View>

          {/* Right: Question & Answer Box */}
          <View className="flex-1 rounded-xl border border-gray-400 bg-white p-3 shadow-sm">
            <Text className="mb-4 text-justify font-poppins text-[10px] leading-4 text-black">
              {char.question}
            </Text>

            {/* Input Lines */}
            <View className="w-full">
              <View className="h-6 w-full border-b border-gray-400" />
              <View className="h-6 w-full border-b border-gray-400" />
              <View className="h-6 w-full border-b border-gray-400" />

              {/* Invisible Input for typing */}
              <TextInput
                className="absolute bottom-0 left-0 right-0 top-0 pt-2 font-poppins text-xs text-[#3e2723]"
                multiline
                numberOfLines={3}
                onChangeText={(text) => handleAnswerChange(char.id, text)}
                value={answers[char.id] || ''}
              />
            </View>
          </View>
        </View>
      ))}
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3">
        <FontAwesome5 name="save" size={16} color="white" />
        <Text className="ml-2 font-poppins-bold text-white">I-save ang mga Sagot</Text>
      </TouchableOpacity>
    </View>
  );
};

// ==================================================
// 4. PAGBUBUOD (Summary) - PLACEHOLDER
// ==================================================
export const Pagbubuod = ({ rangeId }: { rangeId: string }) => {
  const rubric = [
    {
      label:
        'Pag-unawa sa Wakas – Naipakita ang malinaw at wastong pag-unawa sa mahahalagang pangyayari sa wakas ng Noli Me Tangere',
      points: '5 puntos',
    },
    {
      label:
        'Pagpili ng Mahahalagang Detalye – Natampok lamang ang pinakamahahalagang pangyayari; hindi lumabis sa hinihinging bilang ng pangungusap.',
      points: '5 puntos',
    },
    {
      label:
        'Kaayusan ng Pagkakasulat – Malinaw, lohikal, at organisado ang pagkakasunod-sunod ng mga pangungusap.',
      points: '5 puntos',
    },
    {
      label: 'Kalinawan ng Kaisipan – Malinaw at madaling maunawaan ang ipinahahayag na kaisipan.',
      points: '5 puntos',
    },
    { label: 'Wastong Gamit ng Wika – Tama ang gramatika, baybay, at bantas.', points: '5 puntos' },
  ];

  const [summary, setSummary] = useState('');
  const activityId = `pagbubuod-${rangeId}`;

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getAnswers(activityId);
      if (savedAnswers.length > 0) {
        setSummary(savedAnswers[0].selected_answer);
      }
    };
    loadAnswers();
  }, [activityId]);

  const handleSave = async () => {
    const user = await getUser();
    if (!user) {
      Alert.alert('Error', 'Hindi mahanap ang user.');
      return;
    }

    const score = summary.trim().length > 0 ? 1 : 0;

    await saveAnswer(activityId, 1, summary, false);
    await saveScore(user.id, activityId, score);

    Alert.alert('Galing!', 'Ang iyong buod ay nai-save na.');
  };

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <FontAwesome5 name="edit" size={24} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Pagbubuod</Text>
      </View>

      {/* Instruction Box */}
      <View className="mb-6 rounded-xl border-2 border-b-4 border-[#5d4037] bg-[#ffecb3] p-4 shadow-sm">
        <Text className="text-justify font-poppins text-xs leading-5 text-[#3e2723]">
          <Text className="font-bold">Panuto:</Text> Sumulat ng isang maikling buod tungkol sa
          kabanata isa (1) hanggang tatlo (3) mula sa nobelang Noli Me Tangere. Tiyakin na ang iyong
          buod ay malinaw, organisado, at binubuo lamang ng hindi hihigit sa sampung (10)
          pangungusap.
        </Text>
      </View>

      {/* Writing Area (Lined Paper) */}
      <View className="relative mb-6 min-h-[300px] overflow-hidden rounded-3xl border-4 border-[#e8d4b0] bg-white shadow-md">
        {/* Lined Background */}
        <View className="absolute bottom-0 left-0 right-0 top-0 px-6 pt-10">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <View key={i} className="h-10 w-full border-b-2 border-black" />
          ))}
        </View>

        {/* TextInput Overlay */}
        <TextInput
          multiline
          placeholder="Simulan ang iyong buod dito..."
          className="flex-1 px-6 pt-10 font-poppins text-base leading-[40px] text-[#3e2723]"
          textAlignVertical="top"
          style={{ lineHeight: 80 }}
          onChangeText={setSummary}
          value={summary}
        />
      </View>

      {/* Rubric Table */}
      <View className="border-2 border-[#3e2723] bg-[#f5f5f5]">
        {/* Table Header */}
        <View className="flex-row border-b border-[#3e2723] bg-[#d7ccc8]">
          <View className="flex-1 items-center justify-center border-r border-[#3e2723] p-2">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">Pamantayan</Text>
          </View>
          <View className="w-16 items-center justify-center p-2">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">Puntos</Text>
          </View>
        </View>

        {/* Table Rows */}
        {rubric.map((row, index) => (
          <View key={index} className="flex-row border-b border-[#3e2723] bg-white">
            <View className="flex-1 justify-center border-r border-[#3e2723] p-2">
              <Text className="text-justify font-poppins text-xs leading-3 text-[#3e2723]">
                {row.label}
              </Text>
            </View>
            <View className="w-16 items-center justify-center bg-[#efede6] p-2">
              <Text className="font-poppins-bold text-xs text-[#3e2723]">{row.points}</Text>
            </View>
          </View>
        ))}

        {/* Total Row */}
        <View className="flex-row bg-[#d7ccc8]">
          <View className="flex-1 items-center justify-center border-r border-[#3e2723] p-2">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">Kabuuang Puntos</Text>
          </View>
          <View className="w-16 items-center justify-center p-2">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">25 puntos</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3">
        <FontAwesome5 name="save" size={16} color="white" />
        <Text className="ml-2 font-poppins-bold text-white">I-save ang Buod</Text>
      </TouchableOpacity>
    </View>
  );
};

// ==================================================
// PAGHIHINUHA (Kabanata 4-6) - Situation Analysis
// ==================================================
export const Paghihinuha4to6 = ({ rangeId }: { rangeId: string }) => {
  const cards = [
    {
      id: 1,
      color: 'bg-[#eefeeb]', // Light Green
      borderColor: 'border-[#c8e6c9]',
      title: 'Sitwasyon:',
      text: 'Naglakad si Ibarra nang walang tiyak na paroroonan hanggang marating niya ang liwasan ng Binundok. Wala pa rin siyang nakitang pagbabago mula nang siya ay umalis...',
    },
    {
      id: 2,
      color: 'bg-[#fff8e1]', // Light Yellow
      borderColor: 'border-[#ffecb3]',
      title: 'Sitwasyon:',
      text: 'Pagdating ni Ibarra sa Fonda de Lala, naupo siya sa silid at pinagmamasdan mula sa bintana ang maliwanag na bahay sa kabila ng ilog. Narinig niya ang kalansing ng kubyertos at tugtugin ng orkestra...',
    },
    {
      id: 3,
      color: 'bg-[#e0f7fa]', // Light Blue
      borderColor: 'border-[#b2ebf2]',
      title: 'Sitwasyon:',
      text: 'Ipinakita ang kayamanan, impluwensya, at pamumuhay ni Kapitan Tiyago: pandak, may bilugang mukha, maimpluwensyang tao, kaibigan ng gobyerno at prayle, at turing sa sarili bilang tunay na Espanyol...',
    },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const activityId = `paghihinuha-${rangeId}`;

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getAnswers(activityId);
      const answersMap = savedAnswers.reduce((acc, item) => {
        acc[item.question_index] = item.selected_answer;
        return acc;
      }, {});
      setAnswers(answersMap);
    };
    loadAnswers();
  }, [activityId]);

  const handleAnswerChange = (id: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleSave = async () => {
    const user = await getUser();
    if (!user) {
      Alert.alert('Error', 'Hindi mahanap ang user.');
      return;
    }

    let score = 0;

    for (const card of cards) {
      const answer = answers[card.id];
      if (answer) {
        await saveAnswer(activityId, card.id, answer, false);
        score++;
      }
    }

    await saveScore(user.id, activityId, score);
    Alert.alert('Galing!', 'Ang iyong mga sagot ay nai-save na.');
  };

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <FontAwesome5 name="search" size={20} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">
          Paghihinuha (Kabanata 4-6)
        </Text>
      </View>

      <Text className="mb-6 text-justify font-poppins text-xs leading-5 text-[#5d4037]">
        <Text className="font-bold">Panuto:</Text> Basahin at unawain ang bawat sitwasyon. Batay sa
        mga pahiwatig sa teksto, ilahad ang posibleng susunod na pangyayari, damdamin, o aksyon ng
        tauhan at ipaliwanag ang iyong lohikal na paghihinuha.
      </Text>

      {/* Cards Loop */}
      {cards.map((card) => (
        <View key={card.id} className="mb-6 flex-row">
          {/* Left: Situation Box */}
          <View
            className={`w-32 rounded-xl p-4 ${card.color} border ${card.borderColor} mr-3 justify-center shadow-sm`}>
            <Text className="mb-2 text-center font-poppins-bold text-xs text-[#3e2723]">
              {card.title}
            </Text>
            <Text className="text-center font-serif text-[10px] italic leading-4 text-[#5d4037]">
              {card.text}
            </Text>
          </View>

          {/* Right: Answer Lines */}
          <View className="shadow-inner flex-1 justify-between rounded-xl border border-[#d7ccc8] bg-[#efede6] p-3 py-1">
            {[1, 2, 3, 4, 5].map((line) => (
              <View key={line} className="mb-1 h-6 w-full border-b border-[#bcaaa4]" />
            ))}
            {/* Invisible Text Input overlaying the lines for typing */}
            <TextInput
              className="absolute bottom-0 left-0 right-0 top-0 p-3 font-poppins text-xs leading-7 text-[#3e2723]"
              multiline
              textAlignVertical="top"
              onChangeText={(text) => handleAnswerChange(card.id, text)}
              value={answers[card.id] || ''}
            />
          </View>
        </View>
      ))}
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3">
        <FontAwesome5 name="save" size={16} color="white" />
        <Text className="ml-2 font-poppins-bold text-white">I-save ang mga Sagot</Text>
      </TouchableOpacity>
    </View>
  );
};

// ==================================================
// PAGLILINAW (Kabanata 4-6) - FIXED DICE & INPUT
// ==================================================
const DiceFace = ({ value }: { value: number }) => {
  const size = 56; // Box size (w-14)
  const dotSize = 10;
  const padding = 8; // Distance from edge

  // Reusable Dot Component
  const Dot = ({ pos }: { pos: string }) => {
    const style: any = {
      width: dotSize,
      height: dotSize,
      borderRadius: dotSize / 2,
      backgroundColor: 'black',
      position: 'absolute',
    };

    // Calculate positions manually to ensure they stay inside
    if (pos.includes('top')) style.top = padding;
    if (pos.includes('bottom')) style.bottom = padding;
    if (pos.includes('left')) style.left = padding;
    if (pos.includes('right')) style.right = padding;

    // Middle vertical alignment
    if (pos.includes('midY')) style.top = (size - dotSize) / 2;

    // Center alignment
    if (pos === 'center') {
      style.top = (size - dotSize) / 2;
      style.left = (size - dotSize) / 2;
    }

    return <View style={style} />;
  };

  const renderDots = () => {
    switch (value) {
      case 1:
        return <Dot pos="center" />;
      case 2:
        return (
          <>
            <Dot pos="top-left" />
            <Dot pos="bottom-right" />
          </>
        );
      case 3:
        return (
          <>
            <Dot pos="top-left" />
            <Dot pos="center" />
            <Dot pos="bottom-right" />
          </>
        );
      case 4:
        return (
          <>
            <Dot pos="top-left" />
            <Dot pos="top-right" />
            <Dot pos="bottom-left" />
            <Dot pos="bottom-right" />
          </>
        );
      case 5:
        return (
          <>
            <Dot pos="top-left" />
            <Dot pos="top-right" />
            <Dot pos="center" />
            <Dot pos="bottom-left" />
            <Dot pos="bottom-right" />
          </>
        );
      case 6:
        return (
          <>
            <Dot pos="top-left" />
            <Dot pos="top-right" />
            <Dot pos="midY-left" />
            <Dot pos="midY-right" />
            <Dot pos="bottom-left" />
            <Dot pos="bottom-right" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#3e2723',
        borderRadius: 12,
        position: 'relative',
      }}>
      {renderDots()}
    </View>
  );
};
export const Paglilinaw4to6 = ({ rangeId }: { rangeId: string }) => {
  const data = [
    {
      id: 1,
      text: "Ano ang ibig sabihin ni Tenyente Guevarra nang sabihin niyang 'mag-ingat' si Ibarra? Ipaliwanag ang kontekstong historikal at personal na dahilan kung bakit mahalaga ang babalang ito.",
    },
    {
      id: 2,
      text: 'Paano naging simbolo ng kawalang-katarungan ang sinapit ni Don Rafael? Ipaliwanag batay sa pangyayari sa artilyero at sa mga paratang laban sa kanya.',
    },
    {
      id: 3,
      text: "Sa Kabanata V, bakit inihambing ang liwanag mula sa bahay ni Maria Clara sa isang 'tala sa gabing madilim'? Ano ang ipinapakitang emosyon at simbolo nito sa nararamdaman ni Ibarra?",
    },
    {
      id: 4,
      text: 'Ano ang ipinapakitang katangian ni Padre Sibyla at ng batang Pransiskano sa eksena sa bahay ni Kapitan Tiyago? Ipaliwanag kung paano nagkakaiba ang kanilang kilos at inuusal batay sa inilalahad ng teksto.',
    },
    {
      id: 5,
      text: "Bakit sinasabing may 'kapangyarihan' ang pag-ibig sa pamilya at kabanata sa karakter nina Ibarra at Maria Clara sa Kabanata V-VI? Ipaliwanag kung paano ito nagdudulot ng pag-asa o pighati sa mga tauhan.",
    },
    {
      id: 6,
      text: "Ano ang ipinahihiwatig ng pagiging 'tunay na Espanyol' ni Kapitan Tiyago ayon sa kanyang asal at paniniwala? Linawin kung paano ito nagpapakita ng kalagayan ng lipunang Pilipino noong panahon ng kolonyalismo.",
    },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const activityId = `paglilinaw-${rangeId}`;

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getAnswers(activityId);
      const answersMap = savedAnswers.reduce((acc, item) => {
        acc[item.question_index] = item.selected_answer;
        return acc;
      }, {});
      setAnswers(answersMap);
    };
    loadAnswers();
  }, [activityId]);

  const handleAnswerChange = (id: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleSave = async () => {
    const user = await getUser();
    if (!user) {
      Alert.alert('Error', 'Hindi mahanap ang user.');
      return;
    }

    let score = 0;

    for (const item of data) {
      const answer = answers[item.id];
      if (answer) {
        await saveAnswer(activityId, item.id, answer, false);
        score++;
      }
    }

    await saveScore(user.id, activityId, score);
    Alert.alert('Galing!', 'Ang iyong mga sagot ay nai-save na.');
  };

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <MaterialCommunityIcons name="dice-5" size={24} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Paglilinaw</Text>
      </View>

      {/* Instructions */}
      <Text className="mb-6 text-justify font-poppins text-xs leading-5 text-[#5d4037]">
        <Text className="font-bold">Panuto:</Text> Pindutin ang dice at sagutin ang katanungang
        katapat ng numerong lumabas. Batay sa kabanatang nabasa, ipaliwanag ang kahulugan, simbolo,
        at damdaming ipinapahayag ng bawat tanong.
      </Text>

      {/* Questions List */}
      <View>
        {data.map((item) => (
          <View key={item.id} className="mb-8 flex-row items-start">
            {/* Left: Fixed Dice */}
            <View className="mr-4 pt-1">
              <DiceFace value={item.id} />
            </View>

            {/* Right: Question & Answer Stack */}
            <View className="flex-1">
              {/* Question Bubble */}
              <View className="mb-3 rounded-2xl border-2 border-[#3e2723] bg-white p-3 shadow-sm">
                <Text className="text-justify font-poppins text-[10px] leading-4 text-[#3e2723]">
                  {item.text}
                </Text>
              </View>

              {/* Answer Input Bubble */}
              <View className="shadow-inner rounded-xl border-2 border-[#3e2723] bg-[#efede6] p-2">
                <TextInput
                  placeholder="Isulat ang iyong sagot dito..."
                  placeholderTextColor="#a1887f"
                  multiline
                  className="min-h-[50px] font-poppins text-xs text-[#3e2723]"
                  textAlignVertical="top"
                  onChangeText={(text) => handleAnswerChange(item.id, text)}
                  value={answers[item.id] || ''}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3">
        <FontAwesome5 name="save" size={16} color="white" />
        <Text className="ml-2 font-poppins-bold text-white">I-save ang mga Sagot</Text>
      </TouchableOpacity>
    </View>
  );
};

// ==================================================
// PAGSISIYASAT (Kabanata 4-6) - CASES 1, 2 & 3
// Matches all G2 FINAL NAA images
// ==================================================
export const Pagsisiyasat4to6 = ({ rangeId }: { rangeId: string }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const activityId = `pagsisiyasat-${rangeId}`;

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getAnswers(activityId);
      const answersMap = savedAnswers.reduce((acc, item) => {
        acc[item.question_index] = item.selected_answer;
        return acc;
      }, {});
      setAnswers(answersMap);
    };
    loadAnswers();
  }, [activityId]);

  const handleAnswerChange = (key: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [key]: text }));
  };

  const handleSave = async () => {
    const user = await getUser();
    if (!user) {
      Alert.alert('Error', 'Hindi mahanap ang user.');
      return;
    }

    let score = 0;
    let questionIndex = 1;

    for (const key in answers) {
      if (answers[key]) {
        await saveAnswer(activityId, questionIndex++, answers[key], false);
        score++;
      }
    }

    await saveScore(user.id, activityId, score);
    Alert.alert('Galing!', 'Ang iyong mga sagot ay nai-save na.');
  };

  return (
    <View className="pb-8">
      {/* Main Header */}
      <View className="mb-6 flex-row items-center">
        <FontAwesome5 name="eye" size={24} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Pagsisiyasat</Text>
      </View>

      {/* ==================== CASE 1 SECTION ==================== */}
      <View className="mb-8">
        <Text className="mb-2 font-serif text-lg font-bold text-black">
          Case 1: Sino ang Suspek?
        </Text>

        <Text className="mb-4 text-justify font-poppins text-xs leading-4 text-[#5d4037]">
          <Text className="font-bold">Panuto:</Text> Batay sa nabasang akda, Isulat ang pangalan ng
          tatlong (3) tauhan na posibleng suspek o may motibo sa pagkakakulong sa ama ni Crisostomo
          Ibarra. Isulat ito sa bawat nakalaang kahon.
        </Text>

        {/* Suspects Row */}
        <View className="flex-row justify-between px-2">
          {[1, 2, 3].map((i) => (
            <View key={i} className="w-[30%] items-center">
              {/* Silhouette Frame */}
              <View className="relative mb-2 aspect-square w-full items-center justify-end overflow-hidden rounded-lg border-2 border-black bg-white">
                <FontAwesome5
                  name="user-alt"
                  size={55}
                  color="black"
                  style={{ marginBottom: -8 }}
                />
                <Text className="absolute top-1 font-serif text-4xl font-bold text-white shadow-sm">
                  ?
                </Text>
              </View>

              {/* Yellow Input Box */}
              <TextInput
                className="h-8 w-full rounded-md border border-[#fbc02d] bg-[#fdd835] p-0 text-center font-poppins-bold text-[10px] text-black"
                onChangeText={(text) => handleAnswerChange(`case1_suspect${i}`, text)}
                value={answers[`case1_suspect${i}`] || ''}
              />
            </View>
          ))}
        </View>
      </View>

      {/* ==================== CASE 2 SECTION ==================== */}
      <View className="mb-8">
        <View className="mb-2 flex-row items-center">
          <FontAwesome5 name="user-secret" size={20} color="#2e7d32" />
          <Text className="ml-2 font-serif text-lg font-bold text-black">
            Case 2: Ano ang ebidensya?
          </Text>
        </View>

        <Text className="mb-4 text-justify font-poppins text-xs leading-4 text-[#5d4037]">
          <Text className="font-bold">Panuto:</Text> Mula sa mga suspek na iyong inilagay sa Case 1,
          ilahad mo ang motibo kung bakit sila ang iyong pinaghihinalaang nagpakulong sa ama ni
          Crisostomo Ibarra.
        </Text>

        {/* STRICT TABLE LAYOUT */}
        <View className="mt-2 border-2 border-black bg-white">
          {/* Table Header */}
          <View className="h-12 flex-row border-b-2 border-black bg-white">
            <View className="flex-1 items-center justify-center border-r-2 border-black">
              <Text className="font-serif text-sm font-bold text-black">Motibo</Text>
            </View>
            <View className="flex-1 items-center justify-center">
              <Text className="font-serif text-sm font-bold text-black">Paliwanag</Text>
            </View>
          </View>

          {/* Table Rows */}
          {[1, 2, 3].map((row, index) => (
            <View
              key={row}
              className={`h-16 flex-row ${index !== 2 ? 'border-b border-black' : ''}`}>
              <View className="flex-1 justify-center border-r-2 border-black bg-white px-4">
                <TextInput
                  className="h-10 w-full border-b-2 border-black font-poppins text-xs text-black"
                  placeholder=""
                  onChangeText={(text) => handleAnswerChange(`case2_motibo${row}`, text)}
                  value={answers[`case2_motibo${row}`] || ''}
                />
              </View>
              <View className="flex-1 justify-center bg-white px-4">
                <TextInput
                  className="h-10 w-full border-b-2 border-black font-poppins text-xs text-black"
                  placeholder=""
                  onChangeText={(text) => handleAnswerChange(`case2_paliwanag${row}`, text)}
                  value={answers[`case2_paliwanag${row}`] || ''}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ==================== CASE 3 SECTION (NEW) ==================== */}
      <View>
        <View className="mb-2 flex-row items-center">
          {/* Silhouette Icon Header */}
          <View className="relative mr-2">
            <FontAwesome5 name="user-alt" size={24} color="black" />
            <Text className="absolute right-1 top-0 text-[10px] font-bold text-white">?</Text>
          </View>
          <Text className="font-serif text-lg font-bold text-black">
            Case 3 : Sino ang tunay na salarin?
          </Text>
        </View>

        <Text className="mb-4 text-justify font-poppins text-xs leading-4 text-[#5d4037]">
          <Text className="font-bold">Panuto:</Text> Sagutin ang tanong sa ibaba. Ipaliwanag at
          ilahad batay sa iyong pagkakaunawa sa nobela.
        </Text>

        {/* Large Question Box */}
        <View className="border-2 border-black bg-white p-5">
          <Text className="mb-4 text-justify font-serif text-xs font-bold leading-5 text-black">
            Batay sa iyong pagsusuri sa nobela, sino ang tunay na salarin sa pagkakakulong ng ama ni
            Crisostomo Ibarra, at paano niya naisakatuparan ang kaniyang masamang layunin?
          </Text>

          {/* Lined Writing Area */}
          <View className="relative mt-2 h-64">
            {/* Background Lines */}
            <View className="absolute bottom-0 left-0 right-0 top-0 justify-between py-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
                <View key={line} className="h-6 w-full border-b border-black" />
              ))}
            </View>

            {/* Input Overlay */}
            <TextInput
              className="flex-1 p-0 pt-1 font-poppins text-xs leading-7 text-black"
              multiline
              textAlignVertical="top"
              style={{ lineHeight: 28 }} // Adjust line height to match border spacing
              onChangeText={(text) => handleAnswerChange('case3_answer', text)}
              value={answers['case3_answer'] || ''}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3">
        <FontAwesome5 name="save" size={16} color="white" />
        <Text className="ml-2 font-poppins-bold text-white">I-save ang mga Sagot</Text>
      </TouchableOpacity>
    </View>
  );
};

// ==================================================
// PAGBUBUOD (Kabanata 4-6) - Emoji Summary
// Fixed: Emojis are now a placeholder inside the input
// ==================================================
export const Pagbubuod4to6 = ({ rangeId }: { rangeId: string }) => {
  const rubric = [
    {
      label:
        'Pagkilala sa Pangunahing Ideya – Malinaw na naipakita ang pangunahing mensahe ng kabanata batay sa ibinigay na emoji; hindi nalilihis sa sentral na tema.',
      points: '5 puntos',
    },
    {
      label:
        'Pagluhanay ng Mahahalagang Pangyayari – Kumpleto at lohikal ang pagkakasunod-sunod ng mahahalagang pangyayari; walang labis na detalye.',
      points: '5 puntos',
    },
    {
      label:
        'Pagiging Komprehensibo at Maikli – Napanatili ang kabuuang saysay ng kabanata sa pinaikling paraan; hindi sumobra sa detalye at hindi nagkulang sa personal na opinyon.',
      points: '5 puntos',
    },
    {
      label:
        'Kaayusan at Kalinawan ng Paglalahad – Malinaw, organisado, at madaling basahin ang buod; may maayos na daloy ng ideya.',
      points: '5 puntos',
    },
    {
      label: 'Gamit ng Wika – Wastong baybay, bantas, at gramatika; malinaw ang mga pangungusap.',
      points: '5 puntos',
    },
  ];

  const [summary, setSummary] = useState('');
  const activityId = `pagbubuod-${rangeId}`;

  useEffect(() => {
    const loadAnswers = async () => {
      const savedAnswers = await getAnswers(activityId);
      if (savedAnswers.length > 0) {
        setSummary(savedAnswers[0].selected_answer);
      }
    };
    loadAnswers();
  }, [activityId]);

  const handleSave = async () => {
    const user = await getUser();
    if (!user) {
      Alert.alert('Error', 'Hindi mahanap ang user.');
      return;
    }

    const score = summary.trim().length > 0 ? 1 : 0;

    await saveAnswer(activityId, 1, summary, false);
    await saveScore(user.id, activityId, score);

    Alert.alert('Galing!', 'Ang iyong buod ay nai-save na.');
  };

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <FontAwesome5 name="edit" size={24} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Pagbubuod</Text>
      </View>

      {/* Instruction Box */}
      <Text className="mb-4 text-justify font-poppins text-xs leading-5 text-[#5d4037]">
        <Text className="font-bold">Panuto:</Text> Basahing mabuti ang itinakdang kabanata mula sa
        Nobelang Noli Me Tangere. Gamit ang mga emoji, sumulat ng isang maikling buod na binubuo ng
        apat (4) hanggang anim (6) na pangungusap.
        {'\n\n'}
        Tiyaking malinaw na nakasaad ang pangunahing ideya, mahahalagang pangyayari, at tamang
        pagkakasunod-sunod ng mga ito. Iwasan ang paglalagay ng labis na detalye, sariling opinyon,
        o komentaryo; ibatay lamang ang sagot sa mismong nilalaman ng kabanata.
      </Text>

      {/* Writing Area (Lined Paper) */}
      <View className="relative mb-6 min-h-[350px] overflow-hidden rounded-xl border border-gray-400 bg-[#f5f5f5] shadow-sm">
        {/* TextInput Overlay with Emoji Placeholder */}
        <TextInput
          multiline
          // The emoji sequence is now here as a placeholder example
          placeholder="📜🏠😲🤫🔥😮👥   (Magsimula rito...)"
          placeholderTextColor="#757575"
          className="flex-1 px-4 pt-10 font-poppins text-xs  leading-[32px]"
          textAlignVertical="top"
          style={{ lineHeight: 70 }} // Matches the height of the background lines
          onChangeText={setSummary}
          value={summary}
        />
      </View>

      {/* Rubric Table */}
      <View className="mb-8 border-2 border-black bg-[#f5f5f5]">
        {/* Table Header */}
        <View className="h-10 flex-row border-b border-black bg-[#d7ccc8]">
          <View className="flex-1 items-center justify-center border-r border-black">
            <Text className="font-poppins-bold text-[10px] text-black">Pamantayan</Text>
          </View>
          <View className="w-16 items-center justify-center">
            <Text className="font-poppins-bold text-[10px] text-black">Puntos</Text>
          </View>
        </View>

        {/* Table Rows */}
        {rubric.map((row, index) => (
          <View key={index} className="flex-row border-b border-black bg-white">
            <View className="flex-1 justify-center border-r border-black p-2">
              <Text className="text-justify font-poppins text-xs leading-3 text-black">
                <Text className="font-bold">{row.label.split('–')[0]} –</Text>
                {row.label.split('–')[1]}
              </Text>
            </View>
            <View className="w-16 items-center justify-center bg-[#efede6] p-2">
              <Text className="font-poppins-bold text-xs text-black">{row.points}</Text>
            </View>
          </View>
        ))}

        {/* Total Row */}
        <View className="h-8 flex-row bg-[#d7ccc8]">
          <View className="flex-1 items-center justify-center border-r border-black">
            <Text className="font-poppins-bold text-[10px] text-black">Kabuuang Puntos</Text>
          </View>
          <View className="w-16 items-center justify-center">
            <Text className="font-poppins-bold text-[10px] text-black">25 puntos</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleSave}
        className="mt-4 flex-row items-center justify-center rounded-full bg-[#3e2723] py-3">
        <FontAwesome5 name="save" size={16} color="white" />
        <Text className="ml-2 font-poppins-bold text-white">I-save ang Buod</Text>
      </TouchableOpacity>
    </View>
  );
};
