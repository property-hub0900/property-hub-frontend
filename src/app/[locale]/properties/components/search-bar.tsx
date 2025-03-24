"use client";

import type React from "react";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL query parameters
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [rent, setRent] = useState(searchParams.get("rent") || "Rent");
  const [propertyType, setPropertyType] = useState(
    searchParams.get("propertyType") || "Property Type"
  );
  const [bedsAndBath, setBedsAndBath] = useState(
    searchParams.get("bedsAndBath") || "Beds & Bath"
  );
  const [price, setPrice] = useState(searchParams.get("price") || "Price");
  const [saveSearch, setSaveSearch] = useState(
    searchParams.get("saveSearch") === "true"
  );

  // Create a memoized function to update URL with current search parameters
  const updateQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    if (city) params.set("city", city);
    if (rent !== "Rent") params.set("rent", rent);
    if (propertyType !== "Property Type")
      params.set("propertyType", propertyType);
    if (bedsAndBath !== "Beds & Bath") params.set("bedsAndBath", bedsAndBath);
    if (price !== "Price") params.set("price", price);
    if (saveSearch) params.set("saveSearch", "true");

    // Use replace instead of push to avoid adding to browser history for every change
    router.push(`?${params.toString()}`);
  }, [city, rent, propertyType, bedsAndBath, price, saveSearch, router]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams();
  };

  // Handle rent change
  const handleRentChange = (value: string) => {
    setRent(value);
  };

  // Handle property type change
  const handlePropertyTypeChange = (value: string) => {
    setPropertyType(value);
  };

  // Handle beds and bath change
  const handleBedsAndBathChange = (value: string) => {
    setBedsAndBath(value);
  };

  // Handle price change
  const handlePriceChange = (value: string) => {
    setPrice(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 md:flex-row md:items-center mb-10"
    >
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder=""
          className="pl-9"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 md:flex md:flex-row">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between" type="button">
              {rent} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={rent}
              onValueChange={handleRentChange}
            >
              <DropdownMenuRadioItem value="Rent">Rent</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Buy">Buy</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between" type="button">
              {propertyType} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={propertyType}
              onValueChange={handlePropertyTypeChange}
            >
              <DropdownMenuRadioItem value="Property Type">
                Property Type
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Apartment">
                Apartment
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Villa">Villa</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Townhouse">
                Townhouse
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between" type="button">
              {bedsAndBath} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={bedsAndBath}
              onValueChange={handleBedsAndBathChange}
            >
              <DropdownMenuRadioItem value="Beds & Bath">
                Beds & Bath
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="1+ Bed">
                1+ Bed
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2+ Beds">
                2+ Beds
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3+ Beds">
                3+ Beds
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="4+ Beds">
                4+ Beds
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="justify-between" type="button">
              {price} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={price}
              onValueChange={handlePriceChange}
            >
              <DropdownMenuRadioItem value="Price">Price</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="0-100,000">
                0-100,000 QAR
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="100,000-200,000">
                100,000-200,000 QAR
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="200,000-300,000">
                200,000-300,000 QAR
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="300,000+">
                300,000+ QAR
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="justify-between" type="button">
          More Filters <ChevronDown className="ml-2 h-4 w-4" />
        </Button>

        <Button type="submit" className="col-span-2 md:col-span-1">
          Find
        </Button>
      </div>

      {/* <div className="flex items-center gap-2">
        <Checkbox
          id="saveSearch"
          checked={saveSearch}
          onCheckedChange={(checked) => setSaveSearch(checked as boolean)}
        />
        <label htmlFor="saveSearch" className="text-sm">
          Save Search
        </label>
      </div> */}
    </form>
  );
}
