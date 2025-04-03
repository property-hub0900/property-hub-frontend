import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function CtaSection() {
  const t = useTranslations("landingPage");
  return (
    <section className="bg-primary py-12 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <h3 className="text-primary-foreground mb-4 md:mb-0">
          {t("cta.title")}
        </h3>
        <Button
          variant="default"
          className="bg-white text-primary hover:bg-gray-100 rounded-md"
        >
          {t("cta.button")}
        </Button>
      </div>
    </section>
  );
}
