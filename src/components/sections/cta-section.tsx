import { Button } from "@/components/ui/button";

type CtaSectionProps = {
  t: any;
};

export default function CtaSection({ t }: CtaSectionProps) {
  return (
    <section className="bg-primary py-12 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-primary-foreground mb-4 md:mb-0">
          {t("cta.title")}
        </h2>
        <Button
          variant="secondary"
          className="bg-white text-primary hover:bg-gray-100 rounded-md"
        >
          {t("cta.button")}
        </Button>
      </div>
    </section>
  );
}
