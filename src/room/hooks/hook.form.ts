"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRoomStore } from "../store";
import { useCreateRoom, useUpdateRoom } from "./hooks.api";
import { RoomRequestDTO } from "../types";

export function useRoomForm() {
  const { modal, selectedRoom, setModal, setSelectedRoom } = useRoomStore();

  const isOpened = modal === "CREATE" || modal === "UPDATE";
  const isEditing = modal === "UPDATE";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RoomRequestDTO>();

  const { mutate: createRoom } = useCreateRoom();
  const { mutate: updateRoom } = useUpdateRoom();

  useEffect(() => {
    if (isEditing && selectedRoom) {
      reset({
        roomNumber: selectedRoom.roomNumber,
        floor: selectedRoom.floor ?? undefined,
        status: selectedRoom.status,
        cashierId: selectedRoom.cashierId ?? null,
      });
    } else {
      reset({
        roomNumber: "",
        floor: undefined,
        status: "AVAILABLE",
        cashierId: null,
      });
    }
  }, [isEditing, selectedRoom, reset]);

  const closeModal = () => {
    setModal(null);
    setSelectedRoom(null);
    reset();
  };

  const submit = handleSubmit((values) => {
    if (isEditing && selectedRoom) {
      updateRoom(
        { id: selectedRoom.id, payload: values },
        { onSuccess: closeModal }
      );
    } else {
      createRoom(values, { onSuccess: closeModal });
    }
  });

  return {
    register,
    errors,
    isEditing,
    control,
    isSubmitting,
    submit,
    closeModal,
    isOpened,
  };
}