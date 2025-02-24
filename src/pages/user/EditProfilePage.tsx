import HeaderIcon from "@components/HeaderIcon";
import UserForm from "@components/UserForm";
import useAxiosInstance from "@hooks/useAxiosInstance";
import ErrorPage from "@pages/ErrorPage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { SetHeaderContents, user } from "types";

export default function EditProfilePage() {
  const { setHeaderContents } = useOutletContext<SetHeaderContents>();
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state.user;
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const { resetUser } = useUserStore();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "개인정보 수정",
    });
  }, []);

  const editUserInfo = useMutation({
    mutationFn: (
      formData: {
        value: string;
        detailValue: string;
      } & user
    ) => {
      const { value, detailValue, ...userData } = formData;
      console.log(formData);
      const count =
        Number(!!userData.extra?.userName) +
        Number(!!userData.address?.trim() || !!value) +
        Number(!!userData.phone);
      // if (count === 1 || count === 2) {
      //   if (userData.address)
      //     throw new Error(
      //       "기본 배송지 정보를 전부 입력해주시거나 전부 비워주시길 바랍니다\n(이름, 전화번호, 주소)"
      //     );
      // }
      if (data.address && !value) {
        const body = {
          ...data,
          ...userData,
          extra: {
            ...data.extra,
            ...userData.extra,
          },
        };
        return axios.patch(`/users/${data._id}`, body);
      }
      const body = {
        ...data,
        ...userData,
        address: `${value ? value : ""} ${detailValue ? detailValue : ""}`,
        extra: {
          ...data.extra,
          ...userData.extra,
        },
      };
      return axios.patch(`/users/${data._id}`, body);
    },
    onSuccess: () => {
      resetUser();
      toast.success("프로필 정보 변경이 완료되었습니다.");
      toast.success("설정 적용을 위해 로그아웃합니다. 다시 로그인해주세요.");
      resetUser();
      queryClient.clear();
      navigate("/users/login", { replace: true });
    },
    onError: (err) => {
      console.error("회원 정보 변경 실패:", err);
      let errorMessage = "알 수 없는 오류가 발생했습니다.";

      // response가 존재하는 경우 → AxiosError 가능성 높음
      if (err && typeof err === "object" && "response" in err) {
        const response = err.response as {
          data?: { message?: string };
        };
        errorMessage =
          response.data?.message || "서버에서 오류가 발생했습니다.";
      }

      // 일반 Error 객체일 경우
      else if (err instanceof Error) {
        errorMessage = err.message.replace(/^Error:\s*/, "");
      }
      // 문자열로 들어오는 경우
      else if (typeof err === "string") {
        errorMessage = err;
      }
      toast.error(errorMessage);
    },
  });
  return (
    <>
      <Helmet>
        <title>프로필 수정 | 바로Farm</title>
      </Helmet>
      <UserForm
        buttonText="수정하기"
        userInfo={data}
        onSubmitUser={editUserInfo.mutate}
      />
    </>
  );
}
