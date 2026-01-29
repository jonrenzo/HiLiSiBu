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
  const questions = [
    {
      id: 1,
      text: "Batay sa mga naging pahayag at kilos ng mga panauhin sa piging na idinaos ni Kapitan Tiago. Paano mo mapatutunayan na mayroong hindi pantay na katayuan sa lipunan ang mga tauhang naroon? Magbigay ng mga tiyak na patunay mula sa kabanata upang suportahan ang iyong ideya."
    },
    {
      id: 2,
      text: "Paano inilalarawan sa teksto ang pagtrato kay Ibarra, at ano ang ipinahihiwatig nito tungkol sa umiiral na sistema ng kapangyarihan?"
    },
    {
      id: 3,
      text: "Paano inilalarawan sa nobela ang mga gawi at pamamaraan ng mga prayle, at sa iyong pagsusuri, masasabi mo bang makatarungan ang mga ito? Patunayan ang iyong sagot gamit ang mga sitwasyon at implikasyon ipinakita sa akda."
    },
    {
      id: 4,
      text: "Paano nahahayag ang tunay na pagkatao ni Crisostomo Ibarra sa Kabanata 2 sa pamamagitan ng kanyang pananalita at pakikitungo sa bawat taong kanyang nakasalamuha?"
    },
    {
      id: 5,
      text: "Paano masasabing ang handaan sa bahay ni Kapitan Tiago ay isang maliit na salamin ng lipunang Pilipino noong panahon ng Espanyol? Magbigay ng mga patunay mula sa kabanata na nagpapakita ng ugnayan ng kapangyarihan sa pagitan ng pamahalaan at simbahan"
    }
  ];

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
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

// ==================================================
// 3. PAGLILINAW (Clarification) - PLACEHOLDER
// ==================================================
export const Paglilinaw = () => {
  const characters = [
    {
      id: 1,
      // Ensure you have this image asset
      image: require('../../assets/images/tiago.png'),
      question: 'Sang-ayon ka ba na si Kapitan Tiago ay maituturing na isang "oportunista" dahil sa kanyang pakikipag-ugnayan sa kapwa makapangyarihang prayle at opisyal ng pamahalaan upang mapanatili ang kanyang sariling interes?'
    },
    {
      id: 2,
      image: require('../../assets/images/ibarra.png'),
      question: 'Sa iyong palagay, ang kawalan ba ng marahas na reaksyon ni Ibarra ay tanda ng kanyang pagiging edukado, o maaari itong tingnan bilang isang estratehikong pag-iwas sa gulo?'
    },
    {
      id: 3,
      // You might need to add a 'sibyla.png' or use a placeholder
      image: require('../../assets/images/hernando.png'), // Using Damaso as placeholder if Sibyla missing
      question: 'Sang-ayon ka ba kay Padre Sibyla nang palihim niyang pinupuna o sinusuri ang mga kilos ni Ibarra sa halip na harapin ito nang direkta, na nagpapakita ng kanyang pagiging maingat at mapanuri?'
    },
    {
      id: 4,
      // You might need to add 'rafael.png'
      image: require('../../assets/images/don.png'), // Using Ibarra as placeholder if Rafael missing
      question: 'Sa iyong pagsusuri, maaari mo bang ipaliwanag kung paanong ang matibay na prinsipyo at sariling paninindigan ni Don Rafael ang naging pangunahing mitsa ng kanyang tunggalian sa mga makapangyarihan sa San Diego?'
    },
  ];

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-2 flex-row items-center">
        <MaterialCommunityIcons name="file-document-edit-outline" size={24} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Paglilinaw</Text>
      </View>

      <Text className="font-poppins-bold text-lg text-black mb-1">Sino sila?</Text>

      <Text className="mb-6 font-poppins text-xs text-justify text-[#5d4037] leading-4">
        <Text className="font-bold">Panuto:</Text> Tukuyin ang katangiang ipinakikita ng bawat tauhan at bigyang katuwiran ang mga ito.
      </Text>

      {/* Character Loop */}
      {characters.map((char) => (
        <View key={char.id} className="mb-6 flex-row items-start">

          {/* Left: Golden Frame Portrait */}
          <View className="mr-3 shadow-lg">
            {/* Outer Gold Frame */}
            <View className="h-28 w-24 bg-[#bcaaa4] border-4 border-[#d4af37] rounded-sm p-1 shadow-md justify-center items-center">
              {/* Inner Detail & Image */}
              <View className="w-full h-full border border-[#8d6e63] bg-[#5d4037]">
                <Image
                  source={char.image}
                  className="w-full h-full"
                  resizeMode="cover"
                  defaultSource={{ uri: 'https://via.placeholder.com/100' }}
                />
              </View>
            </View>
          </View>

          {/* Right: Question & Answer Box */}
          <View className="flex-1 bg-white border border-gray-400 rounded-xl p-3 shadow-sm">
            <Text className="font-poppins text-[10px] text-justify text-black mb-4 leading-4">
              {char.question}
            </Text>

            {/* Input Lines */}
            <View className="w-full">
              <View className="border-b border-gray-400 h-6 w-full" />
              <View className="border-b border-gray-400 h-6 w-full" />
              <View className="border-b border-gray-400 h-6 w-full" />

              {/* Invisible Input for typing */}
              <TextInput
                className="absolute top-0 left-0 right-0 bottom-0 text-xs font-poppins text-[#3e2723] pt-2"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

        </View>
      ))}
    </View>
  );
};

