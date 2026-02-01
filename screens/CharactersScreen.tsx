import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
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
    description:
      'Binatang nag-aral sa Europa na nangarap makapagpatayo ng paaralan upang matiyak ang magandang kinabukasan ng kabataan ng San Diego. Siya ay kababata at kasintahan ni Maria Clara.',
  },
  {
    id: 2,
    name: 'Maria Clara delos Santos',
    image: require('../assets/images/maria.png'),
    description:
      'Siya ang Kasintahan ni Crisostomo Ibarra na kumakatawan sa isang uri ng Pilipinang lumaki sa kumbento at nagkaroon ng edukasyong nakasalig sa doktrina ng relihiyon.',
  },
  {
    id: 3,
    name: 'Padre Damaso',
    image: require('../assets/images/damaso.png'),
    description:
      'Isang kurang Pransiskano na dating kura ng San Diego at siya ring nagpahukay at nagpalipat sa bangkay ni Don Rafael Ibarra sa libingan ng mga Intsik.',
  },
  {
    id: 4,
    name: 'Don Santiago "Kapitan Tiago" delos Santos',
    image: require('../assets/images/tiago.png'),
    description:
      'Isang mayamang mangangalakal na taga-Binondo na asawa ni Pia Alba at ama ni Maria Clara. Siya ay isang taong mapagpanggap at laging masunurin sa nakatataas.',
  },
  {
    id: 5,
    name: 'Don Rafael Ibarra',
    image: require('../assets/images/don.png'), // Replace with actual image
    description:
      'Ama ni Crisostomo Ibarra na namatay sa bilangguan. Siya ay labis na kinainggitan ni Padre Damaso dahil sa yaman na kanyang tinataglay.',
  },
  {
    id: 6,
    name: 'Padre Hernando Sibyla',
    image: require('../assets/images/hernando.png'), // Replace with actual image
    description:
      'Isang paring Dominikano na lihim na sumusubaybay sa bawat kilos ni Crisostomo Ibarra.',
  },
  {
    id: 7,
    name: 'Tiya Isabela',
    image: require('../assets/images/tiya.png'), // Replace with actual image
    description:
      'Siya ang hipag ni Kapitan Trago na nag-alaga kay Maria Clara simula nang siya ay sanggol pa lamang.',
  },
  {
    id: 8,
    name: 'Donya Pia Alba delos Santos',
    image: require('../assets/images/pia.png'), // Replace with actual image
    description:
      'Siya ang ina ni Maria Clara na sa loob ng anim na taon ng kanilang pagsasama ng kanyang kabiyak na si Kapitan Tiago ay hindi nagkaanak. Siya ay namatay matapos maisilang si Maria Clara.',
  },
  {
    id: 9,
    name: 'Alperes ',
    image: require('../assets/images/alp.png'), // Replace with actual image
    description:
      'Siya ang puno ng mga guwardiya sibil at siya rin ay mahigpit na kaagaw ng kura sa kapangyarihan sa San Diego.',
  },
  {
    id: 10,
    name: 'Tenyente Guevarra  ',
    image: require('../assets/images/guev.png'), // Replace with actual image
    description:
      'Isa sa matapat na kaibigan ni Don Rafael Ibarra. Siya rin ang tenyente ng guardia civil na nagkuwento kay Crisostomo Ibarra ng totoong sinapit ng kaniyang ama.',
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
    <View className="flex-1 bg-[#4f2b21]">
      <View className="absolute right-[-50] top-[-50] h-64 w-64 rounded-full bg-[#5d4037] opacity-20" />
      <View className="absolute bottom-[100] left-[-30] h-40 w-40 rounded-full bg-[#3e2723] opacity-30" />

      <SafeAreaView className="flex-1 bg-[#4f2b21]">
        {/* Header Title */}
        <View className={`px-4 pb-4 ${Platform.OS === 'android' ? 'pt-8' : 'pt-2'}`}>
          <Text className="text-center font-serif text-xl font-bold tracking-wide text-[#f5f5f5] shadow-md">
            Mga Tauhan
          </Text>
          <Text className="mt-1 text-center font-poppins text-xs uppercase tracking-widest text-[#bcaaa4]">
            Kabanata 1 - 6
          </Text>
        </View>

        {/* Main Content Container */}
        <View className="mx-4 flex-1 overflow-hidden rounded-t-[30px] bg-[#efede6] shadow-2xl">
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
                  className={`mb-6 overflow-hidden rounded-2xl border border-[#d7ccc8] bg-white shadow-sm transition-all duration-300`}>
                  <View className="flex-row items-center p-4">
                    {/* Portrait Frame (Image) */}
                    <View className="relative">
                      {/* Gold Frame Effect using borders */}
                      <View className="h-24 w-20 overflow-hidden rounded-lg border-[3px] border-[#b8860b] bg-[#4a342e] shadow-md">
                        <Image
                          source={char.image}
                          className="h-full w-full opacity-90"
                          resizeMode="cover"
                        />
                      </View>
                      {/* Decorative corner dots for frame effect (Optional) */}
                      <View className="absolute left-0 top-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                      <View className="absolute right-0 top-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                      <View className="absolute bottom-0 left-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                      <View className="absolute bottom-0 right-0 m-0.5 h-1.5 w-1.5 rounded-full bg-[#ffd700]" />
                    </View>

                    {/* Name & Hint */}
                    <View className="ml-4 flex-1 justify-center">
                      <Text className="mb-1 font-poppins-bold text-lg leading-6 text-[#3e2723]">
                        {char.name}
                      </Text>
                      {!isExpanded && (
                        <Text className="font-poppins text-[10px] italic text-[#8d6e63]">
                          Pindutin upang makilala...
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Description (Hidden by default) */}
                  {isExpanded && (
                    <View className="px-4 pb-5 pt-0">
                      <View className="mb-3 h-[1px] w-full bg-[#d7ccc8] opacity-50" />
                      <Text className="text-justify font-poppins text-sm leading-6 text-[#5d4037]">
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
