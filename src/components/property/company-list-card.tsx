import { PUBLIC_ROUTES } from "@/constants/paths";
import { ICompany } from "@/types/public/properties";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const CompanyListCard = ({ data }: { data: ICompany }) => {
  const t = useTranslations();

  return (
    <div className="relative flex flex-row border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg ">
      <div className="w-1/3 flex items-center justify-center">
        <div className="relative w-full h-full">
          <img
            src={data.logo ? data.logo : "/placeholder.svg"}
            alt={`${data.name} logo`}
            className="object-contain w-full h-full"
          />
        </div>
      </div>
      <div className="w-2/3 flex flex-col gap-1 p-4 text-muted-foreground text-sm">
        <h5 className="font-semibold text-foreground">{data.name}</h5>
        <p className="text-muted-foreground">{t("text.headOffice")}</p>
        {data.city && (
          <p className="mt-2">
            {t("form.location.label")}: {data.city}
          </p>
        )}

        <div className="flex gap-6 mt-6">
          <div className="flex items-center gap-3">
            <span className="text-primary font-medium bg-muted-foreground/5 rounded-sm px-3 py-1">
              {t("button.forSale")}: {data.saledProperties}
            </span>
            <span className="text-primary font-medium bg-muted-foreground/5 rounded-sm px-3 py-1">
              {t("button.forRent")}: {data.rentedProperties}
            </span>
          </div>
        </div>
      </div>
      <Link
        className="absolute left-0 top-0 w-full h-full z-10"
        href={`${PUBLIC_ROUTES.findCompany}/${data.companyId}`}
      ></Link>
    </div>
  );
};
