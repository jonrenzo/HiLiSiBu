import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, Alert, LayoutRectangle } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { FontAwesome5, Feather } from '@expo/vector-icons';
import Svg, { Line } from 'react-native-svg';
import { chaptersData } from '../data/chaptersData';
import { RootStackParamList } from '../navigation/AppNavigator';

type ChapterDetailRouteProp = RouteProp<RootStackParamList, 'ChapterDetail'>;

export default function ChapterDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute<ChapterDetailRouteProp>();

    const { id, title, tag, image } = route.params;
    const chapterContent = chaptersData.find(c => c.id === id);

    const [activeTab, setActiveTab] = useState<'talasalitaan' | 'nobela'>('talasalitaan');

    // --- STATE MANAGEMENT ---

    // 1. Multiple Choice
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

    // 2. Mind Map
    const [mindMapInputs, setMindMapInputs] = useState<string[]>(['', '', '', '']);

    // 3. Punan Mo
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

    // --- HANDLERS ---

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

    // Punan Mo
    const handlePunanTextChange = (text: string, questionId: number, charIndex: number, clues: string[]) => {
        const key = `q${questionId}-${charIndex}`;
        setPunanInputs(prev => ({ ...prev, [key]: text.toUpperCase() }));

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

    const handlePunanKeyPress = (e: any, questionId: number, charIndex: number, clues: string[]) => {
        const key = `q${questionId}-${charIndex}`;
        if (e.nativeEvent.key === 'Backspace') {
            if (!punanInputs[key]) {
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

    // Matching Type 1
    const handleChoiceClick = (choice: string) => {
        setActiveChoice(choice);
    };

    const handleLineClick = (questionId: number) => {
        if (activeChoice) {
            setMatches(prev => ({ ...prev, [questionId]: activeChoice }));
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
            Alert.alert("Pumili muna", "Pumili muna ng salita sa kaliwa.");
            return;
        }

        setConnectedPairs(prev => {
            const newState = { ...prev };
            const existingTermId = Object.keys(newState).find(key => newState[Number(key)] === definition);
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
                <View className="px-4 pt-4 pb-2 flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                        <Feather name="arrow-left" size={24} color="#e8d4b0" />
                    </TouchableOpacity>
                    <Text className="text-[#e8d4b0] font-poppins-bold text-lg ml-2 flex-1 text-center mr-8">
                        {tag}
                    </Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                        {/* Chapter Image */}
                        <View className="mx-4 mt-2 h-56 rounded-2xl overflow-hidden border-2 border-[#5d4037] relative bg-black">
                            <Image source={image} className="w-full h-full opacity-90" resizeMode="cover" />
                            <View className="absolute bottom-0 w-full bg-black/50 p-4">
                                <Text className="text-[#e8d4b0] text-xs font-poppins-bold tracking-widest uppercase mb-1">
                                    {tag}
                                </Text>
                                <Text className="text-white text-xl font-poppins-bold leading-tight">
                                    {title}
                                </Text>
                            </View>
                        </View>

                        {/* Toggle Buttons */}
                        <View className="flex-row mx-4 mt-6 bg-[#5d4037] rounded-xl p-1 border border-[#6d4c41]">
                            <TouchableOpacity onPress={() => setActiveTab('talasalitaan')} className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${activeTab === 'talasalitaan' ? 'bg-[#8d6e63]' : 'bg-transparent'}`}>
                                <FontAwesome5 name="book" size={14} color={activeTab === 'talasalitaan' ? '#fff' : '#bcaaa4'} />
                                <Text className={`ml-2 font-poppins-bold text-sm ${activeTab === 'talasalitaan' ? 'text-white' : 'text-[#bcaaa4]'}`}>Talasalitaan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('nobela')} className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${activeTab === 'nobela' ? 'bg-[#8d6e63]' : 'bg-transparent'}`}>
                                <FontAwesome5 name="book-open" size={14} color={activeTab === 'nobela' ? '#fff' : '#bcaaa4'} />
                                <Text className={`ml-2 font-poppins-bold text-sm ${activeTab === 'nobela' ? 'text-white' : 'text-[#bcaaa4]'}`}>Nobela</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Content Area */}
                        <View className="mx-4 mt-6 bg-[#efede6] rounded-2xl p-5 min-h-[400px]">

                            {activeTab === 'talasalitaan' ? (
                                <View>
                                    {/* --- LAYOUT 1: Multiple Choice --- */}
                                    {chapterContent.quizType === 'multiple-choice' && (
                                        <View>
                                            <Text className="text-ink font-serif text-xl font-bold mb-2">TUMPAK SALITA</Text>
                                            <Text className="text-ink font-poppins text-xs opacity-80 mb-6 leading-5 text-justify">
                                                <Text className="font-bold">Panuto: </Text>
                                                Basahin nang mabuti ang bawat pangungusap. Piliin at pindutin ang angkop na kasingkahulugan.
                                            </Text>
                                            {chapterContent.quiz.map((item, index) => (
                                                <View key={item.id} className="mb-8">
                                                    <Text className="text-ink font-poppins text-sm mb-3 leading-6">
                                                        {index + 1}. {item.question!.split(item.wordToDefine!).map((part, i, arr) => (
                                                        <Text key={i}>{part}{i < arr.length - 1 && <Text className="underline font-bold">{item.wordToDefine}</Text>}</Text>
                                                    ))}
                                                    </Text>
                                                    <View className="flex-row justify-between gap-1">
                                                        {item.options!.map((option, idx) => {
                                                            const isSelected = selectedAnswers[item.id] === option;
                                                            return (
                                                                <TouchableOpacity
                                                                    key={idx}
                                                                    onPress={() => handleSelectAnswer(item.id, option, item.correct!)}
                                                                    className={`flex-1 border border-ink rounded-lg py-2 px-1 items-center justify-center ${isSelected ? 'bg-ink' : 'bg-[#e8d4b0]'}`}
                                                                >
                                                                    <Text className={`font-poppins-bold text-[10px] text-center ${isSelected ? 'text-white' : 'text-ink'}`} numberOfLines={1} adjustsFontSizeToFit>{option}</Text>
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
                                            <Text className="text-ink font-poppins-bold text-lg mb-4">Buuin ang Diwa</Text>
                                            <Text className="text-ink font-poppins text-xs text-center opacity-70 mb-6 px-4">
                                                I-type ang iyong mga sagot sa loob ng mga bilog.
                                            </Text>

                                            <View className="relative w-full h-[300px] items-center justify-center mb-6">
                                                <View className="absolute bg-ink/50 w-[2px] h-16 top-[60px] left-[35%] -rotate-45" />
                                                <View className="absolute bg-ink/50 w-[2px] h-16 top-[60px] right-[35%] rotate-45" />
                                                <View className="absolute bg-ink/50 w-[2px] h-16 bottom-[60px] left-[35%] rotate-45" />
                                                <View className="absolute bg-ink/50 w-[2px] h-16 bottom-[60px] right-[35%] -rotate-45" />

                                                <View className="z-10 w-32 h-32 bg-[#f5c170] rounded-full items-center justify-center border-2 border-dashed border-ink shadow-sm">
                                                    <View className="w-28 h-28 bg-[#f5c170] rounded-full items-center justify-center border border-ink">
                                                        <Text className="font-serif font-bold text-lg text-ink">{chapterContent.quiz[0].centerWord}</Text>
                                                    </View>
                                                </View>

                                                {[
                                                    { top: 0, left: 0 },
                                                    { top: 0, right: 0 },
                                                    { bottom: 0, left: 0 },
                                                    { bottom: 0, right: 0 }
                                                ].map((pos, idx) => (
                                                    <TextInput
                                                        key={idx}
                                                        className="absolute w-28 h-12 bg-[#e8d4b0] rounded-full border border-ink text-center font-poppins-bold text-xs text-ink shadow-sm"
                                                        style={pos}
                                                        placeholder="?"
                                                        placeholderTextColor="#8d6e63"
                                                        value={mindMapInputs[idx]}
                                                        onChangeText={(text) => handleMindMapChange(text, idx)}
                                                    />
                                                ))}
                                            </View>

                                            <Text className="text-ink font-poppins text-xs text-justify leading-5 border-t border-ink/20 pt-4 mt-2 w-full">
                                                <Text className="font-bold">Hint: </Text>
                                                {chapterContent.quiz[0].hint}
                                            </Text>
                                        </View>
                                    )}

                                    {/* --- LAYOUT 3: PUNAN MO! --- */}
                                    {chapterContent.quizType === 'punan-mo' && (
                                        <View>
                                            <Text className="text-ink font-serif text-xl font-bold mb-2 text-center">PUNAN MO!</Text>
                                            <Text className="text-ink font-poppins text-xs opacity-80 mb-6 leading-5 text-justify">
                                                <Text className="font-bold">Panuto: </Text>
                                                Isulat ang nawawalang titik sa ilang kahon upang mabuo ang kahulugan ng salitang may salungguhit.
                                            </Text>

                                            <View className="flex-row flex-wrap justify-between">
                                                {chapterContent.quiz.map((item, index) => {
                                                    const isFullWidth = index === 4;
                                                    const containerWidth = isFullWidth ? 'w-full' : 'w-[48%]';

                                                    return (
                                                        <View key={item.id} className={`${containerWidth} mb-6`}>
                                                            <View className="bg-[#e8d4b0]/30 border border-ink p-2 mb-2 min-h-[80px] justify-center shadow-sm">
                                                                <Text className="text-ink font-poppins text-[10px] leading-4">
                                                                    {index + 1}. {item.question!.split(item.wordToDefine!).map((part, i, arr) => (
                                                                    <Text key={i}>{part}{i < arr.length - 1 && <Text className="font-bold underline">{item.wordToDefine}</Text>}</Text>
                                                                ))}
                                                                </Text>
                                                            </View>
                                                            <View className="flex-row justify-center flex-wrap gap-[2px]">
                                                                {item.clues!.map((char, charIdx) => {
                                                                    const isPreFilled = char !== '';
                                                                    const inputKey = `q${item.id}-${charIdx}`;
                                                                    return (
                                                                        <View key={charIdx} className={`w-5 h-6 border border-ink items-center justify-center ${isPreFilled ? 'bg-[#f5c170]' : 'bg-[#e8d4b0]'}`}>
                                                                            {isPreFilled ? (
                                                                                <Text className="text-ink font-poppins-bold text-xs">{char}</Text>
                                                                            ) : (
                                                                                <TextInput
                                                                                    ref={(el) => punanInputRefs.current[inputKey] = el}
                                                                                    className="w-full h-full text-center font-poppins-bold text-xs text-ink p-0"
                                                                                    maxLength={1}
                                                                                    value={punanInputs[inputKey] || ''}
                                                                                    onChangeText={(text) => handlePunanTextChange(text, item.id, charIdx, item.clues!)}
                                                                                    onKeyPress={(e) => handlePunanKeyPress(e, item.id, charIdx, item.clues!)}
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
                                            <Text className="text-ink font-serif text-xl font-bold mb-2 text-center">
                                                {chapterContent.quizTitle}
                                            </Text>
                                            <Text className="text-ink font-poppins text-xs opacity-80 mb-6 leading-5 text-justify">
                                                <Text className="font-bold">Panuto: </Text>
                                                {chapterContent.quizInstructions || "Iugnay ang salita sa tamang kahulugan."}
                                            </Text>

                                            <View className="mb-8 mt-4">
                                                {chapterContent.quiz.map((item) => {
                                                    const isLongAnswer = id === 4;
                                                    const lineWidth = isLongAnswer ? 'flex-1' : 'w-[30%]';
                                                    const termWidth = isLongAnswer ? 'w-[40%]' : 'flex-1';

                                                    return (
                                                        <View key={item.id} className="flex-row items-center mb-4">
                                                            <TouchableOpacity
                                                                onPress={() => handleLineClick(item.id)}
                                                                className={`${lineWidth} border-b-2 ${matches[item.id] ? 'border-ink bg-ink/10' : 'border-ink'} mr-3 h-auto min-h-[32px] justify-end pb-1`}
                                                            >
                                                                <Text className="text-ink font-poppins-bold text-[10px] text-center px-1">
                                                                    {matches[item.id] || ''}
                                                                </Text>
                                                            </TouchableOpacity>
                                                            <View className={termWidth}>
                                                                <Text className="text-ink font-poppins text-xs leading-4">
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
                                                            className={`px-3 py-2 rounded-md border ${isActive ? 'bg-ink border-ink' : 'bg-[#bcaaa4] border-[#8d6e63]'} shadow-sm`}
                                                        >
                                                            <Text className={`font-poppins-bold text-[10px] ${isActive ? 'text-white' : 'text-[#3e2723]'}`}>
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
                                            <Text className="text-ink font-serif text-xl font-bold mb-2 text-center">
                                                {chapterContent.quizTitle}
                                            </Text>
                                            <Text className="text-ink font-poppins text-xs opacity-80 mb-6 leading-5 text-justify">
                                                <Text className="font-bold">Panuto: </Text>
                                                {chapterContent.quizInstructions}
                                            </Text>

                                            <View className="flex-row justify-between relative">
                                                {/* SVG LAYER - zIndex 10 ensures visibility on top of background */}
                                                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }} pointerEvents="none">
                                                    <Svg height="100%" width="100%">
                                                        {Object.entries(connectedPairs).map(([termIdStr, defString]) => {
                                                            const termId = Number(termIdStr);
                                                            const termRect = termLayouts[termId];
                                                            const defRect = defLayouts[defString];

                                                            if (!termRect || !defRect) return null;

                                                            // Start: Right edge of Left Column (40%)
                                                            const startX = "40%";
                                                            // End: Left edge of Right Column (100% - 55% = 45%)
                                                            const endX = "45%";

                                                            // Center Y of each box
                                                            const startY = termRect.y + (termRect.height / 2);
                                                            const endY = defRect.y + (defRect.height / 2);

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
                                                                    setTermLayouts(prev => ({ ...prev, [item.id]: layout }));
                                                                }}
                                                                onPress={() => handleTermPress(item.id)}
                                                                className={`p-3 rounded-lg border-2 mb-4 h-24 justify-center ${
                                                                    isMatched
                                                                        ? 'bg-[#d7ccc8] border-ink'
                                                                        : isSelected
                                                                            ? 'bg-[#f5c170] border-ink'
                                                                            : 'bg-[#e8d4b0] border-ink'
                                                                }`}
                                                            >
                                                                <Text className="font-poppins-bold text-xs text-center text-ink">
                                                                    {item.term}
                                                                </Text>
                                                                {isMatched && (
                                                                    <View className="absolute right-[-10px] top-10 bg-ink rounded-full p-1 border border-[#e8d4b0]">
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
                                                                    setDefLayouts(prev => ({ ...prev, [choice]: layout }));
                                                                }}
                                                                onPress={() => handleDefinitionPress(choice)}
                                                                className={`p-2 rounded-lg border mb-4 h-24 justify-center ${
                                                                    isMatched
                                                                        ? 'bg-[#d7ccc8] border-ink'
                                                                        : 'bg-white border-ink/50'
                                                                }`}
                                                            >
                                                                <Text className="font-poppins text-[10px] text-ink text-justify leading-3">
                                                                    {choice}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                </View>
                            ) : (
                                // NOBELA VIEW
                                <View>
                                    <Text className="text-ink font-poppins-bold text-lg mb-4 border-b border-ink/20 pb-2">
                                        {tag}: {title}
                                    </Text>
                                    <Text className="text-ink font-poppins text-sm text-justify leading-7">
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
