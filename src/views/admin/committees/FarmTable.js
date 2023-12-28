import React from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";

export default function FarmTable({ farmModal }) {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>اسم المزرعة</th>
          </tr>
        </thead>
        <tbody>
          {
            farmModal?.farms?.map((farm, index) => (
              <tr key={index}>
                <td>
                  <Link
                    to={{
                      pathname: farm.url,
                    }}
                    target="_blank"
                  >
                    {farm.farmName}
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}
