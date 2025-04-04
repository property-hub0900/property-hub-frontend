export const RTL_LANGUAGES = ["ar"];

export const isRTL = (locale: string) => RTL_LANGUAGES.includes(locale);

export const getDirection = (locale: string) => (isRTL(locale) ? "rtl" : "ltr");

// Utility to add RTL class to specific elements that need RTL styles
export const getRTLClass = (locale: string, defaultClass: string = "") => {
  return `${defaultClass} ${isRTL(locale) ? "rtl" : "ltr"}`.trim();
};