// ==================================================
// 4. PAGBUBUOD (Summary) - PLACEHOLDER
// ==================================================
export const Pagbubuod = () => {
  const rubric = [
    { label: "Pag-unawa sa Wakas – Naipakita ang malinaw at wastong pag-unawa sa mahahalagang pangyayari sa wakas ng Noli Me Tangere", points: "5 puntos" },
    { label: "Pagpili ng Mahahalagang Detalye – Natampok lamang ang pinakamahahalagang pangyayari; hindi lumabis sa hinihinging bilang ng pangungusap.", points: "5 puntos" },
    { label: "Kaayusan ng Pagkakasulat – Malinaw, lohikal, at organisado ang pagkakasunod-sunod ng mga pangungusap.", points: "5 puntos" },
    { label: "Kalinawan ng Kaisipan – Malinaw at madaling maunawaan ang ipinahahayag na kaisipan.", points: "5 puntos" },
    { label: "Wastong Gamit ng Wika – Tama ang gramatika, baybay, at bantas.", points: "5 puntos" },
  ];

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <FontAwesome5 name="edit" size={24} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Pagbubuod</Text>
      </View>

      {/* Instruction Box */}
      <View className="mb-6 rounded-xl border-2 border-[#5d4037] bg-[#ffecb3] p-4 shadow-sm border-b-4">
        <Text className="font-poppins text-xs text-justify leading-5 text-[#3e2723]">
          <Text className="font-bold">Panuto:</Text> Sumulat ng isang maikling buod tungkol sa kabanata isa (1) hanggang tatlo (3) mula sa nobelang Noli Me Tangere. Tiyakin na ang iyong buod ay malinaw, organisado, at binubuo lamang ng hindi hihigit sa sampung (10) pangungusap.
        </Text>
      </View>

      {/* Writing Area (Lined Paper) */}
      <View className="mb-6 overflow-hidden rounded-3xl border-4 border-[#e8d4b0] bg-white shadow-md relative min-h-[300px]">
        {/* Lined Background */}
        <View className="absolute top-0 left-0 right-0 bottom-0 pt-10 px-6">
          {[1,2,3,4,5,6,7].map((i) => (
            <View key={i} className="h-10 border-b-2 border-black w-full" />
          ))}
        </View>

        {/* TextInput Overlay */}
        <TextInput
          multiline
          placeholder="Simulan ang iyong buod dito..."
          className="flex-1 pt-10 px-6 text-base font-poppins text-[#3e2723] leading-[40px]"
          textAlignVertical="top"
          style={{ lineHeight: 80 }}
        />
      </View>

      {/* Rubric Table */}
      <View className="border-2 border-[#3e2723] bg-[#f5f5f5]">
        {/* Table Header */}
        <View className="flex-row border-b border-[#3e2723] bg-[#d7ccc8]">
          <View className="flex-1 border-r border-[#3e2723] p-2 items-center justify-center">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">Pamantayan</Text>
          </View>
          <View className="w-16 p-2 items-center justify-center">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">Puntos</Text>
          </View>
        </View>

        {/* Table Rows */}
        {rubric.map((row, index) => (
          <View key={index} className="flex-row border-b border-[#3e2723] bg-white">
            <View className="flex-1 border-r border-[#3e2723] p-2 justify-center">
              <Text className="font-poppins text-xs text-justify text-[#3e2723] leading-3">{row.label}</Text>
            </View>
            <View className="w-16 p-2 items-center justify-center bg-[#efede6]">
              <Text className="font-poppins-bold text-xs text-[#3e2723]">{row.points}</Text>
            </View>
          </View>
        ))}

        {/* Total Row */}
        <View className="flex-row bg-[#d7ccc8]">
          <View className="flex-1 border-r border-[#3e2723] p-2 items-center justify-center">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">Kabuuang Puntos</Text>
          </View>
          <View className="w-16 p-2 items-center justify-center">
            <Text className="font-poppins-bold text-[10px] text-[#3e2723]">25 puntos</Text>
          </View>
        </View>
      </View>
    </View>
  );
};


