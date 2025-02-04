import HeaderIcon from "@components/HeaderIcon";
import RecentKeywordItem from "@components/RecentKeywordItem";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

export default function SearchPage() {
  // 최근 검색어 상태 관리
  // useState에 함수를 전달할 경우, 컴포넌트의 첫 번째 렌더링에서만 호출한 후 리렌더링에서는 이 함수의 반환값을 무시하고, 이미 저장된 state값을 사용함
  const [recentKeywords, setRecentKeywords] = useState(() => {
    // localStorage에서 최근 검색어 배열을 가져오거나, 없으면 빈 배열 반환
    return JSON.parse(localStorage.getItem("recentKeywords") || "[]");
  });

  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "검색",
    });
  }, []);

  // 검색어 저장하는 함수
  const saveKeyword = (newKeyword) => {
    // 이미 존재하는 검색어인지 확인(중복 방지)
    if (!recentKeywords.includes(newKeyword)) {
      // 새로운(최근) 검색어를 배열 앞에 추가
      const updatedKeywords = [newKeyword, ...recentKeywords];
      // 최대 개수 10개로 제한
      const limitedKeywords = limitKeywords(updatedKeywords);
      // localStorage 업데이트
      localStorage.setItem("recentKeywords", JSON.stringify(limitedKeywords));
      // state 업데이트
      setRecentKeywords(limitedKeywords);
    }
  };

  // 검색어 10개로 제한하는 함수
  const limitKeywords = (keywords) => {
    // 10개 초과시 가장 오래된 검색어 제거
    if (keywords.length > 10) {
      return keywords.slice(0, 10); // 배열이 10개 초과일 때: 앞에서부터 10개만 잘라서 반환
    }
    return keywords; // 배열이 10개 이하일 때: 전체 배열을 그대로 반환
  };

  // 검색어 개별 삭제하는 함수
  const removeKeyword = (keywordToRemove) => {
    // filter로 선택된 검색어만 제외하고 새 배열 생성
    const filteredKeywords = recentKeywords.filter(
      (keyword) => keyword !== keywordToRemove
    );
    // localStorage 업데이트
    localStorage.setItem("recentKeywords", JSON.stringify(filteredKeywords));
    // state 업데이트
    setRecentKeywords(filteredKeywords);
  };

  // 검색어 전체 삭제하는 함수
  const clearAllKeyword = () => {
    localStorage.removeItem("recentKeywords");
    setRecentKeywords([]);
  };

  // 검색어 제출 처리 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    // 폼에서 name="keyword"인 입력값을 가져와 앞뒤 공백 제거
    const keyword = e.target.keyword.value.trim();

    // 검색어가 없는 경우 경고 메시지 출력 후 종료
    if (!keyword) {
      toast.info("검색어를 입력해주세요.");
      return; // navigate 방지
    }

    // 검색어가 있는 경우 localStorage에 검색어 저장
    saveKeyword(keyword);
    // 검색어가 있는 경우 검색 결과 페이지로 이동
    navigate(`/search/results?keyword=${keyword}`);
  };

  return (
    <>
      <Helmet>
        <title>검색페이지 | 바로Farm</title>
        {/* <meta name="description" content="신선한 농수산물을 간편하게 찾아보세요."></meta> */}
      </Helmet>

      <div className="p-5">
        {/* 검색창 */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="search" className="text-sm font-semibold block mb-2">
            찾으시는 상품이 있으신가요?
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
              placeholder="검색어를 입력해주세요"
              id="search"
              name="keyword"
              maxLength={20}
            />
          </div>
        </form>
        {/* 최근 검색어 */}
        <div className="flex items-center mt-2.5">
          <h5 className="flex-grow text-sm font-semibold">최근 검색어</h5>
          <button
            className="text-xs font-medium"
            type="button"
            onClick={clearAllKeyword}
          >
            전체 삭제
          </button>
        </div>

        <ul className="mt-2.5 flex items-center flex-wrap gap-2.5 text-sm">
          {recentKeywords.map((keyword) => (
            <RecentKeywordItem
              key={keyword}
              keyword={keyword}
              onRemove={removeKeyword}
            />
          ))}
        </ul>
      </div>
    </>
  );
}
