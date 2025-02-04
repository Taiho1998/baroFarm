import PhotoReviewItem from "@components/PhotoReviewItem";
import { Link, useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

PurchaseItem.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  orderId: PropTypes.number.isRequired,
};

export default function PurchaseItem({ orderId, product, date }) {
  let isReviewed = false;
  const [year, month, day] = date.split(".");
  const arriveDate = `${month}/${day.split(" ")[0]}`;

  const navigate = useNavigate();

  if (!!product.review) isReviewed = true;
  return (
    <section
      className="flex gap-5 border-b-[0.5px] border-gray2 py-3 items-center"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <PhotoReviewItem image={product.image.path} />
      <div className="py-3 text-sm w-full relative">
        <p className="font-semibold">{product.name}</p>
        <p className="text-xs  text-gray5 py-1 pb-3">
          📦 {arriveDate} 구매 완료
        </p>
        <span className="font-semibold">
          {(
            (product.extra?.saledPrice ?? product.price) * product.quantity
          ).toLocaleString()}
          원
        </span>
        <span className="ml-4">{product.quantity}개</span>
        <Link
          to={
            isReviewed
              ? `/product/${product._id}/reviews`
              : `/product/${product._id}/reviews/new/${orderId}`
          }
          className={`text-xs absolute bottom-4 right-0 ${
            isReviewed
              ? "border-b border-gray5 text-gray5 hover:text-btn-primary hover:border-b-btn-primary"
              : "border-b border-btn-primary text-btn-primary hover:text-gray5 hover:border-gray5"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {isReviewed ? "후기 보기" : "후기 작성"}
        </Link>
      </div>
    </section>
  );
}
