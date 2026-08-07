import { useSavedProperty } from "@/hooks/useSavedProperty";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function FeaturedCard({
  property,
  onUnsave,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  showSave?: boolean;
}) {
  const router = useRouter();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(
    property.id,
    onUnsave,
  );
  return (
    <TouchableOpacity
      onPress={() => router.push(`/(root)/property/${property.id}`)}
      className="w-60 mr-4 rounded-3xl overflow-hidden bg-gray-50 border
      border-gray-100"
      // style={{
      //   shadowColor: "#000",
      //   shadowOffset: { width: 0, height: 2 },
      //   shadowOpacity: 0.08,
      //   shadowRadius: 12,
      //   elevation: 4,
      //   opacity: property.is_sold ? 0.5 : 1,
      // }}
    >
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-44"
        resizeMode="cover"
      />
      <View className="absolute top-3 left-3 bg-[#e3e7e8] px-3 py-1 rounded-full">
        <Text className="text-xs font-semibold text-[#3c3d3d] capitalize">
          {property.type}
        </Text>
      </View>
      <TouchableOpacity
        onPress={toggleSave}
        disabled={saveLoading}
        className="absolute top-3 right-3 bg-transparent"
      >
        <Ionicons
          name={isSaved ? "heart" : "heart"}
          size={24}
          color={isSaved ? "#FF3B30" : "#363837"}
        />
      </TouchableOpacity>
      {property.is_sold && (
        <View className="absolute top-3 right-3 bg-red-500 px-3 py-1 rounded-full">
          <Text className="text-xs font-semibold text-white">Sold</Text>
        </View>
      )}

      <View className="p-4">
        <Text className="text-base text-gray-800 mb-2" numberOfLines={1}>
          {property.brief_description}
        </Text>

        <View className="flex-row items-center gap-1 mb-3">
          <Ionicons name="location-outline" size={13} color="#6B7280" />
          <Text className="text-xs text-gray-500" numberOfLines={1}>
            {property.address}, {property.city} {property.state}
          </Text>
        </View>

        <View className="flex-col">
          <Text className="text-sm font-semibold text-gray-900">
            Price: {formatPrice(property.initial_price)}
          </Text>
          {/* Conditional rendering for subsequent price */}
          {Number(property?.subsequent_price) > 0 && (
            <Text className="text-sm font-semibold text-gray-900">
              To pay: {formatPrice(property.subsequent_price)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
