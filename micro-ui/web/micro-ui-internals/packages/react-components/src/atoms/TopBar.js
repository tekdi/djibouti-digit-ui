import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";
import { NotificationBell } from "./svgindex";
import { useLocation } from "react-router-dom";
import BackButton from "./BackButton";
import { useTranslation } from "react-i18next";

const TopBar = ({
  img,
  isMobile,
  logoUrl,
  onLogout,
  toggleSidebar,
  ulb,
  userDetails,
  notificationCount,
  notificationCountLoaded,
  cityOfCitizenShownBesideLogo,
  onNotificationIconClick,
  hideNotificationIconOnSomeUrlsWhenNotLoggedIn,
  changeLanguage,
}) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // const showHaburgerorBackButton = () => {
  //   if (pathname === "/digit-ui/citizen" || pathname === "/digit-ui/citizen/" || pathname === "/digit-ui/citizen/select-language") {
  //     return <Hamburger handleClick={toggleSidebar} />;
  //   } else {
  //     return <BackButton className="top-back-btn" />;
  //   }
  // };
  return (
    <div className="navbar" style={{padding: "16px 24px"}}>
      <div className="center-container back-wrapper" style={{alignItems: "center", marginLeft: "0", marginRight: "0"}}>
        <div className="hambuger-back-wrapper" style={{alignItems: "center"}}>
          {isMobile && <Hamburger handleClick={toggleSidebar} />}
          <a href={window.location.href.includes("citizen")?"/digit-ui/citizen":"/digit-ui/employee"}><img
            className="city"
            id="topbar-logo"
            src={img || "https://egov-bucket.s3.af-south-1.amazonaws.com/DATUH.jpeg"}
            alt="djibouti"
            style={{minWidth:"46px", height:"48px"}}
          />
          </a>
          <h2 style={{marginLeft: "8px", fontWeight: "700"}}>{`${t("MINISTRY_NAME")}`}</h2>
        </div>

        <div className="RightMostTopBarOptions">
          <h3 style={{borderLeft: "0", borderRight: "1px", borderStyle: "solid", paddingRight: "8px", marginRight: "8px"}}>{cityOfCitizenShownBesideLogo}</h3>
          {!hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? changeLanguage : null}
          {/* {!hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? (
            <div className="EventNotificationWrapper" onClick={onNotificationIconClick}>
              {notificationCountLoaded && notificationCount ? (
                <span>
                  <p>{notificationCount}</p>
                </span>
              ) : null}
              <NotificationBell />
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  img: PropTypes.string,
};

TopBar.defaultProps = {
  img: undefined,
};

export default TopBar;
