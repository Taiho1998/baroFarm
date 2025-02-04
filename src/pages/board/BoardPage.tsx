import HeaderIcon from "@components/HeaderIcon";
import Pagination from "@components/Pagination";
import ShowConfirmToast from "@components/ShowConfirmToast";
import Spinner from "@components/Spinner";
import useAxiosInstance from "@hooks/useAxiosInstance";
import BoardPageDetail from "@pages/board/BoardPageDetail";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Link,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

export default function BoardPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [isLogin, setIsLogin] = useState(true);
  const axios = useAxiosInstance();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || ""; // URL에서 keyword 가져오기
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: `바로파밍`,
      rightChild: (
        <>
          <HeaderIcon name="search" onClick={() => navigate("/search")} />
          <HeaderIcon name="cart_empty" onClick={() => navigate("/cart")} />
        </>
      ),
    });
    if (user) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, []);

  // 사진을 포함한 게시글
  const { data: communityBoard, isLoading } = useQuery({
    queryKey: ["posts", "community", keyword],
    queryFn: () =>
      axios.get(`/posts`, {
        params: { type: "community", keyword: keyword, limit: 10 },
      }),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  // 사진을 포함하지 않은 게시글
  const { data: noPicBoard, isLoading: isLoading2 } = useQuery({
    queryKey: ["posts", "noPic", keyword],
    queryFn: () =>
      axios.get(`/posts`, {
        params: { type: "noPic", keyword: keyword, limit: 10 },
      }),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  if (isLoading || isLoading2) {
    return <Spinner />;
  }

  const mergeData = [...communityBoard, ...noPicBoard];
  const sortedData = mergeData.sort((prev, next) => next._id - prev._id);

  const handleClick = async (event) => {
    event.preventDefault();
    const isConfirmed = await ShowConfirmToast(
      "로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?"
    );
    if (isConfirmed) {
      navigate("/users/login");
    }
  };

  const searchKeyword = (e) => {
    // 폼에서 name="keyword"인 입력값을 가져와 앞뒤 공백 제거
    e.preventDefault();
    const searchWord = e.target.keyword.value.trim();
    setSearchParams({ keyword: searchWord }); // URL에 keyword 저장
  };

  // 페이지에 맞는 데이터 계산
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedData.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(sortedData.length / postsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0 });
  };

  const boards = currentPosts?.map((item) => (
    <BoardPageDetail key={item._id} item={item} />
  ));

  return (
    <>
      <Helmet>
        <title>바로파밍 | 바로Farm</title>
      </Helmet>
      <div className="relative mx-5">
        <form className="pt-2" onSubmit={searchKeyword}>
          <label htmlFor="search" className="text-sm font-semibold block mb-2">
            게시판 검색
          </label>
          <div className="flex items-center gap-1 w-full rounded-md p-1 border border-gray3 focus-within:border-btn-primary">
            <button type="submit" aria-label="검색하기">
              <img src="/icons/icon_search.svg" alt="" />
            </button>
            <input
              className="flex-grow border-none outline-none
              [&::-webkit-search-cancel-button]:appearance-none
              [&::-webkit-search-cancel-button]:bg-[url('/icons/icon_x_thin.svg')]
              [&::-webkit-search-cancel-button]:bg-center
              [&::-webkit-search-cancel-button]:h-4
              [&::-webkit-search-cancel-button]:w-4"
              type="search"
              placeholder="키워드를 입력해주세요"
              id="search"
              name="keyword"
              maxLength={20}
            />
          </div>
        </form>
        <div className="flex my-2 items-center bg-btn-primary rounded-md gap-3 p-3">
          <img
            src="/images/BaroFarmIcon.png"
            alt="바로팜 로고"
            className="w-[90px]"
          />
          <p className="text-white text-sm break-keep">
            바로파밍은
            <br />
            모든 회원이 함께하는<span className="text-orange-400">
              {" "}
              소통
            </span>{" "}
            공간입니다.
            <br /> 바로팜에서 구매한 상품으로 만든 요리를 자랑하고 나만의
            레시피를 나누어 보세요!
          </p>
        </div>

        <div className="h-[7px] bg-gray1 -mx-5"></div>
        {boards.length !== 0 && keyword !== "" && (
          <>
            <span className="block py-3 text-sm font-semibold">
              &quot;{keyword}&quot; 검색 결과 {boards.length}개
            </span>
          </>
        )}
        {boards}
        {boards.length === 0 && keyword !== "" && (
          <div className="relative">
            <span className="mt-10 block text-center text-gray4">
              &quot;{keyword}&quot; 검색 결과가 없습니다.
            </span>
          </div>
        )}
        <Link
          to={isLogin ? "new" : ""}
          onClick={!isLogin ? (event) => handleClick(event) : null}
          className="fixed right-[calc(50%-155px)] bottom-[150px] w-[40px] h-[40px] rounded-full shadow-bottom"
        >
          <img src="/icons/icon_newpost.svg" className="w-full h-full" />
        </Link>
        <div className="flex justify-center my-5 items-center gap-2">
          <Pagination
            page={page}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      </div>
    </>
  );
}
