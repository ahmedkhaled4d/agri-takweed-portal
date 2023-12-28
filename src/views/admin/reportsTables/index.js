import React, { useEffect, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import axiosApiInstance from 'services/axios.inercept';
import BackendFilter from './filter/BackendFilter';
import ReportsButtons from './ReportsButtons';

import ReportList from './ReportList';
import { Toaster } from 'react-hot-toast';
import useColumns from './useColumns';
import { fetchData } from 'services/api.service';

function ReportsTables() {
  // const [loading, setLoading] = useState(false);
  //   const [errorMsg, setErrorMsg] = useState('');
  const [crops, setCrops] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [fetchedData, setFetchedData] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [selectedReport, setSelectedReport] = useState({
    name: '',
    endpoint: '',
  });
  const [selectionHappened, setSelectionHappened] = useState(false);
  const { cols, execlFn } = useColumns(selectedReport.name);

  useEffect(() => {
    fetchData('/crop', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
      .then((response) => response.json())
      .then((data) => {
        setCrops(data.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData('/location', 'get', null, { sortBy: 'createdAt', sortValue: -1 })
      .then((response) => response.json())
      .then((data) => {
        // let govIds = [];
        // data.data.forEach((gov) => {
        //   govIds.push(gov._id);
        // });
        setGovernorates(data.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleButtonSelect(name, endpoint) {
    setSelectedReport({ name: name, endpoint: endpoint });
    setSelectionHappened(true);
    setFetchedData([]);
  }

  //   async function handleBackendFilter(filterValues) {
  //     try {
  //       const data = await axiosApiInstance.post(
  //         '/admin/report/visits',
  //         filterValues
  //       );
  //       setFetchedData(data.data);
  //     } catch (err) {
  //       setLoading(false);
  //       setErrorMsg('حدث خطأ ما');
  //       console.log(err);
  //     }
  //   }

  //   useEffect(() => {
  //     fetchReports(filterValues);
  //   }, [selectedReport]);

  // const columns = React.useMemo(
  //   () => [
  //     { Header: 'رقم الطلب', accessor: 'code' },
  //     { Header: 'اسم الجهة', accessor: 'farmName' },
  //     { Header: 'اسم المالك', accessor: 'farmOwner' },
  //     { Header: 'هاتف المالك', accessor: 'farmOwnerPhone' },
  //     { Header: 'مقدم الطلب', accessor: 'user' },
  //     { Header: 'هاتف مقدم الطلب', accessor: 'userPhone' },
  //     { Header: 'المحافظة', accessor: 'governorate' },
  //     { Header: 'المركز / القسم', accessor: 'center' },
  //     { Header: 'الوحدة المحلية', accessor: 'hamlet' },
  //     { Header: 'تاريخ الطلب', accessor: 'RequestDate' },
  //     { Header: 'تاريخ الفحص', accessor: 'gpxDate' },
  //     { Header: 'المساحة في الطلب', accessor: 'RequestedTotalArea' },
  //     { Header: 'المساحة الفعلية', accessor: 'ActualTotalArea' },
  //     { Header: 'عدد النقاط المساحية', accessor: 'NOPointsAfterSubtraction' },
  //     { Header: 'عدد القطع', accessor: 'NoOfLands' },
  //     { Header: 'الاحداثيات', accessor: 'coordinate' },
  //     { Header: '(latitude) دائرة العرض', accessor: 'lat' },
  //     { Header: '(longitude) خط الطول', accessor: 'lng' },
  //     { Header: 'الحالة', accessor: 'status' },
  //     { Header: 'تاريخ الانضمام', accessor: 'createdAt' },
  //   ],
  //   []
  // );
  // console.log('====================================');
  // console.log(cols, execlFn);
  // console.log('====================================');
  
  return (
    <div className="content">
      <Toaster />
      <ReportsButtons
        handleButtonSelect={handleButtonSelect}
        selectedReport={selectedReport}
      />
      <BackendFilter
        setFetchedData={setFetchedData}
        selectedReport={selectedReport}
        selectionHappened={selectionHappened}
        crops={crops}
        setFilterValues={setFilterValues}
        governorates={governorates}
      />
      <ReportList
        columns={cols}
        data={fetchedData}
        execlFn={execlFn}
        crops={crops}
        filterValues={filterValues}
      />
    </div>
  );
}

export default ReportsTables;
