import { Button } from "@/components/ui/button";

type AppraisalSectionProps = {
  t: any;
};

export default function AppraisalSection({ t }: AppraisalSectionProps) {
  return (
    <section className="py-16 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 md:h-64 overflow-hidden rounded-md">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=300&q=80"
                alt={t("appraisal.imageAlt1")}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-48 md:h-64 overflow-hidden rounded-md">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&h=300&q=80"
                alt={t("appraisal.imageAlt2")}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <div className="mb-4">
              <span className="text-sm text-muted-foreground uppercase font-medium">
                {t("appraisal.ourValue")}
              </span>
              <h2 className="text-3xl font-bold mb-1 text-foreground">
                {t("appraisal.title")}
              </h2>
              <div className="text-primary text-3xl font-medium mb-4">
                {t("appraisal.services")}
              </div>
            </div>
            <p className="text-muted-foreground mb-6 text-sm">
              {t("appraisal.description")}
            </p>
            <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-md">
              {t("appraisal.button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
