/*!

*/
/*eslint-disable*/
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "contexts/user";
import "./clientHeader.css";
// used for making the prop types of this component
function Header(props) {
  const [state, dispatch] = useContext(UserContext);

  const [accountPath, setAccountPath] = useState(() => {
    const saved = localStorage.getItem("_r");
    if (saved === "954VC58412cH1M") return "/client";
    if (saved === "324FC5612ce4E") return "/admin/dashboard";
    return "/login";
  });

  const location = useLocation();
  let headerClassName = "";
  location.pathname === "/"
    ? (headerClassName = "header-area header-1")
    : (headerClassName = "header-area header-2");
  return (
    <div className={headerClassName}>
      <div className="navbar-area">
        <div className="main-responsive-nav">
          <div className="container">
            <div className="mobile-nav">
              <ul className="menu-sidebar menu-small-device">
                <li>
                  <Link className="default-button" to={accountPath}>
                    {state.user} <i className="fas fa-arrow-left"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="main-nav">
          <div className="container">
            <nav className="navbar navbar-expand-md navbar-light">
              <div
                className="collapse navbar-collapse mean-menu"
                id="navbarSupportedContent"
              >
                <div className="menu-sidebar">
                  <Link className="default-button" to={accountPath}>
                    {state.user} <i className="fas fa-arrow-left"></i>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
