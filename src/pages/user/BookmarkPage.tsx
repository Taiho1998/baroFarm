import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";

import HeaderIcon from "@components/HeaderIcon";
import Products from "@components/Products";
import Spinner from "@components/Spinner";
import { Helmet } from "react-helmet-async";

export default function BookmarkPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  const instance = useAxiosInstance();
  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "찜한 상품",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);

  const {
    data: likeItem,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["like"],
    queryFn: async () => {
      const response = await instance.get(`/products`);
      return response.data.item;
    },
  });

  if (isLoading) return <Spinner />;
  if (isError) return <DataErrorPage />;

  const likeProducts = !!likeItem
    ? Object.values(likeItem).filter(
        (item) => item && item.myBookmarkId !== undefined
      )
    : [];

  return (
    <>
      <Helmet>
        <title>찜한 상품 | 바로Farm</title>
      </Helmet>
      {likeProducts.length === 0 ? (
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray4">
          찜한 상품이 없습니다.
        </p>
      ) : (
        <Products productsData={likeProducts} />
      )}
    </>
  );
}
