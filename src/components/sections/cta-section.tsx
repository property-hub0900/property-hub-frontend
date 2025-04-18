import { Button } from "@/components/ui/button";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CtaSection() {
  const t = useTranslations();
  return (
    <section className="w-full bg-primary py-8 md:py-14 ">
      <div className="container mx-auto flex flex-col justify-between items-center gap-3 md:flex-row">
        <h3 className="text-primary-foreground text-center md:text-left">
          {t("title.lookingToAdvertiseAProperty")}
        </h3>
        <Link href={PUBLIC_ROUTES.contactUs}>
          <Button
            variant="default"
            className="bg-white text-primary hover:bg-gray-100 rounded-md"
          >
            {t("button.letsTalk")}
          </Button>
        </Link>
      </div>
    </section>
  );
}
