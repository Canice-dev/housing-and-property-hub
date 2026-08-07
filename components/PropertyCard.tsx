import { useSavedProperty } from "@/hooks/useSavedProperty";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function PropertyCard({
  property,
  onUnsave,
  showSave = false, // added true for the toggle to work
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
      className="flex-row bg-white rounded-xl mb-4 overflow-hidden border
      border-gray-100"
      style={{
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.06,
        // shadowRadius: 8,
        // elevation: 3,
        opacity: property.is_sold ? 0.5 : 1,
      }}
    >
      {/* Image */}
      <Image
        source={{ uri: property.images[0] }}
        className="w-28 h-[116px]"
        resizeMode="cover"
      />
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text
            className="text-sm font-semibold text-gray-800 mb-2"
            numberOfLines={2}
          >
            {property.brief_description}
          </Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={11} color="#6B7280" />
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {property.address}, {property.city} {property.state}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
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
          {property.is_sold && (
            <View className="bg-red-50 px-2 py-0.5 rounded-full">
              <Text className="text-red-500 text-xs font-semibold">Sold</Text>
            </View>
          )}
        </View>
      </View>

      {/* {showSave && ( */}
      <TouchableOpacity
        onPress={toggleSave}
        disabled={saveLoading}
        className="w-10 items-center pt-3"
      >
        <Ionicons
          name={isSaved ? "heart" : "heart"}
          size={18}
          color={isSaved ? "#FF3B30" : "#9CA3AF"}
        />
      </TouchableOpacity>
      {/* )} */}
    </TouchableOpacity>
  );
}
