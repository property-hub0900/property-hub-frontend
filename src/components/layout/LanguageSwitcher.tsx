"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { getDirection, getRTLClass } from "@/utils/rtl";

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: "en", name: "EN" },
  { code: "ar", name: "AR" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [currentLang, setCurrentLang] = useState(currentLocale);

  useEffect(() => {
    // Get language from URL
    const urlLang = pathname.split("/")[1];
    if (LANGUAGES.some((lang) => lang.code === urlLang)) {
      setCurrentLang(urlLang);
      // Set RTL direction
      document.documentElement.dir = getDirection(urlLang);
      document.documentElement.lang = urlLang;
      // Add RTL class to body for global styles
      document.body.className = getRTLClass(urlLang, document.body.className);
    }
  }, [pathname]);

  const switchLanguage = (langCode: string) => {
    if (currentLang === langCode) return;

    // Update URL with new language
    const segments = pathname.split("/");
    if (LANGUAGES.some((lang) => lang.code === segments[1])) {
      segments[1] = langCode;
    } else {
      segments.splice(1, 0, langCode);
    }
    const newPath = segments.join("/");

    // Update document direction and language
    document.documentElement.dir = getDirection(langCode);
    document.documentElement.lang = langCode;
    // Update body class for RTL
    document.body.className = getRTLClass(langCode, document.body.className);

    // Navigate to new URL
    router.push(newPath);
    setCurrentLang(langCode);
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {LANGUAGES.map((lang, index) => (
          <div key={lang.code} className="flex items-center">
            <button
              onClick={() => switchLanguage(lang.code)}
              className={`text-sm font-medium cursor-pointer hover:text-primary ${
                currentLang === lang.code ? "text-primary" : "text-gray-500"
              }`}
            >
              {lang.name}
            </button>
            {index < LANGUAGES.length - 1 && (
              <span className="text-muted-foreground/30 mx-1">|</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
