import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/AppNavigator';

// Mock Data for Chapters
// TODO: Replace 'require' paths with your actual chapter images
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
    // const navigation = useNavigation();

    const handleRead = (chapterId: number) => {
        console.log(`Open Chapter ${chapterId}`);
        // Add navigation to chapter details here
    };

    return (
        <View className="flex-1 bg-[#4a342e]">
            {/* Safe Area for Status Bar */}
            <SafeAreaView className="bg-[#4a342e]" />

            {/* Main Header Title */}
            <View className={`px-4 pb-6 ${Platform.OS === 'android' ? 'pt-8' : 'pt-2'}`}>
                <View className="bg-[#5d4037] py-3 px-6 rounded-lg border border-[#6d4c41] shadow-lg">
                    <Text className="text-[#f5f5f5] text-center font-serif text-xl font-bold tracking-wide">
                        Mga Piling Kabanata
                    </Text>
                </View>
            </View>

            {/* White Scrollable Container */}
            <View className="flex-1 bg-[#efede6] mx-4 rounded-t-[30px] overflow-hidden shadow-2xl">
                <ScrollView
                    className="flex-1 px-5 pt-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {chapters.map((chapter) => (
                        <View key={chapter.id} className="mb-8 bg-transparent">

                            {/* Chapter Image Card */}
                            <View className="w-full h-40 rounded-xl overflow-hidden mb-3 bg-gray-300 shadow-sm border border-gray-200">
                                <Image
                                    source={chapter.image}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            </View>

                            {/* Chapter Tag (e.g. KABANATA I) */}
                            <View className="self-start bg-[#4e342e] px-3 py-1 rounded-sm mb-1">
                                <Text className="text-[#e8d4b0] text-[10px] font-bold tracking-widest uppercase font-poppins">
                                    {chapter.tag}
                                </Text>
                            </View>

                            {/* Chapter Title */}
                            <Text className="text-black text-2xl font-poppins-bold mb-3 leading-tight">
                                {chapter.title}
                            </Text>

                            {/* Action Button */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => handleRead(chapter.id)}
                                className="bg-[#4e342e] py-3 rounded-full flex-row justify-center items-center shadow-md active:opacity-90"
                            >
                                {/* Book Icon (Simple text representation or use an icon library) */}
                                <Text className="text-white mr-2">📖</Text>
                                <Text className="text-white font-poppins-bold text-sm tracking-wide">
                                    Basahin at Sagutin ang Nobela
                                </Text>
                            </TouchableOpacity>

                        </View>
                    ))}
                </ScrollView>
            </View>

            <StatusBar style="light" backgroundColor="#4a342e" />
        </View>
    );
}
