import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosApiInstance from 'services/axios.inercept';
import HubDataList from './HubDataList';
import HubsButtons from './HubsButtons';
// import useColumns from './useColumns';
import { Spinner } from 'reactstrap';

const originalData = [
  {
    hubId: 'string',
    hubCode: 'number',
    hubName: 'string',
    holder: [
      {
        crop: 'string',
        variety: 'string',
        amount: 'number',
      },
    ],
  },
  {
    hubId: 'hkj',
    hubCode: 'numbfdgdher',
    hubName: 'kjh',
    holder: [
      {
        crop: '345yg',
        variety: 'rter',
        amount: '567',
      },
    ],
  },
];

function Step3({ reqCode }) {
  const [selectedHub, setSelectedHub] = useState({
    name: '',
    storeId: '',
  });

  const [originalData, setOriginalData] = useState([]);

  const [hubDataToShow, setHubDataToShow] = useState([]);
  const [loading, setLoading] = useState(true);

  function handleButtonSelect(name, storeId) {
    setSelectedHub({ name: name, storeId: storeId });
    //     setSelectionHappened(true);
    // setHubDataToShow([]);
  }

  function getData() {
    if (reqCode) {
      axiosApiInstance
        .get(`/admin/traceability/${reqCode}/store`)
        .then((response) => {
          console.log('original data',response);
          setLoading(false);
          setOriginalData(() => {
            return response.data.data?.map((el) => {
              return {
                ...el,
                amountToAdd: '0',
              };
            });
          });
        })
        .catch((e) => {
          toast.error('حدث خطأ');
          setLoading(false);
          console.error(e);
        });
    }
  }

  useEffect(() => {
    console.log(reqCode);
    getData();
  }, []);

  // function updateHubDataToShow() {
  //   console.log('updateHubDataToShow');
  //   if (selectedHub.name) {
  //     setHubDataToShow(() => {
  //       return originalData.find((el) => {
  //         return el.hubName === selectedHub.name;
  //       });
  //     });
  //   }
  // }

  useEffect(() => {
    if (selectedHub.name) {
      setHubDataToShow(() => {
        return originalData.find((el) => {
          return el.hubName === selectedHub.name;
        });
      });
    }
  }, [selectedHub.name, originalData]);
  // const { cols } = useColumns();

  return (
    <>
      {loading === true && <Spinner animation="border" role="status"></Spinner>}
      <HubsButtons
        BtnsData={originalData}
        handleButtonSelect={handleButtonSelect}
        selectedHub={selectedHub}
      />

      <HubDataList
        // columns={cols}
        hubDataToShow={hubDataToShow}
        reqCode={reqCode}
        selectedHub={selectedHub}
        getData={getData}
        // updateHubDataToShow={updateHubDataToShow}
        // execlFn={execlFn}
        // crops={crops}
        // filterValues={filterValues}
      />
    </>
  );
}
export default Step3;
