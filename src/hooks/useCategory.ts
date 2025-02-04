import { useQuery } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";

export const useCategory = (product) => {
  const instance = useAxiosInstance();

  const { data: categoryData } = useQuery({
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
