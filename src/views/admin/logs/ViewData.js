import React from 'react'

export default function ViewData({data}) {
    return (
      <>
        <pre>IP: {data?.ip}</pre>
        <pre>userAgent: {data?.userAgent}</pre>
        <pre>contentLength: {data?.contentLength}</pre>
        <pre>payload: {JSON.stringify(data.payload, undefined, 2)}</pre>
      </>
    );
}
