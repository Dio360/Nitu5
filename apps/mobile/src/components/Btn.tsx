import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Kind = "dark" | "pink" | "yellow" | "ghost" | "danger";

/** Nitu5 buttons: Gumroad colors, chunky borders, hard shadows, big tap targets. */
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
    <Text style={[s.txt, (kind === "pink" || kind === "yellow" || kind === "ghost") && s.txtDark]}>{title}</Text>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    elevation: 3,
  },
  dark: { backgroundColor: "#000" },
  pink: { backgroundColor: "#FF90E8" },
  yellow: { backgroundColor: "#FFC900" },
  ghost: { backgroundColor: "#fff" },
  danger: { backgroundColor: "#E02020" },
  off: { opacity: 0.5 },
  txt: { color: "#fff", fontSize: 16, fontWeight: "800" },
  txtDark: { color: "#000" },
});
