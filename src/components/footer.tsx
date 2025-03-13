import type React from "react";
import { Facebook, Twitter, Youtube } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("landingPage");

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8 w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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

        <div className="border-t border-primary/40 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-foreground/80 text-sm">
            © 2025 PropertyHub. {t("footer.allRightsReserved")}
          </p>
          <p className="text-primary-foreground/80 text-sm mt-2 md:mt-0">
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
    <div>
      <h3 className="text-2xl text-primary-foreground font-bold mb-4">
        PropertyHub
      </h3>
      <p className="text-primary-foreground/80 mb-4 text-sm">
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
      className="text-primary-foreground hover:text-primary-foreground/80 bg-primary-foreground/20 p-1.5 rounded-full"
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
      <h4 className="font-medium mb-4">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-primary-foreground/80 hover:text-primary-foreground"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
