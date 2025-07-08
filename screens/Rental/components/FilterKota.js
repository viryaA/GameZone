import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { BlurView } from "expo-blur";
import { useState, useEffect } from "react";
import { DAFTAR_KOTA } from "../../../Locale/constant";
import i18n from "../../../Locale/i18n";
import "../../../global.css";

export default function FilterKota({ visible, onClose, onSelectKota }) {
  const [search, setSearch] = useState("");
  const [filteredKota, setFilteredKota] = useState(DAFTAR_KOTA);

  useEffect(() => {
    setFilteredKota(
      DAFTAR_KOTA.filter((kota) =>
        kota.nama.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <BlurView
          intensity={50}
          tint="dark"
          className="flex-1 justify-center items-center"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-11/12 max-h-[80%]"
          >
            <View className="bg-white p-6 rounded-xl shadow-lg">
              <Text className="text-xl font-bold mb-4 text-[#004080]">
                {i18n.t("selectCity") || "Pilih Kota"}
              </Text>

              <TextInput
                placeholder={i18n.t("searchKota") || "Cari kota..."}
                value={search}
                onChangeText={setSearch}
                className="border border-gray-300 rounded-lg p-2 mb-4"
              />

              <View style={{ maxHeight: 300 }} className="mb-4">
                <FlatList
                  data={filteredKota}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="py-3 border-b border-gray-200"
                      onPress={() => {
                        onSelectKota(item);
                        onClose();
                      }}
                    >
                      <Text className="text-gray-800">{item.nama}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              <TouchableOpacity
                onPress={onClose}
                className="py-3 rounded-xl bg-gray-200 items-center"
              >
                <Text className="text-gray-800 font-semibold">
                  {i18n.t("cancel") || "Batal"}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
