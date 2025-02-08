import { Link } from "react-router-dom";
import PropTypes from "prop-types";

RecentKeywordItem.propTypes = {
  keyword: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default function RecentKeywordItem({ keyword, onRemove }) {
  return (
    <li className="rounded-full border border-btn-primary text-btn-primary flex items-center gap-1 px-2">
      <Link to={`/search/results?keyword=${keyword}`} className="hover:font-bold">
        {keyword}
      </Link>
      <button aria-label="검색어 삭제" onClick={() => onRemove(keyword)}>
        <img src="/icons/icon_x_green.svg" alt="삭제" />
      </button>
    </li>
  );
}