// ==================================================
// PAGHIHINUHA (Kabanata 4-6) - Situation Analysis
// ==================================================
export const Paghihinuha4to6 = () => {
  const cards = [
    {
      id: 1,
      color: "bg-[#eefeeb]", // Light Green
      borderColor: "border-[#c8e6c9]",
      title: "Sitwasyon:",
      text: "Naglakad si Ibarra nang walang tiyak na paroroonan hanggang marating niya ang liwasan ng Binundok. Wala pa rin siyang nakitang pagbabago mula nang siya ay umalis..."
    },
    {
      id: 2,
      color: "bg-[#fff8e1]", // Light Yellow
      borderColor: "border-[#ffecb3]",
      title: "Sitwasyon:",
      text: "Pagdating ni Ibarra sa Fonda de Lala, naupo siya sa silid at pinagmamasdan mula sa bintana ang maliwanag na bahay sa kabila ng ilog. Narinig niya ang kalansing ng kubyertos at tugtugin ng orkestra..."
    },
    {
      id: 3,
      color: "bg-[#e0f7fa]", // Light Blue
      borderColor: "border-[#b2ebf2]",
      title: "Sitwasyon:",
      text: "Ipinakita ang kayamanan, impluwensya, at pamumuhay ni Kapitan Tiyago: pandak, may bilugang mukha, maimpluwensyang tao, kaibigan ng gobyerno at prayle, at turing sa sarili bilang tunay na Espanyol..."
    }
  ];

  return (
    <View className="pb-8">
      {/* Header */}
      <View className="mb-4 flex-row items-center">
        <FontAwesome5 name="search" size={20} color="#3e2723" />
        <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Paghihinuha (Kabanata 4-6)</Text>
      </View>

      <Text className="mb-6 font-poppins text-xs text-justify text-[#5d4037] leading-5">
        <Text className="font-bold">Panuto:</Text> Basahin at unawain ang bawat sitwasyon. Batay sa mga pahiwatig sa teksto, ilahad ang posibleng susunod na pangyayari, damdamin, o aksyon ng tauhan at ipaliwanag ang iyong lohikal na paghihinuha.
      </Text>

      {/* Cards Loop */}
      {cards.map((card) => (
        <View key={card.id} className="mb-6 flex-row">

          {/* Left: Situation Box */}
          <View className={`w-32 p-4 rounded-xl ${card.color} border ${card.borderColor} justify-center mr-3 shadow-sm`}>
            <Text className="font-poppins-bold text-xs text-center text-[#3e2723] mb-2">
              {card.title}
            </Text>
            <Text className="font-serif italic text-[10px] text-center text-[#5d4037] leading-4">
              {card.text}
            </Text>
          </View>

          {/* Right: Answer Lines */}
          <View className="flex-1 justify-between py-1 bg-[#efede6] rounded-xl border border-[#d7ccc8] p-3 shadow-inner">
            {[1, 2, 3, 4, 5].map((line) => (
              <View key={line} className="border-b border-[#bcaaa4] w-full h-6 mb-1" />
            ))}
            {/* Invisible Text Input overlaying the lines for typing */}
            <TextInput
              className="absolute top-0 left-0 right-0 bottom-0 p-3 text-xs font-poppins text-[#3e2723] leading-7"
              multiline
              textAlignVertical="top"
            />
          </View>

        </View>
      ))}
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
      case 1: return <Dot pos="center" />;
      case 2: return <><Dot pos="top-left" /><Dot pos="bottom-right" /></>;
      case 3: return <><Dot pos="top-left" /><Dot pos="center" /><Dot pos="bottom-right" /></>;
      case 4: return <><Dot pos="top-left" /><Dot pos="top-right" /><Dot pos="bottom-left" /><Dot pos="bottom-right" /></>;
      case 5: return <><Dot pos="top-left" /><Dot pos="top-right" /><Dot pos="center" /><Dot pos="bottom-left" /><Dot pos="bottom-right" /></>;
      case 6: return <><Dot pos="top-left" /><Dot pos="top-right" /><Dot pos="midY-left" /><Dot pos="midY-right" /><Dot pos="bottom-left" /><Dot pos="bottom-right" /></>;
      default: return null;
    }
  };

  return (
      <View style={{ width: size, height: size, backgroundColor: 'white', borderWidth: 2, borderColor: '#3e2723', borderRadius: 12, position: 'relative' }}>
        {renderDots()}
      </View>
  );
};
export const Paglilinaw4to6 = () => {
  const data = [
    {
      id: 1,
      text: "Ano ang ibig sabihin ni Tenyente Guevarra nang sabihin niyang 'mag-ingat' si Ibarra? Ipaliwanag ang kontekstong historikal at personal na dahilan kung bakit mahalaga ang babalang ito."
    },
    {
      id: 2,
      text: "Paano naging simbolo ng kawalang-katarungan ang sinapit ni Don Rafael? Ipaliwanag batay sa pangyayari sa artilyero at sa mga paratang laban sa kanya."
    },
    {
      id: 3,
      text: "Sa Kabanata V, bakit inihambing ang liwanag mula sa bahay ni Maria Clara sa isang 'tala sa gabing madilim'? Ano ang ipinapakitang emosyon at simbolo nito sa nararamdaman ni Ibarra?"
    },
    {
      id: 4,
      text: "Ano ang ipinapakitang katangian ni Padre Sibyla at ng batang Pransiskano sa eksena sa bahay ni Kapitan Tiyago? Ipaliwanag kung paano nagkakaiba ang kanilang kilos at inuusal batay sa inilalahad ng teksto."
    },
    {
      id: 5,
      text: "Bakit sinasabing may 'kapangyarihan' ang pag-ibig sa pamilya at kabanata sa karakter nina Ibarra at Maria Clara sa Kabanata V-VI? Ipaliwanag kung paano ito nagdudulot ng pag-asa o pighati sa mga tauhan."
    },
    {
      id: 6,
      text: "Ano ang ipinahihiwatig ng pagiging 'tunay na Espanyol' ni Kapitan Tiyago ayon sa kanyang asal at paniniwala? Linawin kung paano ito nagpapakita ng kalagayan ng lipunang Pilipino noong panahon ng kolonyalismo."
    }
  ];

  return (
      <View className="pb-8">
        {/* Header */}
        <View className="mb-4 flex-row items-center">
          <MaterialCommunityIcons name="dice-5" size={24} color="#3e2723" />
          <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Paglilinaw</Text>
        </View>

        {/* Instructions */}
        <Text className="mb-6 font-poppins text-xs text-justify text-[#5d4037] leading-5">
          <Text className="font-bold">Panuto:</Text> Pindutin ang dice at sagutin ang katanungang katapat ng numerong lumabas. Batay sa kabanatang nabasa, ipaliwanag ang kahulugan, simbolo, at damdaming ipinapahayag ng bawat tanong.
        </Text>

        {/* Questions List */}
        <View>
          {data.map((item) => (
              <View key={item.id} className="flex-row items-start mb-8">

                {/* Left: Fixed Dice */}
                <View className="mr-4 pt-1">
                  <DiceFace value={item.id} />
                </View>

                {/* Right: Question & Answer Stack */}
                <View className="flex-1">
                  {/* Question Bubble */}
                  <View className="bg-white border-2 border-[#3e2723] rounded-2xl p-3 shadow-sm mb-3">
                    <Text className="font-poppins text-[10px] text-justify text-[#3e2723] leading-4">
                      {item.text}
                    </Text>
                  </View>

                  {/* Answer Input Bubble */}
                  <View className="bg-[#efede6] border-2 border-[#3e2723] rounded-xl p-2 shadow-inner">
                    <TextInput
                        placeholder="Isulat ang iyong sagot dito..."
                        placeholderTextColor="#a1887f"
                        multiline
                        className="text-xs font-poppins text-[#3e2723] min-h-[50px]"
                        textAlignVertical="top"
                    />
                  </View>
                </View>
              </View>
          ))}
        </View>
      </View>
  );
};

