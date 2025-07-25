'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
} from '@mui/material';
import { useProductStore } from '@/stores/product.store';
import { useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProductDialog({ open, onClose }: Props) {
  const {
    selected,
    categories,
    addProduct,
    updateProduct,
    fetchProducts,
    fetchCategories,
    setField,
    resetForm,
  } = useProductStore();

  const isEditing = Boolean(selected?.id);

  useEffect(() => {
    if (open) {
       if (!selected?.id) {
        resetForm();
      }
      fetchCategories();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selected?.product || !selected?.category || selected.price == null) return;

    try {
      const { id, ...data } = selected;

      if (isEditing) {
        await updateProduct(id, data);
      } else {
        await addProduct(data);
      }

      await fetchProducts(1, 10);
      await fetchCategories();
      onClose();
    } catch (error) {
      console.error('Failed to submit product', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{isEditing ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Product"
            fullWidth
            value={selected?.product || ''}
            onChange={(e) => setField('product', e.target.value)}
          />
          <Autocomplete
            freeSolo
            options={categories}
            value={selected?.category || ''}
            onInputChange={(_, newValue) => setField('category', newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Category" fullWidth />
            )}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={selected?.price ?? ''}
            onChange={(e) => setField('price', parseFloat(e.target.value))}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEditing ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
