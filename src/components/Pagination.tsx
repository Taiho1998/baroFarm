import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default function Pagination({
  page,
  handlePageChange,
  totalPages,
}: {
  page: number;
  handlePageChange: Function;
  totalPages: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading && page < totalPages) {
      setIsLoading(true);
      handlePageChange(page + 1); // 페이지가 무한하게 증가하는 것을 방지
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1,
    });
    // 최하단 요소를 관찰 대상으로 지정함
    const observerTarget = document.getElementById("observer");
    // 관찰 시작

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      observer.disconnect(); // 기존 observer 해제
    };
  }, [page, totalPages, isLoading]);

  useEffect(() => {
    setIsLoading(false);
  }, [page]);

  return (
    <>
      {/* <button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="px-3 py-1 mx-1 text-sm bg-gray2 rounded-md disabled:opacity-50"
      >
        이전
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-3 py-1 mx-1 text-sm rounded-md ${
            page === index + 1 ? "bg-btn-primary text-white" : "bg-gray2"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        className="px-3 py-1 mx-1 text-sm bg-gray2 rounded-md disabled:opacity-50"
      >
        다음
      </button> */}
      <div id="observer" className="h-[20px]">
        {page < totalPages ? `10개 더 보기` : "마지막 게시글입니다!"}
      </div>
    </>
  );
}
