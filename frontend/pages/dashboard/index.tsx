import React, { useState, useEffect } from 'react';
import { Box, Text, Button, Grid, GridItem } from '@chakra-ui/react';
import DashboardLayout from "@/layouts/Dashboard.layout";

const Dashboard = () => {
  // Buat state untuk menyimpan data yang akan ditampilkan di dashboard
  const [data, setData] = useState([]);

  // Contoh penggunaan useEffect untuk melakukan sesuatu setiap kali komponen di-render ulang
  useEffect(() => {
    // Contoh: ambil data dari backend atau sumber lainnya
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Jangan lupa untuk memberikan array dependencies kosong agar useEffect hanya dijalankan sekali saat komponen di-mount

  return (
    <DashboardLayout>
      <Box p={5}>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Dashboard</Text>
        
        {/* Contoh menampilkan data */}
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {data.map((item, index) => (
            <GridItem key={index}>
              <Box p={4} borderWidth="1px" borderRadius="lg">
              </Box>
            </GridItem>
          ))}
        </Grid>

        {/* Contoh tombol */}
        <Button mt={4} colorScheme="blue">Tombol Contoh</Button>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
