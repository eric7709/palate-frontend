import { notFound } from "next/navigation";
import AppProvider from "@/src/shared/provider/AppProvider";
import { RoomUnavailable } from "@/src/orders/shared/RoomUnavailable";
import { getRoom } from "@/src/room/utils";
import { RoomBase } from "@/src/orders/components/shared/RoomBase";

interface PageProps { params: Promise<{ token: string }> }

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