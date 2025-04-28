"use client";

import { SetStateAction, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

interface IChartsProps {
  companyTimeframe: string;
  setCompanyTimeframe: React.Dispatch<SetStateAction<string>>;
  companiesData: any;
  propertyTimeframe: string;
  setPropertyTimeframe: React.Dispatch<SetStateAction<string>>;
  propertiesData: any;
}

export const Charts = (data: IChartsProps) => {
  const {
    companyTimeframe,
    setCompanyTimeframe,
    companiesData,
    propertyTimeframe,
    setPropertyTimeframe,
    propertiesData,
  } = data;

  const t = useTranslations();

  // Select the appropriate data based on the selected timeframe
  const companyDataKey = companyTimeframe === "weekly" ? "day" : "month";
  const propertyDataKey = propertyTimeframe === "weekly" ? "day" : "month";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Company Data Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Company Data</CardTitle>
          <Select value={companyTimeframe} onValueChange={setCompanyTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companiesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={companyDataKey} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="CompanyCount"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-gray-500">
            {companyTimeframe === "monthly"
              ? "12 Month Summary"
              : "Weekly Summary"}
          </div>
        </CardContent>
      </Card>

      {/* Property Data Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Property Data</CardTitle>
          <Select
            value={propertyTimeframe}
            onValueChange={setPropertyTimeframe}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={propertiesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={propertyDataKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={"CompanyCount"}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-gray-500">
            {propertyTimeframe === "monthly"
              ? "12 Month Summary"
              : "Weekly Summary"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
