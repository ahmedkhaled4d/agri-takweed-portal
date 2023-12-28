export function downloadExecl(workbook, filename) {
  workbook.xlsx.writeBuffer().then((buf) => {
    //  saveAs(new Blob([buf]), `testFile.xlsx`);
    //  console.log(buf);
    const blob = new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;",
    });
    const URL = window.URL || window.webkitURL;
    const downloadUrl = URL.createObjectURL(blob);
    //  let URL =
    //    'data:application/vnd.ms-excel' + encodeURIComponent(new Blob([buf]));
    //  URL.createObjectURL(blob);
    const fileName = filename;
    // Create download link element
    const downloadLink = document.createElement("a");

    // feature detection
    downloadLink.href = downloadUrl;
    downloadLink.setAttribute("download", fileName);
    downloadLink.click();
  });
}
