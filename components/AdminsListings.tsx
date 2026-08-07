import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function AdminsListings({ property }: { property: Property }) {
  return (
    <TouchableOpacity className="w-full rounded-3xl overflow-hidden bg-gray-50 border border-gray-100">
      <Image
        source={{ uri: property.images[0] }}
        className="w-full h-60"
        resizeMode="cover"
      />
      {property.is_sold && (
        <View className="absolute top-3 right-3 bg-red-500 px-3 py-1 rounded-full">
          <Text className="text-xs font-semibold text-white">Sold</Text>
        </View>
      )}
      <View className="p-4">
        <Text
          className="text-lg font-semibold text-gray-900 mb-2"
          numberOfLines={1}
        >
          {property.brief_description}
        </Text>
        <Text
          className="text-base text-gray-600 font-normal leading-tight mb-2"
          numberOfLines={2}
        >
          {property.detailed_description}
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
