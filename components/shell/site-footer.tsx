import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/30 pt-12 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold tracking-tight text-foreground">
              <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-teal-400 text-xs font-extrabold text-white">
                N
              </span>
              <span>3 Алхаад ол</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              МУИС-ийн оюутан, багш ажилчдад зориулсан эд зүйлсээ хайх, олох
              систем.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80">
              Холбоосууд
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-teal-500 transition-colors"
                >
                  Нүүр хуудас
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="hover:text-teal-500 transition-colors"
                >
                  Бүх зарууд
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-teal-500 transition-colors"
                >
                  Миний профайл
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80">
              Тусламж
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/#faq"
                  className="hover:text-teal-500 transition-colors"
                >
                  Түгээмэл асуултууд
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-teal-500 transition-colors"
                >
                  Аюулгүй ажиллагаа
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-teal-500 transition-colors"
                >
                  Холбоо барих
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/80">
              Холбоо барих
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Улаанбаатар хот, Сүхбаатар дүүрэг, МУИС-ийн хичээлийн байрууд
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center text-xs text-muted-foreground">
          © 2026 3 Алхаад ол. Бүх эрх хуулиар хамгаалагдсан.
        </div>
      </div>
    </footer>
  );
}
