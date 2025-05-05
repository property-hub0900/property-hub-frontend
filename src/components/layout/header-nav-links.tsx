import { PROPERTY_PURPOSE } from "@/constants/constants";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const HeaderNavLinks = () => {
  const t = useTranslations();

  return (
    <>
      <Link
        href={`${PUBLIC_ROUTES.properties}?purpose=${PROPERTY_PURPOSE[0]}`}
        className="transition-colors text-sm font-medium hover:text-primary"
      >
        {t("button.buy")}
      </Link>
      <Link
        href={`${PUBLIC_ROUTES.properties}?purpose=${PROPERTY_PURPOSE[1]}`}
        className="transition-colors text-sm font-medium hover:text-primary"
      >
        {t("button.rent")}
      </Link>
      <Link
        href={PUBLIC_ROUTES.properties}
        className="transition-colors text-sm font-medium hover:text-primary"
      >
        {t("button.exploreProperties")}
      </Link>
      <Link
        href={PUBLIC_ROUTES.findCompany}
        className="transition-colors text-sm font-medium hover:text-primary"
      >
        {t("button.findCompany")}
      </Link>
    </>
  );
};
