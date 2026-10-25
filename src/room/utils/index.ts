import { RoomResponseDTO } from "@/src/room/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080/api/palate";

export async function getRoom(token: string): Promise<RoomResponseDTO | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/rooms/qrcode/${token}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching room context via QR token:", error);
    return null;
  }
}