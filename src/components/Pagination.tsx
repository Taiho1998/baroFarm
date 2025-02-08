import PropTypes from "prop-types";

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default function Pagination({ page, handlePageChange, totalPages }) {
  return (
    <>
      <button
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        className="px-3 py-1 mx-1 text-sm bg-gray2 rounded-md disabled:opacity-50"
      >
        이전
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-3 py-1 mx-1 text-sm rounded-md ${
            page === index + 1 ? "bg-btn-primary text-white" : "bg-gray2"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        className="px-3 py-1 mx-1 text-sm bg-gray2 rounded-md disabled:opacity-50"
      >
        다음
      </button>
    </>
  );
}
