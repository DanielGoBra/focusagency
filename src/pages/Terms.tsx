import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrandPage } from "../components/Dark";
import { SiteFooter } from "../components/Site";
import { LEGAL, type LegalBlock } from "../content/legal";

function Rich({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi);
  return parts.map((part, index) => {
    if (/^https?:\/\//i.test(part)) {
      return (
        <a key={index} href={part} className="font-semibold text-accent-ink">
          {part}
        </a>
      );
    }
    if (part.includes("@")) {
      return (
        <a key={index} href={`mailto:${part}`} className="font-semibold text-accent-ink">
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function Blocks({ blocks }: { blocks: LegalBlock[] }) {
  return blocks.map((block, index) => {
    if (block.kind === "list") {
      return (
        <ul key={index} className="list-disc space-y-2 pl-5">
          {block.items.map((item) => (
            <li key={item}>
              <Rich text={item} />
            </li>
          ))}
        </ul>
      );
    }
    if (block.kind === "defs") {
      return (
        <dl key={index} className="space-y-4">
          {block.items.map((item) => (
            <div key={item.term}>
              <dt className="font-extrabold text-fg">{item.term}</dt>
              <dd className="mt-1">
                <Rich text={item.text} />
              </dd>
            </div>
          ))}
        </dl>
      );
    }
    return (
      <p key={index}>
        <Rich text={block.text} />
      </p>
    );
  });
}

export function Terms() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const node = document.getElementById(hash.slice(1));
    if (!node) return;
    const header = document.querySelector("header");
    const offset = (header?.getBoundingClientRect().height ?? 96) + 20;
    const top = node.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "auto" });
  }, [hash]);

  return (
    <BrandPage title="Términos y privacidad · FocusChat" sections={[]}>
      <main className="relative z-10 mx-auto max-w-3xl px-5 py-12 md:py-16">
        <p className="text-xs font-bold tracking-[0.18em] text-accent-ink uppercase">FocusChat</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">Términos y privacidad</h1>
        <p className="mt-4 text-base leading-relaxed text-fg/80">
          Aquí está el documento completo de FocusChat, actualizado el 24 de octubre de 2026. Cubre el uso de la plataforma y el tratamiento de los datos.
        </p>
        <nav className="mt-6 flex flex-wrap gap-3" aria-label="Documentos">
          {LEGAL.map((document) => (
            <a key={document.id} href={`#${document.id}`} className="rounded-full border border-current/20 px-4 py-2 text-sm font-extrabold text-accent-ink">
              {document.id === "condiciones" ? "Términos y condiciones" : "Política de privacidad"}
            </a>
          ))}
          <a href="/legal/terminos-focuschat.pdf" className="rounded-full border border-current/20 px-4 py-2 text-sm font-extrabold text-fg">
            Descargar PDF
          </a>
        </nav>

        <div className="mt-12 space-y-16 text-base leading-relaxed text-fg/80">
          {LEGAL.map((document) => (
            <article key={document.id} id={document.id} className="scroll-mt-32 space-y-6">
              <header>
                <h2 className="text-3xl font-extrabold tracking-tight text-fg">{document.title}</h2>
                <p className="mt-2 text-sm font-bold text-fg/60">{document.updated}</p>
              </header>
              {document.lead.map((paragraph) => (
                <p key={paragraph}>
                  <Rich text={paragraph} />
                </p>
              ))}
              {document.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-32 space-y-4">
                  <h3 className="text-xl font-extrabold text-fg">{section.title}</h3>
                  <Blocks blocks={section.blocks} />
                </section>
              ))}
            </article>
          ))}
          <Link to="/" className="inline-flex font-bold text-accent-ink">
            Volver a Focuschat
          </Link>
        </div>
      </main>
      <SiteFooter />
    </BrandPage>
  );
}
