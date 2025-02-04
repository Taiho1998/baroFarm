import { useRouteError, useNavigate } from "react-router-dom";
import logoImage from "/images/BaroFarmIcon.png";
import { Helmet } from "react-helmet-async";

export default function DataErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error(error);

  return (
    <>
      <Helmet>
        <title>서버 에러 | 바로Farm</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center h-screen absolute top-0 left-1/2 -translate-x-1/2">
        <h1 className="text-btn-primary font-semibold text-5xl">
          Server Error
        </h1>
        <p className="text-gray5 text-center pt-4">
          서버에서 예상치 못한 오류가 발생했습니다. <br />
          잠시 후 다시 시도해 주세요.
        </p>
        <img src={logoImage} className="w-[300px]" />
        <button
          className="text-white  bg-btn-primary px-6 py-2 rounded-md"
          onClick={() => navigate(`/`)}
        >
          메인으로
        </button>
      </div>
    </>
  );
}
