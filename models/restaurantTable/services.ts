import axios from "axios";
import { RestaurantTableResponseDTO } from "@/models/restaurantTable/types";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/palate";

export async function getTable(token: string): Promise<RestaurantTableResponseDTO | null> {
  console.log("📡 API CALL VIA AXIOS");
  try {
    const response = await axios.get<RestaurantTableResponseDTO>(
      `${BACKEND_URL}/tables/qrcode/${token}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching table context via QR token:", error);
    return null;
  }
}