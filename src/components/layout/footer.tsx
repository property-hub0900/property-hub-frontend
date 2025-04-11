"use client";
import { Facebook, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import type React from "react";

export default function Footer() {
  const t = useTranslations("landingPage");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground w-full pt-12 pb-4 md:pt-16 md:pb-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-5 gap-8 mb-5 md:gap-16 md:mb-12">
          <FooterBrand t={t} />
          <FooterLinks
            title={t("footer.product")}
            links={[
              { label: t("footer.features"), href: "#" },
              { label: t("footer.pricing"), href: "#" },
              { label: t("footer.listings"), href: "#" },
              { label: t("footer.customers"), href: "#" },
              { label: t("footer.brand"), href: "#" },
            ]}
          />
          <FooterLinks
            title={t("footer.company")}
            links={[
              { label: t("footer.aboutUs"), href: "#" },
              { label: t("footer.blog"), href: "#" },
              { label: t("footer.careers"), href: "#" },
              { label: t("footer.contact"), href: "#" },
              { label: t("footer.customers"), href: "#" },
            ]}
          />
          <FooterLinks
            title={t("footer.resources")}
            links={[
              { label: t("footer.community"), href: "#" },
              { label: t("footer.contact"), href: "#" },
              { label: t("footer.dpa"), href: "#" },
              { label: t("footer.terms"), href: "#" },
            ]}
          />
        </div>

        <div className="border-t border-primary-foreground/40 pt-5 flex flex-col md:flex-row justify-between items-center md:pt-8">
          <p className=" text-sm">
            © {currentYear} PropertyExplorer. {t("footer.allRightsReserved")}
          </p>
          <p className="text-primary-foreground hover:underline text-sm mt-2 md:mt-0">
            <a href="#" className="hover:text-primary-foreground">
              {t("footer.termsAndConditions")}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterBrand({ t }: { t: any }) {
  return (
    <div className="col-span-2">
      <h3 className="text-2xl text-primary-foreground font-bold mb-4">
        PropertyExplorer
      </h3>
      <p className="text-primary-foreground text-base mb-5 ">
        {t("footer.tagline")}
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
