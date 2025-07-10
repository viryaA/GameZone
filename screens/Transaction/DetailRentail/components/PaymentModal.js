import { Modal, View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import i18n from "../../../../Locale/i18n";
import "../../../../global.css";

export default function PaymentModal({
  visible,
  onClose,
  dates,
  item,
  startTime,
  endTime,
  durasi,
  totalPrice,
  priceRng,
  onPay,
}) {
  const formatDate = (date) => {
    return date?.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      weekday: "short",
    });
  };

  const calculateEndTime = () => {
    if (!startTime || !durasi) return null;

    const [startHour, startMinute] = startTime
      .split(":")
      .map((v) => parseInt(v));
    if (isNaN(startHour) || isNaN(startMinute)) return null;

    const endHour = (startHour + durasi) % 24; // agar tetap dalam format 0–23
    return `${endHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
  };

  const getAmPm = (timeStr) => {
    if (!timeStr) return "";
    const [hour] = timeStr.split(":").map(Number);
    return hour >= 12 ? "PM" : "AM";
  };

  console.log("item", item);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <BlurView intensity={50} tint="dark" className="flex-1 justify-end">
        <View className="bg-[#5829AB] rounded-t-3xl px-6 pt-4 pb-6">
          <View className="items-center">
            <View className="w-12 h-1.5 bg-white/50 rounded-full mb-4" />
            <Text className="text-white font-bold text-xl mb-4">
              {item.rng_nama_ruangan}
            </Text>
          </View>

          {/* Play Date & Time */}
          <View
            className="bg-white/10 p-4 rounded-3xl mb-4"
            style={{
              borderWidth: 1.5,
              borderColor: "#ffffff", // Warna outline putih
            }}
          >
            <Text className="text-white mb-1">Play Date & Time</Text>
            <View className="flex-row justify-between">
              <View>
                <Text className="text-white font-bold">{formatDate(dates)}</Text>
                <Text className="text-white text-sm">
                  {startTime || "--:--"} {getAmPm(startTime)}
                </Text>
              </View>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                className="self-center"
              />
              <View>
                <Text className="text-white font-bold">{formatDate(dates)}</Text>
                <Text className="text-white text-sm">
                  {calculateEndTime() || "--:--"} {getAmPm(calculateEndTime())}
                </Text>
              </View>
            </View>
          </View>

          {/* Total Amount */}
          <View
            className="bg-white/10 p-4 rounded-3xl mb-6"
            style={{
              borderWidth: 1.5,
              borderColor: "#ffffff", // Warna outline putih
            }}
          >
            <Text className="text-white mb-1">{i18n.t("totalPayment")}</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-white">
                Rp {item.rng_harga_per_jam.toLocaleString("id-ID")} x{" "}
                {durasi || 0} {i18n.t("jam")}
              </Text>
              <Text className="text-white font-bold text-lg">
                Rp
                {(parseInt(item.rng_harga_per_jam) * durasi).toLocaleString(
                  "id-ID"
                ) || 0}
              </Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={() => onPay?.()}
            className="bg-[#FF3366] py-4 rounded-xl items-center shadow-md"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <Text className="text-white font-semibold text-base">
              {i18n.t("confirmBook")}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}
