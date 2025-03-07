import React, { Fragment, useMemo } from "react";
import { Table, StatusTable, Row, CardSubHeader, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

const SubOccupancyTable = ({ edcrDetails, applicationData }) => {
  const { t } = useTranslation();
  const isMobile = window.Digit.Utils.browser.isMobile();

  const tableHeader = [
    {
      name: "BPA_TABLE_COL_FLOOR",
      id: "Floor",
    },
    {
      name: "BPA_TABLE_COL_LEVEL",
      id: "Level",
    },
    {
      name: "BPA_TABLE_COL_OCCUPANCY",
      id: "Occupancy",
    },
    {
      name: "BPA_TABLE_COL_BUILDUPAREA",
      id: "BuildupArea",
    },
    {
      name: "BPA_TABLE_COL_FLOORAREA",
      id: "FloorArea",
    },
    {
      name: "BPA_TABLE_COL_CARPETAREA",
      id: "CarpetArea",
    }
  ]

  const accessData = (plot) => {
    const name = plot;
    return (originalRow, rowIndex, columns) => {
      return originalRow[name];
    }
  }


  const tableColumns = useMemo(
    () => {
      return tableHeader.map((ob) => ({
        Header: t(`${ob.name}`),
        accessor: accessData(ob.id),
        id: ob.id
      }));
    });

  function getFloorData(block) {
    let floors = [];
    block?.floorInfos?.map((ob,i) => {
      floors.push({
        Floor: t(ob.floorName),
        Level: ob.level,
        Occupancy: t(`${ob.usage}`),
        BuildupArea: ob.buildupArea,
        FloorArea: ob.floorArea || 0,
        CarpetArea: ob.carpetArea || 0,
        key: t(ob.floorName),
      });
    });
    return floors;
  }

  const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
    if (searcher == "") return str;
    while (str.includes(searcher)) {
      str = str.replace(searcher, replaceWith);
    }
    return str;
  };

  function getSubOccupancyValues(index) {
    let values = applicationData?.landInfo?.unit;
    let returnValue = "";
    if (values?.length > 0) {
      let splitArray = values[index]?.usageCategory?.split(',');
      if (splitArray?.length) {
        const returnValueArray = splitArray.map(data => data ? `${t(`BPA_SUBOCCUPANCYTYPE_${stringReplaceAll(data?.toUpperCase(), "-", "_")}`)}` : "NA");
        returnValue = returnValueArray.join(', ')
      }
    }
    return returnValue ? returnValue : "NA";
  }
  
  return (
    <Fragment>
      <div style={{ background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth: "950px", minWidth: "280px" }}>
        <StatusTable>
          {edcrDetails?.values?.map((value, index) => {
            if (value?.isHeader) return <CardSubHeader style={{fontSize: "20px", paddingBottom: "10px"}}>{t(value?.title)}</CardSubHeader>
            else return <Row className="border-none" labelStyle={{width: "100%", fontSize: "20px"}} key={`${value.title}`} label={`${t(`${value.title}`)}`} text={value?.value ? value?.value : ""} />
          })}
        </StatusTable>

        {applicationData?.buildingInfos?.map((block, index) => (
          <div key={index} style={applicationData?.buildingInfos?.length > 0 ? {marginBottom: "30px", background: "#FAFAFA", border: "1px solid #D6D5D4", padding: "8px", borderRadius: "4px", maxWidth: "950px", minWidth: "280px"} : {marginBottom: "30px"}}>
            <StatusTable>
              <Row className="border-none" textStyle={{wordBreak:"break-word"}} label={`${t("BPA_SUB_OCCUPANCY_LABEL")}`} text={getSubOccupancyValues(index)}></Row>
            </StatusTable>
            <div style={window.location.href.includes("citizen") || isMobile?{overflow:"scroll"}:{ maxWidth: "950px", maxHeight: "100%" }}>
              <Table
                className="customTable table-fixed-first-column table-border-style"
                t={t}
                disableSort={false}
                autoSort={true}
                manualPagination={false}
                isPaginationRequired={false}
                initSortId="S N "
                data={getFloorData(block)}
                columns={tableColumns}
                getCellProps={(cellInfo) => { return { style: {} } }}
              />
            </div>
          </div>))}
      </div>
    </Fragment>
  )
}

export default SubOccupancyTable;