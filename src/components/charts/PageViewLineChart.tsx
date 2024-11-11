"use client";

import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDays, differenceInDays, format, parseISO, isValid } from "date-fns";

interface GroupedView {
  _id: string | Date;
  count: number;
}

interface DataWithoutGaps {
  name: string;
  clicks: number;
}

interface PageViewLineChartProps {
  groupedViews: GroupedView[];
}

function PageViewLineChart({ groupedViews }: PageViewLineChartProps) {
  const dataWithoutGaps: DataWithoutGaps[] = [];
  groupedViews.forEach((value, index) => {
    const date =
      typeof value._id === "string"
        ? value._id
        : value._id.toISOString().split("T")[0];

    dataWithoutGaps.push({
      name: date,
      clicks: value.count,
    });

    const nextDate = groupedViews?.[index + 1]?._id;
    if (date && nextDate) {
      const nextDateString =
        typeof nextDate === "string"
          ? nextDate
          : nextDate.toISOString().split("T")[0];
      const daysBetween = differenceInDays(
        parseISO(nextDateString),
        parseISO(date)
      );
      if (daysBetween > 0) {
        for (let i = 1; i < daysBetween; i++) {
          const dateBetween = format(addDays(parseISO(date), i), "yyyy-MM-dd");
          dataWithoutGaps.push({
            name: dateBetween,
            clicks: 0,
          });
        }
      }
    }
  });

  console.log("dataWithoutGaps", dataWithoutGaps);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <LineChart
          data={dataWithoutGaps}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis
            dataKey="name"
            tickFormatter={(tick) =>
              isValid(parseISO(tick))
                ? format(parseISO(tick), "MMM dd, yyyy")
                : tick
            }
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [value, "clicks"]}
            labelFormatter={(label: string) =>
              isValid(parseISO(label))
                ? format(parseISO(label), "MMMM dd, yyyy")
                : label
            }
          />
          <Legend />
          <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PageViewLineChart;
