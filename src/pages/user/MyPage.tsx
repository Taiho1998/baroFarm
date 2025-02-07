import HeaderIcon from "@components/HeaderIcon";
import Spinner from "@components/Spinner";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { user, UserStore } from "types";

export default function MyPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const url = "https://11.fesp.shop";

  // zustand store에서 유저 상태 가져옴
  // 유저가 로그인 상태인지 확인하는 용도
  const user: user = useUserStore((store: UserStore) => store.user);

  const axios = useAxiosInstance();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate("/")} />,
      title: "마이 페이지",
      rightChild: (
        <>
          <HeaderIcon name="search" onClick={() => navigate("/search")} />
        </>
      ),
    });
  }, []);

  /// store에서 user 상태를 초기화하는 함수 가져오기
  const resetUser = useUserStore((store: UserStore) => store.resetUser);

  const logoutClick = () => {
    //로그아웃 시 캐시 삭제
    resetUser();
    queryClient.clear();
    navigate("/");
  };

  //로그인 시 로그인 화면으로 이동
  const loginClick = () => {
    navigate("/users/login");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user", user?._id],
    queryFn: () => axios.get(`/users/${user._id}`),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
    enabled: !!user,
  });

  // 로그인 아닌 경우에는 로그아웃 시 화면 보일 수 있게 예외처리
  if (isLoading && user) {
    //이 아래에는 로딩 페이지
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>마이 페이지 | 바로Farm</title>
      </Helmet>
      <div className="pt-[18px] px-5 mb-[70px]">
        <div className="h-auto pb-4">
          <div className="flex flex-row items-center">
            {user && (
              <>
                <img
                  src={
                    data?.image
                      ? data.image.includes("http://") ||
                        data.image.includes("https://")
                        ? data.image
                        : url + data.image
                      : "/images/profile/ProfileImage_Sample.jpg"
                  }
                  className="mr-5 w-[49px] h-[50px] rounded-full object-cover"
                  loading="lazy"
                />
                <div>
                  <p className="text-gray5/50 text-[12px] leading-[14px]">
                    {data.type == "seller" ? "판매회원" : "구매회원"}
                  </p>
                  <h2 className="text-[16px] leading-[18px] mt-[4px]">
                    {data?.name}님! 어서오세요
                  </h2>
                </div>
                <button
                  onClick={logoutClick}
                  className="flex ml-auto h-fit items-center text-[14px]"
                >
                  로그아웃
                  <img
                    src="/icons/icon_forward.svg"
                    className="h-4 ml-2"
                    alt="profileDetail icon"
                  />
                </button>
              </>
            )}
            {!user && (
              <>
                <img
                  src={"/images/profile/ProfileImage_Sample.jpg"}
                  className="mr-5 w-[49px] h-[50px] rounded-full"
                  loading="lazy"
                />
                <div>
                  <h2 className="text-[16px] leading-[18px] mt-[4px]">
                    게스트님! 어서오세요
                  </h2>
                </div>
                <button
                  onClick={loginClick}
                  className="flex ml-auto h-fit items-center text-[14px]"
                >
                  로그인하기
                  <img
                    src="/icons/icon_forward.svg"
                    className="h-4 ml-2"
                    alt="profileDetail icon"
                  />
                </button>
              </>
            )}
          </div>
          {user && (
            <div className="flex border-t-[1px] border-gray2 h-[58px] mt-[16px]">
              <Link
                to={"/users/purchase"}
                className="flex justify-center items-center flex-1 text-center h-[50px] border-r-[1px] border-gray2"
              >
                구매 내역
              </Link>
              {data.type === "seller" && (
                <Link
                  to={"/users/sale"}
                  className="flex justify-center items-center flex-1 text-center h-[50px] border-r-[1px] border-gray2"
                >
                  판매 내역
                </Link>
              )}
              <Link
                to={"/users/myboard"}
                className="flex justify-center items-center flex-1 text-center h-[50px]"
              >
                작성한 글{" "}
                <span className="text-btn-primary ml-1">{data.posts}건</span>
              </Link>
            </div>
          )}
        </div>
        <div className="h-[7px] bg-gray1 mx-[-20px]"></div>
        <div className="h-[152px] pt-[18px]">
          <h2 className="text-base leading-[19px]">구매 정보</h2>
          <Link
            to={"/users/recent"}
            className="flex items-center text-[14px] mt-[27px]"
          >
            최근 본 상품
            <img
              src="/icons/icon_forward.svg"
              className="h-[16px] ml-auto"
              alt="recentProduct icon"
            />
          </Link>
          {/* 로그인한 유저만 찜 기능을 이용할 수 있음. 따라서 찜한 상품 조회 기능은 필요 없음 */}
          {user && (
            <Link
              to={"/users/bookmarks"}
              className="flex items-center text-[14px] mt-[24px]"
            >
              찜한 상품
              <img
                src="/icons/icon_forward.svg"
                className="h-[16px] ml-auto"
                alt="likedProduct icon"
              />
            </Link>
          )}
        </div>
        {/* 해당 영역은 로그아웃 상태일 시 사용을 필요로 하지 않음 */}
        {user && data?.type === "seller" && (
          <>
            <div className="h-[7px] bg-gray1 mx-[-20px]"></div>
            <div className="h-[109px] pt-[18px] ">
              <h2 className="text-base leading-[19px]">판매 정보</h2>
              <Link
                to={"/product/new"}
                className="flex items-center text-[14px] mt-[27px] mb-[24px]"
              >
                상품 등록
                <img
                  src="/icons/icon_forward.svg"
                  className="h-[16px] ml-auto"
                  alt="addProduct icon"
                />
              </Link>
            </div>
          </>
        )}
        {user && (
          <>
            <div className="h-[7px] bg-gray1 mx-[-20px]"></div>
            <div className="h-[109px] pt-[18px] ">
              <h2 className="text-base leading-[19px]">계정 관리</h2>
              <Link
                to={`/users/profile`}
                className="flex items-center text-[14px] mt-[27px] mb-[24px]"
                state={{ id: data._id }}
              >
                내 정보 보기
                <img
                  src="/icons/icon_forward.svg"
                  className="h-[16px] ml-auto"
                  alt="addProduct icon"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
