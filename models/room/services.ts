import { RoomResponseDTO } from "@/models/room/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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