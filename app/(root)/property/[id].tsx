import { useSavedProperty } from "@/hooks/useSavedProperty";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/userStore";
import { Property } from "@/types";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ImageViewing from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
//const ADMIN_PHONE = "09112376172"; // replace with your WhatsApp number

export default function PropertyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  // const [no_of_bedrooms, setNoOfBedrooms] = useState<number | undefined>(
  //   undefined,
  // );
  // const [no_of_bathrooms, setNoOfBathrooms] = useState<number | undefined>(
  //   undefined,
  // );
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const authSupabase = useSupabase();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? "");

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();
    setProperty(data);
    setLoading(false);
  };

  const handleMarkSold = () => {
    Alert.alert("Mark as Sold", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Mark Sold",
        onPress: async () => {
          await authSupabase
            .from("properties")
            .update({ is_sold: true })
            .eq("id", id);
          setProperty((prev) => (prev ? { ...prev, is_sold: true } : prev));
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Property", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await authSupabase.from("properties").delete().eq("id", id);
          router.replace("/(root)/(tabs)");
        },
      },
    ]);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleMobileContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.brief_description}`;
    const url = `tel:${property?.mobile_number}`;
    Linking.openURL(url);
  };
  const handleContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.brief_description}`;
    const url = `https://wa.me/${property?.whatsapp_number}?text=${encodeURIComponent(
      message,
    )}`;
    Linking.openURL(url);
  };

  const handleShare = async () => {
    await Share.share({ message: `Check out ${property?.brief_description}` });
  };

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500">Property not found</Text>
      </View>
    );
  }

  // if (no_of_bedrooms === 0 || no_of_bathrooms === 0) {
  //   setNoOfBedrooms(property.no_of_bedrooms);
  //   setNoOfBathrooms(property.no_of_bathrooms);
  // }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.longitude - 0.003
  }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
    property.latitude + 0.003
  }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                  <Image
                    source={{ uri: item }}
                    style={{ width, height: 350 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
          </View>
          <View className="absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">
              {activeIndex + 1}/{property.images.length}
            </Text>
          </View>

          <SafeAreaView className="absolute top-0 left-0 right-0">
            <View className="flex-row items-center justify-between px-4 pt-2">
              <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-white rounded-full items-center justify-center"
                style={{
                  elevation: 3,
                  backgroundColor: "rgba(255,255,255,0.88)",
                }}
              >
                <Ionicons name="arrow-back" size={20} color="#111827" />
              </TouchableOpacity>
              <View className="absolute right-4 flex-row gap-2">
                <TouchableOpacity
                  onPress={handleShare}
                  className="w-10 h-10 bg-white rounded-full items-center justify-center"
                  style={{
                    elevation: 3,
                    backgroundColor: "rgba(255,255,255,0.88)",
                  }}
                  accessibilityLabel="Share property"
                >
                  <Ionicons name="share-social" size={20} color="#111827" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={toggleSave}
                  disabled={saveLoading}
                  className="w-10 h-10 bg-white rounded-full items-center justify-center"
                  style={{
                    elevation: 3,
                    backgroundColor: "rgba(255,255,255,0.88)",
                  }}
                >
                  <Ionicons
                    name={isSaved ? "heart" : "heart"}
                    size={20}
                    color={isSaved ? "#FF3B30" : "#111827"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View
          className="px-5 pt-5 pb-8"
          style={{ opacity: property.is_sold ? 0.6 : 1 }}
        >
          <View className="flex-row gap-2 mb-3 flex-wrap">
            <Text className="text-2xs font-semibold text-gray-500">
              {property.type}
            </Text>
            {property.is_featured && (
              <Text className="text-[#018A4D] text-2xs font-semibold">
                Featured
              </Text>
            )}
            {property.is_sold && (
              <View className="bg-red-50 px-3 py-1 rounded-full">
                <Text className="text-red-500 text-xs font-semibold">Sold</Text>
              </View>
            )}
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {property.brief_description}
          </Text>
          <Text className="text-md text-gray-600 mb-1">
            {property.detailed_description}
          </Text>
          <View className="flex-row items-center gap-2 mb-4 mt-4">
            <Text className="text-xl font-bold text-gray-900">
              N{property.initial_price}
            </Text>
            <Text className="text-xl font-bold text-gray-900">
              N{property.subsequent_price}
            </Text>
          </View>

          {/* Location */}
          <Text className="text-base font-bold text-gray-900 mb-2">
            Location
          </Text>

          <View className="flex-row items-center gap-2 mb-5">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-gray-500 text-sm flex-1">
              {property.address}, {property.city} {property.state}
            </Text>
          </View>

          {/* <View className="px-5 py-5 border-b border-gray-100">
            <View className="flex-row justify-between">
              <View className="items-center">
                <Ionicons name="bed-outline" size={20} color="#6B7280" />
                <Text>{no_of_bedrooms}</Text>
              </View>
              <View className="items-center">
                <Ionicons name="water-outline" size={20} color="#6B7280" />
                <Text>{no_of_bathrooms}</Text>
              </View>
            </View>
          </View> */}

          {/* MAP PREVIEW */}
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/(root)/property/map",
                params: {
                  latitude: property.latitude,
                  longitude: property.longitude,
                  type: property.type,
                  address: `${property.address}, ${property.city}`,
                },
              })
            }
            activeOpacity={0.9}
            className="rounded-2xl overflow-hidden mb-6"
            style={{ height: 200 }}
          >
            <WebView
              source={{ uri: mapUrl }}
              style={{ flex: 1 }}
              scrollEnabled={false}
              pointerEvents="none"
            />
            <View className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 rounded-full flex-row items-center gap-1">
              <Ionicons name="expand-outline" size={12} color="#374151" />
              <Text className="text-gray-600 text-xs font-medium">
                Tap to expand
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex-row gap-3 mb-4">
            <TouchableOpacity
              onPress={handleMobileContact}
              className="w-1/2 flex-row items-center justify-center gap-2 bg-[#1d9bf0] py-4 rounded-2xl mb-4"
            >
              <Ionicons name="call-outline" size={20} color="white" />
              <Text className="text-white font-bold text-base">Call Agent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleContact}
              className="w-1/2 flex-row items-center justify-center gap-2 bg-green-600 py-4 rounded-2xl mb-4"
            >
              <Ionicons name="logo-whatsapp" size={20} color="white" />
              <Text className="text-white font-bold text-base">
                Contact Agent
              </Text>
            </TouchableOpacity>
          </View>

          {isAdmin && (
            <View className="flex-row gap-3">
              {!property.is_sold && (
                <TouchableOpacity
                  onPress={handleMarkSold}
                  className="flex-1 flex-row items-center justify-center gap-2 bg-amber-50 py-4 rounded-2xl border border-amber-200"
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color="#D97706"
                  />
                  <Text className="text-amber-600 font-semibold">
                    Mark Sold
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={handleDelete}
                className="flex-1 flex-row items-center justify-center gap-2 bg-red-50 py-4 rounded-2xl border border-red-100"
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text className="text-red-500 font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Viewer */}
      <ImageViewing
        images={property.images.map((uri) => ({ uri }))}
        imageIndex={activeIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
}
