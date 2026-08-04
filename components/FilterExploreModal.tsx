import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "self contained", value: "self contained" },
  { label: "semi-self contained", value: "semi-self contained" },
  { label: "single room", value: "single room" },
  { label: "land", value: "land" },
  { label: "item", value: "item" },
  { label: "others", value: "others" },
];

export default function FilterExploreModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    type,
    description,
    address,
    city,
    minPrice,
    maxPrice,
    setType,
    setDescription,
    setAddress,
    setCity,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const activeCount = [
    type,
    description,
    address,
    city,
    minPrice,
    maxPrice,
  ].filter((v) => v !== null).length;

  const chip = (active: boolean) =>
    `px-4 py-2 rounded-full border ${
      active ? "bg-gray-900 border-gray-100" : "bg-white border-gray-200"
    }`;

  const chipText = (active: boolean) =>
    `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

  const handleClear = () => {
    resetFilters();
    onClose();
  };
  const handleApply = () => {
    onClose();
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Filters</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text className="text-blue-600 font-semibold text-sm">Clear</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-base font-bold text-gray-800 mb-3">
            Popular
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {TYPES.map((item) => (
              <TouchableOpacity
                key={String(item.value)}
                onPress={() => setType(item.value)}
                className={chip(type === item.value)}
              >
                <Text className={chipText(type === item.value)}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View className="px-5 pb-8 pt-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-gray-800 rounded-2xl py-4 items-center"
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-bold text-base">
              Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
