import PGButton from "@components/PGButton";
import PortOne from "@portone/browser-sdk/v2";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  productData: PropTypes.shape({
    selectedItems: PropTypes.array.isRequired,
    totalFees: PropTypes.number.isRequired,
  }).isRequired,
  purchaseItem: PropTypes.object.isRequired,
};

export default function PaymentModal({
  isOpen,
  onClose,
  productData,
  purchaseItem,
}) {
  if (!isOpen) return null;

  // 이전 페이지에서 넘어온 구매할 상품
  const selectedItems = productData.selectedItems;

  // 이전 페이지에서 넘어온 최종 금액
  const totalFees = productData.totalFees;

  // 구매할 상품의 이름을 문자열로 표기
  const orderName =
    selectedItems.length > 2
      ? `'${selectedItems[0].product.name}' 외 ${
          selectedItems.length - 1
        }개 상품`
      : `'${selectedItems[0].product.name}'`;

  // 카카오페이로 결제하기
  async function requestKaKaoPayment() {
    const response = await PortOne.requestPayment({
      redirectUrl: `${window.location.origin}/complete`,
      // Store ID 설정
      storeId: "store-e90f21f0-954a-4a58-ae68-e155e0670351",
      // 채널 키 설정
      channelKey: "channel-key-0f1c45cf-85fe-4c76-8f93-51e2c1e86159",
      paymentId: `payment-${crypto.randomUUID()}`,
      orderName: orderName,
      totalAmount: totalFees,
      currency: "CURRENCY_KRW",
      payMethod: "EASY_PAY",
    });

    if (response.code !== undefined) {
      // 오류 발생
      return toast.error(response.message);
    }

    selectedItems.forEach((item) =>
      purchaseItem.mutate({
        _id: item.product._id,
        quantity: item.quantity,
      })
    );
  }

  // 토스페이로 결제하기
  async function requestTossPayment() {
    const response = await PortOne.requestPayment({
      redirectUrl: `${window.location.origin}/complete`,
      // Store ID 설정
      storeId: "store-e90f21f0-954a-4a58-ae68-e155e0670351",
      // 채널 키 설정
      channelKey: "channel-key-af0ec137-19d7-472a-b2e3-196399058b04",
      paymentId: `payment${Math.random().toString(36).slice(2)}`,
      orderName: orderName,
      totalAmount: totalFees,
      currency: "CURRENCY_KRW",
      payMethod: "EASY_PAY",
    });
    console.log(response);

    if (response.code !== undefined) {
      // 오류 발생
      return toast.error(response.message);
    }

    selectedItems.forEach((item) =>
      purchaseItem.mutate({
        _id: item.product._id,
        quantity: item.quantity,
      })
    );
  }

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* 모달창 */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">결제 수단을 선택하세요.</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* 결제 수단 추가 */}
        <div className="flex gap-6 justify-center">
          <PGButton imgPath="kakaopay.jpg" onClick={requestKaKaoPayment}>
            카카오페이
          </PGButton>
          <PGButton imgPath="tosspay.jpg" onClick={requestTossPayment}>
            토스페이
          </PGButton>
        </div>
      </div>
    </div>,
    document.body
  );
}
