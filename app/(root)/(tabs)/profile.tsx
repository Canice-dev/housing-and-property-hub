import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white mb-10">
      <Text className="text-xl font-bold text-gray-800">ProfileScreen</Text>

      <TouchableOpacity
        onPress={handleSignOut}
        className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100 m-8"
      >
        <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
