import PropTypes from "prop-types";
import clsx from "clsx";

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  isBig: PropTypes.bool,
  isWhite: PropTypes.bool,
};

export default function Button({
  children,
  type = "button",
  onClick: clickHandler,
  isBig = false,
  isWhite = false,
}) {
  const baseClasses =
    "flex items-center justify-center rounded-md shrink-0 self-start";
  const styleClasses = isWhite
    ? "border border-gray2 bg-white"
    : "text-white bg-btn-primary";
  const sizeClasses = isBig
    ? "w-full py-3 text-xl font-bold"
    : "py-1 px-3 text-sm font-semibold";

  const classes = clsx(baseClasses, styleClasses, sizeClasses);

  return (
    <button className={classes} type={type} onClick={clickHandler}>
      {children}
    </button>
  );
}
