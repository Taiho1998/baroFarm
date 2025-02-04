import axios from "axios";
import useUserStore from "@zustand/useUserStore";
import { useLocation, useNavigate } from "react-router-dom";
import ShowConfirmToast from "@components/ShowConfirmToast";

// access token 재발급 URL
const REFRESH_URL = "/auth/refresh";

function useAxiosInstance() {
  const { user, setUser, resetUser } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 기본 설정을 가진 새로운 인스턴스를 생성할 때 사용하는 메서드.
  // 매 요청마다 공통된 설정을 적용할 수 있다.
  const instance = axios.create({
    baseURL: "https://11.fesp.shop",
    timeout: 1000 * 15,
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "client-id": "final04",
    },
  });

  // 요청 인터셉터 추가하기
  // 전달되는 config는 서버 요청할 때 보내는 axios 설정값 (instance + 호출할 때 설정한 것)
  instance.interceptors.request.use((config) => {
    // refresh 요청일 경우 Authorization 헤더는 이미 refresh token으로 지정되어 있음
    // 로그인 되어 있고 + accessToken 갱신 요청이 아닐 경우 = 즉, 일반적인 서버 통신 요청일 경우엔, 토큰을 accessToken으로 설정.
    if (user && config.url !== REFRESH_URL) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }

    // 요청이 전달되기 전에 필요한 공통 작업 수행
    config.params = {
      // 개별적으로 호출할 때 delay를 명시적으로 지정 안 했으면 아래가 default로 지정됨.
      // 개발할 때는 500으로, 운영할 때는 0으로 환경변수로 지정해주면 된다.
      // delay: 500,
      ...config.params, // config 객체의 나머지 기존 속성값은 그대로 유지
    };

    return config;
  });

  // 응답 인터셉터 추가하기
  instance.interceptors.response.use(
    (response) => {
      // 2xx 범위에 있는 상태 코드는 이 함수가 호출됨
      // 응답 데이터를 이용해서 필요한 공통 작업 수행
      // 모든 응답에 대해 콘솔에 응답 객체 출력
      console.log(response);

      return response;
    },
    async (error) => {
      // 2xx 외의 범위에 있는 상태 코드는 이 함수가 호출됨
      // 공통 에러 처리
      console.error("인터셉터", error);
      // 서버에서 전달되는 error 객체에서 config, response를 뽑아냄.
      const { config, response } = error;

      // 에러 상태 401 : 토큰 인증 문제 발생
      if (response?.status === 401) {
        // (1) 갱신 요청에서 401 발생 → 로그인 페이지로 리다이렉트
        if (config.url === REFRESH_URL) {
          navigateLogin();
          return Promise.reject(error);
        }

        // (2) 일반 요청에서 401 발생 → 토큰 갱신 시도
        if (user) {
          // 1. refreshToken으로 새로운 accessToken 요청
          try {
            const {
              data: { accessToken },
            } = await instance.get(REFRESH_URL, {
              headers: {
                Authorization: `Bearer ${user.refreshToken}`,
              },
            });

            // 2. 새로운 accessToken으로 user 상태 갱신
            setUser({ ...user, accessToken });

            // 3. 갱신된 accessToken으로 원래 요청 재시도
            config.headers.Authorization = `Bearer ${accessToken}`;
            return axios(config); // 재요청
          } catch (refreshError) {
            // 4. refreshToken 요청 실패 시 로그인 페이지로 이동
            navigateLogin();
            return Promise.reject(refreshError);
          }
        }

        // 로그인 안 된 상태에서의 401
        navigateLogin();
      }

      return Promise.reject(error);
    }
  );

  // 로그인되지 않은 사용자가 로그인 이후에 사용할 api호출할 때 리다이렉트
  async function navigateLogin() {
    resetUser();
    const gotoLogin = await ShowConfirmToast(
      "로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?"
    );
    if (gotoLogin)
      navigate("/users/login", { state: { from: location.pathname } });
  }

  return instance;
}

export default useAxiosInstance;
