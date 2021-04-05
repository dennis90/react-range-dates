import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useState } from "react";

dayjs.extend(isBetween);

const defaultMonthsNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const defaultWeekNames = [
  "Sun.",
  "Mon.",
  "Tue.",
  "Wed.",
  "Thu.",
  "Fry.",
  "Sat.",
];

export enum AvailablePanel {
  Calendar = 1,
  CustomizedRanges,
  SelectMonth,
  SelectYear,
}

export interface DateStructure {
  day: number;
  month: number;
  year: number;
}

interface SelectYear {
  kind: "middle" | "future" | "past";
  range: number;
}

export interface CustomizedRanges {
  label: React.ReactText;
  startDate: DateStructure;
  endDate: DateStructure;
}

export type onDatesSelected = (startDate: Date, endDate: Date) => void;

export interface ReactRangeDatesProps {
  baseClassname?: string;
  controlNext: React.ReactChild;
  controlPrev: React.ReactChild;
  customizedRanges?: CustomizedRanges[];
  customizedRangesLabel?: string;
  monthNames?: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string
  ];
  onDatesSelected?: onDatesSelected;
  open: boolean;
  selectYears?: SelectYear;
  weekDayNames?: [string, string, string, string, string, string, string];
}

const ReactRangeDates: React.FC<ReactRangeDatesProps> = ({
  baseClassname = "reactRangeDates",
  weekDayNames = defaultWeekNames,
  monthNames = defaultMonthsNames,
  ...props
}) => {
  const today = new Date();

  const selectYears: SelectYear = props.selectYears
    ? props.selectYears
    : { kind: "middle", range: 10 };

  const [year, setYear] = useState<number>(today.getFullYear());
  const [month, setMonth] = useState<number>(today.getMonth());
  const [panel, setPanel] = useState<AvailablePanel>(AvailablePanel.Calendar);
  const [startDate, setStartDate] = useState<DateStructure | null>(null);
  const [endDate, setEndDate] = useState<DateStructure | null>(null);
  const [hoveredDate, setHoveredDate] = useState<DateStructure | null>(null);

  const daysInMonth = 32 - new Date(year, month, 32).getDate();
  const firstDay = new Date(year, month).getDay();

  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
      return;
    }
    setMonth(month + 1);
  };

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
      return;
    }
    setMonth(month - 1);
  };

  const displaySelectYearPanelClickHandler = (): void => {
    setPanel(AvailablePanel.SelectYear);
  };

  const displaySelectMonthPanelClickHandler = (): void => {
    setPanel(AvailablePanel.SelectMonth);
  };

  const openSelectCustomizedDateClickHandler = (): void => {
    setPanel(AvailablePanel.CustomizedRanges);
  };

  const selectYearClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const nextYear = Number.parseInt(
      (event.target as HTMLButtonElement).dataset.yearValue,
      10
    );
    setYear(nextYear);
    setPanel(AvailablePanel.Calendar);
  };

  const selectMonthClickHandler = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    const nextMonth = Number.parseInt(
      (event.target as HTMLButtonElement).dataset.monthValue,
      10
    );
    setMonth(nextMonth);
    setPanel(AvailablePanel.Calendar);
  };

  const calendarDayClickHandler = (
    event: React.MouseEvent<HTMLTableDataCellElement>
  ): void => {
    const dateValue = {
      day: Number.parseInt(
        (event.currentTarget as HTMLTableDataCellElement).dataset.dayValue,
        10
      ),
      month: month,
      year: year,
    };

    if (startDate !== null && endDate === null) {
      setEndDate(dateValue);
      if (props.onDatesSelected) {
        const firstDate = dayjs(
          `${startDate.year}-${startDate.month + 1}-${startDate.day}`
        );

        const secondDate = dayjs(
          `${dateValue.year}-${dateValue.month + 1}-${dateValue.day}`
        );
        if (firstDate.isAfter(secondDate)) {
          props.onDatesSelected(secondDate.toDate(), firstDate.toDate());
        } else {
          props.onDatesSelected(firstDate.toDate(), secondDate.toDate());
        }
      }
      return;
    }

    setStartDate(dateValue);
    setEndDate(null);
  };

  const mouseEnterCellHandler = (
    event: React.MouseEvent<HTMLTableDataCellElement>
  ): void => {
    const dateValue = {
      day: Number.parseInt(
        (event.currentTarget as HTMLTableDataCellElement).dataset.dayValue,
        10
      ),
      month: month,
      year: year,
    };
    setHoveredDate(dateValue);
  };

  const dateBoundaryType = (dayNumber): "Lower" | "Higher" => {
    const currentDate = dayjs(`${year}-${month + 1}-${dayNumber}`);
    const startDateValue: dayjs.Dayjs | false =
      startDate &&
      dayjs(`${startDate.year}-${startDate.month + 1}-${startDate.day}`);

    if (
      startDateValue &&
      !currentDate.isSame(startDateValue) &&
      currentDate.isAfter(startDateValue)
    ) {
      return "Higher";
    }
    return "Lower";
  };

  const isDateSelected = (dayNumber: number): boolean => {
    if (startDate === null && endDate === null) {
      return false;
    }

    return (
      (startDate &&
        startDate.day === dayNumber &&
        startDate.month === month &&
        startDate.year === year) ||
      (endDate &&
        endDate.day === dayNumber &&
        endDate.month === month &&
        endDate.year === year)
    );
  };

  const dateIsBetween = (
    first: DateStructure,
    second: DateStructure,
    current: DateStructure
  ): boolean => {
    const firstDate = dayjs(`${first.year}-${first.month + 1}-${first.day}`);
    const secondDate = dayjs(
      `${second.year}-${second.month + 1}-${second.day}`
    );
    const currentDate = dayjs(
      `${current.year}-${current.month + 1}-${current.day}`
    );
    if (firstDate.isBefore(secondDate)) {
      return currentDate.isBetween(firstDate, secondDate);
    }
    return currentDate.isBetween(secondDate, firstDate);
  };

  const isDateOnRange = (dayNumber: number): boolean => {
    if (startDate === null && endDate === null) {
      return false;
    }

    if (endDate === null) {
      if (hoveredDate === null) {
        return false;
      }
      return dateIsBetween(startDate, hoveredDate, {
        day: dayNumber,
        month,
        year,
      });
    }

    return dateIsBetween(startDate, endDate, { day: dayNumber, month, year });
  };

  let content: React.ReactNode;

  if (panel === AvailablePanel.SelectYear) {
    const startYear: number =
      selectYears.kind === "middle"
        ? today.getFullYear() - selectYears.range / Math.round(2)
        : selectYears.kind === "future"
        ? today.getFullYear()
        : today.getFullYear() - selectYears.range;

    content = (
      <div className={`${baseClassname}__selectYearPanel`}>
        {[...new Array(selectYears.range)].map((_, yearIndex) => (
          <button
            onClick={selectYearClickHandler}
            data-year-value={startYear + yearIndex}
            key={yearIndex}
          >
            {startYear + yearIndex}
          </button>
        ))}
      </div>
    );
  } else if (panel === AvailablePanel.SelectMonth) {
    content = (
      <div className={`${baseClassname}__selectMonthPanel`}>
        {monthNames.map((label, monthIndex) => (
          <button
            key={monthIndex}
            data-month-value={monthIndex}
            onClick={selectMonthClickHandler}
          >
            {label}
          </button>
        ))}
      </div>
    );
  } else if (panel === AvailablePanel.CustomizedRanges) {
    content = (
      <div className={`${baseClassname}__selectCustomizedPanel`}>
        {(props.customizedRanges || []).map((period, index) => (
          <button data-period-index={index}>{period}</button>
        ))}
      </div>
    );
  } else {
    content = (
      <div className={`${baseClassname}__calendarRootPanel`}>
        <div
          onClick={displaySelectMonthPanelClickHandler}
          className={`${baseClassname}__calendarMonthHeader`}
        >
          {monthNames[month]}
        </div>
        <div
          onClick={displaySelectYearPanelClickHandler}
          className={`${baseClassname}__calendarMonthYear`}
        >
          {year}
        </div>
        <div className={`${baseClassname}__calendarMonthControls`}>
          <button onClick={prevMonth}>{props.controlPrev}</button>
          <button onClick={nextMonth}>{props.controlNext}</button>
        </div>
        <table>
          <thead>
            <tr className={`${baseClassname}__weekDayRow`}>
              {weekDayNames.map((weekDay, index) => (
                <th key={index}>{weekDay}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...new Array(Math.ceil((daysInMonth + firstDay) / 7))].map(
              (_, columnIndex) => (
                <tr
                  key={columnIndex}
                  className={`${baseClassname}__monthDayRow`}
                >
                  {[...new Array(7)].map((_, dayIndex) => {
                    const dayNumber = columnIndex * 7 + dayIndex - firstDay + 1;
                    const disabledDay =
                      (columnIndex === 0 && dayIndex < firstDay) ||
                      dayNumber > daysInMonth;

                    return (
                      <td
                        key={dayIndex}
                        data-day-value={dayNumber}
                        onClick={
                          !disabledDay ? calendarDayClickHandler : undefined
                        }
                        onMouseEnter={
                          !disabledDay ? mouseEnterCellHandler : undefined
                        }
                        data-disabled={disabledDay}
                        className={[
                          `${baseClassname}__dayCell`,
                          [0, 6].includes(dayIndex)
                            ? `${baseClassname}__weekendCell`
                            : `${baseClassname}__workdayCell`,
                          isDateSelected(dayNumber)
                            ? [
                                `${baseClassname}__cellBoundary`,
                                `${baseClassname}__cellBoundary${dateBoundaryType(
                                  dayNumber
                                )}`,
                              ].join(" ")
                            : isDateOnRange(dayNumber)
                            ? `${baseClassname}__cellRange`
                            : "",
                        ].join(" ")}
                      >
                        {disabledDay ? "" : <span>{dayNumber}</span>}
                      </td>
                    );
                  })}
                </tr>
              )
            )}
          </tbody>
        </table>

        {props.customizedRanges && props.customizedRanges.length > 0 && (
          <div className={`${baseClassname}__customizedButton`}>
            <button onClick={openSelectCustomizedDateClickHandler}>
              {props.customizedRangesLabel || "Customized"}
            </button>
          </div>
        )}
      </div>
    );
  }

  return props.open ? <div>{content}</div> : null;
};

export default ReactRangeDates;
