import { useLikeToggle } from "@hooks/useLikeToggle";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

ProductBig.propTypes = {
  _id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  seller: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  mainImages: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
  extra: PropTypes.shape({
    sale: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
  price: PropTypes.number.isRequired,
  replies: PropTypes.number.isRequired, // 댓글 배열
};

export default function ProductBig(product) {
  const navigate = useNavigate();

  const goDetailPage = () => {
    navigate(`/product/${product._id}`);
  };

  const { isLiked, handleLike } = useLikeToggle(product);

  return (
    <section
      className="flex flex-col shrink-0 py-5 w-[201px] cursor-pointer"
      onClick={goDetailPage}
    >
      <div className="relative">
        <img
          className="h-[279px] rounded-lg object-cover"
          alt={product.name}
          src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
        />
        <button
          className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-bottom"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <img src={isLiked ? likeIcon.active : likeIcon.default} />
        </button>
      </div>
      <div className="pl-[5px] pt-[10px]">
        <span className="font-semibold pt-[10px] text-sm">
          {product.seller.name}
        </span>
        <p className="text-xs line-clamp-1">{product.name}</p>
        <div className="pt-1 flex items-center">
          <span className="text-red1 font-semibold text-base pr-1">
            {product.extra.sale}%
          </span>
          <span className="font-extrabold text-lg line-clamp-1">
            {product.extra.saledPrice.toLocaleString()}원
          </span>
        </div>
        <span className="font-semibold text-xs pr-2">
          ⭐️ {product.rating ? product.rating.toFixed(1) : 0}
        </span>
        <span className="text-gray4 font-regular text-xs">
          {" "}
          ({product.replies})
        </span>
      </div>
    </section>
  );
}
