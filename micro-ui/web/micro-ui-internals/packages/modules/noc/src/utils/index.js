import React from "react";

/* methid to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
    // Returning null in else case because new Date(null) returns initial date from calender
    if (dateEpoch) {
        const dateFromApi = new Date(dateEpoch);
        let month = dateFromApi.getMonth() + 1;
        let day = dateFromApi.getDate();
        let year = dateFromApi.getFullYear();
        month = (month > 9 ? "" : "0") + month;
        day = (day > 9 ? "" : "0") + day;
        return `${day}/${month}/${year}`;
    } else {
        return null;
    }
};

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

export const businessServiceList = (isCode= false) => {
    let isSearchScreen = window.location.href.includes("/search");
    const availableBusinessServices = [{
        code: isSearchScreen ? "MD_NOC" : "MD_NOC_SRV",
        active: true,
        roles: ["MD_NOC_APPROVER"],
        i18nKey: "WF_MD_NOC_MD_NOC_SRV",
    }, {
        code: isSearchScreen ? "DDCF_NOC" : "DDCF_NOC_SRV",
        active: true,
        roles: ["DDCF_NOC_APPROVER"],
        i18nKey: "WF_DDCF_NOC_DDCF_NOC_SRV"
    }, {
        code: isSearchScreen ? "DNPC_NOC" : "DNPC_NOC_SRV",
        active: true,
        roles: ["DNPC_NOC_APPROVER"],
        i18nKey: "WF_DNPC_NOC_DNPC_NOC_SRV"
    }, {
        code: isSearchScreen ? "INSPD_NOC" : "INSPD_NOC_SRV",
        active: true,
        roles: ["INSPD_NOC_APPROVER"],
        i18nKey: "WF_INSPD_NOC_INSPD_NOC_SRV"
    }, {
        code: isSearchScreen ? "EDD_NOC" : "EDD_NOC_SRV",
        active: true,
        roles: ["EDD_NOC_APPROVER"],
        i18nKey: "WF_EDD_NOC_EDD_NOC_SRV"
    }, {
        code: isSearchScreen ? "ONEAD_NOC" : "ONEAD_NOC_SRV",
        active: true,
        roles: ["ONEAD_NOC_APPROVER"],
        i18nKey: "WF_ONEAD_NOC_ONEAD_NOC_SRV"
    }, {
        code: isSearchScreen ? "DTELECOM_NOC" : "DTELECOM_NOC_SRV",
        active: true,
        roles: ["DTELECOM_NOC_APPROVER"],
        i18nKey: "WF_DTELECOM_NOC_DTELECOM_NOC_SRV"
    }

];

    const newAvailableBusinessServices = [];
    const loggedInUserRoles = Digit.UserService.getUser().info.roles;
    availableBusinessServices.map(({ roles }, index) => {
        roles.map((role) => {
            loggedInUserRoles.map((el) => {
                if (el.code === role) {
                    isCode ? newAvailableBusinessServices.push(availableBusinessServices?.[index]?.code) : newAvailableBusinessServices.push(availableBusinessServices?.[index])
                }
            })
        })
    });

    return newAvailableBusinessServices;
}