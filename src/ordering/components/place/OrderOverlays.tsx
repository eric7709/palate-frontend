"use client"
import CustomerFormModal from "@/src/customers/components/admin/CustomerFormModal";
import { CartPage } from "../cart/CartPage";
import { UnavailabilityError } from "../shared/UnavailabilityError";
import { HistoryPage } from "../view/HistoryPage";
import { ConfirmModal } from "./ConfirmModal";
import { SuccessModal } from "./SuccessModal";
import { NoteModal } from "./NoteModal";

export function OrderOverlays() {
  return (
    <>
      <CartPage />
      <ConfirmModal />
      <HistoryPage />
      <UnavailabilityError />
      <SuccessModal />
      <CustomerFormModal />
      <NoteModal />
    </>
  );
}