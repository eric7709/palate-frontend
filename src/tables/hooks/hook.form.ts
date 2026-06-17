import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTableStore } from '../store';
import { useCreateTable, useUpdateTable } from './hooks.api';
import { useGetCashierOptions, useGetWaiterOptions } from '../../employees/hooks/hooks.api';

export interface TableFormValues {
  tableName: string;
  tableNumber: number;
  status?: string;
  capacity?: number;
}

const defaultValues: TableFormValues = {
  tableName: '',
  tableNumber: 0,
  status: '',
  capacity: undefined,
};

export const useTableForm = () => {
  const { selectedTable, modal, closeModal } = useTableStore();

  const { mutateAsync: create, isPending: isCreating } = useCreateTable();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateTable();

  const waiterOptions = useGetWaiterOptions();
  const cashierOptions = useGetCashierOptions();

  const isEditing = modal === 'editTable';

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    control,
    setError,
  } = useForm<TableFormValues>({ defaultValues });

  useEffect(() => {
    if (selectedTable) {
      reset({
        tableName: selectedTable.tableName,
        tableNumber: selectedTable.tableNumber,
        status: selectedTable.status || '',
        capacity: selectedTable.capacity,
      });
    } else {
      reset(defaultValues);
    }
  }, [selectedTable, reset]);

  useEffect(() => {
    if (modal == null) {
      reset(defaultValues);
    }
  }, [modal]);

  const submit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        capacity: data.capacity || undefined,
      };

      if (isEditing && selectedTable) {
        await update({ id: selectedTable.id, payload });
      } else {
        await create(payload);
      }

      reset();
      closeModal();
    } catch (error: any) {
      setError('root', {
        message: error?.response?.data?.message || error?.message || 'Something went wrong',
      });
    }
  });

  return {
    register,
    control,
    errors,
    submit,
    reset,
    waiterOptions,
    cashierOptions,
    modal,
    closeModal,
    isEditing,
    setValue,
    isSubmitting: isCreating || isUpdating,
    isOpened: modal === 'createTable' || modal === 'editTable',
  };
};