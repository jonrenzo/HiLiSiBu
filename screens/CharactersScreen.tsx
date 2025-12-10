import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Platform, LayoutAnimation, UIManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Mock Data: Replace 'require' with your actual character images
const characters = [
    {
        id: 1,
        name: 'Don Crisostomo Magsalin Ibarra',
        image: require('../assets/images/ibarra.png'),
        description: 'Binatang nag-aral sa Europa na nangarap makapagpatayo ng paaralan upang matiyak ang magandang kinabukasan ng kabataan ng San Diego. Siya ay kababata at kasintahan ni Maria Clara.',
    },
    {
        id: 2,
        name: 'Maria Clara delos Santos',
        image: require('../assets/images/maria.png'),
        description: 'Siya ang Kasintahan ni Crisostomo Ibarra na kumakatawan sa isang uri ng Pilipinang lumaki sa kumbento at nagkaroon ng edukasyong nakasalig sa doktrina ng relihiyon.',
    },
    {
        id: 3,
        name: 'Padre Damaso',
        image: require('../assets/images/damaso.png'),
        description: 'Isang kurang Pransiskano na dating kura ng San Diego at siya ring nagpahukay at nagpalipat sa bangkay ni Don Rafael Ibarra sa libingan ng mga Intsik.',
    },
    {
        id: 4,
        name: 'Don Santiago "Kapitan Tiago" delos Santos',
        image: require('../assets/images/tiago.png'),
        description: 'Isang mayamang mangangalakal na taga-Binondo na asawa ni Pia Alba at ama ni Maria Clara. Siya ay isang taong mapagpanggap at laging masunurin sa nakatataas.',
    },
    {
        id: 5,
        name: 'Don Rafael Ibarra',
        image: require('../assets/images/don.png'), // Replace with actual image
        description: 'Ama ni Crisostomo Ibarra na namatay sa bilangguan. Siya ay labis na kinainggitan ni Padre Damaso dahil sa yaman na kanyang tinataglay.',
    },
    {
        id: 6,
        name: 'Padre Hernando Sibyla',
        image: require('../assets/images/hernando.png'), // Replace with actual image
        description: 'Isang paring Dominikano na lihim na sumusubaybay sa bawat kilos ni Crisostomo Ibarra.',
    },
    {
        id: 7,
        name: 'Tiya Isabela',
        image: require('../assets/images/tiya.png'), // Replace with actual image
        description: 'Siya ang hipag ni Kapitan Trago na nag-alaga kay Maria Clara simula nang siya ay sanggol pa lamang.',
    },
    {
        id: 8,
        name: 'Donya Pia Alba delos Santos',
        image: require('../assets/images/pia.png'), // Replace with actual image
        description: 'Siya ang ina ni Maria Clara na sa loob ng anim na taon ng kanilang pagsasama ng kanyang kabiyak na si Kapitan Tiago ay hindi nagkaanak. Siya ay namatay matapos maisilang si Maria Clara.',
    },
    {
        id: 9,
        name: 'Alperes ',
        image: require('../assets/images/alp.png'), // Replace with actual image
        description: 'Siya ang puno ng mga guwardiya sibil at siya rin ay mahigpit na kaagaw ng kura sa kapangyarihan sa San Diego.',
    },
    {
        id: 10,
        name: 'Tenyente Guevarra  ',
        image: require('../assets/images/guev.png'), // Replace with actual image
        description: 'Isa sa matapat na kaibigan ni Don Rafael Ibarra. Siya rin ang tenyente ng guardia civil na nagkuwento kay Crisostomo Ibarra ng totoong sinapit ng kaniyang ama.',
    },
];

export default function CharactersScreen() {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleDescription = (id: number) => {
        // Animate the transition
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        // Toggle: if clicking the same ID, close it (null), otherwise open new ID
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <View className="flex-1 bg-[#4a342e]">
            <SafeAreaView className="flex-1 bg-[#4a342e]">

                {/* Header Title */}
                <View className={`px-4 pb-4 ${Platform.OS === 'android' ? 'pt-8' : 'pt-2'}`}>
                    <Text className="text-[#f5f5f5] text-center font-serif text-xl font-bold tracking-wide shadow-md">
                        Mga Tauhan
                    </Text>
                    <Text className="text-[#bcaaa4] text-center font-poppins text-xs uppercase tracking-widest mt-1">
                        Kabanata 1 - 6
                    </Text>
                </View>

                {/* Main Content Container */}
                <View className="flex-1 bg-[#efede6] mx-4 rounded-t-[30px] overflow-hidden shadow-2xl">
                    <ScrollView
                        className="flex-1 px-5 pt-6"
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }} // Padding for bottom tab bar
                    >
                        {characters.map((char) => {
                            const isExpanded = expandedId === char.id;

                            return (
                                <TouchableOpacity
                                    key={char.id}
                                    activeOpacity={0.9}
                                    onPress={() => toggleDescription(char.id)}
                                    className={`mb-6 rounded-2xl border border-[#d7ccc8] overflow-hidden bg-white shadow-sm transition-all duration-300`}
                                >
                                    <View className="flex-row p-4 items-center">

                                        {/* Portrait Frame (Image) */}
                                        <View className="relative">
                                            {/* Gold Frame Effect using borders */}
                                            <View className="w-20 h-24 rounded-lg border-[3px] border-[#b8860b] shadow-md bg-[#4a342e] overflow-hidden">
                                                <Image
                                                    source={char.image}
                                                    className="w-full h-full opacity-90"
                                                    resizeMode="cover"
                                                />
                                            </View>
                                            {/* Decorative corner dots for frame effect (Optional) */}
                                            <View className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#ffd700] rounded-full m-0.5" />
                                            <View className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#ffd700] rounded-full m-0.5" />
                                            <View className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#ffd700] rounded-full m-0.5" />
                                            <View className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-[#ffd700] rounded-full m-0.5" />
                                        </View>

                                        {/* Name & Hint */}
                                        <View className="flex-1 ml-4 justify-center">
                                            <Text className="text-[#3e2723] font-poppins-bold text-lg leading-6 mb-1">
                                                {char.name}
                                            </Text>
                                            {!isExpanded && (
                                                <Text className="text-[#8d6e63] font-poppins text-[10px] italic">
                                                    Pindutin upang makilala...
                                                </Text>
                                            )}
                                        </View>
                                    </View>

                                    {/* Description (Hidden by default) */}
                                    {isExpanded && (
                                        <View className="px-4 pb-5 pt-0">
                                            <View className="h-[1px] bg-[#d7ccc8] w-full mb-3 opacity-50" />
                                            <Text className="text-[#5d4037] font-poppins text-sm leading-6 text-justify">
                                                {char.description}
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

            </SafeAreaView>
            <StatusBar style="light" backgroundColor="#4a342e" />
        </View>
    );
}
