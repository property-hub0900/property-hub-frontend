import { Card } from "@/components/ui/card";
import { IGetAdminStatsReport } from "@/types/protected/admin";
import { BriefcaseBusiness, Database, Package, Users2 } from "lucide-react";

export const Stats = ({ data }: { data: IGetAdminStatsReport }) => {
  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Companies"
          value={data.companyCount}
          icon={<BriefcaseBusiness className="w-full" />}
        />
        <StatCard
          title="Total Properties"
          value={data.propertyCount}
          icon={<Database className="w-full" />}
        />

        <StatCard
          title="Total Customers"
          value={data.customerCount}
          icon={<Users2 className="w-full" />}
        />
        <StatCard
          title="Total Subscriptions"
          value={data.subscriptionCount}
          icon={<Package className="w-full" />}
        />
      </div>
    </>
  );
};

// Stat Card Component
function StatCard({ title, value, icon }) {
  return (
    <Card className="px-5 py-6">
      <div className="flex flex-row items-center justify-between">
        <h4 className="font-bold">{value}</h4>
        <div className="size-8 flex items-center justify-center text-primary bg-primary/10 p-2 rounded-md">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-sm">{title}</div>
      </div>
    </Card>
  );
}
