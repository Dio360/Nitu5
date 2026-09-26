import React, { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { Trip, api, naira } from "@/api";

export default function TripDetails(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (id) api<Trip>(`/trips/${id}`).then(setTrip);
    }, [id]),
  );

  if (!trip) return <ActivityIndicator style={s.spin} size="large" />;

  return (
    <View style={s.wrap}>
      <View style={s.card}>
        <Text style={s.route}>
          {trip.originLabel} → {trip.destinationLabel}
        </Text>
        <Text style={s.meta}>{new Date(trip.departureAt).toLocaleString()}</Text>
        <Text style={s.meta}>
          {trip.rideModel} · {trip.tripType} · {trip.seatsLeft} of {trip.seatsTotal} seats left
        </Text>
        <Text style={s.fare}>
          {trip.rideModel === "SHARED"
            ? `${naira(trip.farePerSeatKobo)} / seat`
            : `${naira(trip.privateFareKobo)} / car`}
        </Text>
      </View>
      <View style={s.card}>
        <Text style={s.dname}>
          {trip.driver.firstName} {trip.driver.lastName} ⭐ {trip.driver.rating ?? "new"}
        </Text>
        <Text style={s.meta}>{trip.driver.verificationTier}</Text>
        <Text style={s.meta}>{trip.driver.driverType ?? "Rider"} · Status: {trip.status}</Text>
      </View>
      <Text style={s.note}>Price offers land here in step G2.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, backgroundColor: "#FFF9EF" },
  spin: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    elevation: 4,
  },
  route: { fontSize: 20, fontWeight: "900" },
  meta: { fontSize: 14, color: "#5A6B87", marginTop: 4 },
  fare: { fontSize: 22, fontWeight: "900", marginTop: 8 },
  dname: { fontSize: 17, fontWeight: "800" },
  note: { textAlign: "center", color: "#5A6B87", marginTop: 16 },
});
