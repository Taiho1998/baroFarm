import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import HeaderIcon from "@components/HeaderIcon";

import productImage1 from "/images/Sample1.svg";
import PhotoReviewItem from "@components/PhotoReviewItem";

export default function PhotoReviewPage() {
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "포토 리뷰",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);

  return (
    <>
      <div className="p-5 flex gap-4 flex-wrap justify-center">
        <PhotoReviewItem />
        <PhotoReviewItem />
        <PhotoReviewItem />
        <PhotoReviewItem />
        <PhotoReviewItem />
        <PhotoReviewItem />
        <PhotoReviewItem />
        <PhotoReviewItem />
        <PhotoReviewItem />
      </div>
    </>
  );
}
