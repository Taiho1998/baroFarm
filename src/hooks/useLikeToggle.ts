import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosInstance from "@hooks/useAxiosInstance";

export const useLikeToggle = (product) => {
  const [isLiked, setIsLiked] = useState(!!product?.myBookmarkId);
  const queryClient = useQueryClient();
  const instance = useAxiosInstance();

  useEffect(() => {
    setIsLiked(!!product?.myBookmarkId);
  }, [product]);

  const { mutate: addLike } = useMutation({
    mutationFn: async () => {
      if (!product) return;
      const response = await instance.post(`/bookmarks/product`, {
        target_id: product._id,
      });
      return response.data.item;
    },

    onSuccess: () => {
      setIsLiked(true);
      queryClient.invalidateQueries(["products"], product.extra.category);
    },
    onError: (error) => {
      console.error("찜 추가 실패: ", error);
    },
  });

  const { mutate: removeLike } = useMutation({
    mutationFn: async () => {
      if (!product || !product.myBookmarkId) return;
      const response = await instance.delete(`/bookmarks/${product.myBookmarkId}`);
      return response.data;
    },
    onSuccess: () => {
      setIsLiked(false);
      queryClient.invalidateQueries(["products"], product.extra.category);
    },
    onError: () => {
      console.error("좋아요 삭제 실패: ", error);
    },
  });

  const handleLike = () => {
    if (isLiked && product.myBookmarkId) {
      removeLike();
    } else {
      addLike();
    }
  };

  return {
    isLiked,
    handleLike,
  };
};
