import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import i18n from "../../../../Locale/i18n";
import { useState, useEffect } from "react";
import { COLOR_PRIMARY } from "../../../../Locale/constant";
import { Ionicons } from "@expo/vector-icons";

export default function FilterSelector({
  visible,
  onClose,
  selectedStatus,
  selectedHargaperjam,
  selectedJenisPlay,
  onApply,
}) {

  const statusOptions = ["All", "Aktif", "Tidak Aktif"];
  const jenisOptions = ["All", "PS 3", "PS 4", "PS 5"]; 

  const [hargaPerjam, setHargaPerjam] = useState("");
  const [selectedJenis, setSelectedJenis] = useState(selectedJenisPlay || "All");

  const formatRupiah = (angka) => {
    if (!angka) return "";
    const number = parseInt(angka.replace(/\D/g, ""), 10);
    if (isNaN(number)) return "";
    return "Rp " + number.toLocaleString("id-ID");
  };

  useEffect(() => {
    if (selectedHargaperjam === "All" || !selectedHargaperjam) {
      setHargaPerjam("");
    } else {
      setHargaPerjam(formatRupiah(selectedHargaperjam));
    }
  }, [selectedHargaperjam]);

  useEffect(() => {
    setSelectedJenis(selectedJenisPlay || "All");
  }, [selectedJenisPlay]);

  const handleHargaChange = (val) => {
    const raw = val.replace(/\D/g, "");
    setHargaPerjam(formatRupiah(raw));
    onApply(selectedStatus, raw === "" ? "All" : raw, selectedJenis);
  };

  const handleStatusChange = (status) => {
    onApply(status, hargaPerjam.replace(/\D/g, "") || "All", selectedJenis);
  };

  const handleJenisChange = (jenis) => {
    setSelectedJenis(jenis);
    onApply(selectedStatus, hargaPerjam.replace(/\D/g, "") || "All", jenis);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-2xl p-6">
            <Text className="text-lg font-semibold mb-4">{i18n.t("filter")}</Text>

            {/* Status Filter */}
            <Text className="mb-2 text-black font-poppins">{i18n.t("status")}</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedStatus === status
                      ? `bg-[${COLOR_PRIMARY}]`
                      : "bg-gray-200"
                  }`}
                >
                  <View className="flex-row gap-2">
                    <Text
                      className={`${
                        selectedStatus === status ? "text-white" : "text-gray-700"
                      } font-poppins`}
                    >
                      {status}
                    </Text>
                    {selectedStatus === status && (
                      <Ionicons name="checkmark-done" size={18} color="green" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Harga Per Jam */}
            <Text className="mb-2 text-sm text-gray-700">
              {i18n.t("pricePst")} ({i18n.t("leaveEmptyForAll")})
            </Text>
            <TextInput
              keyboardType="numeric"
              value={hargaPerjam}
              onChangeText={handleHargaChange}
              placeholder="Rp 20.000"
              className="border border-gray-300 rounded-xl px-4 py-2 text-base text-gray-800 mb-4"
            />

            {/* Jenis Filter */}
            <Text className="mb-2 text-sm text-gray-700">Jenis Playstation</Text>
            <View className="flex-row flex-wrap gap-2">
              {jenisOptions.map((jenis) => (
                <TouchableOpacity
                  key={jenis}
                  onPress={() => handleJenisChange(jenis)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedJenis === jenis
                      ? `bg-[${COLOR_PRIMARY}]`
                      : "bg-gray-200"
                  }`}
                >
                  <View className="flex-row gap-2 items-center">
                    <Text
                      className={`${
                        selectedJenis === jenis ? "text-white" : "text-gray-700"
                      } font-poppins`}
                    >
                      {jenis}
                    </Text>
                    {selectedJenis === jenis && (
                      <Ionicons name="checkmark-done" size={18} color="green" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tombol Close */}
            <TouchableOpacity
              className={`mt-6 bg-[${COLOR_PRIMARY}] py-2 rounded-lg items-center`}
              onPress={onClose}
            >
              <Text className="text-white font-medium">{i18n.t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
