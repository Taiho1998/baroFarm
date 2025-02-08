import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { useLikeToggle } from "@hooks/useLikeToggle";
import Button from "@components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { toast } from "react-toastify";

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

ProductSmall.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    mainImages: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
      })
    ).isRequired,
    extra: PropTypes.shape({
      sale: PropTypes.number.isRequired,
      saledPrice: PropTypes.number.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
  }),
  bookmarkId: PropTypes.number.isRequired,
};

export default function ProductSmall({ product, bookmarkId }) {
  const navigate = useNavigate();
  const axios = useAxiosInstance();

  // 상품을 누르면 상품 상세 페이지로 이동
  const goDetailPage = () => {
    navigate(`/product/${product._id}`);
  };

  const queryClient = useQueryClient();
  // 북마크 해제 기능
  const deleteBookmark = useMutation({
    mutationFn: () => axios.delete(`/bookmarks/${bookmarkId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
  });

  // 장바구니에 추가 기능
  const addCartItem = useMutation({
    mutationFn: () =>
      axios.post(`/carts`, {
        product_id: parseInt(product._id),
        quantity: 1,
      }),
    onSuccess: () => {
      deleteBookmark.mutate();
      toast.success("장바구니에 추가되었습니다.");
    },
    onError: (error) => {
      console.error("Error adding to cart", error);
    },
  });

  return (
    <section className="flex flex-col cursor-pointer">
      <div className="relative">
        <img
          className="aspect-square rounded-lg object-cover w-full"
          alt={product.name}
          src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
          onClick={goDetailPage}
        />
        <button
          className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-bottom"
          onClick={(e) => {
            e.stopPropagation();
            deleteBookmark.mutate();
            queryClient.invalidateQueries({
              queryKey: ["bookmarks", "product"],
            });
          }}
        >
          <img className="w-5" src={likeIcon.active} />
        </button>
      </div>
      <div className="pl-[5px] pt-[10px]" onClick={goDetailPage}>
        <p className="text-xs line-clamp-1">{product.name}</p>
        <div className="pt-1 flex items-center">
          <span className="text-red1 font-semibold text-base pr-1">
            {product.extra.sale}%
          </span>
          <span className="font-extrabold text-lg line-clamp-1">
            {product.extra.saledPrice.toLocaleString()}원
          </span>
        </div>
      </div>
      <div className="self-center">
        <Button isWhite={true} onClick={() => addCartItem.mutate()}>
          장바구니 담기
        </Button>
      </div>
    </section>
  );
}
