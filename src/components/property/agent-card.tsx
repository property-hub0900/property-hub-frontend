import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { leadsGenerationService } from "@/services/public/leads-generation";
import { IPostedByStaff, IPropertyCompany } from "@/types/public/properties";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface AgentCardProps {
  postedByStaff: IPostedByStaff;
  company: IPropertyCompany;
  propertyId: number;
}

export function AgentCard({ postedByStaff, company, propertyId }: AgentCardProps) {
  const agentName = `${postedByStaff.firstName} ${postedByStaff.lastName}`;
  const t = useTranslations();

  const handleLeadsGeneration = async (type: "call" | "email" | "whatsapp" | "visit") => {
    await leadsGenerationService.generateLeads({ propertyId: propertyId, type: type });
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="mb-4">
        <div className="flex justify-center mb-2">
          <UserAvatar
            src={postedByStaff.profilePhoto}
            firstName={postedByStaff.firstName}
            lastName={postedByStaff.lastName}
            size="lg"
          />
        </div>
        <h5 className="font-semibold text-center">{agentName}</h5>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <Link href={`tel:${postedByStaff?.phoneNumber}`}>
          <Button className="w-full" onClick={(e) => { handleLeadsGeneration("call") }}>
            {t("button.call")}
          </Button>
        </Link>
        <Link
          target="_blank"
          href={`https://wa.me/${postedByStaff?.phoneNumber}`}
        >
          <Button className="w-full" variant="outline" onClick={(e) => { handleLeadsGeneration("whatsapp") }}>
            {t("button.whatsApp")}
          </Button>
        </Link>
        <Link
          className="col-span-2"
          href={`mailto:${postedByStaff?.user.email}`}
        >
          <Button className="w-full" variant="outline" onClick={(e) => { handleLeadsGeneration("email") }}>
            {t("button.email")}
          </Button>
        </Link>
      </div>
      <div className="flex justify-center gap-4">
        {company.logo && (
          <p>
            <Image
              className="object-cover"
              src={company.logo}
              alt={company.name}
              width={200}
              height={100}
            ></Image>
          </p>
        )}
        <p className="text-base font-normal">{company.name}</p>
      </div>
    </div>
  );
}
