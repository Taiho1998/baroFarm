import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

NavItem.propTypes = {
  to: PropTypes.string.isRequired,
  defaultIcon: PropTypes.string.isRequired,
  activeIcon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  end: PropTypes.bool,
};

export default function NavItem({
  to,
  defaultIcon,
  activeIcon,
  label,
  end = false,
}: {
  to: string;
  defaultIcon: string;
  activeIcon: string;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink to={to} end={end} className="flex flex-col items-center">
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
