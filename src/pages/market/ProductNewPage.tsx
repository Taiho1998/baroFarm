import HeaderIcon from "@components/HeaderIcon";
import useAxiosInstance from "@hooks/useAxiosInstance";
import ProductInfoForm from "@components/ProductInfoForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

export default function ProductNewPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { setHeaderContents } = useOutletContext();

  const navigate = useNavigate();
  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "상품 등록",
    });
  }, []);

  // div 내에 입력한 input & select 태그의 value 변경을 위함
  const [price, setPrice] = useState();

  const queryClient = useQueryClient();

  // zustand store에서 유저 상태 가져옴
  const axios = useAxiosInstance();

  //업로드되는 파일은 이미지 파일로 제한
  const checkImg = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg",
    ]; // 허용 MIME 타입
    if (!validTypes.includes(file.type)) {
      return true;
    }
    return false;
  };

  //상품 추가 함수
  //이미지 업로드와 카테고리 조회를 먼저 실행한 후 해당 함수에서 반환된 값을 가지고 body객체를 생성
  const addProduct = useMutation({
    mutationFn: async (item) => {
      let imageUrl = null;
      let imageName = null;
      let imageOriginalName = null;

      // 이미지 파일 확인 절차
      if (checkImg(item.image[0])) {
        throw new Error("이미지 파일을 업로드해야 합니다");
      }
      // 이미지 첨부는 필수이므로 이미지 첨부가 되어있지 않다면 아예 생성되지 않음
      if (item.image && item.image[0]) {
        const formData = new FormData();
        formData.append("attach", item.image[0]);
        try {
          const uploadImg = await axios.post(`/files`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageUrl = uploadImg.data.item[0].path; // 서버에서 반환된 이미지 URL
          imageName = uploadImg.data.item[0].name; // 서버에서 반환된 이미지 이름
          imageOriginalName = uploadImg.data.item[0].originalname; // 서버에서 반환된 이미지 원본 이름
        } catch (error) {
          console.error(
            "Image upload failed:",
            error.response?.data || error.message
          );
          throw new Error("Image upload failed.");
        }
        const codes = await axios.get("/codes");
        const categoryList = codes.data.item.nested.productCategory.codes;
        const category = categoryList.filter(
          (data) => data.code == item.category
        );

        const body = {
          name: item.name,
          content: `<p>${item.content}</p>`,
          price: price,
          shippingFees: price <= 35000 ? 2500 : 0,
          quantity: parseInt(item.quantity),
          extra: {
            isNew: true,
            isBest: false,
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
            // 새로운 상품이므로 평점은 0으로 초기화
            rating: 0,
          },
          mainImages: {
            path: imageUrl,
            name: imageName,
            originalname: imageOriginalName,
          },
        };
        return axios.post("/seller/products", body);
      }
    },
    onSuccess: () => {
      toast.success("상품이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["posts", "community"] });
      // 판매 내역 페이지로 이동하도록 이후 설정
      navigate("/users/mypage");
    },
    onError: (error) => {
      setValue("image", null);
      console.error("에러 발생: ", error.message);
      toast.error(`에러: ${error.message}`);
    },
  });

  return (
    <>
      <Helmet>
        <title>상품 등록 | 바로Farm</title>
      </Helmet>
      <ProductInfoForm
        register={register}
        handlesubmit={handleSubmit(addProduct.mutate)}
        errors={errors}
        price={price}
        setPrice={setPrice}
      />
    </>
  );
}
