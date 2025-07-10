"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RotateCcw, Zap, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import ContextSlider from "../ContextSlider/ContextSlider";
import LanguageSelector from "../LanguageSelector/LanguageSelector";

interface HeaderBarProps {
  numberOfPreviousMessagesAttached: number;
  setNumberOfPreviousMessagesAttached: (value: number) => void;
  totalTokenSum: number;
  resetTokenCount: () => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const HeaderBar = ({
  numberOfPreviousMessagesAttached,
  setNumberOfPreviousMessagesAttached,
  totalTokenSum,
  resetTokenCount,
  selectedModel,
  setSelectedModel,
}: HeaderBarProps) => {
  const t = useTranslations("Models");
  const tMain = useTranslations("MainPage");

  const models = [
    {
      id: "gemini-2.5-flash",
      name: t("gemini"),
      description: t("geminiDescription"),
    },
    {
      id: "mistral-3.2-small",
      name: t("mistral"),
      description: t("mistralDescription"),
    },
  ];

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex justify-center flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent flex items-center justify-center gap-2 hover:from-blue-300 hover:to-gray-200 transition-all duration-200">
                  <Zap className="w-6 h-6 text-blue-400" />
                  {currentModel.name}
                  <ChevronDown className="w-5 h-5 text-blue-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64">
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className="flex flex-col items-start p-3 cursor-pointer"
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {model.description}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <LanguageSelector />
        </div>

        <div className="flex flex-row justify-between items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-blue-500/20">
          <ContextSlider
            numberOfPreviousMessagesAttached={numberOfPreviousMessagesAttached}
            setNumberOfPreviousMessagesAttached={
              setNumberOfPreviousMessagesAttached
            }
          />

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="hidden sm:inline text-white/80 text-sm">
                {tMain("tokensUsed")}{" "}
              </p>
              <Badge
                variant="outline"
                className="bg-blue-500/20 text-blue-200 border-blue-500/30"
              >
                {totalTokenSum.toLocaleString()}
              </Badge>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={resetTokenCount}
                  size="sm"
                  variant="destructive"
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30"
                >
                  <RotateCcw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tMain("resetTokens")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HeaderBar;
