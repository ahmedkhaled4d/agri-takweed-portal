import React, { useEffect, useRef, useState } from "react";
import { Marker, useGoogleMap } from "@react-google-maps/api";
import SinglePolyline from "./SinglePolyline";
import { Card, Spinner, Table } from "reactstrap";
import MapUtils from "utils/mapUtils/mapUtils";
import axiosApiInstance from "services/axios.inercept";
import { toast, Toaster } from "react-hot-toast";
import MapControl from "./MapControl";

// const farmLocation = { lat: 30.464881, lng: 30.8255188 };
// const test = [
//   {
//     varieties: [
//       {
//         variety: "جريب_فروت",
//         amount: 2,
//         initialAmount: 50,
//         transactionDate: "2023-03-05",
//       },
//     ],
//     ownerName: "البركات",
//     ownerPhone: "0100701400",
//     code: "2248020007",
//     transactionType: "STORE_TO_DISTRIBUTER",
//     from: "63f723f1298484a3951353af",
//     to: "63f736bfbce6240088511500",
//     farmName: "البركات",
//     toHubType: "DISTRIBUTER",
//     toHubSubType: "overland export",
//     toHubName: "سوق العبور",
//     toHubCooredinate: { lat: 30.5603486, lng: 31.0181649 },
//     toHubCode: "1",
//     toHubGov: "61b23cdd61441c3eb914cf70",
//     toHubCenter: "61b23cdd61441c3eb914cfe3",
//     toHubHamlet: "61b23cdf61441c3eb914d929",
//     fromHubType: "STORE",
//     fromHubCooredinate: { lat: 30.55462, lng: 31.000674 },
//     fromHubSubType: "packaging house",
//     fromHubName: "تعديل تاني",
//     fromHubCode: "9707000107",
//     fromHubGov: "61b23cdd61441c3eb914cf70",
//     fromHubCenter: "61b23cdd61441c3eb914cfe3",
//     fromHubHamlet: "61b23cdf61441c3eb914d929",
//   },
//   {
//     varieties: [
//       {
//         variety: "بسرة_فركوتو",
//         amount: 5,
//         initialAmount: 30,
//         transactionDate: "2023-03-05",
//       },
//       {
//         variety: "جريب_فروت",
//         amount: 10,
//         initialAmount: 50,
//         transactionDate: "2023-03-05",
//       },
//     ],
//     ownerName: "البركات",
//     ownerPhone: "0100701400",
//     code: "2248020007",
//     transactionType: "CHARGE_TO_STORE",
//     from: "2248020007",
//     to: "63fb2e5187ee01a78c8bf77f",
//     farmName: "البركات",
//     toHubType: "STORE",
//     toHubSubType: "packaging house",
//     toHubName: "مركز تعبئه ١",
//     toHubCode: "222",
//     toHubCooredinate: { lat: 30.395708, lng: 30.5785979 },
//     toHubGov: "61b23cdd61441c3eb914cf75",
//     toHubCenter: "61b23cdd61441c3eb914cff2",
//     toHubHamlet: "61b23cde61441c3eb914d735",
//   },
//   {
//     varieties: [
//       {
//         variety: "جريب_فروت",
//         amount: 2,
//         initialAmount: 50,
//         transactionDate: "2023-03-05",
//       },
//     ],
//     ownerName: "البركات",
//     ownerPhone: "0100701400",
//     code: "2248020007",
//     transactionType: "STORE_TO_DISTRIBUTER",
//     from: "63fb2e5187ee01a78c8bf77f",
//     to: "63f736bfbce6240088511500",
//     farmName: "البركات",
//     toHubType: "DISTRIBUTER",
//     toHubSubType: "overland export",
//     toHubName: "سوق العبور",
//     toHubCode: "1",
//     toHubCooredinate: { lat: 30.5603486, lng: 31.0181649 },
//     toHubGov: "61b23cdd61441c3eb914cf70",
//     toHubCenter: "61b23cdd61441c3eb914cfe3",
//     toHubHamlet: "61b23cdf61441c3eb914d929",
//     fromHubType: "STORE",
//     fromHubCooredinate: { lat: 30.395708, lng: 30.5785979 },
//     fromHubSubType: "packaging house",
//     fromHubName: "مركز تعبئه ١",
//     fromHubCode: "222",
//     fromHubGov: "61b23cdd61441c3eb914cf75",
//     fromHubCenter: "61b23cdd61441c3eb914cff2",
//     fromHubHamlet: "61b23cde61441c3eb914d735",
//   },
//   {
//     varieties: [
//       {
//         variety: "بسرة_فركوتو",
//         amount: 15,
//         initialAmount: 30,
//         transactionDate: "2023-03-05",
//       },
//     ],
//     ownerName: "البركات",
//     ownerPhone: "0100701400",
//     code: "2248020007",
//     transactionType: "CHARGE_TO_STORE",
//     from: "2248020007",
//     to: "63f726f0298484a395135471",
//     farmName: "البركات",
//     toHubType: "STORE",
//     toHubCooredinate: { lat: 30.4271638, lng: 31.0347753 },
//     toHubSubType: "collecting center",
//     toHubName: "اخر مرة تعديل",
//     toHubCode: "012",
//     toHubGov: "61b23cdd61441c3eb914cf71",
//     toHubCenter: "61b23cdd61441c3eb914d001",
//     toHubHamlet: "61b23cde61441c3eb914d315",
//   },
//   {
//     varieties: [
//       {
//         variety: "جريب_فروت",
//         amount: 5,
//         initialAmount: 50,
//         transactionDate: "2023-03-05",
//       },
//     ],
//     ownerName: "البركات",
//     ownerPhone: "0100701400",
//     code: "2248020007",
//     transactionType: "CHARGE_TO_STORE",
//     from: "2248020007",
//     to: "63f723f1298484a3951353af",
//     farmName: "البركات",
//     toHubType: "STORE",
//     toHubSubType: "packaging house",
//     toHubName: "تعديل تاني",
//     toHubCode: "9707000107",
//     toHubCooredinate: { lat: 30.55462, lng: 31.000674 },
//     toHubGov: "61b23cdd61441c3eb914cf70",
//     toHubCenter: "61b23cdd61441c3eb914cfe3",
//     toHubHamlet: "61b23cdf61441c3eb914d929",
//   },
//   {
//     varieties: [
//       {
//         variety: "بسرة_فركوتو",
//         amount: 15,
//         initialAmount: 30,
//         transactionDate: "2023-03-05",
//       },
//     ],
//     ownerName: "البركات",
//     ownerPhone: "0100701400",
//     code: "2248020007",
//     transactionType: "STORE_TO_DISTRIBUTER",
//     from: "63f726f0298484a395135471",
//     to: "63f727cf298484a3951354ba",
//     farmName: "البركات",
//     toHubType: "DISTRIBUTER",
//     toHubSubType: "air export",
//     toHubName: "اخر مرة تعديل",
//     toHubCooredinate: { lat: 30.544499, lng: 31.1248373 },
//     toHubCode: "1234",
//     toHubGov: "61b23cdd61441c3eb914cf7c",
//     toHubCenter: "61b23cdd61441c3eb914d0b1",
//     toHubHamlet: "61b23ce061441c3eb914e586",
//     fromHubType: "STORE",
//     fromHubSubType: "collecting center",
//     fromHubName: "اخر مرة تعديل",
//     fromHubCode: "012",
//     fromHubCooredinate: { lat: 30.4271638, lng: 31.0347753 },
//     fromHubGov: "61b23cdd61441c3eb914cf71",
//     fromHubCenter: "61b23cdd61441c3eb914d001",
//     fromHubHamlet: "61b23cde61441c3eb914d315",
//   },
//   {
//     varieties: [
//       {
//         variety: "جريب_فروت",
//         amount: 3,
//         initialAmount: 50,
//         transactionDate: "2023-03-05",
//       },
//     ],
//     ownerName: "البركات",
//     ownerPhone: "0100701400",
//     code: "2248020007",
//     transactionType: "STORE_TO_DISTRIBUTER",
//     from: "63fb2e5187ee01a78c8bf77f",
//     to: "63f727cf298484a3951354ba",
//     farmName: "البركات",
//     toHubType: "DISTRIBUTER",
//     toHubCooredinate: { lat: 30.544499, lng: 31.1248373 },

