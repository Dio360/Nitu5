import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { C } from "@/theme";

type Kind = "dark" | "green" | "yellow" | "ghost" | "danger";

/** Nitu5 buttons: clean fills, soft radius, big tap targets. */
export const Btn: React.FC<{
  title: string;
  onPress: () => void;
  disabled?: boolean;
  kind?: Kind;
}> = ({ title, onPress, disabled, kind = "dark" }) => (
  <TouchableOpacity
    style={[s.base, s[kind], disabled && s.off]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.85}
  >
    <Text style={[s.txt, (kind === "yellow" || kind === "ghost") && s.txtDark]}>{title}</Text>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  dark: { backgroundColor: C.ink },
  green: { backgroundColor: C.green },
  yellow: { backgroundColor: C.yellow },
  ghost: { backgroundColor: C.card, borderWidth: 1, borderColor: C.inputLine },
  danger: { backgroundColor: C.red },
  off: { opacity: 0.5 },
  txt: { color: "#fff", fontSize: 16, fontWeight: "700" },
  txtDark: { color: C.ink },
});
