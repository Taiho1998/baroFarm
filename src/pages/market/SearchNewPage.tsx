import { useNavigate, useOutletContext } from "react-router-dom";
import HeaderIcon from "@components/HeaderIcon";
import { useEffect } from "react";
import Products from "@components/Products";
import Spinner from "@components/Spinner";
import DataErrorPage from "@pages/DataErrorPage";
import getMonthlyData from "@utils/getMonthlyData";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useQuery } from "@tanstack/react-query";

export default function SearchNewPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "신상품",
    });
  }, []);

  const axios = useAxiosInstance();

  // 상품 목록 데이터 fetching
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: () => axios.get("/products"),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <DataErrorPage />;

  const filteredNewData = getMonthlyData(data);

  return <Products productsData={filteredNewData} />;
}
