import React, { Fragment, useEffect, useState } from "react";
import { Card, CardHeader, CardLabel, CardText, CitizenInfoLabel, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

const DocsRequired = ({ onSelect, onSkip, config }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateCode = Digit.ULBService.getStateId();
  const history = useHistory();
  const { applicationType: applicationType, serviceType: serviceType } = useParams();
  const [docsList, setDocsList] = useState([]);
  const [uiFlow, setUiFlow] = useState([]);
  const { data, isLoading } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", "DocumentTypes");
  const { isLoading: commonDocsLoading, data: commonDocs } = Digit.Hooks.obps.useMDMS(stateCode, "common-masters", ["DocumentType"]);
  const { isMdmsLoading, data: mdmsData } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["RiskTypeComputation"]);
  const userInfo = Digit.UserService.getUser();
  const queryObject = { 0: { tenantId: stateCode }, 1: { id: userInfo?.info?.id } };
  const { data: LicenseData, isLoading:LicenseDataLoading } = Digit.Hooks.obps.useBPAREGSearch(tenantId, queryObject);
  const checkingUrl = window.location.href.includes("ocbpa");
  sessionStorage.removeItem("clickOnBPAApplyAfterEDCR");

  const { data:homePageUrlLinks , isLoading: homePageUrlLinksLoading } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["homePageUrlLinks"]);


  const goNext = () => {
    if(JSON.parse(sessionStorage.getItem("BPAintermediateValue")) !== null)
    {
    let formData = JSON.parse(sessionStorage.getItem("BPAintermediateValue"))
    sessionStorage.setItem("BPAintermediateValue",null);
    onSelect("",formData);
    }
    else
    onSelect("uiFlow", uiFlow);
  }

  function getUniqueDocTypesByServiceType(list) {
    if (!list) return
    const serviceTypeMap = new Map();

    list?.forEach(item => {
        const serviceType = item.ServiceType;

        if (!serviceTypeMap.has(serviceType)) {
            serviceTypeMap.set(serviceType, new Map()); // Store unique doc types using Map
        }

        const docTypeSet = serviceTypeMap.get(serviceType);

        item?.docTypes?.forEach(doc => {
            if (!docTypeSet.has(doc.code)) {
                docTypeSet.set(doc.code, doc); // Store only unique doc types
            }
        });
    });

    // Convert map to array of objects with unique docTypes for each serviceType
    return Array.from(serviceTypeMap.entries()).map(([serviceType, docTypeSet]) => ({
        serviceType,
        docTypes: Array.from(docTypeSet.values()), // Convert map values to array
    }));
}

  useEffect(() => {
    let architectName = "", isDone = true;
    for (let i = 0; i < LicenseData?.Licenses?.length; i++) {
      if (LicenseData?.Licenses?.[i]?.status === "APPROVED" && isDone) {
        isDone = false;
        architectName = LicenseData?.Licenses?.[i]?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split('.')[0] || "ARCHITECT";
        sessionStorage.setItem("BPA_ARCHITECT_NAME", JSON.stringify(architectName));
      }
    }
  }, [LicenseData])

  useEffect(() => {
    if (!homePageUrlLinksLoading) {
      const windowUrl = window.location.href.split('/');
      const serviceType = windowUrl[windowUrl.length - 2];
      const applicationType = windowUrl[windowUrl.length - 3];
      homePageUrlLinks?.BPA?.homePageUrlLinks?.map(linkData => {
        if(applicationType?.toUpperCase() === linkData?.applicationType && serviceType?.toUpperCase() === linkData?.serviceType) {
          setUiFlow({
            flow: linkData?.flow,
            applicationType: linkData?.applicationType,
            serviceType: linkData?.serviceType
          });
        }
      });
    }
  }, [!homePageUrlLinksLoading]);

  useEffect(() => {
    if (!isLoading) {

      setDocsList(getUniqueDocTypesByServiceType(data));
    }
  }, [!isLoading]);

  if (isLoading) {
    return (
      <Loader />
    )
  }

  return (
    <Fragment>
      <Card>
        <CardHeader>{checkingUrl ? t(`BPA_OOCUPANCY_CERTIFICATE_APP_LABEL`) : t(`OBPS_NEW_BUILDING_PERMIT`)}</CardHeader>
        {/* TODO: Change text styles */}
        {/* <CitizenInfoLabel style={{margin:"0px"}} textStyle={{color:"#0B0C0C"}} text={t(`OBPS_DOCS_REQUIRED_TIME`)} showInfo={false} /> */}
        <CardText style={{ color: "#0B0C0C", marginTop: "12px", fontSize: "16px", fontWeight: "400", lineHeight: "24px" }}>{t(`OBPS_NEW_BUILDING_PERMIT_DESCRIPTION`)}</CardText>
        {isLoading ?
          <Loader /> :
          <Fragment>
            
            {docsList && docsList.map((item, index) => {
              return <div>

                <div style={{ fontWeight: 700, marginBottom: "8px" }} key={index}>
                  <div style={{ display: "flex" }}>
                    <div style={{ minWidth: "20px" }}>{`${index + 1}.`}&nbsp;</div>
                    <div>{` ${t(`${item.serviceType.replace('.', '_')}`)}`}</div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ minWidth: "20px" }}></div>
                    <ol style={{ margin: "0px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {item.docTypes.map((doc, i) => {
                        return <li key={i} style={{ color: "#505A5F", fontSize: "16px", listStyleType: "none" }}>
                          {`${i + 1}. ${t(`${doc?.code}`)}`}
                        </li>
                      })}
                    </ol>
                  </div>
                </div>
              </div>
            })}

          </Fragment>
        }
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={goNext} />
      </Card>
      <CitizenInfoLabel info={t("CS_FILE_APPLICATION_INFO_LABEL")} text={t(`OBPS_DOCS_FILE_SIZE`)} className={"info-banner-wrap-citizen-override"}/>
    </Fragment>
  );
};

export default DocsRequired;