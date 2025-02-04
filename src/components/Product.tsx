import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useLikeToggle } from "@hooks/useLikeToggle";

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

Product.propTypes = {
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
    rating: PropTypes.number,
  }).isRequired,
  price: PropTypes.number.isRequired,
};

export default function Product(product) {
  const navigate = useNavigate();

  const goDetailPage = () => {
    navigate(`/product/${product._id}`);
  };

  const { isLiked, handleLike } = useLikeToggle(product);

  return (
    <section className="flex flex-col cursor-pointer" onClick={goDetailPage}>
      <div className="relative">
        <img
          className="h-[160px] rounded-lg object-cover w-full"
          alt={product.name}
          src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
        />
        <button
          className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-bottom"
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
        >
          <img
            className="w-5"
            src={isLiked ? likeIcon.active : likeIcon.default}
          />
        </button>
      </div>
      <div className="pl-[5px] pt-[10px]">
        <span className="font-semibold pt-[10px] text-sm">
          {product.seller.name}
        </span>
        <p className="text-xs line-clamp-1">{product.name}</p>
        <div className="pt-1 flex items-center">
          <span className="text-red1 font-semibold text-base pr-1">
            {product.extra.sale !== 0 ? `${product.extra.sale}%` : undefined}
          </span>
          <span className="font-extrabold text-lg line-clamp-1">
            {product.extra.saledPrice.toLocaleString()}원
          </span>
        </div>
        <span className="font-semibold text-xs pr-2">
          ⭐️ {product.rating ? product.rating.toFixed(1) : 0}
        </span>
        <span className="text-gray4 font-regular text-xs ">
          (
          {Array.isArray(product.replies)
            ? product.replies.length > 0
              ? product.replies.length
              : 0
            : product.replies}
          )
        </span>
      </div>
    </section>
  );
}
