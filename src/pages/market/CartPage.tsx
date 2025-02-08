import Button from "@components/Button";
import CartItem from "@components/CartItem";
import Checkbox from "@components/Checkbox";
import HeaderIcon from "@components/HeaderIcon";
import ProductSmall from "@components/ProductSmall";
import ShowConfirmToast from "@components/ShowConfirmToast";
import Spinner from "@components/Spinner";
import useAxiosInstance from "@hooks/useAxiosInstance";
import DataErrorPage from "@pages/DataErrorPage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

export default function CartPage() {
  const axios = useAxiosInstance();
  const { user } = useUserStore();
  // 구매할 물품 선택을 위한 폼
  const { register, handleSubmit } = useForm();
  // 결제 버튼 보이기 상태
  const [showButton, setShowButton] = useState(false);
  // 최종 상품 금액을 따로 상태로 관리
  const [totalFees, setTotalFees] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalPayFees, setTotalPayFees] = useState(0);
  // 체크된 상품의 아이디를 담은 배열 상태 관리
  const [checkedItemsIds, setCheckedItemsIds] = useState([]);
  // 보여줄 상품의 타입을 상태 관리
  const [renderCart, setRenderCart] = useState(true);

  // targetRef가 보이면 결제버튼을 보이게 함
  const targetRef = useRef(null);

  // 헤더 상태 설정 함수
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  // 헤더 상태 설정
  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "장바구니",
    });
  }, []);

  // 장바구니 목록 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ["carts"],
    queryFn: () => axios.get("/carts"),
    select: (res) => res.data,
    staleTime: 1000 * 10,
  });

  // 스크롤에 따라 결제버튼 보이게 하기
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 타겟이 보이면 버튼 표시 상태 변경
            setShowButton(true);
          } else {
            setShowButton(false);
          }
        });
      },
      {
        // 뷰포트를 기준으로 감지
        root: null,
        // 10%만 보이면 트리거
        threshold: 0.1,
      }
    );

    const targetElement = targetRef.current;

    // 조건부 렌더링으로 targetRef가 사용하는 요소가 동적으로 생성되거나 사라질 경우에 에러를 발생시키지 않기 위해 조건문으로 검사 필요.
    if (targetElement) {
      observer.observe(targetElement);
    }

    // 컴포넌트 언마운트시 옵저버 해제 (메모리 누수 방지)
    return () => {
      if (targetElement) {
        observer.unobserve(targetElement);
      }
    };
  }, [data, renderCart]);

  // 장바구니 상품 삭제
  const queryClient = useQueryClient();
  const deleteItem = useMutation({
    mutationFn: async (_id) => {
      const ok = await ShowConfirmToast("상품을 삭제하시겠습니까?");
      if (ok) {
        axios.delete(`/carts/${_id}`);
        toast.success("상품이 삭제되었습니다.");
      }
    },
    onSuccess: () => {
      // 캐시된 데이터 삭제 후 리렌더링
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (err) => console.error(err),
  });

  // 장바구니 수량 변경
  const updateItem = useMutation({
    mutationFn: ({ _id, quantity }) =>
      // _id는 장바구니 _id다 (상품의 _id는 product_id)
      axios.patch(`/carts/${_id}`, {
        // 보낼 데이터
        quantity: quantity,
      }),
    onSuccess: () => {
      // 캐시된 데이터 삭제 후 리렌더링
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (err) => console.error(err),
  });

  // 찜한 상품 data fetching
  const { data: likeItem } = useQuery({
    queryKey: ["bookmarks", "product"],
    queryFn: () => axios.get(`/bookmarks/product`),
    select: (res) => res.data.item,
  });

  // 전체 선택 핸들러
  // 전체 선택 체크박스의 체크 상태를 인수로 받는다.
  const toggleCheckAll = (isChecked) => {
    // 전체 선택 체크박스가 체크되었을 때
    if (isChecked) {
      // 장바구니에 담긴 모든 아이템의 아이디를 checkedItemsIds 배열에 담음
      const allProductsIds = data.item.map((item) => item._id);
      setCheckedItemsIds(allProductsIds);
    } else {
      // 체크 해제되었으면 checkedItemsIds 배열을 빈 배열로 설정
      setCheckedItemsIds([]);
    }
  };

  // 장바구니 개별 아이템 체크 핸들러
  const toggleCartItemCheck = (targetId) => {
    // 체크한 상품을 장바구니 데이터에서 찾음
    const cartItem = data.item.find((item) => item._id === targetId);

    // 체크한 상품의 product_id를 checkedCartItems 상태에 추가/제거
    setCheckedItemsIds((prevCheckedIds) => {
      const isAlreadyChecked = prevCheckedIds.includes(cartItem._id);

      if (isAlreadyChecked) {
        return prevCheckedIds.filter((id) => id !== cartItem._id);
      }
      return [...prevCheckedIds, cartItem._id];
    });
  };

  // 장바구니 아이템 여러건 삭제
  const deleteItems = useMutation({
    mutationFn: async () => {
      if (checkedItemsIds.length !== 0) {
        const ok = await ShowConfirmToast("선택하신 상품을 삭제할까요?");
        if (ok) {
          setCheckedItemsIds([]);
          return axios.delete("/carts", {
            data: {
              carts: checkedItemsIds,
            },
          });
        }
      } else {
        toast.warning("삭제할 상품을 선택하세요.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: (err) => console.error(err),
  });

  // 선택한 아이템, 데이터가 변경될 때 상품 금액, 할인 금액 다시 계산
  useEffect(() => {
    // 체크한 상품이 없다면 총금액, 할인금액을 0으로 설정하고 빠져나감
    if (checkedItemsIds.length === 0) {
      setTotalFees(0);
      setDiscount(0);
      return;
    }

    const { subtotal, totalDiscount } = checkedItemsIds.reduce(
      (acc, checkedId) => {
        // 장바구니에서 아이템 찾기
        const currentCartItem = data.item.find(
          (item) => item._id === checkedId
        );

        // 해당 아이템의 총 합산 금액 구하기
        const itemTotal =
          currentCartItem?.quantity * currentCartItem?.product.price;

        // 해당 아이템의 할인 금액 구하기
        const itemDiscount =
          currentCartItem?.quantity *
          (currentCartItem?.product.price -
            currentCartItem?.product.extra.saledPrice);

        return {
          subtotal: acc.subtotal + itemTotal, // 상품 금액 합계
          totalDiscount: acc.totalDiscount + itemDiscount, // 할인 금액 합계
        };
      },
      // 초기값 설정
      { subtotal: 0, totalDiscount: 0 }
    );

    setTotalFees(subtotal);
    setDiscount(totalDiscount);
  }, [checkedItemsIds, data?.item]);

  // 총 결제금액 업데이트
  useEffect(() => {
    setTotalPayFees(totalFees - discount);
  }, [totalFees, discount]);

  if (isLoading) return <Spinner />;
  if (isError) return <DataErrorPage />;
  // 데이터 없을시 null 반환하여 에러 방지
  if (!data && !likeItem) return null;

  // 최종 배송비 계산
  const totalShippingFees = totalFees > 30000 || totalFees === 0 ? 0 : 2500;

  // 장바구니 아이템으로 화면 렌더링
  const itemList = data.item.map((item) => (
    <CartItem
      key={item._id}
      {...item}
      register={register}
      deleteItem={deleteItem}
      updateItem={updateItem}
      toggleCartItemCheck={toggleCartItemCheck}
      isChecked={checkedItemsIds.includes(item._id)}
    />
  ));

  // 찜한 상품으로 화면 렌더링
  const likeItems = likeItem?.map((item) => (
    <ProductSmall key={item._id} product={item.product} bookmarkId={item._id} />
  ));

  // 체크한 아이템의 데이터가 담긴 배열을 구매 페이지로 전송
  const selectItem = () => {
    if (checkedItemsIds.length === 0) {
      toast.warning("구매할 물품을 선택하세요");
      return;
    }

    // 결제 페이지로 체크한 상품의 데이터 넘기기
    const selectedItems = checkedItemsIds.map((_id) =>
      // 각각의 id 마다 checkedItemsIds에 담긴 id와 같은 상품을 장바구니에서 찾아서 리턴
      data.item.find((item) => item._id === _id)
    );
    const currentUrl = window.location.href;

    navigate("/payment", {
      // seletedItems : 체크한 아이템의 아이디가 딤긴 배열
      // totalFees : 최종 상품 금액
      // totalShippingFees : 최종 배송비
      state: {
        selectedItems,
        totalFees: totalPayFees,
        totalShippingFees,
        previousUrl: currentUrl,
      },
    });
  };

  return (
    <>
      <Helmet>
        <title>장바구니 | 바로Farm</title>
      </Helmet>
      <div>
        <section className="flex h-9 font-semibold border-b border-gray2 *:flex *:grow *:cursor-pointer *:self-stretch *:items-center *:justify-center">
          <div
            className={`${
              renderCart ? "border-b-2 border-btn-primary" : "text-gray3"
            }`}
            onClick={() => setRenderCart(true)}
          >
            담은 상품({itemList.length})
          </div>
          <div
            className={`${
              renderCart ? "text-gray3 " : "border-b-2 border-btn-primary"
            }`}
            onClick={() => setRenderCart(false)}
          >
            찜한 상품({likeItem?.length})
          </div>
        </section>
        <>
          {/* 장바구니 상품 혹은 찜한 상품 조건부 렌더링 */}
          {renderCart ? (
            <div>
              {itemList.length > 0 ? (
                <>
                  <section className="py-[14px] px-5 flex gap-[6px] items-center border-b border-gray2">
                    <label
                      className="flex items-center cursor-pointer relative gap-2 grow"
                      htmlFor="checkAll"
                    >
                      <Checkbox
                        id="checkAll"
                        name="checkAll"
                        checked={checkedItemsIds.length === data.item.length}
                        onChange={(e) => toggleCheckAll(e.target.checked)}
                      />
                      전체 선택 ({checkedItemsIds.length}/{itemList?.length})
                    </label>
                    <Button onClick={() => deleteItems.mutate()}>삭제</Button>
                  </section>
                  <form onSubmit={handleSubmit(selectItem)}>
                    <section className="px-5 pb-4 border-b-4 border-gray2">
                      {itemList}
                    </section>
                    <section className="px-5 py-3">
                      <div className="border-b border-gray2">
                        <div className="text-xs flex justify-between mb-3">
                          <span className="text-gray4">총 상품 금액</span>
                          <span>{totalFees.toLocaleString()}원</span>
                        </div>
                        <div className="text-xs flex justify-between mb-3">
                          <span className="text-gray4">할인 금액</span>
                          <span className="text-red1">
                            {discount === 0
                              ? `${discount}원`
                              : `- ${discount.toLocaleString()}원`}
                          </span>
                        </div>
                        <div className="text-xs flex justify-between mb-3">
                          <span className="text-gray4">배송비</span>
                          <span>
                            {totalShippingFees === 0
                              ? "무료"
                              : `+ ${totalShippingFees.toLocaleString()}원`}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between mb-3 py-3 text-[16px] font-bold">
                        <span>총 결제 금액</span>
                        <span>
                          {(totalPayFees + totalShippingFees).toLocaleString()}
                          원
                        </span>
                      </div>
                    </section>
                    <div
                      ref={targetRef}
                      style={{ height: "1px", background: "transparent" }}
                    ></div>
                    <section
                      className={clsx(
                        "max-w-[390px] mx-auto px-5 py-8 bg-gray1 shadow-top fixed left-0 right-0 transition-all duration-150 ease-in-out",
                        showButton
                          ? "bottom-0 opacity-100"
                          : "-bottom-24 opacity-0"
                      )}
                    >
                      <Button isBig={true} type="submit">
                        {(totalPayFees + totalShippingFees).toLocaleString()}원
                        구매하기
                      </Button>
                    </section>
                  </form>
                </>
              ) : (
                <>
                  <section className="pt-[100px] flex flex-col gap-[10px] items-center text-[14px]">
                    <span className="text-gray4">담은 상품이 없습니다.</span>
                    <Link to="/" className="text-bg-primary underline">
                      쇼핑하러 가기
                    </Link>
                  </section>
                </>
              )}
            </div>
          ) : (
            // 찜한 상품렌더링
            <div>
              {likeItem.length > 0 ? (
                <div className="grid grid-cols-3 gap-x-2 gap-y-4 py-2 px-5">
                  {likeItems}
                </div>
              ) : (
                <section className="pt-[100px] flex flex-col gap-[10px] items-center text-[14px]">
                  <span className="text-gray4">찜한 상품이 없습니다.</span>
                  <Link to="/" className="text-bg-primary underline">
                    쇼핑하러 가기
                  </Link>
                </section>
              )}
            </div>
          )}
        </>
      </div>
    </>
  );
}