// ==================================================
// PAGSISIYASAT (Kabanata 4-6) - CASES 1, 2 & 3
// Matches all G2 FINAL NAA images
// ==================================================
export const Pagsisiyasat4to6 = () => {
  return (
      <View className="pb-8">
        {/* Main Header */}
        <View className="mb-6 flex-row items-center">
          <FontAwesome5 name="eye" size={24} color="#3e2723" />
          <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Pagsisiyasat</Text>
        </View>

        {/* ==================== CASE 1 SECTION ==================== */}
        <View className="mb-8">
          <Text className="font-serif text-lg font-bold text-black mb-2">Case 1: Sino ang Suspek?</Text>

          <Text className="font-poppins text-xs text-justify text-[#5d4037] mb-4 leading-4">
            <Text className="font-bold">Panuto:</Text> Batay sa nabasang akda, Isulat ang pangalan ng tatlong (3) tauhan na posibleng suspek o may motibo sa pagkakakulong sa ama ni Crisostomo Ibarra. Isulat ito sa bawat nakalaang kahon.
          </Text>

          {/* Suspects Row */}
          <View className="flex-row justify-between px-2">
            {[1, 2, 3].map((i) => (
                <View key={i} className="w-[30%] items-center">
                  {/* Silhouette Frame */}
                  <View className="w-full aspect-square bg-white border-2 border-black rounded-lg mb-2 items-center justify-end overflow-hidden relative">
                    <FontAwesome5 name="user-alt" size={55} color="black" style={{ marginBottom: -8 }} />
                    <Text className="absolute top-1 text-white font-serif font-bold text-4xl shadow-sm">?</Text>
                  </View>

                  {/* Yellow Input Box */}
                  <TextInput
                      className="w-full h-8 bg-[#fdd835] border border-[#fbc02d] rounded-md text-center text-[10px] font-poppins-bold text-black p-0"
                  />
                </View>
            ))}
          </View>
        </View>

        {/* ==================== CASE 2 SECTION ==================== */}
        <View className="mb-8">
          <View className="flex-row items-center mb-2">
            <FontAwesome5 name="user-secret" size={20} color="#2e7d32" />
            <Text className="font-serif text-lg font-bold text-black ml-2">Case 2: Ano ang ebidensya?</Text>
          </View>

          <Text className="font-poppins text-xs text-justify text-[#5d4037] mb-4 leading-4">
            <Text className="font-bold">Panuto:</Text> Mula sa mga suspek na iyong inilagay sa Case 1, ilahad mo ang motibo kung bakit sila ang iyong pinaghihinalaang nagpakulong sa ama ni Crisostomo Ibarra.
          </Text>

          {/* STRICT TABLE LAYOUT */}
          <View className="border-2 border-black bg-white mt-2">
            {/* Table Header */}
            <View className="flex-row border-b-2 border-black h-12 bg-white">
              <View className="flex-1 border-r-2 border-black items-center justify-center">
                <Text className="font-serif font-bold text-sm text-black">Motibo</Text>
              </View>
              <View className="flex-1 items-center justify-center">
                <Text className="font-serif font-bold text-sm text-black">Paliwanag</Text>
              </View>
            </View>

            {/* Table Rows */}
            {[1, 2, 3].map((row, index) => (
                <View key={row} className={`flex-row h-16 ${index !== 2 ? 'border-b border-black' : ''}`}>
                  <View className="flex-1 border-r-2 border-black justify-center px-4 bg-white">
                    <TextInput className="w-full h-10 border-b-2 border-black text-xs font-poppins text-black" placeholder="" />
                  </View>
                  <View className="flex-1 justify-center px-4 bg-white">
                    <TextInput className="w-full h-10 border-b-2 border-black text-xs font-poppins text-black" placeholder="" />
                  </View>
                </View>
            ))}
          </View>
        </View>

        {/* ==================== CASE 3 SECTION (NEW) ==================== */}
        <View>
          <View className="flex-row items-center mb-2">
            {/* Silhouette Icon Header */}
            <View className="relative mr-2">
              <FontAwesome5 name="user-alt" size={24} color="black" />
              <Text className="absolute top-0 right-1 text-white font-bold text-[10px]">?</Text>
            </View>
            <Text className="font-serif text-lg font-bold text-black">Case 3 : Sino ang tunay na salarin?</Text>
          </View>

          <Text className="font-poppins text-xs text-justify text-[#5d4037] mb-4 leading-4">
            <Text className="font-bold">Panuto:</Text> Sagutin ang tanong sa ibaba. Ipaliwanag at ilahad batay sa iyong pagkakaunawa sa nobela.
          </Text>

          {/* Large Question Box */}
          <View className="border-2 border-black bg-white p-5">
            <Text className="font-serif font-bold text-xs text-black text-justify mb-4 leading-5">
              Batay sa iyong pagsusuri sa nobela, sino ang tunay na salarin sa pagkakakulong ng ama ni Crisostomo Ibarra, at paano niya naisakatuparan ang kaniyang masamang layunin?
            </Text>

            {/* Lined Writing Area */}
            <View className="relative h-64 mt-2">
              {/* Background Lines */}
              <View className="absolute top-0 left-0 right-0 bottom-0 justify-between py-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((line) => (
                    <View key={line} className="w-full border-b border-black h-6" />
                ))}
              </View>

              {/* Input Overlay */}
              <TextInput
                  className="flex-1 text-xs font-poppins text-black leading-7 p-0 pt-1"
                  multiline
                  textAlignVertical="top"
                  style={{ lineHeight: 28 }} // Adjust line height to match border spacing
              />
            </View>
          </View>
        </View>

      </View>
  );
};


