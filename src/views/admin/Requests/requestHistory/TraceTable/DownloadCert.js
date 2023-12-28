import React, { useState } from 'react';
import { Button } from 'reactstrap';
import axios from 'services/axios.inercept';

function DownloadCert({ row, column: { id }, reqCode }) {
  // We need to keep and update the state of the cell normally
  // console.log(row);
  // console.log('reqCode', reqCode);
  const [loading, setLoading] = useState(false);
  function downloadCert() {
    setLoading(true);
    // console.log('clicked');
    axios
      .get(
        `/admin/traceability/${reqCode}/history/${row.original.historyId}/cert`,
        { responseType: 'blob' }
      )
      .then((res) => {
        // console.log(res.data);
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${reqCode}-${+new Date()}.pdf`;
        link.click();
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
  }
  return (
    <>
      <Button
        onClick={downloadCert}
        color={loading ? '' : 'primary'}
        outline
        disabled={loading}
      >
        <i
          class="fas fa-download"
          // style={{ cursor: 'pointer' }}
        ></i>
      </Button>
    </>
  );
}

export default DownloadCert;
