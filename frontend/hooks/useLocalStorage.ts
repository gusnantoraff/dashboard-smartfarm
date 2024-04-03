import { useEffect, useState } from 'react';

interface LocalStorage {
  [x: string]: any;
  loading: boolean;
  setItem: (value: any) => void;
  removeAllItem: () => void;
}

export default function useLocalStorage(key: string): LocalStorage {
  const [data, setData] = useState({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const _item = localStorage.getItem(key) as any;

      setData({
        ...data,
        [key]: _item,
      });

      setLoading(false);
    }
  }, []);

  const setItem = (value: any) => {
    localStorage.setItem(key, value);
    setData({
      ...data,
      [key]: value,
    });
  };

  const removeAllItem = () => {
    localStorage.clear();
    setData({});
  };

  const parse = (value: any) => {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  };

  return { [key]: parse(data[key]), loading, setItem, removeAllItem };
}
