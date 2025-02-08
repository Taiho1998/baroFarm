import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import useAxiosInstance from "@hooks/useAxiosInstance";
import HeaderIcon from "@components/HeaderIcon";
import Products from "@components/Products";
import Spinner from "@components/Spinner";
import DataErrorPage from "@pages/DataErrorPage";
import { Helmet } from "react-helmet-async";

export default function CategoryPage() {
  const { category } = useParams();
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  const categoryTitle = [
    { key: "fruit", label: "과일" },
    { key: "vegetable", label: "채소" },
    { key: "kimchi", label: "김치" },
    { key: "liveStock", label: "축산물" },
    { key: "seafood", label: "수산물" },
    { key: "simple", label: "간편식" },
    { key: "riceCake", label: "떡" },
    { key: "rice", label: "쌀 / 잡곡" },
  ];

  const categoryLabel =
    categoryTitle.find((item) => item.key === category)?.label || "카테고리";

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: categoryLabel,
      rightChild: (
        <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
      ),
    });
  }, [category]);

  const instance = useAxiosInstance();

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      const response = await instance.get(`/products`, {
        params: {
          custom: JSON.stringify({ "extra.category": category }),
        },
      });
      return response.data.item;
    },
  });

  if (isLoading) return <Spinner />;
  if (isError) return <DataErrorPage />;

  return (
    <>
      <Helmet>
        <title>{categoryLabel} | 바로Farm</title>
      </Helmet>
      <Products productsData={productsData} />
    </>
  );
}
