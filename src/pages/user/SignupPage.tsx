import HeaderIcon from "@components/HeaderIcon";
import UserForm from "@components/UserForm";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignupPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  const axios = useAxiosInstance();
  const handleSignup = useMutation({
    mutationFn: (formData) => axios.post("/users", formData),
    onSuccess: () => {
      // console.log("회원가입 성공 데이터:", res.data);
      toast.success("회원가입이 완료되었습니다.");
      navigate("/users/login");
    },
    onError: (err) => {
      console.error("회원가입 실패:", err);
      toast.error(
        "회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
      navigate("/users/signup");
    },
  });

  useEffect(() => {
    setHeaderContents({
      leftChild: (
        <HeaderIcon name="x_thin" onClick={() => navigate("/users/login")} />
      ),
      title: "회원가입",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>회원가입 | 바로Farm</title>
        {/* <meta name="description" content="회원가입 1분이면 충분합니다. 바로Farm과 함께하세요."></meta> */}
      </Helmet>

      <UserForm buttonText="회원가입" onSubmitUser={handleSignup.mutate} />
      <p className="flex justify-center text-sm gap-1.5 font-medium -mt-2.5">
        이미 바로팜 회원이신가요?
        <Link to="/users/login" className="text-btn-primary hover:font-bold">
          로그인
        </Link>
      </p>
    </>
  );
}
