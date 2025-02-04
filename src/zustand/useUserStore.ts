import { create } from "zustand";
// zustand 스토어를 스토리지에 연결하는 기능
import { persist, createJSONStorage } from "zustand/middleware";

const useUserStore = create(
  // 1번인자 : 함수(스토어 세팅 함수), 2번인자 : 객체(스토리지에 저장할 때 설정 정보)
  persist(
    (set) => ({
      user: null, // 초기값
      // 로그인할 때 setUser 함수 호출하여 유저 객체에 로그인한 유저 정보 저장
      setUser: (user) => set({ user }),
      // 로그아웃할 때 resetUser 함수 호출하여 유저 객체에서 로그아웃할 유저 정보 삭제
      resetUser: () => set({ user: null }),
    }),
    // 스토리지에 저장할 때 설정 정보
    {
      name: "user", // 키값
      // 세션스토리지에 저장
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
