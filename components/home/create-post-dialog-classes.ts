import { authDialogTitleClassName, authInputClassName } from "@/components/auth/auth-classes";

/** Create post dialog — shell + fields aligned with auth modals */

export const postDialogContentClassName =
  "max-h-[min(90dvh,46rem)] gap-5 overflow-y-auto overscroll-contain rounded-2xl border border-border/50 bg-gradient-to-b from-card via-background to-teal-50/[0.28] p-6 shadow-2xl shadow-black/[0.12] ring-1 ring-black/[0.06] sm:max-w-lg dark:to-teal-950/15";

export const postDialogTitleClassName = authDialogTitleClassName;

export const postDialogDescriptionClassName =
  "rounded-xl border border-border/40 bg-muted/40 px-3.5 py-2.5 text-sm leading-relaxed text-muted-foreground";

export { authInputClassName as postInputClassName };

export const postTextareaClassName =
  "min-h-[5.75rem] w-full rounded-xl border-border/70 bg-background px-3.5 py-3 text-base shadow-sm outline-none transition-[box-shadow,border-color] placeholder:text-muted-foreground/80 focus-visible:border-emerald-500/45 focus-visible:ring-[3px] focus-visible:ring-emerald-500/20 md:text-base";

export const postSelectTriggerClassName =
  "h-11 w-full rounded-xl border-border/70 bg-background text-base shadow-sm focus:ring-[3px] focus:ring-emerald-500/20";

export const postLabelClassName =
  "text-sm font-semibold text-foreground/90";

/** Hero «Хаясан» */
export const postSubmitButtonLost =
  "h-11 rounded-xl border-0 bg-gradient-to-r from-[#ff6b4a] via-[#f8513d] to-[#e63b2e] px-8 text-base font-semibold text-white shadow-lg shadow-black/15 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-[1.02] active:translate-y-0 active:scale-[0.98]";

/** Hero «Олсон» */
export const postSubmitButtonFound =
  "h-11 rounded-xl border-0 bg-gradient-to-r from-[#2dd4a8] via-[#22c55e] to-[#16a34a] px-8 text-base font-semibold text-white shadow-lg shadow-black/15 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-[1.03] active:translate-y-0 active:scale-[0.98]";

export const postCancelButtonClassName =
  "h-11 rounded-xl border border-border/60 bg-background/90 px-6 text-base font-medium shadow-sm transition-all hover:bg-muted/80 hover:shadow-md active:scale-[0.98]";

export const postDialogFooterClassName =
  "mt-2 gap-3 border-0 bg-transparent p-0 shadow-none sm:flex-row sm:justify-end";
