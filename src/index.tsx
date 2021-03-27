import React, { useState } from "react";

const months = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const ReactRangeDates: React.FC = () => {
  const today = new Date();

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());

  const daysInMonth = 32 - new Date(year, month, 32).getDate();
  const firstDay = new Date(year, month).getDay();

  return (
    <div>
      {months[month]} - {year}
      <button onClick={() => setMonth((val) => val - 1)}>{`<`}</button>
      <button onClick={() => setMonth((val) => val + 1)}>{`>`}</button>
      <table>
        <thead>
          <tr>
            <th>D</th>
            <th>S</th>
            <th>T</th>
            <th>Q</th>
            <th>Q</th>
            <th>S</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>
          {[...new Array(Math.ceil((daysInMonth + firstDay) / 7))].map(
            (_, columnIndex) => (
              <tr>
                {[...new Array(7)].map((_, dayIndex) => (
                  <td>
                    {(columnIndex === 0 && dayIndex < firstDay) ||
                    columnIndex * 7 + dayIndex - firstDay + 1 > daysInMonth
                      ? ""
                      : `${columnIndex * 7 + dayIndex - firstDay + 1}`}
                  </td>
                ))}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReactRangeDates;
