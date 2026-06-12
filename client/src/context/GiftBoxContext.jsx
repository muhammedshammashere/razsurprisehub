import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const GiftBoxContext = createContext(null);

export const GiftBoxProvider = ({ children }) => {
  const [giftBox, setGiftBox] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchGiftBox = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/gift-box');
      setGiftBox(data.giftBox);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post('/gift-box/items', { productId, quantity });
    setGiftBox(data.giftBox);
    toast.success('Added to gift box');
    return data.giftBox;
  };

  const updateItem = async (productId, quantity, options = {}) => {
    const { data } = await api.patch(`/gift-box/items/${productId}`, { quantity });
    if (!options.skipSetGiftBox) setGiftBox(data.giftBox);
    return data.giftBox;
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/gift-box/items/${productId}`);
    setGiftBox(data.giftBox);
    toast.success('Removed from gift box');
  };

  const updateBox = async (payload) => {
    const { data } = await api.patch('/gift-box', payload);
    setGiftBox(data.giftBox);
    return data.giftBox;
  };

  const getReservedQuantity = useCallback(
    (productId) => {
      if (!productId) return 0;
      const id = productId.toString();
      const item = giftBox?.items?.find((entry) => {
        const entryId = entry.product?._id || entry.product;
        return entryId?.toString() === id;
      });
      return item?.quantity || 0;
    },
    [giftBox]
  );

  const getAvailableStock = useCallback(
    (product) => Math.max((product?.stock || 0) - getReservedQuantity(product?._id), 0),
    [getReservedQuantity]
  );

  const itemCount = giftBox?.items?.reduce((s, i) => s + i.quantity, 0) || 0;

  return (
    <GiftBoxContext.Provider
      value={{
        giftBox,
        loading,
        itemCount,
        fetchGiftBox,
        addItem,
        updateItem,
        removeItem,
        updateBox,
        getReservedQuantity,
        getAvailableStock,
        setGiftBox,
      }}
    >
      {children}
    </GiftBoxContext.Provider>
  );
};

export const useGiftBox = () => {
  const ctx = useContext(GiftBoxContext);
  if (!ctx) throw new Error('useGiftBox must be used within GiftBoxProvider');
  return ctx;
};