// ==================================================
// PAGBUBUOD (Kabanata 4-6) - Emoji Summary
// Fixed: Emojis are now a placeholder inside the input
// ==================================================
export const Pagbubuod4to6 = () => {
  const rubric = [
    { label: "Pagkilala sa Pangunahing Ideya – Malinaw na naipakita ang pangunahing mensahe ng kabanata batay sa ibinigay na emoji; hindi nalilihis sa sentral na tema.", points: "5 puntos" },
    { label: "Pagluhanay ng Mahahalagang Pangyayari – Kumpleto at lohikal ang pagkakasunod-sunod ng mahahalagang pangyayari; walang labis na detalye.", points: "5 puntos" },
    { label: "Pagiging Komprehensibo at Maikli – Napanatili ang kabuuang saysay ng kabanata sa pinaikling paraan; hindi sumobra sa detalye at hindi nagkulang sa personal na opinyon.", points: "5 puntos" },
    { label: "Kaayusan at Kalinawan ng Paglalahad – Malinaw, organisado, at madaling basahin ang buod; may maayos na daloy ng ideya.", points: "5 puntos" },
    { label: "Gamit ng Wika – Wastong baybay, bantas, at gramatika; malinaw ang mga pangungusap.", points: "5 puntos" },
  ];

  return (
      <View className="pb-8">
        {/* Header */}
        <View className="mb-4 flex-row items-center">
          <FontAwesome5 name="edit" size={24} color="#3e2723" />
          <Text className="ml-2 font-serif text-xl font-bold text-[#3e2723]">Pagbubuod</Text>
        </View>

        {/* Instruction Box */}
        <Text className="font-poppins text-xs text-justify leading-5 text-[#5d4037] mb-4">
          <Text className="font-bold">Panuto:</Text> Basahing mabuti ang itinakdang kabanata mula sa Nobelang Noli Me Tangere. Gamit ang mga emoji, sumulat ng isang maikling buod na binubuo ng apat (4) hanggang anim (6) na pangungusap.
          {"\n\n"}
          Tiyaking malinaw na nakasaad ang pangunahing ideya, mahahalagang pangyayari, at tamang pagkakasunod-sunod ng mga ito. Iwasan ang paglalagay ng labis na detalye, sariling opinyon, o komentaryo; ibatay lamang ang sagot sa mismong nilalaman ng kabanata.
        </Text>

        {/* Writing Area (Lined Paper) */}
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-400 bg-[#f5f5f5] shadow-sm relative min-h-[350px]">

          {/* TextInput Overlay with Emoji Placeholder */}
          <TextInput
              multiline
              // The emoji sequence is now here as a placeholder example
              placeholder="📜🏠😲🤫🔥😮👥   (Magsimula rito...)"
              placeholderTextColor="#757575"
              className="flex-1 pt-10 px-4 text-xs font-poppins  leading-[32px]"
              textAlignVertical="top"
              style={{ lineHeight: 70 }} // Matches the height of the background lines
          />
        </View>

        {/* Rubric Table */}
        <View className="border-2 border-black bg-[#f5f5f5] mb-8">
          {/* Table Header */}
          <View className="flex-row border-b border-black bg-[#d7ccc8] h-10">
            <View className="flex-1 border-r border-black items-center justify-center">
              <Text className="font-poppins-bold text-[10px] text-black">Pamantayan</Text>
            </View>
            <View className="w-16 items-center justify-center">
              <Text className="font-poppins-bold text-[10px] text-black">Puntos</Text>
            </View>
          </View>

          {/* Table Rows */}
          {rubric.map((row, index) => (
              <View key={index} className="flex-row border-b border-black bg-white">
                <View className="flex-1 border-r border-black p-2 justify-center">
                  <Text className="font-poppins text-xs text-justify text-black leading-3">
                    <Text className="font-bold">{row.label.split('–')[0]} –</Text>
                    {row.label.split('–')[1]}
                  </Text>
                </View>
                <View className="w-16 p-2 items-center justify-center bg-[#efede6]">
                  <Text className="font-poppins-bold text-xs text-black">{row.points}</Text>
                </View>
              </View>
          ))}

          {/* Total Row */}
          <View className="flex-row bg-[#d7ccc8] h-8">
            <View className="flex-1 border-r border-black items-center justify-center">
              <Text className="font-poppins-bold text-[10px] text-black">Kabuuang Puntos</Text>
            </View>
            <View className="w-16 items-center justify-center">
              <Text className="font-poppins-bold text-[10px] text-black">25 puntos</Text>
            </View>
          </View>
        </View>
      </View>
  );
};