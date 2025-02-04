import { create } from "zustand";
// zustand 스토어를 스토리지에 연결하는 기능
import { persist, createJSONStorage } from "zustand/middleware";

const usePayStore = create(
  persist(
    (set) => ({
      payData: null,
      setPayData: (payData) => set({ payData }),
      resetPayData: () => set({ payData: null }),
    }),
    {
      name: "payData",
    }
  )
);

export default usePayStore;
