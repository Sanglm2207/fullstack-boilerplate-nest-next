'use client';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit, Inventory2 } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useProductStore } from '@/stores/product.store';
import dayjs from 'dayjs';
import ProductDialog from './ProductDialog';

export default function ProductList() {
  const {
    products,
    total,
    page,
    limit,
    loading,
    fetchProducts,
    deleteProduct,
    fetchProductById,
    resetForm,
    setSelected,
  } = useProductStore();

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchProducts(page, limit);
  }, []);

  const handleAdd = () => {
    resetForm();
    setSelected({
      id: 0,
      product: '',
      category: '',
      price: 0,
      lastUpdate: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = async (id: number) => {
    await fetchProductById(id);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    await fetchProducts(page, limit);
  };

  const handlePageChange = (_: any, newPage: number) => {
    fetchProducts(newPage, limit);
  };

  const from = products.length > 0 ? (page - 1) * limit + 1 : 0;
  const to = (page - 1) * limit + products.length;

  return (
    <Box sx={{ 
      px: 3, 
      py: 2, 
      width: '100%',
      height: 'calc(100vh - 64px)', // Adjust based on your header height
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center">
          <Inventory2 sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
          <Typography variant="h4" fontWeight={600} color="primary">
            Product Management
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleAdd}
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          Add New Product
        </Button>
      </Box>

      {/* Products Table - Flexible height */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Paper elevation={3} sx={{ 
          borderRadius: 3, 
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <TableContainer sx={{ flex: 1 }}>
            <Table stickyHeader sx={{ height: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    backgroundColor: 'primary.main', 
                    fontWeight: 600,
                    color: 'white',
                    width: '5%' 
                  }}>No</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: 'primary.main', 
                    fontWeight: 600,
                    color: 'white',
                    width: '25%' 
                  }}>Product</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: 'primary.main', 
                    fontWeight: 600,
                    color: 'white',
                    width: '20%' 
                  }}>Category</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: 'primary.main', 
                    fontWeight: 600,
                    color: 'white',
                    width: '15%' 
                  }}>Price</TableCell>
                  <TableCell sx={{ 
                    backgroundColor: 'primary.main', 
                    fontWeight: 600,
                    color: 'white',
                    width: '20%' 
                  }}>Last Update</TableCell>
                  <TableCell align="center" sx={{ 
                    backgroundColor: 'primary.main', 
                    fontWeight: 600,
                    color: 'white',
                    width: '15%' 
                  }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product, index) => (
                    <TableRow key={product.id} hover>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">{product.product}</Typography>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>
                        {dayjs(product.lastUpdate).format('MMM DD, YYYY HH:mm')}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton 
                            onClick={() => handleEdit(product.id)}
                            sx={{ 
                              backgroundColor: 'primary.main', 
                              color: 'white',
                              '&:hover': { 
                                backgroundColor: 'primary.dark' 
                              } 
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(product.id)}
                            sx={{ 
                              backgroundColor: 'error.main', 
                              color: 'white',
                              '&:hover': { 
                                backgroundColor: 'error.dark' 
                              } 
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="space-between" alignItems="center" px={3} py={2} bgcolor="background.default">
            <Typography variant="body2" color="text.secondary">
              Showing {from} to {to} of {total} products
            </Typography>
            <Pagination
              page={page}
              count={Math.ceil(total / limit)}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
            />
          </Box>
        </Paper>
      </Box>

      <ProductDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Box>
  );
}