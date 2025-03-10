import Link from "next/link";
import { ChevronRight } from "lucide-react";
import PropertyCard from "@/components/property/property-card";

type LatestProjectsSectionProps = {
  t: any;
};

// Mock property data
const properties = [
  {
    id: 1,
    location: "New York, USA",
    price: "$5,200,000",
    beds: 8,
    rooms: 6,
    rating: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 2,
    location: "Los Angeles, USA",
    price: "$4,800,000",
    beds: 7,
    rooms: 5,
    rating: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 3,
    location: "Miami, USA",
    price: "$3,900,000",
    beds: 6,
    rooms: 4,
    rating: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
  {
    id: 4,
    location: "Chicago, USA",
    price: "$4,100,000",
    beds: 7,
    rooms: 5,
    rating: 9,
    imageUrl:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200&q=80",
  },
];

export default function LatestProjectsSection({
  t,
}: LatestProjectsSectionProps) {
  return (
    <section className="py-16 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("latestProjects.title")}
          </h2>
          <Link
            href="/projects"
            className="text-primary hover:text-primary/80 flex items-center text-sm"
          >
            {t("latestProjects.exploreAll")} <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              t={t}
              location={property.location}
              price={property.price}
              beds={property.beds}
              rooms={property.rooms}
              rating={property.rating}
              imageUrl={property.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
