import HeaderIcon from "@components/HeaderIcon";
import ProductInfoForm from "@components/ProductInfoForm";
import Spinner from "@components/Spinner";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditProduct() {
  const { id } = useParams();
  const [price, setPrice] = useState();
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setHeaderContents } = useOutletContext();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "상품 정보 수정",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data, isLoading } = useQuery({
    queryKey: ["products", id],
    queryFn: () => axios.get(`/products/${id}`),
    select: (res) => res.data.item,
    staleTime: 1000 * 10,
  });

  const patchProduct = useMutation({
    mutationFn: async (item) => {
      const codes = await axios.get("/codes");
      const categoryList = codes.data.item.nested.productCategory.codes;
      setPrice(data.price);
      const category = categoryList.filter(
        (data) => data.code == item.category
      );
      const body = {
        name: item.name,
        content: `<p>${item.content}</p>`,
        price: price,
        shippingFees: price >= 35000 ? 2500 : 0,
        quantity: parseInt(item.quantity),
        extra: {
          bestSeason:
            item.seasonStart !== item.seasonEnd
              ? [parseInt(item.seasonStart), parseInt(item.seasonEnd)]
              : [parseInt(item.seasonStart)], // 두 제철 값이 같은 경우에는 값 하나만 입력되게 함
          category: category[0].code,
          sort: category[0].sort,
          depth: category[0].depth,
          sale: item.sale ? parseInt(item.sale) : 0,
          saledPrice:
            Math.round(
              (price * (1 - (item.sale ? parseInt(item.sale) : 0) / 100)) / 10
            ) * 10,
        },
      };
      return axios.patch(`/seller/products/${id}`, body);
    },
    onSuccess: () => {
      toast.success("상품 정보가 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
      navigate("/users/sale", { replace: true });
    },
    onError: (err) => {
      console.err(err);
      toast.error("에러 메시지: ", err);
    },
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Helmet>
        <title>상품 수정 | 바로Farm</title>
      </Helmet>
      <ProductInfoForm
        register={register}
        handlesubmit={handleSubmit(patchProduct.mutate)}
        errors={errors}
        price={price}
        setPrice={setPrice}
        isEdit={true}
        editInfo={data}
      ></ProductInfoForm>
    </>
  );
}
