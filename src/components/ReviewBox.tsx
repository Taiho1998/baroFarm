import PropTypes from "prop-types";

ReviewBox.prototypes = {
  option: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};
export default function ReviewBox({ option, content }) {
  return (
    <section className="mt-5 p-5 border border-gray3 rounded-[10px] w-[320px] flex-shrink-0 ">
      <p className="font-medium text-xs text-gray4 mb-1 line-clamp-1">
        옵션: {option}
      </p>
      <p className="font-medium text-sm text-gray5 line-clamp-2">{content}</p>
    </section>
  );
}
