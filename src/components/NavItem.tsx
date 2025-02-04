import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  defaultIcon: PropTypes.string.isRequired,
  activeIcon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default function NavItem({ to, defaultIcon, activeIcon, label }) {
  return (
    <NavLink to={to} className="flex flex-col items-center">
      {({ isActive }) => (
        <>
          <img
            src={isActive ? activeIcon : defaultIcon}
            className="w-10"
            alt={`${label}icon`}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
