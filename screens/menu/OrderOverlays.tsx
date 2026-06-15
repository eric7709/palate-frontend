import CartPage from "./CartPage";
import ConfirmModal from "./ConfirmModal";
import CustomerFormModal from "./CustomerModal";
import HistoryPage from "./HistoryPage";
import SuccessModal from "./SuccessModal";
import UnavailabilityError from "./UnavailabilityError";

export function OrderOverlays() {
  return (
    <>
      <CartPage />
      <ConfirmModal />
      <HistoryPage />
      <UnavailabilityError />
      <SuccessModal />
      <CustomerFormModal />
    </>
  );
}