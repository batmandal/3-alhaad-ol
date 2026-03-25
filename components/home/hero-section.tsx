"use client";

import * as React from "react";
import type { PostType } from "@/lib/types";
import { PackageSearch, SearchCheck } from "lucide-react";

export function HeroSection({
  onLost,
  onFound,
}: {
  onLost: () => void;
  onFound: () => void;
}) {
  return (
    <section className="relative flex min-h-[min(85vh,820px)] flex-col overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#ffe8e0] via-[#f5f0ff] to-[#d8f5dc]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 top-20 size-64 rounded-3xl bg-white/40 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-10 top-40 size-48 rotate-12 rounded-2xl bg-white/30 blur-xl"
        aria-hidden
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-10 pb-24 sm:pb-28 lg:py-12 lg:pb-32">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="flex flex-col gap-7">
            <p className="flex items-center gap-2.5 text-base font-medium text-foreground/70">
              <span className="size-2.5 rounded-full bg-rose-400" />
              МУИС-ийн гээгдсэн/олдсон эд зүйлс
            </p>
            <h1 className="text-5xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-6xl lg:text-[3.75rem] xl:text-[4rem]">
              Олж авах &amp; буцаах
              <span className="mt-2 block bg-gradient-to-r from-emerald-700 via-teal-700 to-rose-900 bg-clip-text text-transparent">
                Амархан
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
              Гээгдсэн зүйлээ олж, олдсон зүйлээ эзэнтэй нь аюулгүйгаар холбох
              үйлчилгээ.
            </p>
            <div className="flex flex-wrap gap-3 text-base text-muted-foreground">
              <span className="rounded-full bg-white/60 px-4 py-1.5 shadow-sm ring-1 ring-black/5">
                999+ хэрэглэгч нэгдсэн
              </span>
              <span className="rounded-full bg-white/60 px-4 py-1.5 shadow-sm ring-1 ring-black/5">
                Баталгаажуулалттай
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <div className="relative mx-auto w-full max-w-lg">
              <div className="absolute -left-4 top-4 z-10 w-[42%] rotate-[-6deg] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10 transition-transform duration-500 hover:scale-[1.02]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80"
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="relative z-20 mx-auto w-[55%] overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10 transition-transform duration-500 hover:scale-[1.02]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400&q=80"
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
              <div className="absolute -right-2 top-8 z-10 w-[40%] rotate-[8deg] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10 transition-transform duration-500 hover:scale-[1.02]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&q=80"
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-5">
              <HeroCtaButton
                variant="lost"
                label="Хаясан"
                sub="Зар нэмэх"
                icon={<PackageSearch className="size-8 text-white/95" />}
                onClick={() => onLost()}
              />
              <HeroCtaButton
                variant="found"
                label="Олсон"
                sub="Зар нэмэх"
                icon={<SearchCheck className="size-8 text-white/95" />}
                onClick={() => onFound()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-px text-white">
        <svg
          className="block w-full text-white"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,32 C240,8 480,40 720,24 C960,8 1200,40 1440,28 L1440,48 L0,48 Z"
          />
        </svg>
      </div>
    </section>
  );
}

function HeroCtaButton({
  variant,
  label,
  sub,
  icon,
  onClick,
}: {
  variant: PostType;
  label: string;
  sub: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  const grad =
    variant === "lost"
      ? "from-[#ff6b4a] via-[#f8513d] to-[#e63b2e]"
      : "from-[#2dd4a8] via-[#22c55e] to-[#16a34a]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-1 items-center justify-between gap-5 rounded-2xl bg-gradient-to-r px-6 py-5 text-left shadow-lg shadow-black/15 ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:scale-[0.98] ${grad}`}
    >
      <div>
        <p className="text-xl font-bold text-white">{label}</p>
        <p className="text-base text-white/90">{sub}</p>
      </div>
      <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
    </button>
  );
}
