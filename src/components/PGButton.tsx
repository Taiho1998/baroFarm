import PropTypes from "prop-types";

PGButton.propTypes = {
  imgPath: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default function PGButton({ imgPath, children, onClick }) {
  return (
    <button className="flex flex-col items-center gap-2" onClick={onClick}>
      <img
        src={`/images/PG-logos/${imgPath}`}
        alt={`${children}로 결제하기`}
        className="size-20 rounded-lg"
      />
      <span className="font-semibold">{children}</span>
    </button>
  );
}
