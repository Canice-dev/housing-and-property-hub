import { useSupabase } from "@/hooks/useSupabase";
import { Property } from "@/types";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}

export default function ProfileScreen() {
  const authSupabase = useSupabase();
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const { signOut, userId } = useAuth();
  const router = useRouter();

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await authSupabase
      .from("saved_properties")
      .select("id, property_id, properties(*)")
      .eq("user_clerk_id", userId)
      .order("id", { ascending: false });

    setSaved((data as unknown as SavedProperty[]) ?? []);
    setLoading(false);
  }, [userId]);

  // Refresh every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved]),
  );

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to update your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split("/").pop() || "profile.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert("Success", "Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile image:", error);
      Alert.alert(
        "Error",
        "Failed to update profile picture. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900">Profile</Text>
        <TouchableOpacity
          // onPress={() => router.push()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
        >
          <Ionicons name="settings-outline" size={20} color="#111827" />
        </TouchableOpacity>
      </View>
      {/* added a scrollView to be able to scroll view */}
      <ScrollView>
        <View className="items-center py-8">
          <View className="relative">
            <Image
              source={{ uri: user.imageUrl }}
              className="w-24 h-24 rounded-full mb-4"
            />
            <TouchableOpacity
              onPress={handleUpdateProfileImage}
              disabled={isUpdating}
              className="absolute bottom-3 right-0 bg-blue-600 rounded-full p-2"
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="camera" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-xl font-bold text-gray-800">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-gray-500 mt-1">
            {user.emailAddresses[0].emailAddress}
          </Text>
        </View>

        <View className="flex-row justify-around mb-6">
          <TouchableOpacity
            onPress={() => router.push("/(root)/(tabs)/starred")}
            className="px-5 pt-4 pb-3 items-center"
          >
            {!loading && (
              <Text className="text-sm text-gray-400 mt-1">{saved.length}</Text>
            )}
            <Text className="text-base text-gray-700 mt-1">Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(root)/listings/userListings")}
          >
            <Text className="text-base text-gray-700 mt-1">My</Text>
            <Text className="text-base text-gray-700">Listings</Text>
          </TouchableOpacity>
        </View>
        {/* Menu Items */}
        <View className="px-6 gap-2">
          <MenuItem
            icon="star"
            label="Starred Properties"
            onPress={() => router.push("/(root)/(tabs)/starred")}
          />
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() =>
              Alert.alert("Coming Soon", "Notifications coming soon!")
            }
          />

          <MenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() =>
              Linking.openURL(
                "mailto:caniceaba404@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App",
              )
            }
          />
          <TouchableOpacity
            className="flex-row justify-between items-center w-full h-14 rounded-2xl px-5 bg-gray-50"
            onPress={() => router.push("/(root)/listings/userListings")}
          >
            <View className="flex-row items-center gap-3">
              <Ionicons name="add-circle-outline" size={24} color={"#6b7280"} />
              <Text className="text-gray-700">All Posts</Text>
            </View>
            <View>
              <Ionicons name="chevron-forward" size={20} color={"#d1d5db"} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100 m-8"
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-red-500 font-semibold text-base">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center gap-4 bg-gray-50 px-4 py-4 rounded-2xl"
    >
      <Ionicons name={icon} size={22} color="#6B7280" />
      <Text className="flex-1 text-gray-700 font-medium text-base">
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );
}
