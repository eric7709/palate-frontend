import { notFound } from "next/navigation";
import AppProvider from "@/provider/AppProvider";
import RoomBase from "@/screens/menu/RoomBase";
import { RoomUnavailable } from "@/ui/RoomUnavailable";
import { getRoom } from "@/models/room/services";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function RoomPage({ params }: PageProps) {
  const resolvedParams = await params;

  if (!resolvedParams.token) {
    notFound();
  }

  const roomData = await getRoom(resolvedParams.token);

  if (!roomData) {
    notFound();
  }

  if (!roomData.cashierId || roomData.status !== "AVAILABLE") {
    return <RoomUnavailable room={roomData} />;
  }

  return (
    <AppProvider>
      <RoomBase roomData={roomData} />
    </AppProvider>
  );
}