import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { IPostedByStaff, IPropertyCompany } from "@/types/client/properties";
import Image from "next/image";
import Link from "next/link";

interface AgentCardProps {
  postedByStaff: IPostedByStaff;
  company: IPropertyCompany;
  t: any;
}

export function AgentCard({ postedByStaff, company, t }: AgentCardProps) {
  const agentName = `${postedByStaff.firstName} ${postedByStaff.lastName}`;

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <Link href={`tel:${postedByStaff.phoneNumber}`}>
          <Button className="w-full">{t("contact.call")}</Button>
        </Link>
        <Link
          target="_blank"
          href={`https://wa.me/${postedByStaff.phoneNumber}`}
        >
          <Button variant="outline">{t("contact.whatsApp")}</Button>
        </Link>
        <Link
          className="col-span-2"
          href={`mailto:${postedByStaff?.user.email}`}
        >
          <Button className="w-full" variant="outline">
            {t("contact.email")}
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
