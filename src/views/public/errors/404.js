import React from "react";

function Error404(props) {
  return (
    <section className="error ptb-100">
      <div className="container">
        <div className="error-content">
          <img src="/assets/images/error.png" alt="img" />
          <h4>مساعد الفلاحين في تكويد الاراضي الزراعيه في مصر</h4>
          <p>
            منظومة التكويد الجديدة وهى عملية تتبع للمزارع التى تريد تصدير
            إنتاجها عن طريق رفع إحداثيات هذه المزارع بأستخدام أجهزة تحديد
            المواقع والاقمار الصناعية .
          </p>
        </div>
      </div>
    </section>
  );
}

export default Error404;