//     toHubSubType: "air export",
//     toHubName: "اخر مرة تعديل",
//     toHubCode: "1234",
//     toHubGov: "61b23cdd61441c3eb914cf7c",
//     toHubCenter: "61b23cdd61441c3eb914d0b1",
//     toHubHamlet: "61b23ce061441c3eb914e586",
//     fromHubType: "STORE",
//     fromHubSubType: "packaging house",
//     fromHubName: "مركز تعبئه ١",
//     fromHubCode: "222",
//     fromHubCooredinate: { lat: 30.395708, lng: 30.5785979 },
//     fromHubGov: "61b23cdd61441c3eb914cf75",
//     fromHubCenter: "61b23cdd61441c3eb914cff2",
//     fromHubHamlet: "61b23cde61441c3eb914d735",
//   },
// ];
const { markersFitBounds } = new MapUtils();

export default function Polylines({ reqCode, farmLocation }) {
  const [data, setData] = useState([]);
  const [clickedPolyline, setClickedPolyline] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastClickedPolylineRef = useRef(null);
  const markerRef = useRef([]);
  const map = useGoogleMap();

  const handleMapClick = () => {
    setClickedPolyline(null);
    lastClickedPolylineRef.current?.setOptions({ strokeColor: "black" });
  };

  useEffect(() => {
    let eventHandler = map.addListener("click", handleMapClick);
    return () => {
      eventHandler.remove();
    };
  }, []);
  useEffect(() => {
    setLoading(true);
    axiosApiInstance
      .get(`/admin/traceability/${reqCode}/tracetree`)
      .then((res) => {
        setData(res.data.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
        toast.error("حدث خطأ ..");
      });
  }, []);

  const onMarkerLoad = (marker) => {
    markerRef.current.push(marker);
    if (map && data.length > 0) markersFitBounds(markerRef.current, map);
  };
  return (
    <>
      <Toaster />
      {loading && <Spinner animation="border" role="status"></Spinner>}
      <Marker
        onLoad={onMarkerLoad}
        position={farmLocation}
        icon={
          farmLocation
            ? `/assets/images/media/charges/FARM.png`
            : "https://storage.googleapis.com/takweed-eg.appspot.com/data/Google_Maps_pin.svg"
        }
      />
      {data?.map((ele, i) => {
        return (
          <Marker
            icon={
              ele.toHubType
                ? `/assets/images/media/charges/${ele.toHubType}.png`
                : "https://storage.googleapis.com/takweed-eg.appspot.com/data/Google_Maps_pin.svg"
            }
            onLoad={onMarkerLoad}
            key={i}
            position={ele.toHubCooredinate}
          >
            <SinglePolyline
              data={ele}
              setClickedPolyline={setClickedPolyline}
              clickedPolyline={clickedPolyline}
              farmLocation={farmLocation}
              lastClickedPolylineRef={lastClickedPolylineRef}
            />
          </Marker>
        );
      })}

      <MapControl position="RIGHT_CENTER">
        {clickedPolyline && (
          <Card>
            <Table className="mb-0">
              <tbody>
                <tr>
                  <td colSpan={2}>
                    <span>من</span>
                    <i className="fas fa-long-arrow-alt-left fa-lg mx-2"></i>
                    {clickedPolyline.fromHubName ? (
                      clickedPolyline.fromHubName
                    ) : (
                      <span>المزرعة</span>
                    )}
                  </td>
                  {/* <td className="border-0">
                  {clickedPolyline.fromHubName
                    ? clickedPolyline.fromHubName
                    : "المزرعة"}
                </td> */}
                  <td colSpan={2}>
                    <span>إلى</span>
                    <i className="fas fa-long-arrow-alt-left fa-lg mx-2"></i>
                    <span>{clickedPolyline.toHubName}</span>
                  </td>
                  {/* <td>{clickedPolyline.toHubName}</td> */}
                </tr>
                <tr>
                  <td style={{ backgroundColor: "lightgray" }}>م</td>
                  <td style={{ backgroundColor: "lightgray" }}>الصنف</td>
                  <td style={{ backgroundColor: "lightgray" }}>الكمية</td>
                  <td style={{ backgroundColor: "lightgray" }}>التاريخ</td>
                </tr>

                {clickedPolyline.varieties.map((variety, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{variety.variety.replace("_", " ")}</td>
                      <td>{variety.amount}</td>
                      <td>{variety.transactionDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        )}
      </MapControl>
    </>
  );
}
