import AdminsListings from "@/components/AdminsListings";
import { supabase } from "@/lib/supabase";
import { Property } from "@/types";
import { useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminListingsScreen() {
  const { user, isLoaded } = useUser();
  const [listings, setListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAdminListings = async () => {
    // 1. Ensure the user is logged in
    if (!user?.id) return;

    setLoading(true);
    try {
      // 2. Query properties where clerk_id matches the logged-in admin's ID
      const { data: listingData } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", user.id) // Use 'user_id' if that's your column name
        .order("created_at", { ascending: false });

      setListings(listingData ?? []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch once Clerk has loaded and user is authenticated
    if (isLoaded && user) {
      fetchAdminListings();
    }
  }, [isLoaded, user?.id]);

  if (!isLoaded || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-gray-50 px-5 h-full">
      <View className="flex-row justify-between pt-4 pb-2 items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center"
          style={{
            elevation: 1,
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 text-lg font-bold px-5 mb-4 pt-3">
          My Listings
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

      <View className="flex bg-gray-50">
        <Text className="text-sm text-gray-400 mb-1">
          {listings.length} Listings found
        </Text>

        <FlatList
          className="mb-20"
          data={listings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <AdminsListings property={item} />}
          alwaysBounceVertical
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-6 gap-4"
          ListEmptyComponent={
            <View className="items-center justify-center mt-12">
              <Text className="text-gray-400 text-sm">
                You have&apos;nt listed any properties yet. Start by adding a
                new listing!
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
