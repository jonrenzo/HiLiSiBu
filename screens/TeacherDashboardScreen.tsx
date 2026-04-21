import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { supabase } from '../src/lib/supabase';
import { useAuth } from '../src/hooks/useAuth';

type TeacherDashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TeacherDashboard'>;

export default function TeacherDashboardScreen() {
  const navigation = useNavigation<TeacherDashboardNavigationProp>();
  const { profile, signOut } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClasses(data || []);
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      Alert.alert('Error', 'Hindi makuha ang mga klase.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      Alert.alert('Kulang', 'Paki-enter ang pangalan ng klase.');
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data, error } = await supabase
        .from('classes')
        .insert({
          teacher_id: user.id,
          name: newClassName.trim(),
          invite_code: inviteCode,
        })
        .select()
        .single();

      if (error) throw error;

      setClasses([data, ...classes]);
      setModalVisible(false);
      setNewClassName('');
      Alert.alert('Tagumpay', `Nagawa na ang klaseng ${data.name}! Invite Code: ${data.invite_code}`);
    } catch (error: any) {
      console.error('Error creating class:', error);
      Alert.alert('Error', 'Hindi makagawa ng klase.');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Sigurado ka bang gusto mong lumabas?',
      [
        { text: 'Hindi', style: 'cancel' },
        { 
          text: 'Oo', 
          onPress: async () => {
            await signOut();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          }
        },
      ]
    );
  };

  const renderClassItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('TeacherClassDetail', { classId: item.id, className: item.name })}
      className="mb-4 w-full rounded-2xl border-2 border-ink bg-parchment p-5 shadow-md">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="font-poppins-bold text-xl text-ink">{item.name}</Text>
        <Ionicons name="chevron-forward" size={20} color="#3e2c2c" />
      </View>
      <View className="flex-row items-center">
        <Text className="font-poppins text-sm text-ink opacity-70">Invite Code: </Text>
        <View className="rounded bg-ink px-2 py-0.5">
          <Text className="font-poppins-bold text-sm text-white">{item.invite_code}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/images/bg_login.png')}
      className="flex-1"
      resizeMode="cover">
      <View className="absolute inset-0 bg-yellow-900/40" />
      
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="mb-8 flex-row items-center justify-between">
          <View>
            <Text className="font-poppins-bold text-2xl text-white">Teacher Dashboard</Text>
            <Text className="font-poppins text-sm text-white opacity-80">Kumusta, {profile?.name || 'Guro'}</Text>
          </View>
          <TouchableOpacity 
            onPress={handleLogout}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-800/80">
            <Ionicons name="log-out-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="mb-8 w-full flex-row items-center justify-center rounded-full border-2 border-ink bg-[#f5c170] py-4 shadow-lg">
          <Ionicons name="add-circle-outline" size={24} color="#3e2c2c" className="mr-2" />
          <Text className="font-poppins-bold text-lg text-ink">GUMAWA NG BAGONG CLASS</Text>
        </TouchableOpacity>

        <Text className="mb-4 font-poppins-bold text-lg text-white">Aking mga Klase</Text>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#f5c170" />
          </View>
        ) : (
          <FlatList
            data={classes}
            keyExtractor={(item) => item.id}
            renderItem={renderClassItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="mt-10 items-center">
                <Ionicons name="school-outline" size={64} color="white" className="opacity-30" />
                <Text className="mt-4 text-center font-poppins text-white opacity-60">Wala pang klase. Gumawa ng isa!</Text>
              </View>
            }
          />
        )}
      </View>

      {/* Create Class Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 items-center justify-center bg-black/60 p-6">
          <View className="w-full rounded-3xl border-4 border-[#8B4513] bg-parchment p-6">
            <Text className="mb-4 text-center font-poppins-bold text-xl text-ink">Bagong Klase</Text>
            <TextInput
              placeholder="Pangalan ng Klase (e.g. Grade 9 - Rizal)"
              placeholderTextColor="#a08060"
              className="mb-6 w-full rounded-full border-2 border-ink bg-white/50 px-6 py-3 font-poppins text-ink"
              value={newClassName}
              onChangeText={setNewClassName}
              autoFocus
            />
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 items-center rounded-full border-2 border-ink bg-transparent py-3">
                <Text className="font-poppins-bold text-ink">BATALIN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateClass}
                disabled={creating}
                className="flex-1 items-center rounded-full border-2 border-ink bg-ink py-3">
                {creating ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="font-poppins-bold text-white">GUMAWA</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="light" />
    </ImageBackground>
  );
}
