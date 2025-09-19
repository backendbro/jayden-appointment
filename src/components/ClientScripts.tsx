// src/components/ClientScripts.tsx
import { useEffect } from "react";

export default function ClientScripts(): null {
  useEffect(() => {
    // set years
    const yr = document.getElementById("yr");
    const yr2 = document.getElementById("yr2");
    if (yr) yr.textContent = String(new Date().getFullYear());
    if (yr2) yr2.textContent = String(new Date().getFullYear());

    // sidebars
    const desktopMenuToggle = document.getElementById("desktop-menu-toggle");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
    const desktopSidebar = document.getElementById("desktop-sidebar");
    const mobileSidebar = document.getElementById("mobile-sidebar");
    const closeDesktopSidebar = document.getElementById("close-desktop-sidebar");
    const closeMobileSidebar = document.getElementById("close-mobile-sidebar");

    desktopMenuToggle?.addEventListener("click", () =>
      desktopSidebar?.classList.toggle("translate-x-full")
    );
    closeDesktopSidebar?.addEventListener("click", () =>
      desktopSidebar?.classList.add("translate-x-full")
    );
    mobileMenuToggle?.addEventListener("click", () =>
      mobileSidebar?.classList.toggle("-translate-x-full")
    );
    closeMobileSidebar?.addEventListener("click", () =>
      mobileSidebar?.classList.add("-translate-x-full")
    );

    /* ===== HERO SLIDER (simplified) ===== */
    try {
      const slides = Array.from(document.querySelectorAll<HTMLElement>(".hero-slide"));
      const bullets = Array.from(document.querySelectorAll<HTMLElement>("[data-index]"));
      let current = 0;
      let auto: number | undefined;

      function applyBg(slide: HTMLElement) {
        const bg = slide.getAttribute("data-bg");
        if (bg) slide.style.backgroundImage = `url('${bg}')`;
      }
      slides.forEach(applyBg);

      function revealHeroText(slideEl: HTMLElement) {
        const heading = slideEl.querySelector(".hero-heading") as HTMLElement | null;
        const sub = slideEl.querySelector(".hero-sub") as HTMLElement | null;
        heading?.classList.remove("hero-visible");
        sub?.classList.remove("hero-visible");
        setTimeout(() => {
          heading?.classList.add("hero-visible");
          sub?.classList.add("hero-visible");
        }, 90);
      }

      function showSlide(i: number) {
        slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
        bullets.forEach((b, idx) => b.classList.toggle("bg-white/90", idx === i));
        if (slides[i]) revealHeroText(slides[i]);
        current = i;
      }

      function next() {
        showSlide((current + 1) % slides.length);
      }
      function prev() {
        showSlide((current - 1 + slides.length) % slides.length);
      }

      document.getElementById("next-slide")?.addEventListener("click", () => {
        next();
        resetAuto();
      });
      document.getElementById("prev-slide")?.addEventListener("click", () => {
        prev();
        resetAuto();
      });
      bullets.forEach((b, idx) =>
        b.addEventListener("click", () => {
          showSlide(idx);
          resetAuto();
        })
      );

      function startAuto() {
        auto = window.setInterval(next, 7000);
      }
      function resetAuto() {
        if (auto) clearInterval(auto);
        startAuto();
      }

      if (slides.length) {
        showSlide(0);
        startAuto();
      }
    } catch (e) {
      console.error("Hero slider init failed", e);
    }

    /* ========== INTERSECTION OBSERVER: reveal animate-f-* elements ========== */
    let io: IntersectionObserver | null = null;
    (function setupIntersection() {
      const left = Array.from(document.querySelectorAll<HTMLElement>(".animate-f-left"));
      const mid = Array.from(document.querySelectorAll<HTMLElement>(".animate-f-m"));
      const right = Array.from(document.querySelectorAll<HTMLElement>(".animate-f-right"));
      const all = [...left, ...mid, ...right];

      if (!all.length) return;

      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const el = entry.target as HTMLElement;
              if (el.classList.contains("animate-f-left")) el.classList.add("inview-f-left");
              if (el.classList.contains("animate-f-m")) el.classList.add("inview-f-m");
              if (el.classList.contains("animate-f-right")) el.classList.add("inview-f-right");
              observer.unobserve(entry.target);
            });
          },
          { threshold: 0.18 }
        );
        all.forEach((el) => io?.observe(el));
      } else {
        // older browsers fallback: reveal immediately
        all.forEach((el) => {
          if (el.classList.contains("animate-f-left")) el.classList.add("inview-f-left");
          if (el.classList.contains("animate-f-m")) el.classList.add("inview-f-m");
          if (el.classList.contains("animate-f-right")) el.classList.add("inview-f-right");
        });
      }
    })();

    /* ===== VP CONTACT POPUP + forms (kept as you had) ===== */
    try {
      const fab = document.getElementById("vpContactFab");
      const modal = document.getElementById("vpContactModal");
      const backdrop = document.getElementById("vpBackdrop");
      const panel = document.getElementById("vpPanel");
      const closeBtn = document.getElementById("vpClose");
      const form = document.getElementById("vpContactForm") as HTMLFormElement | null;
      const toast = document.getElementById("vpToast");
      const quickCall = document.getElementById("vpQuickCall");
      const whatsappBtn = document.getElementById("vpWhatsApp");

      const PHONE_NUMBER = "+15551234567";
      const WHATSAPP_NUMBER = "15551234567";

      let previouslyFocused: Element | null = null;

      function openModal() {
        previouslyFocused = document.activeElement;
        modal?.classList.remove("vp-hidden");
        modal?.classList.add("vp-open");
        document.body.style.overflow = "hidden";
        setTimeout(() => (document.getElementById("vp_name") as HTMLElement | null)?.focus(), 80);
        document.addEventListener("focus", enforceFocus, true);
      }
      function closeModal() {
        modal?.classList.remove("vp-open");
        document.body.style.overflow = "";
        document.removeEventListener("focus", enforceFocus, true);
        setTimeout(() => {
          modal?.classList.add("vp-hidden");
          (previouslyFocused as HTMLElement | null)?.focus?.();
        }, 260);
      }
      function enforceFocus(e: FocusEvent) {
        if (!modal?.classList.contains("vp-hidden") && !modal.contains(e.target as Node)) {
          e.stopPropagation();
          panel?.querySelector("input,textarea,button,select")?.focus();
        }
      }

      fab?.addEventListener("click", openModal);
      closeBtn?.addEventListener("click", closeModal);
      backdrop?.addEventListener("click", closeModal);
      window.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape" && !modal?.classList.contains("vp-hidden")) closeModal();
      });

      quickCall?.addEventListener("click", () => {
        window.location.href = `tel:${PHONE_NUMBER}`;
      });
      whatsappBtn?.addEventListener("click", () => {
        const text = encodeURIComponent("Hi — I need help with my visa.");
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank");
      });

      function showToast(msg = "Done", ms = 2600) {
        if (!toast) return;
        toast.innerHTML =
          '<div style="background:#fff;padding:10px 14px;border-radius:10px;border:1px solid rgba(2,6,23,0.06);box-shadow:0 8px 26px rgba(2,6,23,0.08)">' +
          msg +
          "</div>";
        toast.classList.add("vp-show");
        setTimeout(() => toast.classList.remove("vp-show"), ms);
      }

      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const name = (form.querySelector('[name="name"]') as HTMLInputElement).value.trim();
          const email = (form.querySelector('[name="email"]') as HTMLInputElement).value.trim();
          if (!name || !email) {
            showToast("Please provide your name and email.");
            return;
          }
          showToast("Thanks — your message is on its way!");
          form.reset();
          setTimeout(closeModal, 900);
        });
      }
    } catch (e) {
      console.error("VP popup init failed", e);
    }

    // cleanup: disconnect IntersectionObserver & remove any one-off intervals/listeners if needed
    return () => {
      if (io) io.disconnect();
      // note: for brevity we didn't store every listener reference above to remove individually.
      // If you need perfect teardown (e.g. for SSR/hot-reload), keep references and remove here.
    };
  }, []);

  return null;
}
