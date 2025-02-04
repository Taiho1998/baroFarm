import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import HeaderIcon from "@components/HeaderIcon";
import SoldItem from "@components/SoldItem";
import { useQuery } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import useAxiosInstance from "@hooks/useAxiosInstance";
import Spinner from "@components/Spinner";
import { Helmet } from "react-helmet-async";

export default function SalePage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const axios = useAxiosInstance();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "판매 내역",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["products", user._id],
    queryFn: () => axios.get(`/seller/products?sort={"createdAt": -1}`),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
    enabled: !!user,
  });

  if (isLoading) {
    return <Spinner />;
  }

  const groupedData = data.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString(); // 날짜만 추출 (YYYY.MM.DD)
    if (!acc[date]) acc[date] = []; // 날짜 키가 없으면 생성
    acc[date].push(item); // 날짜 키에 데이터 추가
    return acc;
  }, {});
  const groupedArray = Object.entries(groupedData).map(([date, items]) => ({
    date,
    items,
  }));

  const SoldItemList = groupedArray.map((data) => {
    return (
      <div key={data.date} className="p-5 pb-0">
        <p className="font-bold text-lg pl-1">{data.date}</p>
        {data.items.map((item) => (
          <SoldItem key={item._id} item={item} />
        ))}
      </div>
    );
  });
  return (
    <>
      <Helmet>
        <title>판매 내역 | 바로Farm</title>
      </Helmet>
      {data.length !== 0 && <>{SoldItemList}</>}
      {data.length === 0 && (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray4">
          아직 등록된 상품이 없습니다.
        </p>
      )}
    </>
  );
}
