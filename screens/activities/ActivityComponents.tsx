import React from 'react';
import { View, Text, TextInput, Image, ScrollView } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// ==================================================
// 1. PAGHIHINUHA (Inference) - Character Analysis (Kabanata 1-3)
// ==================================================
export const Paghihinuha = () => {
  // Data derived from the screenshot text
  const characters = [
    {
      id: 1,
      name: 'Ibarra',
      question:
        'Batay sa kanyang kasuotan at ekspresyon, paano mo ilalarawan ang kanyang papel sa lipunang ginagalawan niya?',
      image: require('../../assets/images/ibarra.png'), // Make sure this file exists!
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

  return (
    <View className="pb-8">
      {/* Header Section */}
      <View className="mb-6 flex-row items-center">
        <FontAwesome5 name="search" size={20} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Paghihinuha</Text>
      </View>

      {/* Main Content Area - Gradient-like background */}
      <View className="shadow-inner rounded-2xl bg-[#cba294] p-4">
        {characters.map((char) => (
          <View key={char.id} className="mb-6 flex-row items-center">
            {/* Left: Character Portrait (Circle with Gold Border) */}
            <View className="mr-3 h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-[#d4af37] bg-gray-300 shadow-md">
              {/* Image with fallback */}
              <Image
                source={char.image}
                className="h-full w-full"
                resizeMode="cover"
                defaultSource={{ uri: 'https://via.placeholder.com/150' }} // Prevents crash if image missing
              />
            </View>

            {/* Right: Question Bubble */}
            <View className="relative flex-1 rounded-xl border border-[#3e2723] bg-white p-3 shadow-sm">
              <Text className="mb-4 text-justify font-poppins text-[10px] leading-4 text-black">
                {char.question}
              </Text>

              {/* Answer Line */}
              <TextInput
                className="border-b-2 border-black py-0 font-poppins text-xs text-[#3e2723]"
                placeholder="Isulat ang sagot..."
                placeholderTextColor="#bcaaa4"
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ==================================================
// 2. PAGSISIYASAT (Investigation) - PLACEHOLDER
// ==================================================
export const Pagsisiyasat = () => {
  return (
    <View className="items-center justify-center py-10">
      <View className="mb-4 rounded-full border border-[#8d6e63] bg-[#efede6] p-6">
        <FontAwesome5 name="eye" size={40} color="#5d4037" />
      </View>
      <Text className="font-poppins-bold text-lg text-[#3e2723]">Pagsisiyasat</Text>
      <Text className="mt-2 px-8 text-center font-poppins text-xs text-[#8d6e63]">
        wip
      </Text>
    </View>
  );
};

// ==================================================
// 3. PAGLILINAW (Clarification) - PLACEHOLDER
// ==================================================
export const Paglilinaw = () => {
  return (
    <View className="items-center justify-center py-10">
      <View className="mb-4 rounded-full border border-[#8d6e63] bg-[#efede6] p-6">
        <MaterialCommunityIcons name="projector-screen" size={40} color="#5d4037" />
      </View>
      <Text className="font-poppins-bold text-lg text-[#3e2723]">Paglilinaw</Text>
      <Text className="mt-2 px-8 text-center font-poppins text-xs text-[#8d6e63]">
        wip
      </Text>
    </View>
  );
};

// ==================================================
// 4. PAGBUBUOD (Summary) - PLACEHOLDER
// ==================================================
export const Pagbubuod = () => {
  return (
    <View className="items-center justify-center py-10">
      <View className="mb-4 rounded-full border border-[#8d6e63] bg-[#efede6] p-6">
        <FontAwesome5 name="file-alt" size={40} color="#5d4037" />
      </View>
      <Text className="font-poppins-bold text-lg text-[#3e2723]">Pagbubuod</Text>
      <Text className="mt-2 px-8 text-center font-poppins text-xs text-[#8d6e63]">
        wip
      </Text>
    </View>
  );
};
