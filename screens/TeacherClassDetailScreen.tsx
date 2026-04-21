import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { supabase } from '../src/lib/supabase';

type TeacherClassDetailRouteProp = RouteProp<RootStackParamList, 'TeacherClassDetail'>;

export default function TeacherClassDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<TeacherClassDetailRouteProp>();
  const { classId, className } = route.params;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://4pmodel.vercel.app';
    console.log('Fetching from URL:', `${backendUrl}/api/teacher/class-progress?classId=${classId}`);
    try {
      const res = await fetch(`${backendUrl}/api/teacher/class-progress?classId=${classId}`);

      if (!res.ok) throw new Error('Failed to fetch class data');
      
      const data = await res.json();
      
      if (data.profiles.length === 0) {
        setStudents([]);
        return;
      }

      const { profiles, chapters, talasalitaan, activities } = data;

      // Aggregate per student
      const rows = profiles.map((p: any) => {
        const uid = p.id;
        
        // Unique chapters read
        const chaptersRead = new Set(
          chapters.filter((r: any) => r.user_id === uid).map((r: any) => r.chapter_id)
        ).size;

        // Unique chapters with talasalitaan answered
        const talasalitaanDone = new Set(
          talasalitaan?.filter((r: any) => r.user_id === uid).map((r: any) => r.chapter_id) || []
        ).size;

        // 4P activity answers
        const activityData = activities.filter((r: any) => r.user_id === uid);
        const countUnique = (type: string) =>
          new Set(
            activityData
              .filter((r: any) => r.activity_type === type)
              .map((r: any) => `${r.chapter_range}-${r.question_index}`)
          ).size;

        return {
          id: uid,
          name: p.name ?? '—',
          chaptersRead,
          talasalitaanDone,
          paghihinuha: countUnique('paghihinuha'),
          pagsisiyasat: countUnique('pagsisiyasat'),
          paglilinaw: countUnique('paglilinaw'),
          pagbubuod: countUnique('pagbubuod'),
        };
      });


      setStudents(rows);
    } catch (error: any) {
      console.error('Error fetching student data:', error);
      Alert.alert('Error', 'Hindi makuha ang datos ng mga estudyante.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const ProgressBar = ({ label, current, max }: { label: string, current: number, max: number }) => (
    <View className="mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="font-poppins text-[10px] text-ink opacity-70">{label}</Text>
        <Text className="font-poppins-bold text-[10px] text-ink">{current}/{max}</Text>
      </View>
      <View className="h-1.5 w-full rounded-full bg-ink/10 overflow-hidden">
        <View 
          className={`h-full rounded-full ${current >= max ? 'bg-green-700' : 'bg-ink/60'}`}
          style={{ width: `${Math.min((current / max) * 100, 100)}%` }} 
        />
      </View>
    </View>
  );

  const StudentItem = ({ item }: { item: any }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <View className="mb-4 w-full rounded-2xl border-2 border-ink bg-parchment shadow-sm overflow-hidden">
        <TouchableOpacity 
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
          className="flex-row items-center justify-between p-5 bg-ink/5">
          <View>
            <Text className="font-poppins-bold text-lg text-ink">{item.name}</Text>
            {!expanded && (
              <Text className="font-poppins text-[10px] text-ink opacity-60">
                Nabasa: {item.chaptersRead}/6 | Akitibidad: {item.paghihinuha + item.pagsisiyasat + item.paglilinaw + item.pagbubuod}
              </Text>
            )}
          </View>
          <Ionicons 
            name={expanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#3e2c2c" 
          />
        </TouchableOpacity>

        {expanded && (
          <View className="p-5 border-t border-ink/10">
            <View className="flex-row space-x-4 mb-4">
              <View className="flex-1">
                <ProgressBar label="Kabanata" current={item.chaptersRead} max={6} />
                <ProgressBar label="Talasalitaan" current={item.talasalitaanDone} max={6} />
              </View>
              <View className="flex-1">
                <ProgressBar label="Paghihinuha" current={item.paghihinuha} max={12} />
                <ProgressBar label="Pagsisiyasat" current={item.pagsisiyasat} max={15} />
              </View>
            </View>
            
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <ProgressBar label="Paglilinaw" current={item.paglilinaw} max={10} />
              </View>
              <View className="flex-1">
                <ProgressBar label="Pagbubuod" current={item.pagbubuod} max={2} />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderStudentItem = ({ item }: { item: any }) => (
    <StudentItem item={item} />
  );



  return (
    <ImageBackground
      source={require('../assets/images/bg_login.png')}
      className="flex-1"
      resizeMode="cover">
      <View className="absolute inset-0 bg-yellow-900/40" />
      
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4 h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text className="font-poppins-bold text-2xl text-white" numberOfLines={1}>{className}</Text>
            <Text className="font-poppins text-sm text-white opacity-80">{students.length} Estudyante</Text>
          </View>
          <TouchableOpacity 
            onPress={onRefresh}
            className="ml-auto h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Ionicons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#f5c170" />
          </View>
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={renderStudentItem}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Ionicons name="people-outline" size={64} color="white" className="opacity-30" />
                <Text className="mt-4 text-center font-poppins text-white opacity-60">Wala pang estudyante sa klaseng ito.</Text>
              </View>
            }
          />
        )}
      </View>

      <StatusBar style="light" />
    </ImageBackground>
  );
}
