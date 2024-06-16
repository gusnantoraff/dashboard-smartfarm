import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HStack, Select, Spinner } from '@chakra-ui/react';

type Props = {
  onSelect?: (value: any) => void;
  [x: string]: any;
  modelKey: 'cluster_id';
};

const FilterDropdown = ({ onSelect, ...rest }: Props) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const response = await axios.get('http://localhost:4000/clusters/all');
        if (response.data) {
          const options = response.data.map((item: any) => ({
            value: item.cluster_id,
            label: item.name,
          }));
          setOptions(options);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching clusters:', error);
        setLoading(false);
      }
    };

    fetchClusters();
  }, []);

  return (
    <HStack {...rest}>
      {loading ? (
        <Spinner />
      ) : (
        <Select
          defaultValue="" // Menggunakan defaultValue untuk nilai default
          onChange={(e) => {
            if (onSelect) {
              onSelect(e.target.value);
            }
          }}
        >
          {/* Tambahkan opsi default yang nonaktif */}
          <option disabled value="">Filter</option>
          {options.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      )}
    </HStack>
  );
};

export default FilterDropdown;