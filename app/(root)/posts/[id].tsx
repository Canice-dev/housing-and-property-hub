import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserAllPOsts() {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-gray-50 px-5">
      <View className="pt-4 pb-3">
        <View className="flex-row items-center gap-3 py-2">
          <TouchableOpacity
            onPress={() => router.push("/(root)/(tabs)/profile")}
          >
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-2xl font-bold text-gray-900 mb-4">
              All Posts
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
