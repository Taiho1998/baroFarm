import HeaderIcon from "@components/HeaderIcon";
import NewPost from "@components/NewPost";
import { useEffect, useState } from "react";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { ReviewData, SetHeaderContents } from "types";

export default function ProductNewReviewPage() {
  const { setHeaderContents } = useOutletContext<SetHeaderContents>();
  const navigate = useNavigate();

  type ReviewForm = {
    order_id?: number;
    product_id?: number;
    rating: number;
    content: string;
    image: File[];
  };

  const { register, handleSubmit } = useForm<ReviewForm>();

  const queryClient = useQueryClient();
  const axios = useAxiosInstance();

  const { _id, order_id } = useParams();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "후기 작성",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);

  const [rating, setRating] = useState(0);
  const handleRating = (rating: number) => {
    setRating(rating);
  };

  const addReview = useMutation({
    mutationFn: async (item: {
      order_id?: number;
      product_id?: number;
      rating: number;
      content: string;
      image: File[];
    }) => {
      let imageUrl = null;

      if (item.image && item.image[0]) {
        const formData = new FormData();
        formData.append("attach", item.image[0]);

        const uploadImg = await axios.post(`/files`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = uploadImg.data.item[0].path; // 서버에서 반환된 이미지 URL
      }
      const body = {
        order_id: typeof order_id === "string" ? parseInt(order_id) : null,
        product_id: typeof _id === "string" ? parseInt(_id) : null,
        rating: rating,
        content: item.content,
        extra: {
          image: imageUrl,
        },
      };

      return axios.post(`/replies`, body);
    },
    onSuccess: () => {
      toast.success("후기가 등록되었습니다.");
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ["post", "review"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <>
      <Helmet>
        <title>후기 작성 | 바로Farm</title>
      </Helmet>
      <NewPost
        isBoard={false}
        handleSubmit={handleSubmit((data) => addReview.mutate(data, undefined))}
        register={register}
        handleRating={handleRating}
      />
    </>
  );
}
