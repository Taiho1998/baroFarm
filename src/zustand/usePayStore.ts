import { PayData } from "types";
import { create } from "zustand";
// zustand 스토어를 스토리지에 연결하는 기능
import { persist, createJSONStorage } from "zustand/middleware";

interface PayStore {
  payData: PayData | null;
  setPayData: (payData: object) => void;
  resetPayData: () => void;
}

const usePayStore = create<PayStore>()(
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
