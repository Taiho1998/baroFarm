import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useAxiosInstance from "@hooks/useAxiosInstance";
import HeaderIcon from "@components/HeaderIcon";
import PhotoReviewItem from "@components/PhotoReviewItem";
import ReviewItem from "@components/ReviewItem";
import Spinner from "@components/Spinner";
import DataErrorPage from "@pages/DataErrorPage";

import { Helmet } from "react-helmet-async";

export default function ReviewPage() {
  const { setHeaderContents } = useOutletContext();

  const navigate = useNavigate();
  const { _id } = useParams();

  const instance = useAxiosInstance();

  const [sortOrder, setSortOrder] = useState("best");

  const handleSort = (order) => {
    setSortOrder(order);
  };

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "후기",
    });
  }, []);

  const {
    data: reviewData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", _id, "reviews"],
    queryFn: async () => {
      const end = sortOrder === "best" ? { rating: -1 } : { createdAt: -1 };
      const response = await instance.get(
        `/replies/products/${_id}?sort=${JSON.stringify(end)}`
      );
      return response.data.item;
    },
    enable: !!_id && !!sortOrder,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <DataErrorPage />;

  const ratings = reviewData.map((review) => review.rating);
  const totalRating =
    ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length;

  const sortedReviewData =
    sortOrder === "new"
      ? [...reviewData].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      : reviewData;

  const photoReviews = reviewData.filter(
    (review) => review.extra && review.extra.image
  );
  return (
    <>
      <Helmet>
        <title>후기 | 바로Farm</title>
      </Helmet>
      <section className="p-5 border-b-[1px] border-b-gray2">
        <p className="font-medium pb-2">전체 구매자 평점</p>
        <span className="font-semibold pr-2">
          {Array(Math.floor(totalRating)).fill("⭐️")}
        </span>
        <span className="font-extrabold">{totalRating.toFixed(1)}</span>
      </section>

      {photoReviews.length > 0 && (
        <section className="p-5 pb-0 border-b-8 border-b-gray1">
          <div className="flex items-center justify-between">
            <span className="font-bold">사진 후기</span>
            {/* <Link
          to={`/product/${_id}/reviews/photo`}
          className="font-medium text-sm text-gray5 flex items-center"
        >
          더보기
          <img src={forwardIcon} className="w-3" />
        </Link> */}
          </div>
          <div className="flex overflow-x-auto gap-3 pt-5 pb-5">
            {photoReviews.map((review) => (
              <PhotoReviewItem key={review._id} image={review.extra.image} />
            ))}
          </div>
        </section>
      )}

      <section className="py-5">
        <p className="font-bold pl-5 pb-1">후기 {reviewData.length}개</p>
        <button
          className={`pl-5 text-sm font-semibold ${
            sortOrder === "best" ? "text-bg-primary" : "text-gray4"
          }`}
          onClick={() => handleSort("best")}
        >
          별점순
        </button>
        <button
          className={`pl-2 text-sm font-semibold ${
            sortOrder === "new" ? "text-bg-primary" : "text-gray4"
          }`}
          onClick={() => handleSort("new")}
        >
          최신순
        </button>
        {sortedReviewData.map((reply) => (
          <ReviewItem
            key={reply._id}
            reply={reply}
            productName={reply.product.name}
          />
        ))}
      </section>
    </>
  );
}
