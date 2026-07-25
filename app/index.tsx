import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import "../global.css";

export default function App() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  // Redirect based on auth state
  if (isSignedIn) return <Redirect href="./(root)/(tabs)" />;

  return <Redirect href="/sign-up" />;
}
