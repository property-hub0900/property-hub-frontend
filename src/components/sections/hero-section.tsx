import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchTabs from "@/components/search/search-tabs";

type HeroSectionProps = {
  t: any;
};

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="relative h-[500px] w-full">
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url(/cover.png)",
        }}
      ></div>
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white w-full px-4 sm:px-6 lg:px-8">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center">
          {t("hero.title")}
        </h1>
        <p className="text-white text-base max-w-xl mb-8 opacity-90 text-center">
          {t("hero.subtitle")}
        </p>

        {/* Search Box */}
        <div className="w-full max-w-4xl mx-auto rounded-md overflow-hidden shadow-lg">
          <SearchTabs t={t} />
          <SearchForm t={t} />
        </div>
      </div>
    </section>
  );
}

function SearchForm({ t }: { t: any }) {
  return (
    <div className="flex flex-col bg-card sm:flex-row items-center p-4 rounded-sm rounded-tl-none">
      <div className="w-full sm:w-1/4 mb-3 sm:mb-0 sm:mr-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-full border border-input rounded-md h-10">
            <SelectValue placeholder={t("search.propertyType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("search.allProperties")}</SelectItem>
            <SelectItem value="house">{t("search.house")}</SelectItem>
            <SelectItem value="apartment">{t("search.apartment")}</SelectItem>
            <SelectItem value="villa">{t("search.villa")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full mb-3 sm:mb-0 sm:mr-3 relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <Input
          className="pl-10 border border-input rounded-md h-10 w-full"
          placeholder={t("search.placeholder")}
        />
      </div>
      <Button className="w-full sm:w-1/6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md h-10">
        {t("search.button")}
      </Button>
    </div>
  );
}
