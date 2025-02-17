import HeaderIcon from "@components/HeaderIcon";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { SetHeaderContents } from "types";

export default function ProductMyReviewPage() {
  const { setHeaderContents } = useOutletContext<SetHeaderContents>();
  const navigate = useNavigate();
  useEffect(() => {
    setHeaderContents({
      leftChild: <HeaderIcon name="back" onClick={() => navigate(-1)} />,
      title: "리뷰 작성",
      rightChild: (
        <>
          <HeaderIcon name="home_empty" onClick={() => navigate("/")} />
        </>
      ),
    });
  }, []);
  return (
    <div className="p-5">
      <h1>MyReviewPage</h1>
    </div>
  );
}
