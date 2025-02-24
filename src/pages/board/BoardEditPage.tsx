import Button from "@components/Button";
import HeaderIcon from "@components/HeaderIcon";
import NewPost from "@components/NewPost";
import useAxiosInstance from "@hooks/useAxiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "@zustand/useUserStore";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { BoardData, SetHeaderContents } from "types";

interface FormData {
  order_id?: number;
  product_id?: number;
  rating: number;
  content: string;
  image: File[];
}

export default function BoardEditPage() {
  const { setHeaderContents } = useOutletContext<SetHeaderContents>();
  const navigate = useNavigate();
  const location = useLocation();
  const data: BoardData | undefined = location.state.data;
  const { _id } = useParams();
  const axios = useAxiosInstance();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<FormData>();
  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "게시글 수정하기",
    });
  }, []);

  // Zustand store에서 user 상태를 가져옴
  const user = useUserStore((store) => store.user);
  // 익명의 사용자가 편집 페이지에 접근하는 것을 방지
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const checkImg = (file: File) => {
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

  const editPost = useMutation({
    mutationFn: async (item: FormData) => {
      let imageUrl = null;

      // 이미지 변경을 진행했을 경우 처음 등록할 때와 같이 업로드를 진행한 후 body에 imgURL을 추가
      // 단, 이미지 업로드는 필수가 아님
      if (item.image && item.image[0]) {
        if (checkImg(item.image[0])) {
          throw new Error(
            "jpeg, jpg, png, gif, webp, svg 파일을 업로드해야 합니다."
          );
        }
        const formData = new FormData();
        formData.append("attach", item.image[0]);
        try {
          const uploadImg = await axios.post(`/files`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageUrl = uploadImg.data.item[0].path; // 서버에서 반환된 이미지 URL
          const body = {
            content: item.content.replaceAll(/\n|\r\n/g, "<br/>"),
            image: imageUrl,
          };
          return axios.patch(`/posts/${_id}`, body);
        } catch (error) {
          console.error(
            "Image upload failed:",
            (error as { response: { data: string } }).response?.data ||
              (error as { message: string }).message
          );
          throw new Error("Image upload failed.");
        }
      } else {
        const body = {
          content: item.content.replaceAll(/\n|\r\n/g, "<br/>"),
        };
        return axios.patch(`/posts/${_id}`, body);
      }
    },
    onSuccess: () => {
      toast.success("게시물이 수정되었습니다.");

      queryClient.invalidateQueries({ queryKey: ["posts", _id] });
      navigate(`/board/${_id}`, { replace: true });
    },
    onError: (err) => {
      console.error("에러", err);
      toast.error(err.message);
    },
  });

  return (
    <>
      <Helmet>
        <title>게시글 수정 | 바로Farm</title>
      </Helmet>
      <NewPost
        isBoard={true}
        handleSubmit={handleSubmit((data) => editPost.mutate(data, undefined))}
        register={register}
        editInfo={data?.content}
      />
    </>
  );
}
