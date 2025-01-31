import PropTypes from "prop-types";
import { Fragment } from "react";
import { toast } from "react-toastify";

ConfirmToast.propTypes = {
  message: PropTypes.string.isRequired,
  resolve: PropTypes.func,
};

export default function ConfirmToast({ message, resolve }) {
  const newMessage = message.split("\n").map((line) => (
    <>
      {line}
      <br />
    </>
  ));

  return (
    <div>
      <p className="break-keep">{newMessage}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => {
            resolve(true);
            toast.dismiss();
          }}
          className="px-2 py-1 bg-btn-primary text-white rounded-md w-16 hover:bg-[#4E9456]"
        >
          예
        </button>
        <button
          onClick={() => {
            resolve(false);
            toast.dismiss();
          }}
          className="px-2 py-1 bg-gray3 text-white rounded-md hover:bg-gray5"
        >
          아니오
        </button>
      </div>
    </div>
  );
}
