import React, { useEffect, useState } from 'react';
import axiosApiInstance from 'services/axios.inercept';
import toast, { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { Card } from './Card';
import styles from '../requests.module.css';
import axios from 'services/axios.inercept';
import { Spinner } from 'reactstrap';

function validURL(str) {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}
const UploadedPics = () => {
  const location = useLocation();
  const code = location.state?.code;
  const [images, setImages] = useState([]);
  const [downloadImagesState, setDownloadImagesState] = useState(false);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axiosApiInstance
      .get(`/client/initial/doc/${code}`)
      .then((res) => {
        const imgsArr = [];
        res.data?.idSignedUrl &&
          imgsArr.push({
            cardTitle: 'صورة البطاقة',
            cardSrc: res.data?.idSignedUrl[0],
          });
        res.data?.aaSignedUrl &&
          imgsArr.push({
            cardTitle: 'صورة افادة الجمعية الزراعية',
            cardSrc: res.data?.aaSignedUrl[0],
          });
        res.data?.possessionSignedUrl &&
          imgsArr.push({
            cardTitle: 'صورة عقد حيازة',
            cardSrc: res.data?.possessionSignedUrl[0],
          });
        res.data?.ownerSignedUrl &&
          imgsArr.push({
            cardTitle: 'صورة  عقد تمليك او ايجار',
            cardSrc: res.data?.ownerSignedUrl[0],
          });
        res.data?.otherSignedUrl &&
          imgsArr.push({
            cardTitle: 'صور اخري',
            cardSrc: res.data?.otherSignedUrl[0],
          });
        setImages(imgsArr);
        res.data?.doc.pdfLink && setDownloadImagesState(true)
      })
      .catch((e) => {
        console.error(e);
        console.error(e.response?.data.message);
        toast.error(`حدث خطأ`);
      });
  }, []);
  const handelDownload = async () => {
    axios
      .get(`/admin/documents/sign/${code}`)
      .then((response) => {
        const url = response.data.url[0];
        if (validURL(url)) {
          window.location.href = url;
        }
      })
      .catch((error) => console.log(error));
  };

  const handelExport = async () => {
    setLoading(true)
    axios
      .get(`/admin/documents/generatepdf/${code}`)
      .then((response) => {
        window.location.reload()
        setLoading(false)
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Toaster />
      <div
        className="m-5 p-5"
      // style={{ minHeight: '80vh' }}
      >
        <div>
          <button
            className={downloadImagesState ? styles.request_btn : ''}
            style={{ margin: '0.2em' }}
            disabled={!downloadImagesState}
            onClick={() => handelDownload()}
          >
            تنزيل الصور
          </button>

          <button
            className={!downloadImagesState ? styles.request_btn : ''}
            style={{ margin: '0.2em' }}
            onClick={() => handelExport()}
            disabled={downloadImagesState}
          >
            {loading ?
              <Spinner size="sm">
                Loading...
              </Spinner>
              : 'اصدار الصور'}
          </button>
        </div>
        {images.map((item, i) => {
          return (
            <Card cardTitle={item.cardTitle} cardSrc={item.cardSrc} key={i} />
          );
        })}
      </div>
    </>
  );
};

export default UploadedPics;
