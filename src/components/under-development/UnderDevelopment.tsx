import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.jpg";
import { socialLinks } from "./socialLinks";

export default function UnderDevelopment() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-secondary_color via-white to-light_gray px-4 py-16">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary-50/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-ternary_color/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex flex-col items-center gap-4">
          <div className="rounded-full bg-white p-2 shadow-lg ring-4 ring-primary-50/10">
            <Image
              src={logo}
              alt="Change Makers of the World"
              className="h-24 w-24 rounded-full object-cover"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-black_color sm:text-2xl">
            Change Makers of the World
          </h1>
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-50/10 px-4 py-2 text-sm font-medium text-primary-50">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-50 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary-50" />
          </span>
          Under Development
        </div>

        <h2 className="mb-4 text-3xl font-bold text-black_color sm:text-4xl lg:text-5xl">
          Something great is{" "}
          <span className="text-primary-50">coming soon</span>
        </h2>
        <p className="mx-auto mb-10 max-w-md text-base leading-relaxed text-paragraph_color sm:text-lg">
          We&apos;re building a better experience for our community. Stay
          connected with us on social media while we work on it.
        </p>

        <div className="mb-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-black_color">
            Follow Us
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-md ring-1 ring-dark_gray/30 transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:bg-primary-50 hover:shadow-lg hover:ring-primary-50"
              >
                <Icon className="size-6 transition-all duration-200 [&_path]:!fill-primary-50 group-hover:[&_path]:!fill-white" />
              </Link>
            ))}
          </div>
        </div>

        <p className="text-sm text-paragraph_color">
          {`© ${new Date().getFullYear()} Change Makers of the World`}
        </p>
      </div>
    </section>
  );
}
