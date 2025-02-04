import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import HeaderIcon from "@components/HeaderIcon";
import Product from "@components/Product";
import ProductBig from "@components/ProductBig";
import Carousel from "@components/Carousel";
import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";
import Spinner from "@components/Spinner";
import DataErrorPage from "@pages/DataErrorPage";
import getMonthlyData from "@utils/getMonthlyData";
import { Helmet } from "react-helmet-async";

const categories = [
  { title: "제철 과일", image: "/images/menu/Fruit.svg", url: "/menu/fruit" },
  {
    title: "채소",
    image: "/images/menu/Vegetable.svg",
    url: "/menu/vegetable",
  },
  { title: "김치", image: "/images/menu/Kimchi.svg", url: "/menu/kimchi" },
  {
    title: "축산물",
    image: "/images/menu/Livestock.svg",
    url: "/menu/liveStock",
  },
  { title: "수산물", image: "/images/menu/Seafood.svg", url: "/menu/seafood" },
  { title: "간편식품", image: "/images/menu/Simple.svg", url: "/menu/simple" },
  { title: "떡", image: "/images/menu/Ricecake.svg", url: "/menu/riceCake" },
  { title: "쌀/잡곡", image: "/images/menu/Rice.svg", url: "/menu/rice" },
];

export default function MainPage() {
  // axios instance
  const axios = useAxiosInstance();
  // Outlet 컴포넌트로 전달받은 props.setHeaderContents 접근
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();
  // 현재 날짜
  const currentMonth = new Date().getMonth() + 1;

  // 헤더 아이콘 설정
  useEffect(() => {
    setHeaderContents({
      leftChild: (
        <img
          src="/images/BaroFarmLogo_long.png"
          className="absolute top-1/2 -translate-y-1/2 h-[40px]"
        />
      ),
      rightChild: (
        <>
          <HeaderIcon name="search" onClick={() => navigate("/search")} />
          <HeaderIcon name="cart_empty" onClick={() => navigate("/cart")} />
        </>
      ),
    });
  }, []);

  // 카테고리 아이콘 렌더링
  const categoryIcons = categories.map((item, index) => (
    <Link to={item.url} key={index}>
      <img src={item.image} alt={`${item.title} 카테고리`} />
      <span>{item.title}</span>
    </Link>
  ));

  // 상품 목록 데이터 fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => axios.get("/products"),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  // 게시글 데이터 fetching
  const { data: board } = useQuery({
    queryKey: ["posts", "community"],
    queryFn: () => axios.get("/posts?type=community"),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <DataErrorPage />;

  // 데이터 없을시 null 반환하여 에러 방지
  if (!data) return null;
  console.log(data);

  // 캐러셀을 위한 할인 상품 sorting
  const sortedSaleData = data.toSorted((a, b) => b.extra.sale - a.extra.sale);
  const saleProducts = sortedSaleData.filter((_, index) => index < 6);

  // 인기 상품 렌더링
  const sortedBestData = data.toSorted((a, b) => b.buyQuantity - a.buyQuantity);
  const bestProducts = sortedBestData
    // 4개의 상품만 골라서 Product 컴포넌트로 보여준다.
    .filter((_, index) => index < 4)
    .map((product) => <Product key={product._id} {...product} />);

  // 새상품 렌더링
  const filteredNewData = getMonthlyData(data);
  const newProducts = filteredNewData
    // 4개의 상품만 골라서 Product 컴포넌트로 보여준다.
    .filter((_, index) => index < 4)
    .map((product) => <Product key={product._id} {...product} />);

  // 제철 상품 렌더링
  const filteredOnMonthData = data.filter((item) =>
    item.extra.bestMonth?.includes(currentMonth)
  );
  const onMonthProducts = filteredOnMonthData
    .filter((_, index) => index < 6)
    .map((product) => <ProductBig key={product._id} {...product} />);

  // 게시글 개수에 따라 rows 정하기
  const howManyRows = Math.ceil(board?.length / 3);
  // 게시글 이미지 렌더링
  const storyImages = (
    <div
      className={`grid grid-cols-3 grid-rows-${howManyRows} px-5 gap-1 *:size-[120px] *:object-cover *:cursor-pointer`}
    >
      {/* 최대 9개까지만 필터링 */}
      {board
        ?.filter((_, index) => index < 9)
        .map((item, index) => (
          <img
            key={index}
            src={`https://11.fesp.shop${item.image}`}
            alt={item.content}
            onClick={() => navigate(`/board/${item._id}`)}
          />
        ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>바로Farm</title>
      </Helmet>
      <div>
        <Carousel height={225} data={saleProducts} />
        <section className="px-5 mb-4">
          <h2 className="text-xl mb-3">
            관심있는 <span className="font-bold">카테고리</span> 선택하기
          </h2>
          <div className="category-div grid grid-cols-4 gap-y-[6px] gap-x-[14px] text-[14px] *:flex *:flex-col *:text-center">
            {categoryIcons}
          </div>
        </section>
        <section className="px-5 mb-4">
          <div className="flex justify-between mb-3">
            <h2 className="text-xl">
              지금 최고 <span className="font-bold">인기 상품! 🔥</span>
            </h2>
            <Link
              to={"/search/best"}
              className="text-xs flex gap-1 items-start cursor-pointer"
            >
              더보기
              <img
                src="/icons/icon_move.svg"
                alt="더보기 버튼"
                className="size-4"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 justify-between gap-5">
            {bestProducts}
          </div>
        </section>
        <section className="px-5 mb-4">
          <div className="flex justify-between mb-3">
            <h2 className="text-xl">
              따끈따끈한 <span className="font-bold">신상품! ⏰</span>
            </h2>
            <Link
              to={"/search/new"}
              className="text-xs flex gap-1 items-start cursor-pointer"
            >
              더보기
              <img
                src="/icons/icon_move.svg"
                alt="더보기 버튼"
                className="size-4"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 justify-between gap-5">
            {newProducts}
          </div>
        </section>
        <section className="px-5 mb-4">
          <div className="flex justify-between">
            <h2 className="text-xl">
              이 맛이야! <span className="font-bold">제철 음식 🍂</span>
            </h2>
            <Link
              to={"/search/seasonal"}
              className="text-xs flex gap-1 items-start cursor-pointer"
            >
              더보기
              <img
                src="/icons/icon_move.svg"
                alt="더보기 버튼"
                className="size-4"
              />
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-3">{onMonthProducts}</div>
        </section>
        <section className="mb-4">
          <div className="flex justify-between px-5 mb-4">
            <h2 className="text-xl">
              나만의 <span className="font-bold">요리 스토리 🥘</span>
            </h2>
            <div className="flex gap-1 items-start relative *:relative *:top-1">
              <Link to="/board" className="text-xs">
                커뮤니티 가기
              </Link>
              <button>
                <img
                  src="/icons/icon_move.svg"
                  alt="더보기 버튼"
                  className="size-4"
                />
              </button>
            </div>
          </div>
          {storyImages}
        </section>
        <section className="flex flex-col gap-1 px-5 bg-gray1 text-black text-sm py-5 text-center">
          <p className="font-semibold">(주) 바로팜 사업자 정보</p>
          <p>
            (주)바로팜 | 대표자 : 바로팜 <br />
            사업자 등록번호 : 023-25-59672 <br />
            주소 : 서울 강남구 옆집의 옆집 234로 무천타워 2층 <br />
            대표번호 : 1588-1028 <br />
            메일 : baroFarm@baroFarm.co.kr
          </p>
          <p className="font-semibold">고객센터 1800-1800</p>
          <p className="mb-[58px]">
            누구보다 빠르게 남들과는 다르게 상담해 드립니다.
          </p>
          <p>이용약관 | 개인정보처리방침 | 게시글 수집 및 이용 안내</p>
        </section>
      </div>
    </>
  );
}
