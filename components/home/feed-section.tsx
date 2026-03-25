"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useAppStore } from "@/lib/store/app-store";
import { MOCK_CATEGORIES, MOCK_LOCATIONS } from "@/lib/mock-data";
import type { Post, PostType } from "@/lib/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Search,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export function FeedSection() {
  const { posts } = useAppStore();
  const [tab, setTab] = React.useState<PostType>("lost");
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<string>("бүгд");
  const [location, setLocation] = React.useState<string>("бүгд");

  const published = posts.filter((p) => p.status === "published");
  const filtered = published.filter((p) => {
    if (p.type !== tab) return false;
    if (category !== "бүгд" && p.category !== category) return false;
    if (location !== "бүгд" && p.location !== location) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const hay = `${p.title} ${p.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -top-px h-40 bg-gradient-to-b from-white to-transparent" />
      <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-12 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-[2.5rem]">
              Сүүлд нэмэгдсэн
            </h2>
            <p className="text-base text-muted-foreground sm:text-lg">
              Хаясан болон олсон заруудыг шүүж хайна уу.
            </p>
          </div>
          <div className="flex w-fit gap-1.5 rounded-2xl border border-border/40 bg-muted/50 p-2 shadow-sm backdrop-blur-sm">
            <FeedTab
              type="lost"
              active={tab === "lost"}
              onClick={() => setTab("lost")}
            >
              Хаясан
            </FeedTab>
            <FeedTab
              type="found"
              active={tab === "found"}
              onClick={() => setTab("found")}
            >
              Олсон
            </FeedTab>
          </div>
        </div>

        <div className="mb-14 grid gap-6 rounded-[1.5rem] border border-border/60 bg-card p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex h-14 w-full items-center rounded-full border border-border/60 bg-background pl-5 pr-1.5 shadow-sm ring-1 ring-black/[0.04] sm:h-[3.75rem] sm:pl-6 sm:pr-2">
              <input
                id="feed-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Гарчиг эсвэл тайлбараар..."
                className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-base text-foreground outline-none placeholder:text-muted-foreground/70 focus:ring-0 sm:py-3 sm:text-lg"
                autoComplete="off"
              />
              <button
                type="button"
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#ff6b4a] via-[#f8513d] to-[#e63b2e] text-white shadow-md shadow-black/15 ring-1 ring-black/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 active:translate-y-0 active:scale-95 sm:size-11"
                aria-label="Шүүх"
              >
                <Search
                  className="size-4 sm:size-[1.125rem]"
                  strokeWidth={2.25}
                />
              </button>
            </div>
          </div>
          <div className="grid gap-2.5">
            <Label className="flex items-center gap-2 text-base font-semibold opacity-80">
              <Tag className="size-4 text-rose-500" />
              Ангилал
            </Label>
            <Select value={category} onValueChange={(v) => v && setCategory(v)}>
              <SelectTrigger className="w-full rounded-xl border-border/40 bg-background/50 focus:ring-rose-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="бүгд">Бүгд</SelectItem>
                {MOCK_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2.5">
            <Label className="flex items-center gap-2 text-base font-semibold opacity-80">
              <MapPin className="size-4 text-rose-500" />
              Байршил
            </Label>
            <Select value={location} onValueChange={(v) => v && setLocation(v)}>
              <SelectTrigger className="w-full rounded-xl border-border/40 bg-background/50 focus:ring-rose-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="бүгд">Бүгд</SelectItem>
                {MOCK_LOCATIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            Илэрц олдсонгүй.
          </p>
        ) : (
          <PostsCarousel
            posts={filtered}
            resetKey={`${tab}-${search}-${category}-${location}`}
          />
        )}
      </section>
    </div>
  );
}

const SLIDE_WIDTH = "min(540px, calc(100vw - 5.5rem))";

/** Carousel prev/next — liquid glass + layered shadow */
const carouselNavGlass =
  "border border-white/60 bg-white/[0.18] text-foreground/90 shadow-[0_12px_40px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl backdrop-saturate-150 hover:bg-white/[0.18] hover:border-white/60 hover:text-foreground/90 hover:shadow-[0_12px_40px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-1px_0_rgba(255,255,255,0.15)] focus-visible:border-white/70 focus-visible:ring-2 focus-visible:ring-white/35";

function PostsCarousel({
  posts,
  resetKey,
}: {
  posts: Post[];
  resetKey: string;
}) {
  const [swiper, setSwiper] = React.useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const canNavigate = posts.length > 1;
  const canPrev = Boolean(swiper && !swiper.isBeginning);
  const canNext = Boolean(swiper && !swiper.isEnd);

  return (
    <div className="relative py-2">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className={cn(
          "group absolute left-0 top-[42%] z-30 size-12 -translate-y-1/2 rounded-full sm:left-1 md:left-0",
          carouselNavGlass,
          (!canNavigate || !canPrev) && "pointer-events-none opacity-40",
        )}
        disabled={!canNavigate || !canPrev}
        onClick={() => swiper?.slidePrev()}
        aria-label="Өмнөх зар"
      >
        <ChevronLeft className="size-7" />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        className={cn(
          "group absolute right-0 top-[42%] z-30 size-12 -translate-y-1/2 rounded-full sm:right-1 md:right-0",
          carouselNavGlass,
          (!canNavigate || !canNext) && "pointer-events-none opacity-40",
        )}
        disabled={!canNavigate || !canNext}
        onClick={() => swiper?.slideNext()}
        aria-label="Дараагийн зар"
      >
        <ChevronRight className="size-7" />
      </Button>

      <div className="mx-10 min-h-[min(480px,82vw)] sm:mx-12 md:mx-14">
        <Swiper
          key={resetKey}
          modules={[EffectCoverflow, Pagination]}
          effect="coverflow"
          grabCursor
          centeredSlides
          slidesPerView="auto"
          spaceBetween={24}
          speed={650}
          resistanceRatio={0.75}
          watchSlidesProgress
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 180,
            modifier: 1.2,
            slideShadows: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveIndex(s.activeIndex)}
          className="feed-posts-swiper w-full"
        >
          {posts.map((p) => (
            <SwiperSlide
              key={p.id}
              className="box-border !flex"
              style={{ width: SLIDE_WIDTH }}
            >
              <div className="flex w-full pb-1 pt-1">
                <PostCard post={p} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <p className="mt-8 text-center text-sm text-muted-foreground sm:mt-10">
          {activeIndex + 1} / {posts.length} зар
        </p>
      </div>
    </div>
  );
}

function FeedTab({
  children,
  active,
  onClick,
  type,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  type: PostType;
}) {
  const activeStyles =
    type === "lost"
      ? "bg-gradient-to-r from-[#ff6b4a] via-[#f8513d] to-[#e63b2e] text-white shadow-lg shadow-black/15 ring-1 ring-black/5"
      : "bg-gradient-to-r from-[#2dd4a8] via-[#22c55e] to-[#16a34a] text-white shadow-lg shadow-black/15 ring-1 ring-black/5";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-7 py-3 text-base font-bold transition-all duration-300 ease-out active:scale-95 ${
        active
          ? `${activeStyles} scale-105 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0`
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function PostCard({ post }: { post: Post }) {
  const isLost = post.type === "lost";

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block h-full w-full overflow-hidden rounded-3xl outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-primary/10">
        <CardContent className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground/80 sm:text-sm">
              <Calendar className="size-3.5 shrink-0" />
              <span>{post.date}</span>
            </div>
            <Badge
              className={`border-none px-3 py-0.5 text-xs font-bold ${
                isLost
                  ? "bg-rose-500/10 text-rose-600 hover:bg-rose-500/20"
                  : "bg-teal-500/10 text-teal-600 hover:bg-teal-500/20"
              }`}
            >
              {isLost ? "Хаясан" : "Олсон"}
            </Badge>
          </div>

          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-primary">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-base leading-relaxed text-muted-foreground/90">
              {post.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold sm:text-sm">
            <div className="flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-1 text-muted-foreground/80 ring-1 ring-border/40">
              <MapPin
                className={`size-3 ${isLost ? "text-rose-400" : "text-teal-400"}`}
              />
              <span>{post.location}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-1 text-muted-foreground/80 ring-1 ring-border/40">
              <Tag className="size-3 text-primary/60" />
              <span>{post.category}</span>
            </div>
          </div>
        </CardContent>

        <div className="relative mt-auto aspect-video w-full overflow-hidden rounded-b-3xl border-t border-border/10">
          <Image
            src={post.imageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 560px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Card>
    </Link>
  );
}
