"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages, ChevronDown } from "lucide-react";

const LanguageSelector = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Languages");

  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="absolute top-4 right-4 ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/80 hover:text-white hover:bg-blue-500/20 gap-1"
          >
            <Languages className="size-4" />
            <span className="hidden sm:inline">{t(locale as "en" | "pl")}</span>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem
            onClick={() => switchLanguage("en")}
            className={`cursor-pointer ${
              locale === "en" ? "bg-blue-500/20" : ""
            }`}
          >
            {t("en")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => switchLanguage("pl")}
            className={`cursor-pointer ${
              locale === "pl" ? "bg-blue-500/20" : ""
            }`}
          >
            {t("pl")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
