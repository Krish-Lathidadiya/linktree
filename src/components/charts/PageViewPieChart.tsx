"use client";

import React from "react";
import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { addDays, differenceInDays, format, parseISO, isValid } from "date-fns";

interface GroupedView {
  _id: string;
  count: number;
}

interface DataWithoutGaps {
  name: string;
  value: number;
}

interface PageViewPieChartProps {
  groupedViews: GroupedView[];
}

function PageViewPieChart({ groupedViews }: PageViewPieChartProps) {
  const dataWithoutGaps: DataWithoutGaps[] = [];

  groupedViews.forEach((value, index) => {
    const date = value._id;

    // Check if date is a valid ISO date string before using it
    if (isValid(parseISO(date))) {
      dataWithoutGaps.push({
        name: date,
        value: value.count,
      });

      const nextDate = groupedViews?.[index + 1]?._id;

      // Proceed only if nextDate is valid
      if (nextDate && isValid(parseISO(nextDate))) {
        const daysBetween = differenceInDays(parseISO(nextDate), parseISO(date));
        for (let i = 1; i < daysBetween; i++) {
          const dateBetween = format(addDays(parseISO(date), i), "yyyy-MM-dd");
          dataWithoutGaps.push({
            name: dateBetween,
            value: 0,
          });
        }
      }
    }
  });

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={dataWithoutGaps}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
          />
          <Tooltip
            formatter={(value: number) => `${value} clicks`}
            labelFormatter={(label: string) =>
              typeof label === "string" && isValid(parseISO(label)) 
                ? format(parseISO(label), "MMMM dd, yyyy") 
                : label
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PageViewPieChart;
