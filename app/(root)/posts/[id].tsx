import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UserAllPOsts() {
  const router = useRouter();
  return (
    <SafeAreaView className="bg-gray-50 px-5">
      <View className="flex-row justify-between pt-4 pb-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
          style={{
            elevation: 1,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 text-lg font-bold px-5 mb-4">
          All Posts
        </Text>
        <TouchableOpacity
          // onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
          style={{
            elevation: 1,
            // backgroundColor: "rgba(255,255,255,0.88)",
          }}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#111827" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
