import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MenuItemStatusEnum } from './types';
import { useMenuItemStore } from './store';
import { useImageStore } from '@/abstract/store.image';
import { useCreateMenuItem, useUpdateMenuItem } from './hooks';
import { useGetCategoryOptions } from '../category/hooks';
import { uploadImage } from '@/lib/upload';

export interface MenuItemFormValues {
  name: string;
  description: string;
  price: number;
  status: MenuItemStatusEnum;
  categoryId: number;
  imageUrl?: string;
}

const defaultValues: MenuItemFormValues = {
  name: '',
  description: '',
  price: 0,
  status: MenuItemStatusEnum.AVAILABLE,
  categoryId: 0,
  imageUrl: '',
};

export const useMenuItemForm = () => {
  const { selectedMenuItem, modal, closeModal, setModal } = useMenuItemStore();
  const { image } = useImageStore();
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
        status: selectedMenuItem.status as MenuItemStatusEnum,
        categoryId: selectedMenuItem.categoryId,
        imageUrl: selectedMenuItem.imageUrl || '',
      });
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
      }
      setIsUploading(false)

      const payload = { ...data, imageUrl };

      if (isEditing && selectedMenuItem) {
        await update({ id: selectedMenuItem.id, payload });
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

  useEffect(() => {


    if (modal == null) {
      reset({
        name: "",
        description: "",
        price: 0,
        status: MenuItemStatusEnum.AVAILABLE,
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