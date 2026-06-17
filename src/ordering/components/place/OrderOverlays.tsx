"use client"
import { CartPage } from "../cart/CartPage";
import { UnavailabilityError } from "../shared/UnavailabilityError";
import { HistoryPage } from "../view/HistoryPage";
import { ConfirmModal } from "./ConfirmModal";
import { SuccessModal } from "./SuccessModal";
import { NoteModal } from "./NoteModal";
import { CustomerModal } from "./CustomerModal";
// change
export function OrderOverlays() {
  return (
    <>
      <CartPage />
      <ConfirmModal />
      <HistoryPage />
      <UnavailabilityError />
      <SuccessModal />
      <CustomerModal />
      <NoteModal />
    </>
  );
}