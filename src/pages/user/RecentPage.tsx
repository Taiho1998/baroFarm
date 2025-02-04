import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import HeaderIcon from "@components/HeaderIcon";
import Products from "@components/Products";
import { Helmet } from "react-helmet-async";

export default function RecentPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "최근 본 상품",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);

  const productsData = JSON.parse(sessionStorage.getItem("productData"));

  return (
    <>
      <Helmet>
        <title>최근 본 상품 | 바로Farm</title>
      </Helmet>
      {!!productsData ? (
        <Products productsData={productsData} />
      ) : (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray4">
          최근 본 상품이 없습니다.
        </p>
      )}
    </>
  );
}
