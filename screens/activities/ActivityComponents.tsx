  import React, { useState, useEffect, useRef } from 'react';
  import { View, Text, TextInput, Image, TouchableOpacity, Alert, Animated, Modal, Easing, ScrollView } from 'react-native';
  import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
  import { getUser, saveAnswer, saveScore, getAnswers } from '../../services/db';
  
  // ==================================================
  // 1. PAGHIHINUHA (Inference) - Character Analysis (Kabanata 1-3)
  // ==================================================
  export const Paghihinuha = ({ rangeId }: { rangeId: string }) => {
    const allCharacters = [
      {
        id: 1,
        name: 'Crisostomo Ibarra',
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
        name: 'Donya Pia Alba',
        question:
            'Batay sa kanyang postura, paano mo ilalarawan ang katangian na namamayani sa kanya?',
        image: require('../../assets/images/pia.png'),
      },
      {
        id: 5,
        name: 'Kapitan Tiyago',
        question:
            'Ano ang maaaring ipahiwatig ng kanyang ekspresyon sa mata o mukha tungkol sa kanyang pag-iisip o damdamin?',
        image: require('../../assets/images/tiago.png'),
      },
      {
        id: 6,
        name: 'Tiya Isabel',
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
    const [isLoading, setIsLoading] = useState(true);
  
    // Animation values
    const clawY = useRef(new Animated.Value(0)).current;
    const clawRotate = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const characterPulse = useRef(new Animated.Value(1)).current;
    const sparkleAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      loadProgress();
      startPulseAnimation();
      startSparkleAnimation();
    }, []);
  
    const startPulseAnimation = () => {
      Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.15,
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
  
    const startSparkleAnimation = () => {
      Animated.loop(
          Animated.sequence([
            Animated.timing(sparkleAnim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.linear,
              useNativeDriver: true,
            }),
            Animated.timing(sparkleAnim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
      ).start();
    };
  
    const loadProgress = async () => {
      try {
        setIsLoading(true);
  
        // Load saved answers from database
        const savedAnswers = await getAnswers(activityId);
  
        // Convert array to object map
        const answersMap = savedAnswers.reduce((acc, item) => {
          acc[item.question_index] = item.selected_answer;
          return acc;
        }, {});
  
        setSavedAnswers(answersMap);
  
        // Get IDs of completed characters
        const completedIds = Object.keys(answersMap).map(Number);
  
        // Filter out completed characters from available pool
        const remainingCharacters = allCharacters.filter(
            c => !completedIds.includes(c.id)
        );
  
        setAvailableCharacters(remainingCharacters);
        setCompletedCount(completedIds.length);
  
        console.log('Progress loaded:', {
          completed: completedIds.length,
          remaining: remainingCharacters.length
        });
  
      } catch (error) {
        console.error('Error loading progress:', error);
        Alert.alert(
            'May Error',
            'Hindi ma-load ang iyong progress. Magsisimula mula sa umpisa.'
        );
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleClawClick = () => {
      if (availableCharacters.length === 0) {
        Alert.alert('🎉 Tapos na!', 'Nakuha mo na ang lahat ng karakter!');
        return;
      }
  
      if (isClawing) return;
  
      setIsClawing(true);
  
      // Randomly select a character first
      const randomIndex = Math.floor(Math.random() * availableCharacters.length);
      const selected = availableCharacters[randomIndex];
  
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
        setClawedCharacter(selected);
        setIsClawing(false);
  
        // Animate character appearance
        Animated.sequence([
          Animated.spring(characterPulse, {
            toValue: 1.2,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(characterPulse, {
            toValue: 1,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowQuestionModal(true);
        });
      });
    };
  
    const handleSaveAnswer = async () => {
      if (!currentAnswer.trim()) {
        Alert.alert('⚠️ Kulang', 'Mangyaring sagutin ang tanong.');
        return;
      }
  
      try {
        // Get current user (same pattern as Pagsisiyasat)
        const user = await getUser();
        if (!user) {
          Alert.alert('Error', 'Hindi mahanap ang user.');
          return;
        }
  
        // Save answer to database (using clawedCharacter.id as question_index)
        await saveAnswer(activityId, clawedCharacter.id, currentAnswer, false);
  
        // Update local state
        setSavedAnswers((prev) => ({
          ...prev,
          [clawedCharacter.id]: currentAnswer,
        }));
  
        // Calculate new score (how many characters completed)
        const newCount = completedCount + 1;
  
        // Save score (same pattern as Pagsisiyasat)
        await saveScore(user.id, activityId, newCount);
  
        // Remove character from available pool
        setAvailableCharacters((prev) =>
            prev.filter((char) => char.id !== clawedCharacter.id)
        );
  
        setCompletedCount(newCount);
  
        // Reset and close modal
        setCurrentAnswer('');
        setShowQuestionModal(false);
        setClawedCharacter(null);
  
        // Check if all completed
        if (newCount === allCharacters.length) {
          Alert.alert(
              'Mahusay!',
              'Natapos mo na ang lahat ng mga karakter! Ang iyong mga sagot ay nai-save na.',
              [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Mahusay!', 'Ang sagot ay nai-save na. Kumuha ng isa pa.', [
            { text: 'Sige' },
          ]);
        }
      } catch (error) {
        Alert.alert('Error', 'May problema sa pag-save ng sagot.');
        console.error('Save error:', error);
      }
    };
  
    const handleSkipCharacter = () => {
      Alert.alert(
          '⏭️ Laktawan?',
          'Sigurado ka bang gusto mong laktawan ang karakterng ito? Maaari mo pa itong makuha mamaya.',
          [
            { text: 'Hindi', style: 'cancel' },
            {
              text: 'Oo, Laktawan',
              onPress: () => {
                setCurrentAnswer('');
                setShowQuestionModal(false);
                setClawedCharacter(null);
              },
              style: 'destructive',
            },
          ]
      );
    };
  
    const spin = clawRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  
    const sparkleRotate = sparkleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  
    const sparkleOpacity = sparkleAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    });
  
    // Show loading state
    if (isLoading) {
      return (
          <View className="flex-1 items-center justify-center pb-8">
            <FontAwesome5 name="spinner" size={40} color="#3e2723" />
            <Text className="mt-4 font-poppins text-base text-[#3e2723]">
              Iniload ang iyong progress...
            </Text>
          </View>
      );
    }
  
    return (
        <View className="flex-1 pb-8">
          {/* Header Section with improved styling */}
          <View className="mb-6 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="rounded-full bg-[#3e2723] p-2">
                <FontAwesome5 name="search" size={18} color="#d4af37" />
              </View>
              <Text className="ml-3 font-serif text-2xl font-bold text-[#3e2723]">
                Paghihinuha
              </Text>
            </View>
            <View className="rounded-full bg-gradient-to-r from-[#3e2723] to-[#5d4037] px-5 py-2 shadow-lg">
              <Text className="font-poppins-bold text-base text-white">
                {completedCount}/{allCharacters.length}
              </Text>
            </View>
          </View>
  
          {/* Instructions with better design */}
          <View className="mb-6 rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#fff8e1] to-[#f5e6d3] p-5 shadow-md">
            <View className="mb-2 flex-row items-center">
              <View className="rounded-full bg-[#d4af37] p-1.5">
                <FontAwesome5 name="info" size={12} color="#3e2723" />
              </View>
              <Text className="ml-2 font-poppins-bold text-sm text-[#3e2723]">
                Panuto
              </Text>
            </View>
            <Text className="text-justify font-poppins text-xs leading-5 text-[#3e2723]">
              Pindutin ang pulang bilog sa gitna upang simulan ang gawain. Pagmasdang
              mabuti ang anyo, pananamit, at ekspresyon ng mga karakter sa
              larawan. Gamit ang mga detalyeng ito, magbigay ng iyong hinuha tungkol
              sa kanilang pagkatao at maaaring papel sa nobela.
            </Text>
          </View>
  
          {/* Enhanced Claw Machine Container */}
          <View className="items-center rounded-3xl bg-gradient-to-b from-[#8d6e63] to-[#6d4c41] p-4 shadow-2xl">
            {/* Machine Frame with better styling */}
            <View className="w-full rounded-2xl border-4 border-[#3e2723] bg-gradient-to-b from-[#a1887f] to-[#8d6e63] p-3 shadow-inner">
              <View className="overflow-hidden rounded-xl border-4 border-[#d4af37] bg-gradient-to-b from-[#e3f2fd] to-[#bbdefb]" style={{ height: 280 }}>
                {/* Decorative sparkles */}
                <Animated.View
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      transform: [{ rotate: sparkleRotate }],
                      opacity: sparkleOpacity,
                    }}>
                  <FontAwesome5 name="star" size={16} color="#ffd700" />
                </Animated.View>
                <Animated.View
                    style={{
                      position: 'absolute',
                      top: 20,
                      left: 15,
                      transform: [{ rotate: sparkleRotate }],
                      opacity: sparkleOpacity,
                    }}>
                  <FontAwesome5 name="star" size={12} color="#ffd700" />
                </Animated.View>
  
                {/* Claw System with enhanced design */}
                <View className="absolute left-1/2 top-0 -ml-10 items-center" style={{ zIndex: 10 }}>
                  <Animated.View
                      style={{
                        transform: [{ translateY: clawY }, { rotate: spin }],
                      }}
                      className="items-center">
                    {/* Enhanced Cable with gradient effect */}
                    <View
                        className="w-1.5 rounded-full bg-gradient-to-b from-[#212121] to-[#616161] shadow"
                        style={{ height: 50 }}
                    />
                    {/* Enhanced Claw mechanism */}
                    <View className="relative h-24 w-24 items-center justify-center">
                      {/* Outer glow */}
                      <View className="absolute h-20 w-20 rounded-full bg-[#757575]/30" />
                      {/* Main claw body */}
                      <View className="h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-[#9e9e9e] to-[#757575] shadow-xl">
                        <View className="h-12 w-12 items-center justify-center rounded-full bg-[#616161]">
                          <FontAwesome5 name="hand-rock" size={24} color="#3e2723" />
                        </View>
                      </View>
                      {/* Grabbed character preview with glow effect */}
                      {isClawing && clawY._value > 100 && clawedCharacter && (
                          <View className="absolute -bottom-20">
                            <View className="absolute h-16 w-16 rounded-full bg-[#ffd700]/50 blur-lg" />
                            <View className="h-14 w-14 overflow-hidden rounded-full border-4 border-[#ffd700] bg-white shadow-xl">
                              <Image
                                  source={clawedCharacter.image}
                                  className="h-full w-full"
                                  resizeMode="cover"
                              />
                            </View>
                          </View>
                      )}
                    </View>
                  </Animated.View>
                </View>
  
                {/* Enhanced Character Pool Display */}
                <View className="absolute bottom-6 left-0 right-0 items-center">
                  <View className="flex-row flex-wrap justify-center px-4">
                    {availableCharacters.map((char) => (
                        <Animated.View
                            key={char.id}
                            style={{
                              opacity: isClawing ? 0.6 : 1,
                            }}>
                          <View className="m-1.5 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg" style={{ height: 64, width: 64 }}>
                            <Image
                                source={char.image}
                                className="h-full w-full"
                                resizeMode="cover"
                            />
                            {/* Shine effect */}
                            <View className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white/70" />
                            {/* Character border glow */}
                            <View className="absolute inset-0 rounded-full border-2 border-[#d4af37]/50" />
                          </View>
                        </Animated.View>
                    ))}
                  </View>
                </View>
  
                {/* Floor indicator with shadow */}
                <View className="absolute bottom-0 left-0 right-0 h-4 rounded-b-xl bg-gradient-to-t from-[#3e2723] to-transparent" />
              </View>
            </View>
  
            {/* Enhanced Control Panel */}
            <View className="mt-5 w-full items-center rounded-2xl border-4 border-[#3e2723] bg-gradient-to-b from-[#8d6e63] to-[#6d4c41] p-5 shadow-lg">
              {/* Animated Button */}
              <Animated.View
                  style={{
                    transform: [{ scale: isClawing ? 1 : pulseAnim }],
                  }}>
                <TouchableOpacity
                    onPress={handleClawClick}
                    disabled={isClawing || availableCharacters.length === 0}
                    className={`h-28 w-28 items-center justify-center rounded-full shadow-2xl ${
                        isClawing
                            ? 'bg-gradient-to-b from-orange-400 to-orange-600'
                            : availableCharacters.length === 0
                                ? 'bg-gradient-to-b from-gray-400 to-gray-600'
                                : 'bg-gradient-to-b from-red-500 to-red-700'
                    }`}
                    style={{
                      shadowColor: isClawing ? '#ff9800' : '#d32f2f',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.6,
                      shadowRadius: 10,
                      elevation: 15,
                    }}>
                  {/* Button inner ring */}
                  <View className="absolute inset-2 rounded-full border-4 border-white/30" />
                  <FontAwesome5
                      name={isClawing ? 'spinner' : 'play'}
                      size={40}
                      color="white"
                  />
                  <Text className="mt-2 font-poppins-bold text-sm text-white shadow-sm">
                    {isClawing ? 'KUMUHA...' : 'SIMULA'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
  
              {/* Enhanced Status Display */}
              <View className="mt-5 rounded-xl bg-gradient-to-r from-[#3e2723] to-[#5d4037] px-8 py-3 shadow-md">
                <View className="flex-row items-center">
                  <FontAwesome5 name="users" size={14} color="#d4af37" />
                  <Text className="ml-2 text-center font-poppins-bold text-sm text-white">
                    Natitirang Karakter: {availableCharacters.length}
                  </Text>
                </View>
              </View>
            </View>
          </View>
  
          {/* Enhanced Question Modal */}
          <Modal
              visible={showQuestionModal}
              transparent={true}
              animationType="fade"
              onRequestClose={handleSkipCharacter}>
            <View className="flex-1 items-center justify-center bg-black/80 px-4">
              <Animated.View
                  style={{
                    transform: [{ scale: characterPulse }],
                  }}
                  className="w-full max-w-md">
                <View className="rounded-3xl border-4 border-[#d4af37] bg-white shadow-2xl">
                  {/* Character Header with enhanced styling */}
                  {clawedCharacter && (
                      <>
                        <View className="items-center rounded-t-3xl bg-gradient-to-b from-[#f5e6d3] to-white px-6 pt-6 pb-4">
                          <View className="mb-4 overflow-hidden rounded-full border-4 border-[#d4af37] shadow-2xl" style={{ height: 120, width: 120 }}>
                            {/* Glow effect */}
                            <View className="absolute -inset-2 rounded-full bg-[#d4af37]/20 blur-xl" />
                            <Image
                                source={clawedCharacter.image}
                                className="h-full w-full"
                                resizeMode="cover"
                            />
                            {/* Shine overlay */}
                            <View className="absolute left-2 top-2 h-8 w-8 rounded-full bg-white/60" />
                          </View>
                          <View className="rounded-full bg-gradient-to-r from-[#3e2723] to-[#5d4037] px-6 py-2 shadow-lg">
                            <Text className="font-serif text-xl font-bold text-white">
                              {clawedCharacter.name}
                            </Text>
                          </View>
                        </View>
  
                        <ScrollView className="max-h-96 px-6">
                          {/* Question with enhanced design */}
                          <View className="my-4 rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#fff8e1] to-[#f5e6d3] p-4 shadow-sm">
                            <View className="mb-3 flex-row items-center">
                              <View className="rounded-full bg-[#d4af37] p-2">
                                <FontAwesome5 name="question-circle" size={14} color="#3e2723" />
                              </View>
                              <Text className="ml-2 font-poppins-bold text-base text-[#3e2723]">
                                Tanong:
                              </Text>
                            </View>
                            <Text className="text-justify font-poppins text-sm leading-6 text-[#3e2723]">
                              {clawedCharacter.question}
                            </Text>
                          </View>
  
                          {/* Answer Input with enhanced design */}
                          <View className="mb-4">
                            <View className="mb-3 flex-row items-center">
                              <View className="rounded-full bg-[#3e2723] p-2">
                                <FontAwesome5 name="pen" size={12} color="#d4af37" />
                              </View>
                              <Text className="ml-2 font-poppins-bold text-base text-[#3e2723]">
                                Iyong Sagot:
                              </Text>
                            </View>
                            <TextInput
                                className="min-h-[140px] rounded-2xl border-3 border-[#3e2723] bg-white p-4 font-poppins text-sm text-[#3e2723] shadow-sm"
                                placeholder="Isulat ang iyong paghihinuha dito..."
                                placeholderTextColor="#bcaaa4"
                                multiline
                                textAlignVertical="top"
                                value={currentAnswer}
                                onChangeText={setCurrentAnswer}
                            />
                          </View>
                        </ScrollView>
  
                        {/* Action Buttons with enhanced styling */}
                        <View className="flex-row justify-between space-x-3 rounded-b-3xl bg-[#f5f5f5] px-6 py-5">
                          <TouchableOpacity
                              onPress={handleSkipCharacter}
                              className="flex-1 items-center rounded-full border-3 border-[#3e2723] bg-white py-4 shadow-md"
                              style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 3,
                                elevation: 5,
                              }}>
                            <Text className="font-poppins-bold text-base text-[#3e2723]">
                              ⏭️ Laktawan
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                              onPress={handleSaveAnswer}
                              className="flex-1 flex-row items-center justify-center rounded-full bg-gradient-to-r from-[#3e2723] to-[#5d4037] py-4 shadow-lg"
                              style={{
                                shadowColor: '#3e2723',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.4,
                                shadowRadius: 5,
                                elevation: 8,
                              }}>
                            <FontAwesome5 name="save" size={18} color="#d4af37" />
                            <Text className="ml-2 font-poppins-bold text-base text-white">
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
        question:
          'Batay sa mga naging pahayag at kilos ng mga panauhin sa piging na idinaos ni Kapitan Tiago. Paano mo mapatutunayan na mayroong hindi pantay na katayuan sa lipunan ang mga tauhang naroon? Magbigay ng mga tiyak na patunay mula sa kabanata upang suportahan ang iyong ideya',
        key: '🔑',
      },
      {
        id: 2,
        question:
          'Paano inilarawan sa teksto and pagtrato kay Ibarra? Ano ang ipinahihiwatig nito tungkol sa umiiral na kaayusan ng kapangyarihan sa lipunan noong panahong iyon?',
        key: '🔑',
      },
      {
        id: 3,
        question:
          'Ano-ano ang mga ginawa ng mga prayle sa nobela? Sa iyong palagay, makatarungan ba ang kanilangmga ginawa? Ipaliwanag ang iyong sagot batay sa mga pangyayari sa akda.',
        key: '🔑',
      },
      {
        id: 4,
        question:
          'Paano nahahayag ang tunay na pagkatao ni Crisostomo Ibarra sa Kabanata 2 sa pamamagitan ng kanyang pananalita at pakikitungo sa bawat taong kanyang nakasalamuha? ',
        key: '🔑',
      },
      {
        id: 5,
        question:
          'Paano masasabing ang handaan sa bahay ni Kapitan Tiago ay isang maliit na salamin ng lipunang Pilipino noong panahon ng Espanyol? Magbigay ng mga patunay mula sa kabanata na nagpapakita ng ugnayan ng kapangyarihan sa pagitan ng pamahalaan at simbahan',
        key: '🔑',
      },
    ];

    const activityId = `pagsisiyasat-${rangeId}`;

    // State management
    const [selectedKey, setSelectedKey] = useState<number | null>(null);
    const [showDoor, setShowDoor] = useState(false);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [savedAnswers, setSavedAnswers] = useState<{ [key: number]: string }>({});
    const [completedKeys, setCompletedKeys] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Animation values
    const keyRotation = useRef(new Animated.Value(0)).current;
    const doorScale = useRef(new Animated.Value(0)).current;
    const doorShake = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      loadProgress();
      startKeyRotation();
    }, []);

    const startKeyRotation = () => {
      Animated.loop(
          Animated.timing(keyRotation, {
            toValue: 1,
            duration: 10000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
      ).start();
    };

    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const savedAnswers = await getAnswers(activityId);

        const answersMap = savedAnswers.reduce((acc, item) => {
          acc[item.question_index] = item.selected_answer;
          return acc;
        }, {});

        setSavedAnswers(answersMap);
        setCompletedKeys(Object.keys(answersMap).map(Number));
      } catch (error) {
        console.error('Error loading progress:', error);
        Alert.alert('May Error', 'Hindi ma-load ang iyong progress.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleKeyClick = (questionId: number) => {
      if (completedKeys.includes(questionId)) {
        Alert.alert('Tapos na', 'Nasagot mo na ang tanong na ito!');
        return;
      }

      setSelectedKey(questionId);
      setCurrentAnswer(savedAnswers[questionId] || '');

      // Animate door opening
      setShowDoor(true);
      Animated.sequence([
        Animated.spring(doorScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(doorShake, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(doorShake, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(doorShake, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    const handleSubmitAnswer = async () => {
      if (!currentAnswer.trim()) {
        Alert.alert('Kulang ang Sagot', 'Mangyaring magsulat ng sagot bago mag-submit.');
        return;
      }

      const user = await getUser();
      if (!user) {
        Alert.alert('Error', 'Hindi mahanap ang user.');
        return;
      }

      await saveAnswer(activityId, selectedKey, currentAnswer, false);

      setSavedAnswers((prev) => ({
        ...prev,
        [selectedKey!]: currentAnswer,
      }));

      if (!completedKeys.includes(selectedKey!)) {
        setCompletedKeys((prev) => [...prev, selectedKey!]);
      }

      const totalAnswered = completedKeys.includes(selectedKey!)
          ? completedKeys.length
          : completedKeys.length + 1;
      await saveScore(user.id, activityId, totalAnswered);

      setCurrentAnswer('');
      setShowDoor(false);
      setSelectedKey(null);
      doorScale.setValue(0);

      Alert.alert('Mahusay!', 'Nai-save na ang iyong sagot!');
    };

    const handleCloseDoor = () => {
      Animated.timing(doorScale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setShowDoor(false);
        setSelectedKey(null);
        setCurrentAnswer('');
      });
    };

    const rotation = keyRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    if (isLoading) {
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Naglo-load...</Text>
          </View>
      );
    }

    const selectedQuestion = questions.find((q) => q.id === selectedKey);

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#fef3c7', padding: 24 }}>
        {/* Header */}
        <View style={{ marginBottom: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#78350f' }}>
            🔍 Pagsisiyasat
          </Text>
          <Text style={{ marginTop: 8, fontSize: 14, color: '#92400e' }}>Kabanata 1-3</Text>
        </View>

        {/* Progress */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#92400e' }}>
              Progress: {completedKeys.length}/{questions.length}
            </Text>
            <Text style={{ fontSize: 12, color: '#b45309' }}>
              {questions.length - completedKeys.length} natitira
            </Text>
          </View>
          <View
            style={{
              height: 12,
              overflow: 'hidden',
              borderRadius: 9999,
              backgroundColor: '#fde68a',
            }}>
            <View
              style={{
                height: '100%',
                backgroundColor: '#f59e0b',
                width: `${(completedKeys.length / questions.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Instructions */}
        <View
          style={{
            marginBottom: 24,
            borderRadius: 16,
            backgroundColor: 'white',
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}>
          <Text style={{ textAlign: 'center', fontSize: 12, lineHeight: 20, color: '#78350f' }}>
            <Text style={{ fontWeight: 'bold' }}>Panuto:</Text>
            Pumili ng numerong susi mula sa bilog. Bawat numero ay may kaukulang nilalaman. Pagpili ng numero, suriin ang nilalaman nito at sagutan ang katanungang nakapaloob dito.

          </Text>
        </View>

        {/* Spinning Keys Circle */}
        <View
          style={{ marginBottom: 32, height: 384, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View
            style={{
              transform: [{ rotate: rotation }],
              width: 280,
              height: 280,
            }}>
            {questions.map((question, index) => {
              const angle = (index * 360) / questions.length;
              const radius = 120;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              const isCompleted = completedKeys.includes(question.id);

              return (
                <TouchableOpacity
                  key={question.id}
                  onPress={() => handleKeyClick(question.id)}
                  style={{
                    position: 'absolute',
                    left: 140 + x - 25,
                    top: 140 + y - 25,
                    width: 50,
                    height: 50,
                  }}>
                  <View
                    style={{
                      height: '100%',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 9999,
                      borderWidth: 4,
                      borderColor: isCompleted ? '#4ade80' : '#fbbf24',
                      backgroundColor: isCompleted ? '#dcfce7' : '#fef3c7',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 5,
                    }}>
                    <Text style={{ fontSize: 24 }}>{question.key}</Text>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: -4,
                        right: -4,
                        height: 24,
                        width: 24,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 9999,
                        backgroundColor: '#78350f',
                      }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                        {question.id}
                      </Text>
                    </View>
                    {isCompleted && (
                      <View style={{ position: 'absolute', top: -4, right: -4 }}>
                        <Text style={{ fontSize: 18 }}>✅</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* Center Circle */}
          <View
            style={{
              position: 'absolute',
              height: 96,
              width: 96,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 9999,
              borderWidth: 4,
              borderColor: '#92400e',
              backgroundColor: '#fcd34d',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}>
            <Text
                className='font-poppins-semibold'
              style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 12, color: '#78350f' }}>
              Pumili ng Susi
            </Text>
          </View>
        </View>

        {/* Completed Keys */}
        {completedKeys.length > 0 && (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ marginBottom: 12, fontWeight: 'bold', fontSize: 14, color: '#92400e' }}>
              ✅ Nasagot na ({completedKeys.length})
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {completedKeys.map((keyId) => (
                <View
                  key={keyId}
                  style={{
                    borderRadius: 9999,
                    borderWidth: 2,
                    borderColor: '#4ade80',
                    backgroundColor: '#dcfce7',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                  }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#15803d' }}>
                    Tanong #{keyId}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Door Modal */}
        <Modal visible={showDoor} animationType="fade" transparent={true}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.6)',
              padding: 24,
            }}>
            <Animated.View
              style={{
                transform: [{ scale: doorScale }, { translateX: doorShake }],
                width: '100%',
                maxWidth: 448,
              }}>
              <View
                className="font-poppins"
                style={{
                  overflow: 'hidden',
                  borderRadius: 24,
                  backgroundColor: '#92400e',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 20 },
                  shadowOpacity: 0.5,
                  shadowRadius: 25,
                  elevation: 25,
                }}>
                {/* Door Header */}
                <View
                  style={{
                    alignItems: 'center',
                    borderBottomWidth: 4,
                    borderBottomColor: '#451a03',
                    backgroundColor: '#4f2b21',
                    padding: 24,
                  }}>
                  <View
                    style={{
                      marginBottom: 12,
                      height: 80,
                      width: 80,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 9999,
                      borderWidth: 4,
                      borderColor: '#fcd34d',
                      backgroundColor: '#d97706',
                    }}>
                    <Text style={{ fontSize: 36 }}>🚪</Text>
                  </View>
                  <Text
                    style={{ fontSize: 20, fontWeight: 'bold', color: '#fef3c7' }}
                    className="font-poppins-bold">
                    Tanong #{selectedKey}
                  </Text>
                </View>

                {/* Door Content */}
                <View style={{ backgroundColor: 'white', padding: 24 }}>
                  {/* Question */}
                  <View
                    style={{
                      marginBottom: 16,
                      borderRadius: 16,
                      backgroundColor: '#fffbeb',
                      padding: 16,
                    }}>
                    <Text
                      className="font-poppins-semibold"
                      style={{
                        marginBottom: 8,
                        fontWeight: 'bold',
                        fontSize: 12,
                        color: '#78350f',
                      }}>
                      📋 Tanong:
                    </Text>
                    <Text
                      className="font-poppins"
                      style={{
                        textAlign: 'justify',
                        fontSize: 12,
                        lineHeight: 20,
                        color: '#92400e',
                      }}>
                      {selectedQuestion?.question}
                    </Text>
                  </View>

                  {/* Answer Input */}
                  <View style={{ marginBottom: 16 }}>
                    <Text
                        className='font-poppins-semibold'
                      style={{
                        marginBottom: 8,
                        fontWeight: 'bold',
                        fontSize: 12,
                        color: '#78350f',
                      }}>
                      ✍️ Iyong Sagot:
                    </Text>
                    <TextInput
                      style={{
                        minHeight: 120,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: '#fcd34d',
                        backgroundColor: 'white',
                        padding: 12,
                        fontSize: 12,
                        color: '#1f2937',
                      }}
                      className='font-poppins'
                      placeholder="Isulat ang iyong sagot dito..."
                      placeholderTextColor="#9e9e9e"
                      multiline
                      textAlignVertical="top"
                      value={currentAnswer}
                      onChangeText={setCurrentAnswer}
                    />
                  </View>

                  {/* Action Buttons */}
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                      onPress={handleCloseDoor}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        borderRadius: 9999,
                        borderWidth: 2,
                        borderColor: '#d1d5db',
                        backgroundColor: 'white',
                        paddingVertical: 12,
                      }}>
                      <Text className='font-poppins-semibold' style={{ fontWeight: 'bold', fontSize: 12, color: '#4b5563' }}>
                        Isara
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSubmitAnswer}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        borderRadius: 9999,
                        backgroundColor: '#f59e0b',
                        paddingVertical: 12,
                      }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                        I-Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Animated.View>
          </View>
        </Modal>
      </ScrollView>
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
      Alert.alert('Mahusay!', 'Ang iyong mga sagot ay nai-save na.');
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
  
      Alert.alert('Mahusay!', 'Ang iyong buod ay nai-save na.');
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
      Alert.alert('Mahusay!', 'Ang iyong mga sagot ay nai-save na.');
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

  // Dice Face Component
  const DiceFace = ({ value, size = 60 }: { value: number; size?: number }) => {
    const getDots = (num: number) => {
      const dotPositions: { [key: number]: string[] } = {
        1: ['center'],
        2: ['top-left', 'bottom-right'],
        3: ['top-left', 'center', 'bottom-right'],
        4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
        6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
      };
      return dotPositions[num] || [];
    };

    const positions: { [key: string]: { top?: number; bottom?: number; left?: number; right?: number } } = {
      'top-left': { top: size * 0.15, left: size * 0.15 },
      'top-right': { top: size * 0.15, right: size * 0.15 },
      'middle-left': { top: size * 0.42, left: size * 0.15 },
      'middle-right': { top: size * 0.42, right: size * 0.15 },
      'bottom-left': { bottom: size * 0.15, left: size * 0.15 },
      'bottom-right': { bottom: size * 0.15, right: size * 0.15 },
      'center': { top: size * 0.42, left: size * 0.42 },
    };

    const dotSize = size * 0.16;

    return (
        <View
            style={{
              width: size,
              height: size,
              backgroundColor: 'white',
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#3e2723',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 3,
            }}
        >
          {getDots(value).map((position, index) => (
              <View
                  key={index}
                  style={{
                    position: 'absolute',
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize / 2,
                    backgroundColor: '#3e2723',
                    ...positions[position],
                  }}
              />
          ))}
        </View>
    );
  };

  // ==================================================
  // PAGLILINAW (Kabanata 4-6) - Dice Rolling Game
  // ==================================================
  export const Paglilinaw4to6 = ({ rangeId }: { rangeId: string }) => {
    const questions = [
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

    const activityId = `paglilinaw-${rangeId}`;

    // State management
    const [rolledNumbers, setRolledNumbers] = useState<number[]>([]);
    const [currentDiceValue, setCurrentDiceValue] = useState(1);
    const [isRolling, setIsRolling] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});
    const [isLoading, setIsLoading] = useState(true);

    // Animation values
    const diceRotate = useRef(new Animated.Value(0)).current;
    const diceScale = useRef(new Animated.Value(1)).current;
    const modalScale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      loadProgress();
    }, []);

    const loadProgress = async () => {
      try {
        setIsLoading(true);
        const savedAnswers = await getAnswers(activityId);
        const answersMap = savedAnswers.reduce((acc, item) => {
          acc[item.question_index] = item.selected_answer;
          return acc;
        }, {});
        setAnswers(answersMap);
        setRolledNumbers(Object.keys(answersMap).map(Number));
      } catch (error) {
        console.error('Error loading progress:', error);
        Alert.alert('May Error', 'Hindi ma-load ang iyong progress.');
      } finally {
        setIsLoading(false);
      }
    };

    const handleRollDice = () => {
      if (rolledNumbers.length >= 6) {
        Alert.alert('🎉 Tapos na!', 'Nakumpleto mo na ang lahat ng tanong!');
        return;
      }

      if (isRolling) return;

      setIsRolling(true);

      // Rolling animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(diceRotate, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(diceScale, {
              toValue: 1.2,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(diceScale, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => {
        // Get available numbers
        const availableNumbers = [1, 2, 3, 4, 5, 6].filter(
            (num) => !rolledNumbers.includes(num)
        );

        // Randomly select from available numbers
        const randomIndex = Math.floor(Math.random() * availableNumbers.length);
        const rolledNumber = availableNumbers[randomIndex];

        setCurrentDiceValue(rolledNumber);
        setSelectedQuestion(rolledNumber);
        setCurrentAnswer(answers[rolledNumber] || '');

        // Reset rotation
        diceRotate.setValue(0);
        setIsRolling(false);

        // Show modal with animation
        setShowModal(true);
        Animated.spring(modalScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }).start();
      });
    };

    const handleSubmitAnswer = async () => {
      if (!currentAnswer.trim()) {
        Alert.alert('Kulang ang Sagot', 'Mangyaring magsulat ng sagot bago mag-submit.');
        return;
      }

      const user = await getUser();
      if (!user) {
        Alert.alert('Error', 'Hindi mahanap ang user.');
        return;
      }

      await saveAnswer(activityId, selectedQuestion!, currentAnswer, false);

      setAnswers((prev) => ({
        ...prev,
        [selectedQuestion!]: currentAnswer,
      }));

      if (!rolledNumbers.includes(selectedQuestion!)) {
        setRolledNumbers((prev) => [...prev, selectedQuestion!]);
      }

      const totalAnswered = rolledNumbers.includes(selectedQuestion!)
          ? rolledNumbers.length
          : rolledNumbers.length + 1;
      await saveScore(user.id, activityId, totalAnswered);

      setCurrentAnswer('');
      handleCloseModal();

      Alert.alert('Mahusay!', 'Nai-save na ang iyong sagot!', [
        {
          text: 'OK',
          onPress: () => {
            if (rolledNumbers.length + 1 >= 6) {
              Alert.alert('🎉 Tapos na!', 'Nakumpleto mo na ang lahat ng tanong!');
            }
          },
        },
      ]);
    };

    const handleCloseModal = () => {
      Animated.timing(modalScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setShowModal(false);
        setSelectedQuestion(null);
        setCurrentAnswer('');
      });
    };

    const rotation = diceRotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    if (isLoading) {
      return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, color: '#666' }}>Naglo-load...</Text>
          </View>
      );
    }

    const currentQuestion = questions.find((q) => q.id === selectedQuestion);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5', padding: 24 }}>
          {/* Header */}
          <View style={{ marginBottom: 24, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="dice-5" size={32} color="#3e2723" />
              <Text style={{ marginLeft: 8, fontSize: 28, fontWeight: 'bold', color: '#3e2723' }}>
                Paglilinaw
              </Text>
            </View>
            <Text style={{ fontSize: 14, color: '#5d4037' }}>Kabanata 4-6</Text>
          </View>

          {/* Progress */}
          <View style={{ marginBottom: 24 }}>
            <View style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#5d4037' }}>
                Progress: {rolledNumbers.length}/6
              </Text>
              <Text style={{ fontSize: 12, color: '#8d6e63' }}>
                {6 - rolledNumbers.length} natitira
              </Text>
            </View>
            <View style={{ height: 12, overflow: 'hidden', borderRadius: 9999, backgroundColor: '#d7ccc8' }}>
              <View
                  style={{
                    height: '100%',
                    backgroundColor: '#6d4c41',
                    width: `${(rolledNumbers.length / 6) * 100}%`,
                  }}
              />
            </View>
          </View>

          {/* Instructions */}
          <View style={{ marginBottom: 24, borderRadius: 16, backgroundColor: 'white', padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}>
            <Text style={{ textAlign: 'center', fontSize: 12, lineHeight: 20, color: '#5d4037' }}>
              <Text style={{ fontWeight: 'bold' }}>Panuto:</Text> Pindutin ang dice upang mag-roll at makakuha ng random na numero. Sagutin ang tanong na katapat ng numerong lumabas!
            </Text>
          </View>

          {/* Dice Container */}
          <View style={{ marginBottom: 32, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <TouchableOpacity
                onPress={handleRollDice}
                disabled={isRolling || rolledNumbers.length >= 6}
                activeOpacity={0.8}
            >
              <Animated.View
                  style={{
                    transform: [{ rotate: rotation }, { scale: diceScale }],
                  }}
              >
                <DiceFace value={currentDiceValue} size={120} />
              </Animated.View>
            </TouchableOpacity>

            <Text style={{ marginTop: 24, fontSize: 16, fontWeight: 'bold', color: '#3e2723' }}>
              {rolledNumbers.length >= 6
                  ? '🎉 Tapos na!'
                  : isRolling
                      ? 'Nag-ro-roll...'
                      : 'I-tap ang dice para mag-roll!'}
            </Text>
          </View>

          {/* Rolled Numbers */}
          {rolledNumbers.length > 0 && (
              <View style={{ marginBottom: 24 }}>
                <Text style={{ marginBottom: 12, fontSize: 14, fontWeight: 'bold', color: '#5d4037' }}>
                  ✅ Nasagot na ({rolledNumbers.length})
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {rolledNumbers.sort((a, b) => a - b).map((num) => (
                      <View
                          key={num}
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                      >
                        <DiceFace value={num} size={50} />
                        <Text style={{ marginTop: 4, fontSize: 10, fontWeight: 'bold', color: '#4caf50' }}>
                          ✓
                        </Text>
                      </View>
                  ))}
                </View>
              </View>
          )}

          {/* Question Modal */}
          <Modal visible={showModal} animationType="fade" transparent={true}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.7)', padding: 24 }}>
              <Animated.View
                  style={{
                    transform: [{ scale: modalScale }],
                    width: '100%',
                    maxWidth: 500,
                  }}
              >
                <View style={{ overflow: 'hidden', borderRadius: 24, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 25, elevation: 25 }}>
                  {/* Modal Header */}
                  <View style={{ alignItems: 'center', backgroundColor: '#3e2723', padding: 24 }}>
                    <View style={{ marginBottom: 16 }}>
                      <DiceFace value={selectedQuestion || 1} size={80} />
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                      Tanong #{selectedQuestion}
                    </Text>
                  </View>

                  {/* Modal Content */}
                  <View style={{ padding: 24 }}>
                    {/* Question */}
                    <View style={{ marginBottom: 16, borderRadius: 16, backgroundColor: '#fff3e0', padding: 16, borderWidth: 2, borderColor: '#ffb74d' }}>
                      <Text style={{ marginBottom: 8, fontSize: 12, fontWeight: 'bold', color: '#e65100' }}>
                        📋 Tanong:
                      </Text>
                      <Text style={{ textAlign: 'justify', fontSize: 12, lineHeight: 20, color: '#5d4037' }}>
                        {currentQuestion?.text}
                      </Text>
                    </View>

                    {/* Answer Input */}
                    <View style={{ marginBottom: 16 }}>
                      <Text style={{ marginBottom: 8, fontSize: 12, fontWeight: 'bold', color: '#3e2723' }}>
                        ✍️ Iyong Sagot:
                      </Text>
                      <TextInput
                          style={{
                            minHeight: 120,
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: '#d7ccc8',
                            backgroundColor: '#fafafa',
                            padding: 12,
                            fontSize: 12,
                            color: '#1f2937',
                          }}
                          placeholder="Isulat ang iyong sagot dito..."
                          placeholderTextColor="#9e9e9e"
                          multiline
                          textAlignVertical="top"
                          value={currentAnswer}
                          onChangeText={setCurrentAnswer}
                      />
                    </View>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <TouchableOpacity
                          onPress={handleCloseModal}
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            borderRadius: 9999,
                            borderWidth: 2,
                            borderColor: '#d1d5db',
                            backgroundColor: 'white',
                            paddingVertical: 12,
                          }}
                      >
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#4b5563' }}>Isara</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                          onPress={handleSubmitAnswer}
                          style={{
                            flex: 1,
                            alignItems: 'center',
                            borderRadius: 9999,
                            backgroundColor: '#3e2723',
                            paddingVertical: 12,
                          }}
                      >
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>I-Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
            </View>
          </Modal>
        </ScrollView>
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
      Alert.alert('Mahusay!', 'Ang iyong mga sagot ay nai-save na.');
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
  
      Alert.alert('Mahusay!', 'Ang iyong buod ay nai-save na.');
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
