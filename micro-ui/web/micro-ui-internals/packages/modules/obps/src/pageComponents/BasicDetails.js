import React, { 
  useEffect,
   useState
} from "react";
import { 
  // fromUnixTime,
  format
} from "date-fns";
import {
  Card,
  CardHeader,
  // Label,
  // SearchIconSvg,
  Toast,
  // StatusTable,
  TextInput,
  // Row,
  CardCaption,
  SubmitBar,
  Dropdown,
  CardLabel,
  // Loader,
} from "@egovernments/digit-ui-react-components";
import Timeline from "../components/Timeline";
import { useTranslation } from "react-i18next";
// import { scrutinyDetailsData } from "../utils";

const BasicDetails = ({ formData, onSelect, config }) => {
  const [showToast, setShowToast] = useState(null);
  // const [basicData, setBasicData] = useState(formData?.data?.edcrDetails || null);
  const [basicData, setBasicData] = useState({applicationDate:format(new Date(), "yyyy-MM-dd")});
  // const [scrutinyNumber, setScrutinyNumber] = useState(formData?.data?.scrutinyNumber);
  // const [isDisabled, setIsDisabled] = useState(formData?.data?.scrutinyNumber ? true : false);
  const { t } = useTranslation();
  const stateCode = Digit.ULBService.getStateId();
  // const isMobile = window.Digit.Utils.browser.isMobile();
  const {  data: mdmsData } = Digit.Hooks.obps.useMDMS(stateCode, "BPA", ["ApplicationType","ServiceType","OccupancyType","RiskTypeComputation"]);
  // const riskType = Digit.Utils.obps.calculateRiskType(
  //   mdmsData?.BPA?.RiskTypeComputation,
  //   basicData?.planDetail?.plot?.area,
  //   basicData?.planDetail?.blocks
  // );

  const [errors,setErrors] = useState();

  const handleChange = (e) => {
    const { name, value } = e || {};
    const basicDataUpdated = ({ ...basicData, [name]: value })
    setBasicData(basicDataUpdated);

    const requiredFileds = ["applicantName","applicationType","serviceType","occupancyType","riskType"];
    const filteredBasicData = Object.keys(basicDataUpdated).filter((key) => requiredFileds.includes(key) && basicDataUpdated[key] !== "" && basicDataUpdated[key] !== undefined && basicDataUpdated[key] !== null).reduce((obj, key) => {
      obj[key] = basicDataUpdated[key];
      return obj;
    }, {});
    if (Object.keys(filteredBasicData).length < requiredFileds.length) {
      setErrors(Object.keys(filteredBasicData));
    } else {
      setErrors([]);
    }
  };
  // const handleKeyPress = async (event) => {
  //   if (event.key === "Enter") {
  //     if (!scrutinyNumber?.edcrNumber) return;
  //     const details = await scrutinyDetailsData(scrutinyNumber?.edcrNumber, stateCode);
  //     if (details?.type == "ERROR") {
  //       setShowToast({ message: details?.message });
  //       setBasicData(null);
  //     }
  //     if (details?.edcrNumber) {
  //       setBasicData(details);
  //       setShowToast(null);
  //     }
  //   }
  // };

  const closeToast = () => {
    setShowToast(null);
  };

  // const handleSearch = async (event) => {
  //   const details = await scrutinyDetailsData(scrutinyNumber?.edcrNumber, stateCode);
  //   if (details?.type == "ERROR") {
  //     setShowToast({ message: details?.message });
  //     setBasicData(null);
  //   }
  //   if (details?.edcrNumber) {
  //     setBasicData(details);
  //     setShowToast(null);
  //   }
  // };

  const handleSubmit = (event) => {
    
      onSelect(config?.key, {
        // scrutinyNumber,
        ...basicData,
        // applicantName: basicData?.planDetail?.planInformation?.applicantName,
        // occupancyType: basicData?.planDetail?.planInformation?.occupancy,
        // applicationType: basicData?.appliactionType,
        // serviceType: basicData?.applicationSubType,
        // applicationDate: basicData?.applicationDate,
        // riskType: Digit.Utils.obps.calculateRiskType(
        //   mdmsData?.BPA?.RiskTypeComputation,
        //   basicData?.planDetail?.plot?.area,
        //   basicData?.planDetail?.blocks
        // ),
        edcrDetails: basicData,
      });
  };

  let disableVlaue = sessionStorage.getItem("isEDCRDisable");
  disableVlaue = JSON.parse(disableVlaue);

  // const getDetails = async () => {
  //   const details = await scrutinyDetailsData(scrutinyNumber?.edcrNumber, stateCode);
  //   if (details?.type == "ERROR") {
  //     setShowToast({ message: details?.message });
  //     setBasicData(null);
  //   }
  //   if (details?.edcrNumber) {
  //     setBasicData(details);
  //     setShowToast(null);
  //   }
  // };

  // if (disableVlaue) {
  //   let edcrApi = sessionStorage.getItem("isEDCRAPIType");
  //   edcrApi = edcrApi ? JSON.parse(edcrApi) : false;
  //   if (!edcrApi || !basicData) {
  //     sessionStorage.setItem("isEDCRAPIType", JSON.stringify(true));
  //     getDetails();
  //   }
  // }

  useEffect(()=>{
    setBasicData(formData?.data)
  },[formData?.data])

  return (
    <div>
      {showToast && <Toast error={true} label={t(`${showToast?.message}`)} onClose={closeToast} isDleteBtn={true} />}
      <Timeline />
      {/* <div className={isMobile ? "obps-search" : ""} style={!isMobile ? { margin: "8px" } : {}}>
        <Label>{t(`OBPS_SEARCH_EDCR_NUMBER`)}</Label>
        <TextInput
          className="searchInput"
          onKeyPress={handleKeyPress}
          onChange={event => setScrutinyNumber({ edcrNumber: event.target.value })} 
          value={scrutinyNumber?.edcrNumber} 
          signature={true} 
          signatureImg={!disableVlaue && <SearchIconSvg className="signature-img" onClick={!disableVlaue && scrutinyNumber?.edcrNumber ? () => handleSearch() : null} />}
          disable={disableVlaue}
          style={{ marginBottom: "10px" }}
        />
      </div> */}

      <Card>
        <CardCaption>{t(`BPA_SCRUTINY_DETAILS`)}</CardCaption>
        <CardHeader>{t(`BPA_BASIC_DETAILS_TITLE`)}</CardHeader>
        <div>
          <CardLabel>{t("BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL")}*</CardLabel>
          <TextInput name="applicantName" signature={true} disable={disableVlaue} style={{ marginBottom: "10px" }} onChange={e => handleChange(e?.target || {})} value={basicData?.applicantName} />
        </div>
        <div>
          <CardLabel>{t("BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL")}*</CardLabel>
          <Dropdown
            defaultValue={basicData?.applicationType}
            select={(e) => handleChange({ name: "applicationType", value: e.code })}
            selected={mdmsData?.BPA?.ApplicationType.find(item => item.code == basicData?.applicationType)}
            option={mdmsData?.BPA?.ApplicationType.filter(item => item.active) || []}
            optionKey="code"
            type="dropdown"
            t={t}
          />
        </div>
        <div>
          <CardLabel>{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}*</CardLabel>
          <Dropdown
            defaultValue={basicData?.serviceType}
            select={(e) => handleChange({ name: "serviceType", value: e.code })}
            option={mdmsData?.BPA?.ServiceType || []} optionKey="code" type="dropdown" t={t}
            selected={mdmsData?.BPA?.ServiceType.find(item => item.code == basicData?.serviceType)}
          />
        </div>

        <div>
          <CardLabel>{t("BPA_BASIC_DETAILS_OCCUPANCY_LABEL")}*</CardLabel>
          <Dropdown
            defaultValue={basicData?.occupancyType}
            select={(e) => handleChange({ name: "occupancyType", value: e.name })}
            option={mdmsData?.BPA?.OccupancyType || []}
            optionKey="name"
            type="dropdown"
            t={t}
            selected={mdmsData?.BPA?.OccupancyType.find(item => item.name == basicData?.occupancyType)}
          />
        </div>

        <div>
          <CardLabel>{t("BPA_BASIC_DETAILS_RISK_TYPE_LABEL")}*</CardLabel>
          <Dropdown
            defaultValue={basicData?.riskType}
            select={(e) => handleChange({ name: "riskType", value: e.riskType })}
            option={mdmsData?.BPA?.RiskTypeComputation || []}
            optionKey="riskType"
            type="dropdown"
            t={t}
            selected={mdmsData?.BPA?.RiskTypeComputation.find(item => item.riskType == basicData?.riskType)}
          />
        </div>
        <div>
          <CardLabel>{t("BPA_BASIC_DETAILS_APP_DATE_LABEL")}*</CardLabel>
          <TextInput
            defaultValue={basicData?.applicationDate}
            {...{
              label: "ExampleDate",
              placeholder: "dd/mm/yyyy",
              type: "date",
              disable: false,
              nonEditable: true,
              infoMessage: "Sample info message",
              description: "Help Text",
              charCount: true,
              withoutLabel: false,
              populators: {
                name: "defaultDate",
                error: "Error Message",
                editableDate: true,
              },
            }}
          />
        </div>
        <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={handleSubmit}
          disabled={!basicData?.applicantName ||
            !basicData?.applicationType ||
            !basicData?.serviceType ||
            !basicData?.occupancyType ||
            !basicData?.riskType || Boolean(errors?.length > 0)} />
        {/*<StatusTable>
             <Row
              className="border-none"
              label={t(`BPA_BASIC_DETAILS_APP_DATE_LABEL`)}
              text={basicData?.applicationDate ? format(new Date(basicData?.applicationDate), "dd/MM/yyyy") : basicData?.applicationDate}
            /> <Row className="border-none" label={t(`BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL`)} text={t(`WF_BPA_${basicData?.appliactionType}`)} />
            <Row className="border-none" label={t(`BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL`)} text={t(basicData?.applicationSubType)} />
            <Row className="border-none" label={t(`BPA_BASIC_DETAILS_OCCUPANCY_LABEL`)} text={basicData?.planDetail?.planInformation?.occupancy} />
            <Row className="border-none" label={t(`BPA_BASIC_DETAILS_RISK_TYPE_LABEL`)} text={t(`WF_BPA_${riskType}`)} />
            <Row
              className="border-none"
              label={t(`BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL`)}
              text={basicData?.planDetail?.planInformation?.applicantName}
            /> 
          </StatusTable>
          {riskType ? <SubmitBar label={t(`CS_COMMON_NEXT`)} onSubmit={handleSubmit} 
          disabled={!scrutinyNumber?.edcrNumber?.length}
           /> : <Loader />} */}
        </Card>
    </div>
  );
};

export default BasicDetails;
