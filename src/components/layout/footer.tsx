"use client";
import { PROPERTY_PURPOSE } from "@/constants/constants";
import { PUBLIC_ROUTES } from "@/constants/paths";
import { Facebook, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";

export default function Footer() {
  const t = useTranslations();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground w-full pt-12 pb-4 md:pt-16 md:pb-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-5 gap-8 mb-5 md:gap-16 md:mb-12">
          <FooterBrand />
          <FooterLinks
            title={t("title.properties")}
            links={[
              {
                label: t("button.buy"),
                href: `${PUBLIC_ROUTES.properties}?purpose=${PROPERTY_PURPOSE[0]}`,
              },
              {
                label: t("button.rent"),
                href: `${PUBLIC_ROUTES.properties}?purpose=${PROPERTY_PURPOSE[1]}`,
              },
              {
                label: t("button.exploreAll"),
                href: `${PUBLIC_ROUTES.properties}`,
              },
              {
                label: t("button.findCompany"),
                href: `${PUBLIC_ROUTES.findCompany}`,
              },
            ]}
          />
          <FooterLinks
            title={t("title.company")}
            links={[
              { label: t("button.aboutUs"), href: "#" },
              {
                label: t("button.contactUs"),
                href: `${PUBLIC_ROUTES.contactUs}`,
              },
            ]}
          />
          <FooterLinks
            title={t("title.resources")}
            links={[
              { label: t("button.privacyPolicy"), href: "#" },
              { label: t("button.termsAndConditions"), href: "#" },
            ]}
          />
        </div>

        <div className="border-t border-primary-foreground/40 pt-5 flex justify-start items-center md:pt-8">
          <p className=" text-sm">
            © {currentYear} PPortal. {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterBrand() {
  const t = useTranslations();
  return (
    <div className="col-span-2">
      <h3 className="text-2xl text-primary-foreground font-bold mb-4">
        PPortal
      </h3>
      <p className="text-primary-foreground text-base mb-5 ">
        {t("text.footerTagline")}
      </p>
      <div className="flex gap-4">
        <SocialLink href="#" icon={<Facebook size={18} />} />
        <SocialLink href="#" icon={<Twitter size={18} />} />
        <SocialLink href="#" icon={<Youtube size={18} />} />
      </div>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-primary bg-primary-foreground p-1.5 rounded-full"
    >
      {icon}
    </a>
  );
}

type FooterLink = {
  label: string;
  href: string;
};

function FooterLinks({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h5 className="font-medium mb-4">{title}</h5>
      <ul className="space-y-2 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-primary-foreground hover:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
