"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IGetAdminChartReports } from "@/types/protected/admin";
import { useTranslations } from "next-intl";
import { SetStateAction } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IChartsProps {
  companyTimeframe: string;
  setCompanyTimeframe: React.Dispatch<SetStateAction<string>>;
  companiesData: IGetAdminChartReports[];
  propertyTimeframe: string;
  setPropertyTimeframe: React.Dispatch<SetStateAction<string>>;
  propertiesData: IGetAdminChartReports[];
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

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Company Data Chart */}
      <Card>
        <CardHeader className="flex gap-3 flex-col md:flex-row md:justify-between md:items-center">
          <CardTitle>{t("sidebar.companiesData")}</CardTitle>
          <Select value={companyTimeframe} onValueChange={setCompanyTimeframe}>
            <SelectTrigger className="md:w-32">
              <SelectValue placeholder={t("form.selectTimeframe.label")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">
                {t("form.selectTimeframe.options.weekly")}
              </SelectItem>
              <SelectItem value="monthly">
                {t("form.selectTimeframe.options.monthly")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={companiesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={"name"} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* <div className="mt-2 text-xs text-gray-500">
            {companyTimeframe === "monthly"
              ? "12 Month Summary"
              : "Weekly Summary"}
          </div> */}
        </CardContent>
      </Card>

      {/* Property Data Chart */}
      <Card>
        <CardHeader className="flex gap-3 flex-col md:flex-row md:justify-between md:items-center">
          <CardTitle>{t("sidebar.propertyData")}</CardTitle>
          <Select
            value={propertyTimeframe}
            onValueChange={setPropertyTimeframe}
          >
            <SelectTrigger className="md:w-32">
              <SelectValue placeholder={t("form.selectTimeframe.label")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">
                {t("form.selectTimeframe.options.weekly")}
              </SelectItem>
              <SelectItem value="monthly">
                {t("form.selectTimeframe.options.monthly")}
              </SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={propertiesData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={"name"} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={"count"}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          {/* <div className="mt-2 text-xs text-gray-500">
            {propertyTimeframe === "monthly"
              ? "12 Month Summary"
              : "Weekly Summary"}
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};
