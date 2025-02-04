import { useEffect, useState, useRef } from "react";
import {
  useNavigate,
  useOutletContext,
  Link,
  useParams,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import useAxiosInstance from "@hooks/useAxiosInstance";
import { useLikeToggle } from "@hooks/useLikeToggle";
import { useCategory } from "@hooks/useCategory";
import useUserStore from "@zustand/useUserStore";

import PurchaseModal from "@components/PurchaseModal";
import Modal from "@components/Modal";
import ReviewBox from "@components/ReviewBox";
import Spinner from "@components/Spinner";

import forwardIcon from "/icons/icon_forward.svg";
import cartIcon from "/icons/icon_cart_modal.svg";
import HeaderIcon from "@components/HeaderIcon";
import DataErrorPage from "@pages/DataErrorPage";
import { Helmet } from "react-helmet-async";
import ShowConfirmToast from "@components/ShowConfirmToast";

const likeIcon = {
  default: "/icons/icon_likeHeart_no.svg",
  active: "/icons/icon_likeHeart_yes.svg",
};

export default function ProductDetailPage() {
  const { _id } = useParams();

  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  const instance = useAxiosInstance();
  const queryClient = useQueryClient();

  const { user } = useUserStore();

  async function navigateLogin() {
    const gotoLogin = await ShowConfirmToast(
      "로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?"
    );
    if (gotoLogin)
      navigate("/users/login", { state: { from: location.pathname } });
  }

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product"],
    queryFn: async () => {
      const response = await instance.get(`/products/${_id}`);
      return response.data.item;
    },
  });

  if (!!product) {
    let productData = JSON.parse(sessionStorage.getItem("productData"));

    // 맨 처음 값 초기화
    if (!Array.isArray(productData)) {
      productData = [];
    }

    // 중복된 객체를 제거
    productData = productData.filter(
      (item) => item && item._id !== product._id
    );

    // 새로운 상품 추가
    productData.unshift(product);

    // // 최대 10개까지만 유지
    // if (productData.length > 10) {
    //   productData.pop();
    // }

    // 저장
    sessionStorage.setItem("productData", JSON.stringify(productData));
  }

  const { isLiked, handleLike } = useLikeToggle(product);
  const categoryTitle = useCategory(product);

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: categoryTitle,
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
          <HeaderIcon name="cart_empty" onClick={() => navigate("/cart")} />
        </>
      ),
    });
    window.scrollTo(0, 0);
  }, [product, categoryTitle]);

  const purchaseModalRef = useRef();
  const modalRef = useRef();

  const openPurchaseModal = () => {
    purchaseModalRef.current.open();
  };

  const openModal = () => {
    modalRef.current.open();
    purchaseModalRef.current.close();
  };

  const [count, setCount] = useState(1);
  // 이 아이템을 결제 페이지로 보낼때 재구조화하기 위해 상태관리
  const [purchaseItem, setPurchaseItem] = useState();
  // (1) 아이템 불러와졌을 때, (2) count가 바뀔 때 purchaseItem 상태 업데이트
  useEffect(() => {
    setPurchaseItem([
      {
        product: {
          ...product,
          image: { path: product?.mainImages[0].path },
        },
        quantity: count,
      },
    ]);
  }, [product, count]);

  const handleCount = (sign) => {
    if (sign === "plus") setCount((count) => count + 1);
    else if (sign === "minus" && count > 1) setCount((count) => count - 1);
  };

  const cartItem = useMutation({
    mutationFn: async () => {
      const response = await instance.post(`/carts`, {
        product_id: parseInt(_id),
        quantity: parseInt(count),
      });
      return response.data.item;
    },
    onSuccess: () => {
      openModal();
      queryClient.invalidateQueries(["cart"]);
    },
    onError: (error) => {
      console.error("Error adding to cart", error);
    },
  });

  if (isLoading) return <Spinner />;
  if (isError) return <DataErrorPage />;

  return (
    <>
      <Helmet>
        <title>{product.name} | 바로Farm</title>
      </Helmet>
      <img
        alt={product.name}
        className="w-[390px] h-[330px] object-cover"
        src={`https://11.fesp.shop${product.mainImages[0]?.path}`}
      />
      <section className="p-5 border-b-8 border-b-gray1">
        <div className="flex items-center gap-[10px] pb-5">
          <img
            alt={product.name}
            src={`https://11.fesp.shop${product.seller.image}`}
            className="w-[25px] h-[25px] rounded-full"
          />
          <span className="font-semibold ">{product.seller.name}</span>
        </div>

        <p>{product.name}</p>

        <span className="font-semibold text-xs pr-2">
          ⭐️ {product.rating ? product.rating.toFixed(1) : 0}
        </span>
        <span className="text-xs">{product.replies.length}개 후기</span>

        <div className="pt-1">
          {product.extra.sale !== 0 ? (
            <>
              <span className="text-gray4 font-semibold pr-1">
                {product.extra.sale}%
              </span>
              <span className="font-semibold text-gray3 line-through">
                {product.price.toLocaleString()}원
              </span>
            </>
          ) : undefined}
          <p
            className={`font-extrabold text-xl ${
              product.extra.sale !== 0 ? "text-btn-primary" : "text-black"
            }`}
          >
            {product.extra.saledPrice.toLocaleString()}원
          </p>
        </div>
      </section>

      <section className="p-5 border-b-8 border-b-gray1">
        <div className="flex items-center justify-between">
          <span className="font-bold">후기 {product.replies.length}개</span>
          {product.replies.length > 0 ? (
            <Link
              to={`/product/${product._id}/reviews`}
              className="font-medium text-sm text-gray5 flex items-center"
            >
              전체보기
              <img src={forwardIcon} className="w-3" />
            </Link>
          ) : undefined}
        </div>
        <div className="flex overflow-x-auto gap-3 scrollbar-hide">
          {product.replies.map((reply) => (
            <ReviewBox
              key={reply._id}
              option={product.name}
              content={reply.content}
            />
          ))}
        </div>
      </section>

      <section className="p-5 border-b-8 border-b-gray1">
        <div dangerouslySetInnerHTML={{ __html: product.content }} />
      </section>

      <footer className="h-[95px] p-5 border-t border-gray1 flex items-center justify-between fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white">
        <button onClick={handleLike} className="pl-2">
          <img
            src={isLiked ? likeIcon.active : likeIcon.default}
            className="w-10"
          />
          <span className="text-sm font-medium">찜</span>
        </button>
        <button
          onClick={openPurchaseModal}
          className="w-[280px] text-lg text-white bg-btn-primary p-4 rounded-[10px]"
        >
          구매하기
        </button>
      </footer>

      <PurchaseModal ref={purchaseModalRef}>
        <p className="text-sm font-semibold">개수 선택</p>
        <div className="text-sm border border-gray3 rounded-[10px] p-5">
          <p>{product.name}</p>
          <div className="flex gap-2 items-center mt-5">
            <button
              className="w-6 h-6 bg-gray2 rounded-[5px]  text-white flex items-center justify-center"
              onClick={() => handleCount("minus")}
            >
              -
            </button>
            <span className="w-10 h-6 border rounded-[5px] flex items-center justify-center">
              {count}
            </span>
            <button
              className="w-6 h-6 bg-gray2 rounded-[5px]  text-white flex items-center justify-center"
              onClick={() => handleCount("plus")}
            >
              +
            </button>
            <span className="ml-auto text-base font-semibold">
              {(product.extra.saledPrice * count).toLocaleString()}원
            </span>
            <span className="text-[12px] text-red1 mt-[3px]">
              (-
              {(
                (product.price - product.extra.saledPrice) *
                count
              ).toLocaleString()}
              원 할인)
            </span>
          </div>
        </div>
        <div className="bg-gray1 border-y border-gray3 border-t py-3 flex justify-center">
          <p>
            상품 금액 {(product.extra.saledPrice * count).toLocaleString()} 원 +
            배송비 {product.shippingFees.toLocaleString()} 원
          </p>
        </div>
        <div className="flex justify-between gap-3">
          <button
            className="flex-1 text-lg text-btn-primary p-3 rounded-[10px] border border-btn-primary"
            onClick={() => cartItem.mutate()}
          >
            장바구니
          </button>
          <button
            className="flex-1 text-lg text-white bg-btn-primary p-3 rounded-[10px]"
            onClick={() => {
              if (!user) {
                navigateLogin();
              } else {
                const currentUrl = window.location.href;
                navigate("/payment", {
                  state: {
                    selectedItems: purchaseItem,
                    totalFees: product.extra.saledPrice * count,
                    totalShippingFees: product.shippingFees,
                    previousUrl: currentUrl,
                  },
                });
              }
            }}
          >
            구매하기
          </button>
        </div>
      </PurchaseModal>
      <Modal ref={modalRef}>
        <p className="text-center text-lg font-">
          <strong className="font-semibold">장바구니</strong>에 <br /> 상품을
          담았어요
        </p>
        <img src={cartIcon} className="w-[66px]" />
        <Link to="/cart">
          <span className="font-light border-b border-b-black">바로가기</span>
        </Link>
      </Modal>
    </>
  );
}
