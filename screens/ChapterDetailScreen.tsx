import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  LayoutRectangle,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import Svg, { Line } from 'react-native-svg';
import { chaptersData } from '../data/chaptersData';
import { RootStackParamList } from '../navigation/AppNavigator';
import { markChapterAsRead, saveTalasalitaanAnswers, getTalasalitaanAnswers } from '../services/db';

type ChapterDetailRouteProp = RouteProp<RootStackParamList, 'ChapterDetail'>;

export default function ChapterDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<ChapterDetailRouteProp>();

  const { id, title, tag, image } = route.params;
  const chapterContent = chaptersData.find((c) => c.id === id);

  const [activeTab, setActiveTab] = useState<'talasalitaan' | 'nobela'>('talasalitaan');


  // --- STATE MANAGEMENT ---

  React.useEffect(() => {
    if (activeTab === 'nobela') {
      console.log(`Marking Chapter ${id} as read...`);
      markChapterAsRead(id);
    }
  }, [activeTab, id]);

  // 1. Multiple Choice
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  // 2. Mind Map
  const [mindMapInputs, setMindMapInputs] = useState<string[]>(['', '', '', '']);

  // 3. Punan Mo
  // State for storing complete answers (one per question) - THIS IS NOW THE SOURCE OF TRUTH FOR SAVING
  const [punanAnswers, setPunanAnswers] = useState<{ [key: number]: string }>({});
  // Keep the individual inputs for UI display
  const [punanInputs, setPunanInputs] = useState<{ [key: string]: string }>({});
  const punanInputRefs = useRef<{ [key: string]: TextInput | null }>({});

  // 4. Matching Type 1 (Chapter 4/5)
  const [matches, setMatches] = useState<{ [key: number]: string }>({});
  const [activeChoice, setActiveChoice] = useState<string | null>(null);

  // 5. Line Connect (Chapter 6)
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [connectedPairs, setConnectedPairs] = useState<{ [key: number]: string }>({});

  // Layout tracking for lines
  const [termLayouts, setTermLayouts] = useState<Record<number, LayoutRectangle>>({});
  const [defLayouts, setDefLayouts] = useState<Record<string, LayoutRectangle>>({});

  // --- DATA LOADING ---
  useFocusEffect(
    React.useCallback(() => {
      const loadAnswers = async () => {
        if (chapterContent) {
          const savedData = await getTalasalitaanAnswers(id, chapterContent.quizType);
          if (savedData) {
            switch (chapterContent.quizType) {
              case 'multiple-choice':
                setSelectedAnswers(savedData);
                break;
              case 'mind-map':
                setMindMapInputs(savedData);
                break;
              case 'punan-mo':
                // `savedData` is the `punanAnswers` object: { [qid]: "COMPLETEWORD" }
                const savedAnswers = savedData as { [key: number]: string };
                setPunanAnswers(savedAnswers);

                // Populate individual input fields from the complete words
                const newPunanInputs: { [key: string]: string } = {};
                Object.keys(savedAnswers).forEach((questionIdStr) => {
                  const qId = parseInt(questionIdStr, 10);
                  const savedWord = savedAnswers[qId];
                  const question = chapterContent.quiz.find((q) => q.id === qId);

                  if (question && savedWord && question.clues) {
                    question.clues.forEach((char, idx) => {
                      if (char === '') { // This is a blank for user input
                        const key = `q${qId}-${idx}`;
                        newPunanInputs[key] = savedWord[idx] || '';
                      }
                    });
                  }
                });
                setPunanInputs(newPunanInputs);
                break;
              case 'matching':
                setMatches(savedData);
                break;
              case 'line-connect':
                setConnectedPairs(savedData);
                break;
            }
          }
        }
      };
      loadAnswers();
    }, [id, chapterContent])
  );
  
  // --- HANDLERS ---

  const handleSave = async () => {
    let answersToSave;
    const quizType = chapterContent?.quizType;
    switch (quizType) {
      case 'multiple-choice':
        answersToSave = selectedAnswers;
        break;
      case 'mind-map':
        answersToSave = mindMapInputs;
        break;
      case 'punan-mo':
        // Save the complete words object
        answersToSave = punanAnswers;
        break;
      case 'matching':
        answersToSave = matches;
        break;
      case 'line-connect':
        answersToSave = connectedPairs;
        break;
      default:
        Alert.alert('Error', 'Unknown quiz type.');
        return;
    }
    if (quizType) {
      await saveTalasalitaanAnswers(id, quizType, answersToSave);
      Alert.alert('Sagot Nai-save!', 'Ang iyong mga sagot ay nai-save na.');
    }
  };
  
  // -- Punan Mo Handlers (Updated)--
  
  // Updated: Handle text change and update complete word
  const handlePunanTextChange = (
    text: string,
    questionId: number,
    charIndex: number,
    clues: string[]
  ) => {
    const key = `q${questionId}-${charIndex}`;
    const upperText = text.toUpperCase();
    
    // Update individual input for UI
    const newPunanInputs = { ...punanInputs, [key]: upperText };
    setPunanInputs(newPunanInputs);

    // Build and save complete word to state
    let completeWord = '';
    clues.forEach((char, idx) => {
      if (char !== '') {
        completeWord += char;
      } else {
        const inputKey = `q${questionId}-${idx}`;
        completeWord += newPunanInputs[inputKey] || '_';
      }
    });
    
    // Update complete answer state
    setPunanAnswers(prev => ({ ...prev, [questionId]: completeWord }));

    // Auto-focus next input
    if (text.length > 0) {
      let nextIndex = charIndex + 1;
      while (nextIndex < clues.length) {
        if (clues[nextIndex] === '') {
          const nextKey = `q${questionId}-${nextIndex}`;
          punanInputRefs.current[nextKey]?.focus();
          break;
        }
        nextIndex++;
      }
    }
  };

  // Handle backspace
  const handlePunanKeyPress = (
    e: any,
    questionId: number,
    charIndex: number,
    clues: string[]
  ) => {
    const key = `q${questionId}-${charIndex}`;
    
    if (e.nativeEvent.key === 'Backspace') {
      const currentVal = punanInputs[key];

      // Clear current input first, then decide where to move
      const newPunanInputs = { ...punanInputs, [key]: '' };
      setPunanInputs(newPunanInputs);

      // Rebuild the complete word with the cleared input
      let completeWord = '';
      clues.forEach((char, idx) => {
        if (char !== '') {
          completeWord += char;
        } else {
          const inputKey = `q${questionId}-${idx}`;
          completeWord += newPunanInputs[inputKey] || '_';
        }
      });
      setPunanAnswers(prev => ({ ...prev, [questionId]: completeWord }));

      // If the input was already empty, then move focus to the previous input
      if (!currentVal) {
        let prevIndex = charIndex - 1;
        while (prevIndex >= 0) {
          if (clues[prevIndex] === '') {
            const prevKey = `q${questionId}-${prevIndex}`;
            punanInputRefs.current[prevKey]?.focus();
            break;
          }
          prevIndex--;
        }
      }
    }
  };


  // Multiple Choice
  const handleSelectAnswer = (questionId: number, answer: string, correctAnswer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Mind Map
  const handleMindMapChange = (text: string, index: number) => {
    const newInputs = [...mindMapInputs];
    newInputs[index] = text;
    setMindMapInputs(newInputs);
  };


  // Matching Type 1
  const handleChoiceClick = (choice: string) => {
    setActiveChoice(choice);
  };

  const handleLineClick = (questionId: number) => {
    if (activeChoice) {
      setMatches((prev) => ({ ...prev, [questionId]: activeChoice }));
      setActiveChoice(null);
    } else if (matches[questionId]) {
      const newMatches = { ...matches };
      delete newMatches[questionId];
      setMatches(newMatches);
    }
  };

  // Matching Type 2 (Line Connect)
  const handleTermPress = (id: number) => {
    setSelectedTerm(id);
  };

  const handleDefinitionPress = (definition: string) => {
    if (selectedTerm === null) {
      Alert.alert('Pumili muna', 'Pumili muna ng salita sa kaliwa.');
      return;
    }

    setConnectedPairs((prev) => {
      const newState = { ...prev };
      const existingTermId = Object.keys(newState).find(
        (key) => newState[Number(key)] === definition
      );
      if (existingTermId) {
        delete newState[Number(existingTermId)];
      }
      newState[selectedTerm] = definition;
      return newState;
    });
    setSelectedTerm(null);
  };

  if (!chapterContent) return null;

  return (
    <View className="flex-1 bg-[#4a342e]">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 pb-2 pt-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Feather name="arrow-left" size={24} color="#e8d4b0" />
          </TouchableOpacity>
          <Text className="ml-2 mr-8 flex-1 text-center font-poppins-bold text-lg text-[#e8d4b0]">
            {tag}
          </Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Chapter Image */}
            <View className="relative mx-4 mt-2 h-56 overflow-hidden rounded-2xl border-2 border-[#5d4037] bg-black">
              <Image source={image} className="h-full w-full opacity-90" resizeMode="cover" />
              <View className="absolute bottom-0 w-full bg-black/50 p-4">
                <Text className="mb-1 font-poppins-bold text-xs uppercase tracking-widest text-[#e8d4b0]">
                  {tag}
                </Text>
                <Text className="font-poppins-bold text-xl leading-tight text-white">{title}</Text>
              </View>
            </View>

            {/* Toggle Buttons */}
            <View className="mx-4 mt-6 flex-row rounded-xl border border-[#6d4c41] bg-[#5d4037] p-1">
              <TouchableOpacity
                onPress={() => setActiveTab('talasalitaan')}
                className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${activeTab === 'talasalitaan' ? 'bg-[#8d6e63]' : 'bg-transparent'}`}>
                <FontAwesome5
                  name="book"
                  size={14}
                  color={activeTab === 'talasalitaan' ? '#fff' : '#bcaaa4'}
                />
                <Text
                  className={`ml-2 font-poppins-bold text-sm ${activeTab === 'talasalitaan' ? 'text-white' : 'text-[#bcaaa4]'}`}>
                  Talasalitaan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab('nobela')}
                className={`flex-1 flex-row items-center justify-center rounded-lg py-3 ${activeTab === 'nobela' ? 'bg-[#8d6e63]' : 'bg-transparent'}`}>
                <FontAwesome5
                  name="book-open"
                  size={14}
                  color={activeTab === 'nobela' ? '#fff' : '#bcaaa4'}
                />
                <Text
                  className={`ml-2 font-poppins-bold text-sm ${activeTab === 'nobela' ? 'text-white' : 'text-[#bcaaa4]'}`}>
                  Nobela
                </Text>
              </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View className="mx-4 mt-6 min-h-[400px] rounded-2xl bg-[#efede6] p-5">
              {activeTab === 'talasalitaan' ? (
                <View>
                  {/* --- LAYOUT 1: Multiple Choice --- */}
                  {chapterContent.quizType === 'multiple-choice' && (
                    <View>
                      <Text className="mb-2 font-serif text-xl font-bold text-ink">
                        TUMPAK SALITA
                      </Text>
                      <Text className="mb-6 text-justify font-poppins text-xs leading-5 text-ink opacity-80">
                        <Text className="font-bold">Panuto: </Text>
                        Basahin nang mabuti ang bawat pangungusap. Piliin at pindutin ang pinakaangkop na kasingkahulugan.
                      </Text>
                      {chapterContent.quiz.map((item, index) => (
                        <View key={item.id} className="mb-8">
                          <Text className="mb-3 font-poppins text-sm leading-6 text-ink">
                            {index + 1}.{' '}
                            {item.question!.split(item.wordToDefine!).map((part, i, arr) => (
                              <Text key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                  <Text className="font-bold underline">{item.wordToDefine}</Text>
                                )}
                              </Text>
                            ))}
                          </Text>
                          <View className="flex-row justify-between gap-1">
                            {item.options!.map((option, idx) => {
                              const isSelected = selectedAnswers[item.id] === option;
                              return (
                                <TouchableOpacity
                                  key={idx}
                                  onPress={() => handleSelectAnswer(item.id, option, item.correct!)}
                                  className={`flex-1 items-center justify-center rounded-lg border border-ink px-1 py-2 ${isSelected ? 'bg-ink' : 'bg-[#e8d4b0]'}`}>
                                  <Text
                                    className={`text-center font-poppins-bold text-[10px] ${isSelected ? 'text-white' : 'text-ink'}`}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit>
                                    {option}
                                  </Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* --- LAYOUT 2: Mind Map --- */}
                  {chapterContent.quizType === 'mind-map' && (
                    <View className="items-center py-4">
                      <Text className="mb-4 font-poppins-bold text-lg text-ink">
                        Buuin ang Diwa
                      </Text>
                      <Text className="mb-6 px-4 text-center font-poppins text-xs text-ink opacity-70">
                        Isulat sa bawat hugis ang unang salitang pumasok sa iyong isipan na may
                        kaugnayan sa salitang nasa gitna.
                      </Text>

                      <View className="relative mb-6 h-[300px] w-full items-center justify-center">
                        <View className="absolute left-[35%] top-[60px] h-16 w-[2px] -rotate-45 bg-ink/50" />
                        <View className="absolute right-[35%] top-[60px] h-16 w-[2px] rotate-45 bg-ink/50" />
                        <View className="absolute bottom-[60px] left-[35%] h-16 w-[2px] rotate-45 bg-ink/50" />
                        <View className="absolute bottom-[60px] right-[35%] h-16 w-[2px] -rotate-45 bg-ink/50" />

                        <View className="z-10 h-32 w-32 items-center justify-center rounded-full border-2 border-dashed border-ink bg-[#f5c170] shadow-sm">
                          <View className="h-28 w-28 items-center justify-center rounded-full border border-ink bg-[#f5c170]">
                            <Text className="font-serif text-lg font-bold text-ink">
                              {chapterContent.quiz[0].centerWord}
                            </Text>
                          </View>
                        </View>

                        {[
                          { top: 0, left: 0 },
                          { top: 0, right: 0 },
                          { bottom: 0, left: 0 },
                          { bottom: 0, right: 0 },
                        ].map((pos, idx) => (
                          <TextInput
                            key={idx}
                            className="absolute h-12 w-28 rounded-full border border-ink bg-[#e8d4b0] text-center font-poppins-bold text-xs text-ink shadow-sm"
                            style={pos}
                            placeholder="?"
                            placeholderTextColor="#8d6e63"
                            value={mindMapInputs[idx]}
                            onChangeText={(text) => handleMindMapChange(text, idx)}
                          />
                        ))}
                      </View>

                      <Text className="mt-2 w-full border-t border-ink/20 pt-4 text-justify font-poppins text-xs leading-5 text-ink">
                        <Text className="font-bold">Pahiwatig: </Text>
                        {chapterContent.quiz[0].hint}
                      </Text>
                    </View>
                  )}

                  {/* --- LAYOUT 3: PUNAN MO! --- */}
                  {chapterContent.quizType === 'punan-mo' && (
                    <View>
                      <Text className="mb-2 text-center font-serif text-xl font-bold text-ink">
                        PUNAN MO!
                      </Text>
                      <Text className="mb-6 text-justify font-poppins text-xs leading-5 text-ink opacity-80">
                        <Text className="font-bold">Panuto: </Text>
                        Isulat ang nawawalang titik sa ilang kahon upang mabuo ang kahulugan ng
                        salitang may salungguhit. Gamiting gabay ang pangungusap sa bawat kahon.
                      </Text>

                      <View className="flex-row flex-wrap justify-between">
                        {chapterContent.quiz.map((item, index) => {
                          const isFullWidth = index === 4;
                          const containerWidth = isFullWidth ? 'w-full' : 'w-[48%]';

                          return (
                            <View key={item.id} className={`${containerWidth} mb-6`}>
                              <View className="mb-2 min-h-[80px] justify-center border border-ink bg-[#e8d4b0]/30 p-2 shadow-sm">
                                <Text className="font-poppins text-[10px] leading-4 text-ink">
                                  {index + 1}.{' '}
                                  {item.question!.split(item.wordToDefine!).map((part, i, arr) => (
                                    <Text key={i}>
                                      {part}
                                      {i < arr.length - 1 && (
                                        <Text className="font-bold underline">
                                          {item.wordToDefine}
                                        </Text>
                                      )}
                                    </Text>
                                  ))}
                                </Text>
                              </View>
                              <View className="flex-row flex-wrap justify-center gap-[1px]">
                                {item.clues!.map((char, charIdx) => {
                                  const isPreFilled = char !== '';
                                  const inputKey = `q${item.id}-${charIdx}`;
                                  return (
                                      <View
                                          key={charIdx}
                                          // Updated: Removed box border/bg, added bottom border, reduced width
                                          className="h-6 w-4 items-center justify-center border-b border-ink">
                                        {isPreFilled ? (
                                            <Text className="font-poppins-bold text-xs text-ink">
                                              {char}
                                            </Text>
                                        ) : (
                                            <TextInput
                                                ref={(el) => (punanInputRefs.current[inputKey] = el)}
                                                className="h-full w-full p-0 text-center font-poppins-bold text-xs text-ink"
                                                maxLength={1}
                                                value={punanInputs[inputKey] || ''}
                                                onChangeText={(text) =>
                                                    handlePunanTextChange(
                                                        text,
                                                        item.id,
                                                        charIdx,
                                                        item.clues!
                                                    )
                                                }
                                                onKeyPress={(e) =>
                                                    handlePunanKeyPress(e, item.id, charIdx, item.clues!)
                                                }
                                            />
                                        )}
                                      </View>
                                  );
                                })}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* --- LAYOUT 4: MATCHING TYPE (Tap to Place) --- */}
                  {chapterContent.quizType === 'matching' && (
                    <View>
                      <Text className="mb-2 text-center font-serif text-xl font-bold text-ink">
                        {chapterContent.quizTitle}
                      </Text>
                      <Text className="mb-6 text-justify font-poppins text-xs leading-5 text-ink opacity-80">
                        <Text className="font-bold">Panuto: </Text>
                        {chapterContent.quizInstructions ||
                          'Iugnay ang salita sa tamang kahulugan.'}
                      </Text>

                      <View className="mb-8 mt-4">
                        {chapterContent.quiz.map((item) => {
                          const isLongAnswer = id === 4;
                          const lineWidth = isLongAnswer ? 'flex-1' : 'w-[30%]';
                          const termWidth = isLongAnswer ? 'w-[40%]' : 'flex-1';

                          return (
                            <View key={item.id} className="mb-4 flex-row items-center">
                              <TouchableOpacity
                                onPress={() => handleLineClick(item.id)}
                                className={`${lineWidth} border-b-2 ${matches[item.id] ? 'border-ink bg-ink/10' : 'border-ink'} mr-3 h-auto min-h-[32px] justify-end pb-1`}>
                                <Text className="px-1 text-center font-poppins-bold text-[10px] text-ink">
                                  {matches[item.id] || ''}
                                </Text>
                              </TouchableOpacity>
                              <View className={termWidth}>
                                <Text className="font-poppins text-xs leading-4 text-ink">
                                  {item.id}. <Text className="font-bold">{item.term}</Text>
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>

                      <View className="flex-row flex-wrap justify-center gap-2 border-t border-ink/20 pt-6">
                        {chapterContent.matchingChoices?.map((choice, idx) => {
                          const isUsed = Object.values(matches).includes(choice);
                          const isActive = activeChoice === choice;
                          if (isUsed) return null;
                          return (
                            <TouchableOpacity
                              key={idx}
                              onPress={() => handleChoiceClick(choice)}
                              className={`rounded-md border px-3 py-2 ${isActive ? 'border-ink bg-ink' : 'border-[#8d6e63] bg-[#bcaaa4]'} shadow-sm`}>
                              <Text
                                className={`font-poppins-bold text-[10px] ${isActive ? 'text-white' : 'text-[#3e2723]'}`}>
                                {choice}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  )}

                  {/* --- LAYOUT 5: LINE CONNECT (Draw Lines) --- */}
                  {chapterContent.quizType === 'line-connect' && (
                    <View>
                      <Text className="mb-2 text-center font-serif text-xl font-bold text-ink">
                        {chapterContent.quizTitle}
                      </Text>
                      <Text className="mb-6 text-justify font-poppins text-xs leading-5 text-ink opacity-80">
                        <Text className="font-bold">Panuto: </Text>
                        {chapterContent.quizInstructions}
                      </Text>

                      <View className="relative flex-row justify-between">
                        {/* SVG LAYER - zIndex 10 ensures visibility on top of background */}
                        <View
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10,
                          }}
                          pointerEvents="none">
                          <Svg height="100%" width="100%">
                            {Object.entries(connectedPairs).map(([termIdStr, defString]) => {
                              const termId = Number(termIdStr);
                              const termRect = termLayouts[termId];
                              const defRect = defLayouts[defString];

                              if (!termRect || !defRect) return null;

                              // Start: Right edge of Left Column (40%)
                              const startX = '40%';
                              // End: Left edge of Right Column (100% - 55% = 45%)
                              const endX = '45%';

                              // Center Y of each box
                              const startY = termRect.y + termRect.height / 2;
                              const endY = defRect.y + defRect.height / 2;

                              return (
                                <Line
                                  key={termId}
                                  x1={startX}
                                  y1={startY}
                                  x2={endX}
                                  y2={endY}
                                  stroke="#8B4513"
                                  strokeWidth="2"
                                />
                              );
                            })}
                          </Svg>
                        </View>

                        {/* LEFT COLUMN */}
                        <View className="w-[40%] space-y-4">
                          {chapterContent.quiz.map((item) => {
                            const isMatched = !!connectedPairs[item.id];
                            const isSelected = selectedTerm === item.id;

                            return (
                              <TouchableOpacity
                                key={item.id}
                                onLayout={(event) => {
                                  const layout = event.nativeEvent.layout;
                                  setTermLayouts((prev) => ({ ...prev, [item.id]: layout }));
                                }}
                                onPress={() => handleTermPress(item.id)}
                                className={`mb-4 h-24 justify-center rounded-lg border-2 p-3 ${
                                  isMatched
                                    ? 'border-ink bg-[#d7ccc8]'
                                    : isSelected
                                      ? 'border-ink bg-[#f5c170]'
                                      : 'border-ink bg-[#e8d4b0]'
                                }`}>
                                <Text className="text-center font-poppins-bold text-xs text-ink">
                                  {item.term}
                                </Text>
                                {isMatched && (
                                  <View className="absolute right-[-10px] top-10 rounded-full border border-[#e8d4b0] bg-ink p-1">
                                    <FontAwesome5 name="link" size={10} color="#e8d4b0" />
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {/* RIGHT COLUMN */}
                        <View className="w-[55%] space-y-4">
                          {chapterContent.matchingChoices?.map((choice, idx) => {
                            const isMatched = Object.values(connectedPairs).includes(choice);

                            return (
                              <TouchableOpacity
                                key={idx}
                                onLayout={(event) => {
                                  const layout = event.nativeEvent.layout;
                                  setDefLayouts((prev) => ({ ...prev, [choice]: layout }));
                                }}
                                onPress={() => handleDefinitionPress(choice)}
                                className={`mb-4 h-24 justify-center rounded-lg border p-2 ${
                                  isMatched ? 'border-ink bg-[#d7ccc8]' : 'border-ink/50 bg-white'
                                }`}>
                                <Text className="text-justify font-poppins text-[10px] leading-3 text-ink">
                                  {choice}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    </View>
                  )}

                  <View className="mt-8 flex-row justify-around">
                    <TouchableOpacity
                      onPress={handleSave}
                      className="flex-1 rounded-lg bg-[#8d6e63] px-4 py-3">
                      <Text className="text-center font-poppins-bold text-white">
                        I-save ang Sagot
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // NOBELA VIEW
                <View>
                  <Text className="mb-4 border-b border-ink/20 pb-2 font-poppins-bold text-lg text-ink">
                    {tag}: {title}
                  </Text>
                  <Text className="text-justify font-poppins text-sm leading-7 text-ink">
                    {chapterContent.nobela}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <StatusBar style="light" backgroundColor="#4a342e" />
    </View>
  );
}
