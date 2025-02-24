import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { ProductData } from "types";

export const useCategory = (product: ProductData) => {
  const instance = useAxiosInstance();

  const {
    data: categoryData,
  }: {
    data?: { productCategory?: { codes: { code: string; value: string }[] } };
  } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await instance.get(`/codes/productCategory`);
      return response.data.item;
    },
  });

  const category = categoryData?.productCategory?.codes?.find(
    (item) => item.code === product?.extra.category
  );

  return category?.value;
};
