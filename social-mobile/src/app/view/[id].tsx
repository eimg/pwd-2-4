import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function Detail() {
	const { id } = useLocalSearchParams();

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text style={{ fontWeight: "bold", fontSize: 18 }}>View {id}</Text>
		</View>
	);
}
