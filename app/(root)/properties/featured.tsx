import FeaturedExploreCard from "@/components/FeaturedExploreCard";
import FilterExploreModal from "@/components/FilterExploreModal";
import { supabase } from "@/lib/supabase";
import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-gray-100 border-gray-900" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-gray-600" : "text-gray-600"}`;

export default function SeeAllFeatured({ property }: { property: Property }) {
  const {
    search,
    type,
    description,
    address,
    city,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setMinPrice,
    setMaxPrice,
  } = useFilterStore();

  const activeFilterCount = [
    type !== null,
    description !== null,
    address !== null,
    city !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProperties = async () => {
    setLoading(true);

    try {
      const { data: featuredData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false });

      const { data: recommendedData } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false });

      setFeatured(featuredData ?? []);
      setRecommended(recommendedData ?? []);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Could'nt fetch any property");
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, []),
  );

  return (
    <SafeAreaView className="bg-gray-50 px-4">
      <View className="flex-row items-center justify-between py-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>

        <TouchableOpacity
          className="mx-3 flex-1 flex-col items-center justify-center bg-white rounded-full px-4 py-2.5"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text className="text-gray-900 font-semibold text-base">
            Featured Properties
          </Text>
          <Text className="text-gray-900 font-medium text-sm">
            Limited Time Offers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowFilters(true)}

          className={`p-2 rounded-full ${
            activeFilterCount > 0 ? "bg-transparent" : "bg-transparent"
          }`}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="options-outline" size={20} color="#111827" />
          {activeFilterCount > 0 && (
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
              <Text className="text-white text-[9px] font-bold">
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="flex-row gap-2 px-5 h-10 mb-3"
      >
        {TYPES.map((item) => (
          <TouchableOpacity
            key={String(item.value)}
            onPress={() => setType(item.value)}

            className={chip(type === item.value)}

            // className={chip(type === item.value)}
            // style={shadow}
          >
            <Text className={chipText(type === item.value)}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* <View>
        {loading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator size="small" color="#2563EB" />
          </View>
        ) : (
          <FlatList
            data={featured}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <FeaturedExploreCard property={item} />}
            alwaysBounceVertical
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pb-6 gap-4"
            // Displays explicit fallback text if array is empty
            ListEmptyComponent={
              <View className="items-center justify-center py-20">
                <Text className="text-gray-400 text-sm">
                  No properties found for this category.
                </Text>
              </View>
            }
          />
        )}
      </View> */}
      <FlatList
        className="mb-20"
        data={featured}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View className="px-4">
            <FeaturedExploreCard property={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-6 gap-4"
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No properties found</Text>
            </View>
          ) : null
        }
      />

      {/* Filter Modal */}
      <FilterExploreModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}
