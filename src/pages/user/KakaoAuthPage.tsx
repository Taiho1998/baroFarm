import Spinner from "@components/Spinner";
import useAxiosInstance from "@hooks/useAxiosInstance";
import DataErrorPage from "@pages/DataErrorPage";
import { useMutation } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import { useEffect } from "react";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";

export default function KakaoAuthPage() {
  const [searchParms] = useSearchParams();
  const axios = useAxiosInstance();
  const setUser = useUserStore((store) => store.setUser);
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  // 헤더 설정은 컴포넌트 마운트 시에만 실행
  useEffect(() => {
    setHeaderContents({
      title: "카카오로 로그인",
    });
  }, []);

  // URL에서 인가코드를 추출하여 카카오 로그인 요청
  useEffect(() => {
    // 1. URL 파라미터에서 인가코드 가져오기
    const code = searchParms.get("code");
    // 2. 인가코드가 있으면 카카오 로그인 mutation 실행
    if (code) {
      kakaoLogin.mutate(code);
    }
  }, [searchParms]);

  const kakaoLogin = useMutation({
    mutationFn: (code) =>
      axios.post(`/users/login/kakao`, {
        code: code,
        redirect_uri: `${window.location.origin}/users/login/kakao`,
        user: {},
      }),
    onSuccess: (res) => {
      if (res.data.item) {
        // console.log("카카오 로그인 성공:", res);

        const user = res.data.item;
        setUser({
          _id: user._id,
          name: user.name,
          accessToken: user.token.accessToken,
          refreshToken: user.token.refreshToken,
        });

        toast.success(user.name + "님, 로그인 되었습니다.");
        navigate("/");
      }
    },
    onError: (error) => {
      console.error("카카오 로그인 실패", error);
      navigate("/users/login");
    },
  });

  if (kakaoLogin.isLoading) {
    return <Spinner />;
  }

  if (kakaoLogin.isError) {
    return <DataErrorPage />;
  }

  return <Spinner />;
}
