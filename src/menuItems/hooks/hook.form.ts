import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMenuItemStore } from '../store';
import { useImageStore } from '@/src/shared/store/store.image';
import { useCreateMenuItem, useUpdateMenuItem } from './hooks.api';
import { useGetCategoryOptions } from '../../categories/hooks/hooks.api';
import { uploadImage } from '@/src/shared/lib/upload';
import { MenuItemStatus } from '../types';

export interface MenuItemFormValues {
  name: string;
  description: string;
  price: number;
  status: MenuItemStatus;
  categoryId: number;
  imageUrl?: string;
}

const defaultValues: MenuItemFormValues = {
  name: '',
  description: '',
  price: 0,
  status: 'AVAILABLE',
  categoryId: 0,
  imageUrl: '',
};

export const useMenuItemForm = () => {
  const { selectedMenuItem, modal, closeModal, setModal } = useMenuItemStore();
  const { image, removed, clearImageData, setPreviewImage } = useImageStore();
  const categoryOptions = useGetCategoryOptions();

  const { mutateAsync: create, isPending: isCreating } = useCreateMenuItem();
  const { mutateAsync: update, isPending: isUpdating } = useUpdateMenuItem();
  const [isUploading, setIsUploading] = useState(false)

  const isEditing = modal === 'editMenuItem';

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    control,
    setError,
  } = useForm<MenuItemFormValues>({ defaultValues });

  useEffect(() => {
    if (selectedMenuItem) {
      reset({
        name: selectedMenuItem.name,
        description: selectedMenuItem.description || '',
        price: selectedMenuItem.price,
        status: selectedMenuItem.status as MenuItemStatus,
        categoryId: selectedMenuItem.categoryId,
        imageUrl: selectedMenuItem.imageUrl || '',
      });
      setPreviewImage(selectedMenuItem.imageUrl || '')
    } else {
      reset(defaultValues);
    }
  }, [selectedMenuItem, reset]);

  const submit = handleSubmit(async (data) => {
    try {
      let imageUrl = selectedMenuItem?.imageUrl || '';

      if (image) {
        setIsUploading(true)
        imageUrl = await uploadImage(image);
        setIsUploading(false)
      } else if (removed) {
        imageUrl = '';
      }

      const payload = { ...data, imageUrl };

      if (isEditing && selectedMenuItem) {
        await update({ id: selectedMenuItem.id, payload });
      } else {
        await create(payload);
      }
      clearImageData()
      reset();
      closeModal();
    } catch (error: any) {
      setIsUploading(false)
      setError('root', {
        message: error?.response?.data?.message || error?.message || 'Something went wrong',
      });
    }
  });

  useEffect(() => {
    if (modal == null) {
      clearImageData();
      reset({
        name: "",
        description: "",
        price: 0,
        status: 'AVAILABLE',
        categoryId: 0,
        imageUrl: "",
      });
    }
  }, [modal, setModal])

  return {
    register,
    control,
    errors,
    submit,
    reset,
    categoryOptions,
    modal,
    closeModal,
    isEditing,
    setValue,
    isSubmitting: isCreating || isUpdating || isUploading,
    isOpened: modal === 'createMenuItem' || modal === 'editMenuItem',
  };
};