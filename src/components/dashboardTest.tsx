"use client"

import {
    BookmarkIcon,
    Building2,
    Heart,
    Home,
    MessageSquare,
    Settings
} from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoleGate } from "@/components/rbac/role-gate"

export default function DashboardTest() {
    const t = useTranslations("customerDashboard")

    // Mock data for saved properties
    const savedProperties = [
        {
            id: 1,
            title: "Modern Apartment in Downtown",
            address: "123 Main St, Downtown",
            price: "$450,000",
            beds: 2,
            baths: 2,
            sqft: 1200,
            image: "/placeholder.svg?height=200&width=300",
        },
        {
            id: 2,
            title: "Luxury Villa with Pool",
            address: "456 Park Ave, Westside",
            price: "$1,250,000",
            beds: 4,
            baths: 3,
            sqft: 3200,
            image: "/placeholder.svg?height=200&width=300",
        },
        {
            id: 3,
            title: "Cozy Suburban Home",
            address: "789 Oak Dr, Northside",
            price: "$650,000",
            beds: 3,
            baths: 2,
            sqft: 2100,
            image: "/placeholder.svg?height=200&width=300",
        },
    ]

    // Mock data for saved searches
    const savedSearches = [
        {
            id: 1,
            name: "Downtown Apartments",
            criteria: "2+ beds, Under $500k",
            location: "Downtown",
            date: "Updated 2 days ago",
            matches: 12,
        },
        {
            id: 2,
            name: "Suburban Family Homes",
            criteria: "3+ beds, 2+ baths, Under $700k",
            location: "Northside, Eastside",
            date: "Updated 1 week ago",
            matches: 8,
        },
        {
            id: 3,
            name: "Luxury Properties",
            criteria: "4+ beds, 3+ baths, Pool",
            location: "Westside, Southside",
            date: "Updated 3 days ago",
            matches: 5,
        },
    ]

    return (
        <div className="min-h-screen bg-background">


            {/* Main Content */}
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 space-y-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex flex-col items-center text-center space-y-3 py-4">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                        <AvatarFallback>JD</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold text-lg">John Doe</h2>
                                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full">
                                        {t("sidebar.viewProfile")}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <nav className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start">
                                <Home className="mr-2 h-4 w-4" />
                                {t("sidebar.dashboard")}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-[#4AA0D9] font-medium">
                                <Heart className="mr-2 h-4 w-4" />
                                {t("sidebar.savedProperties")}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <BookmarkIcon className="mr-2 h-4 w-4" />
                                {t("sidebar.savedSearches")}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {t("sidebar.messages")}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Building2 className="mr-2 h-4 w-4" />
                                {t("sidebar.myProperties")}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Settings className="mr-2 h-4 w-4" />
                                {t("sidebar.settings")}
                            </Button>
                        </nav>
                    </aside>

                    <RoleGate allowedRoles={["owner", "admin"]} >
                        <div className="flex-1">
                            <Tabs defaultValue="saved-properties" className="w-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>
                                    <TabsList>
                                        <TabsTrigger value="saved-properties">{t("dashboard.tabs.savedProperties")}</TabsTrigger>
                                        <TabsTrigger value="saved-searches">{t("dashboard.tabs.savedSearches")}</TabsTrigger>
                                    </TabsList>
                                </div>

                                <TabsContent value="saved-properties" className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-medium">{t("savedProperties.title")}</h2>
                                        <Badge className="bg-[#4AA0D9]">
                                            {savedProperties.length} {t("savedProperties.propertiesCount")}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {savedProperties.map((property) => (
                                            <Card key={property.id} className="property-card overflow-hidden">
                                                <div className="relative h-48">
                                                    <Image
                                                        src={property.image || "/placeholder.svg"}
                                                        alt={property.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-[#4AA0D9]"
                                                    >
                                                        <Heart className="h-5 w-5 fill-[#4AA0D9]" />
                                                    </Button>
                                                </div>
                                                <CardContent className="p-4">
                                                    <h3 className="font-semibold text-lg">{property.title}</h3>
                                                    <p className="text-muted-foreground text-sm">{property.address}</p>
                                                    <p className="text-[#4AA0D9] font-semibold text-lg mt-2">{property.price}</p>
                                                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                                                        <span>
                                                            {property.beds} {t("savedProperties.property.beds")}
                                                        </span>
                                                        <span>
                                                            {property.baths} {t("savedProperties.property.baths")}
                                                        </span>
                                                        <span>
                                                            {property.sqft} {t("savedProperties.property.sqft")}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="p-4 pt-0 flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        {t("savedProperties.property.viewDetails")}
                                                    </Button>
                                                    <Button size="sm" className="flex-1 bg-[#4AA0D9] hover:bg-[#4AA0D9]/90">
                                                        {t("savedProperties.property.contactAgent")}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="saved-searches" className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-lg font-medium">{t("savedSearches.title")}</h2>
                                        <Badge className="bg-[#4AA0D9]">
                                            {savedSearches.length} {t("savedSearches.searchesCount")}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4">
                                        {savedSearches.map((search) => (
                                            <Card key={search.id}>
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle>{search.name}</CardTitle>
                                                            <CardDescription>{search.location}</CardDescription>
                                                        </div>
                                                        <Badge className="bg-[#4AA0D9]">
                                                            {search.matches} {t("savedSearches.search.matches")}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pb-2">
                                                    <p className="text-sm">{search.criteria}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{search.date}</p>
                                                </CardContent>
                                                <CardFooter className="flex gap-2">
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        {t("savedSearches.search.editSearch")}
                                                    </Button>
                                                    <Button size="sm" className="flex-1 bg-[#4AA0D9] hover:bg-[#4AA0D9]/90">
                                                        {t("savedSearches.search.viewResults")}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </RoleGate>
                </div>
            </main>
        </div>
    )
}

