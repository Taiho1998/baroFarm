import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import fruitImage from "/images/menu/Fruit.svg";
import vegetableImage from "/images/menu/Vegetable.svg";
import kimchiImage from "/images/menu/Kimchi.svg";
import liveStockImage from "/images/menu/Livestock.svg";
import seafoodImage from "/images/menu/Seafood.svg";
import simpleImage from "/images/menu/Simple.svg";
import riceImage from "/images/menu/Rice.svg";
import riceCakeImage from "/images/menu/Ricecake.svg";

import MenuItem from "@components/MenuItem";
import HeaderIcon from "@components/HeaderIcon";

export default function MenuPage() {
  // Outlet 컴포넌트로 전달받은 props.setHeadetContents 접근
  const { setHeaderContents } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderContents({
      title: "카테고리",
      rightChild: (
        <>
          <HeaderIcon name="search" onClick={() => navigate("/search")} />
        </>
      ),
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>카테고리 | 바로Farm</title>
      </Helmet>

      <MenuItem to="/menu/fruit" image={fruitImage} title="과일" />
      <MenuItem to="/menu/vegetable" image={vegetableImage} title="채소" />
      <MenuItem to="/menu/kimchi" image={kimchiImage} title="김치" />
      <MenuItem to="/menu/liveStock" image={liveStockImage} title="축산물" />
      <MenuItem to="/menu/seafood" image={seafoodImage} title="수산물" />
      <MenuItem to="/menu/simple" image={simpleImage} title="간편식" />
      <MenuItem to="/menu/riceCake" image={riceImage} title="떡" />
      <MenuItem to="/menu/rice" image={riceCakeImage} title="쌀 / 잡곡" />
    </>
  );
}
