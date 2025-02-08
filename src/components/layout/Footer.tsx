import NavItem from "@components/NavItem";
import ShowConfirmToast from "@components/ShowConfirmToast";
import useUserStore from "@zustand/useUserStore";
import { useNavigate } from "react-router-dom";

const icons = {
  category: {
    default: "/icons/icon_category_empty.svg",
    active: "/icons/icon_category_full.svg",
  },
  community: {
    default: "/icons/icon_comm_empty.svg",
    active: "/icons/icon_comm_full.svg",
  },
  home: {
    default: "/icons/icon_home_empty.svg",
    active: "/icons/icon_home_full.svg",
  },
  profile: {
    default: "/icons/icon_profile_empty.svg",
    active: "/icons/icon_profile_full.svg",
  },
  cart: {
    default: "/icons/icon_cart_empty.svg",
    active: "/icons/icon_cart_full.svg",
  },
};

export default function Footer() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  async function navigateLogin() {
    const gotoLogin = await ShowConfirmToast(
      "로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?"
    );
    if (gotoLogin)
      navigate("/users/login", { state: { from: location.pathname } });
  }

  return (
    <nav className="h-[100px] border-t border-gray1 flex items-center justify-around fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto bg-white">
      <NavItem
        to="/menu"
        defaultIcon={icons.category.default}
        activeIcon={icons.category.active}
        label="카테고리"
      />
      <NavItem
        to="/board"
        defaultIcon={icons.community.default}
        activeIcon={icons.community.active}
        label="바로파밍"
      />
      <NavItem
        to="/"
        end
        defaultIcon={icons.home.default}
        activeIcon={icons.home.active}
        label="홈"
      />
      <NavItem
        to="/users/mypage"
        defaultIcon={icons.profile.default}
        activeIcon={icons.profile.active}
        label="프로필"
      />
      <button
        className="flex flex-col items-center"
        onClick={!user ? () => navigateLogin() : () => navigate("/cart")}
      >
        <img src={icons.cart.default} className="w-10" alt={`장바구니icon`} />
        <span>장바구니</span>
      </button>
    </nav>
  );
}
