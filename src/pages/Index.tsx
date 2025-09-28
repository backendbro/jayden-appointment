import React, { useEffect, useRef, useState } from "react";
import ClientScripts from "../components/ClientScripts";
import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";

export default function Index() {
  // modal + sidebars + hero slide state
  const [isContactOpen, setContactOpen] = useState(false);
  const [isDesktopSidebarOpen, setDesktopSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const nameRef = useRef(null);
  const mobileEmailRef = useRef(null);
  const mobileSubscribeRef = useRef(null);

  // Testimonial refs
  const testimTrackRef = useRef(null);
  const testimViewportRef = useRef(null);
  const [testimIndex, setTestimIndex] = useState(0);

  // HERO SLIDES (autoplay + manual controls)
  const slides = [
    {
      bg: "https://plus.unsplash.com/premium_photo-1661414779271-d8478e2944bc?w=1600&auto=format&fit=crop&q=80",
      title: "Premium Visa Services That Move Faster",
      sub: "White-glove, personalised immigration guidance for executives, families and corporate relocations — handled by senior advisors across multiple jurisdictions.",
      cta: [
        { href: "#services", text: "Get Started" },
        { href: "#contact", text: "Request Consultation", ghost: true },
      ],
    },
    {
      bg: "https://images.unsplash.com/photo-1653389527286-604ab2dd2471?w=1600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0",
      title: "Trusted Visa Advisors, Exceptional Outcomes",
      sub: "Precise documentation, embassy-ready submissions and an industry-leading success rate.",
      cta: [
        { href: "#services", text: "Our Services" },
        { href: "#contact", text: "Contact Us", ghost: true },
      ],
    },
    {
      bg: "https://www.dif.co/wp-content/uploads/2023/01/shutterstock_1612750594_hi-300x200.jpg",
      title: "Global Reach, Local Expertise",
      sub: "Our network of counsel and partners in-country gives you an edge where timing and compliance matter most.",
      cta: [
        { href: "#services", text: "Explore Services" },
        { href: "#pricing", text: "See Pricing", ghost: true },
      ],
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % slides.length);
    }, 5000); // autoplay every 5s
    return () => clearInterval(id);
  }, []);

  const goToSlide = (i) => setActiveSlide((i + slides.length) % slides.length);
  const prevSlide = () =>
    setActiveSlide((s) => (s - 1 + slides.length) % slides.length);
  const nextSlide = () => setActiveSlide((s) => (s + 1) % slides.length);

  // dynamic year
  useEffect(() => {
    const y = new Date().getFullYear();
    const el = document.getElementById("yr");
    const el2 = document.getElementById("yr2");
    if (el) el.textContent = String(y);
    if (el2) el2.textContent = String(y);
  }, []);

  // focus first field + prevent body scroll when modal open
  useEffect(() => {
    if (isContactOpen) {
      setTimeout(() => nameRef.current?.focus?.(), 60);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isContactOpen]);

  // keyboard handlers
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setContactOpen(false);
        setMobileSidebarOpen(false);
        setDesktopSidebarOpen(false);
      }
      if (e.key === "Enter" && document.activeElement?.id === "vpContactFab") {
        setContactOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // toast helper
  function flashToast(msg = "Done") {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2600);
  }

  // mobile subscribe in hamburger
  const handleMobileSubscribe = (e) => {
    e?.preventDefault();
    const email = mobileEmailRef.current?.value?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      flashToast("Please enter a valid email");
      return;
    }
    // pretend success
    mobileSubscribeRef.current?.reset?.();
    setMobileSidebarOpen(false);
    flashToast("Subscribed — check your inbox!");
    // TODO: call real API
  };

  const handleContactSubmit = (e) => {
    e?.preventDefault();
    flashToast("Message sent — we'll reply soon!");
    setContactOpen(false);
  };

  const openContact = () => setContactOpen(true);
  const closeContact = () => setContactOpen(false);
  const toggleMobileSidebar = () => setMobileSidebarOpen((s) => !s);
  const toggleDesktopSidebar = () => setDesktopSidebarOpen((s) => !s);

  /**
   * Testimonial scroller setup:
   * - makes .testim-track horizontally scrollable (overflow-x: auto)
   * - adds scroll-snap behaviour so each card centers nicely
   * - wires Prev/Next buttons to scroll to nearest card
   * - wires dots to navigate to a card
   * - updates active dot on scroll
   */
  useEffect(() => {
    const trackEl = document.getElementById("testimTrack");
    const viewportEl = document.getElementById("testimViewport");
    const dotsContainer = document.getElementById("testimDots");
    const prevBtn = document.getElementById("testimPrev");
    const nextBtn = document.getElementById("testimNext");

    if (!trackEl || !viewportEl) return;

    // ensure track is scrollable and configured (non-destructive)
    trackEl.style.display = "flex";
    trackEl.style.overflowX = "auto";
    trackEl.style.scrollSnapType = "x mandatory";
    trackEl.style.scrollBehavior = "smooth";
    trackEl.style.setProperty("-webkit-overflow-scrolling", "touch");
    trackEl.style.gap = "18px";

    const cardNodes = Array.from(trackEl.querySelectorAll(".testim-card"));
    if (cardNodes.length === 0) return;

    // Make sure cards use CSS widths (don't override). Still set snap align and prevent shrinking.
    cardNodes.forEach((card) => {
      card.style.flex = "0 0 auto"; // leave width to CSS breakpoints
      card.style.scrollSnapAlign = "center";
      // clear any inline width that may have been set previously
      card.style.minWidth = "";
      card.style.width = "";
    });

    // Build dots
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      cardNodes.forEach((c, i) => {
        const btn = document.createElement("button");
        btn.className = "testim-dot" + (i === 0 ? " active" : "");
        btn.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
        btn.addEventListener("click", () => {
          const left = c.offsetLeft - (trackEl.clientWidth - c.clientWidth) / 2;
          trackEl.scrollTo({ left, behavior: "smooth" });
        });
        dotsContainer.appendChild(btn);
      });
    }

    // find nearest centered index
    const findNearestIndex = () => {
      const center = trackEl.scrollLeft + trackEl.clientWidth / 2;
      let nearestIdx = 0;
      let nearestDist = Infinity;
      cardNodes.forEach((c, i) => {
        const cCenter = c.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(cCenter - center);
        if (d < nearestDist) {
          nearestDist = d;
          nearestIdx = i;
        }
      });
      return nearestIdx;
    };

    // scroll handler
    let raf = 0;
    const onScroll = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const idx = findNearestIndex();
        setTestimIndex(idx);
        if (dotsContainer) {
          Array.from(dotsContainer.children).forEach((btn, i) => {
            btn.classList.toggle("active", i === idx);
          });
        }
      });
    };
    trackEl.addEventListener("scroll", onScroll, { passive: true });

    // wheel handler (convert vertical to horizontal)
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        trackEl.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    trackEl.addEventListener("wheel", onWheel, { passive: false });

    // prev / next
    const scrollToIndex = (i) => {
      const idx = Math.max(0, Math.min(cardNodes.length - 1, i));
      const c = cardNodes[idx];
      if (!c) return;
      const left = c.offsetLeft - (trackEl.clientWidth - c.clientWidth) / 2;
      trackEl.scrollTo({ left, behavior: "smooth" });
    };
    const prevHandler = () => scrollToIndex(findNearestIndex() - 1);
    const nextHandler = () => scrollToIndex(findNearestIndex() + 1);
    prevBtn?.addEventListener("click", prevHandler);
    nextBtn?.addEventListener("click", nextHandler);

    // center first card on mount
    setTimeout(() => scrollToIndex(0), 50);

    // cleanup
    return () => {
      trackEl.removeEventListener("scroll", onScroll);
      trackEl.removeEventListener("wheel", onWheel);
      prevBtn?.removeEventListener("click", prevHandler);
      nextBtn?.removeEventListener("click", nextHandler);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="float-blob blob-a pointer-events-none"></div>
      <div className="float-blob blob-b pointer-events-none"></div>

      <nav id="mainNav">
        <div className="mx-auto nav-container px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                id="mobile-menu-toggle"
                onClick={toggleMobileSidebar}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="open mobile menu"
              >
                <svg
                  className="w-6 h-6 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <a href="/" className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=120&q=80&auto=format&fit=crop"
                  className="w-10 h-10 rounded-md object-cover shadow-sm"
                  alt="VisaPremium logo"
                  loading="lazy"
                />
                <span className="hidden md:inline-block text-lg font-semibold">
                  VisaPremiums
                </span>
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-sm font-medium hover:text-primary transition"
              >
                Home
              </a>
              <a
                href="#services"
                className="text-sm font-medium hover:text-primary transition"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-primary transition"
              >
                About
              </a>

              <Link
                to="/appointment"
                className="vp-cta-appointment"
                id="vpAppointmentCta"
                aria-label="Make an appointment — open booking page"
              >
                <span className="vp-cta-icon" aria-hidden="true">
                  <i className="fas fa-calendar-check"></i>
                </span>
                <span>Make an Appointment</span>
                <span className="vp-cta-badge" aria-hidden="true">
                  Book
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center">
              <button
                id="desktop-menu-toggle"
                onClick={toggleDesktopSidebar}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="open desktop sidebar"
              >
                <svg
                  className="w-5 h-5 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside
        id="desktop-sidebar"
        className={
          "fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 " +
          (isDesktopSidebarOpen ? "translate-x-0" : "translate-x-full")
        }
        aria-hidden={!isDesktopSidebarOpen}
      >
        <div className="p-8 mt-20 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-3xl font-extrabold gradient-text">
                  Hello Friends
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Join our newsletter for priority processing slots, embassy
                  tips and exclusive offers.
                </p>
              </div>
              <button
                id="close-desktop-sidebar"
                onClick={() => setDesktopSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form
              id="subscribeForm"
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                flashToast("Subscribed!");
              }}
            >
              <label className="text-xs font-medium text-gray-600">Email</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky"
              />
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-3 cta-btn"
              >
                Subscribe & Get Priority
              </button>
            </form>

            <div className="mt-6 text-sm text-gray-500">
              We respect your privacy. Unsubscribe anytime.
            </div>

            <div className="mt-8">
              <h4 className="font-semibold mb-3">Follow us</h4>
              <div className="flex gap-4 text-gray-600">
                <a
                  href="#"
                  className="hover:text-primary"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="hover:text-primary" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="hover:text-primary"
                  aria-label="LinkedIn"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            &copy; <span id="yr"></span> VisaPremium — All rights reserved.
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar — now contains subscribe action + inputs (with comfortable padding) */}
      <aside
        id="mobile-sidebar"
        className={
          "fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform transition-transform duration-300 " +
          (isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
        aria-hidden={!isMobileSidebarOpen}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <a href="#" className="text-lg font-bold text-dark">
              VisaPremium
            </a>
            <button
              id="close-mobile-sidebar"
              onClick={() => setMobileSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <nav className="flex flex-col gap-3 mb-4">
            <a href="#" className="py-2 font-medium hover:text-primary">
              Home
            </a>
            <a href="#services" className="py-2 font-medium hover:text-primary">
              Services
            </a>
            <a href="#about" className="py-2 font-medium hover:text-primary">
              About
            </a>
            <Link
              to="/appointment"
              className="py-2 font-medium hover:text-primary"
            >
              Appointment
            </Link>
          </nav>

          {/* Mobile subscribe module copied into hamburger with extra inner padding */}
          <div className="mt-4 border-t border-gray-100 pt-4 px-2">
            <h4 className="font-semibold">Join our newsletter</h4>
            <p className="text-sm text-gray-600 mt-2">
              Priority slots, embassy tips and exclusive offers — delivered to
              your inbox.
            </p>

            <form
              ref={mobileSubscribeRef}
              onSubmit={handleMobileSubscribe}
              className="mt-3 flex flex-col gap-3 px-1"
            >
              <input
                ref={mobileEmailRef}
                type="email"
                name="email"
                placeholder="you@domain.com"
                required
                className="vp-field px-4"
              />
              <button type="submit" className="vp-primary px-4">
                Subscribe
              </button>
            </form>

            <div className="mt-3 text-sm text-gray-500">
              We respect your privacy.
            </div>

            <div className="mt-4 flex gap-3">
              <a href="#" className="hover:text-primary" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-primary" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-primary" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>
      </aside>

      <main className="pt-16">
        {/* HERO: now dynamically renders slides and supports autoplay + manual controls */}
        <section id="heroSection" className="relative">
          <div id="slides" className="absolute inset-0">
            {slides.map((s, i) => (
              <div
                key={i}
                className={`hero-slide ${
                  i === activeSlide ? "active hero-visible" : ""
                }`}
                style={{
                  backgroundImage: `url(${s.bg})`,
                }}
                role="img"
                aria-hidden={i === activeSlide ? "false" : "true"}
              >
                <div className="hero-overlay" aria-hidden></div>
                <div className="h-full flex items-center justify-center px-6">
                  <div className="text-center max-w-3xl">
                    <h1
                      className={`hero-heading text-white font-extrabold ${
                        i === activeSlide ? "hero-visible" : ""
                      } text-3xl sm:text-4xl md:text-6xl`}
                    >
                      {s.title}
                    </h1>
                    <p
                      className={`mt-4 sm:mt-6 hero-sub text-white max-w-2xl mx-auto ${
                        i === activeSlide ? "hero-visible" : ""
                      } text-base sm:text-lg md:text-xl`}
                    >
                      {s.sub}
                    </p>

                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3">
                      {s.cta.map((c, idx) => {
                        // make CTA styling explicit so it matches theme consistently
                        const className = c.ghost
                          ? "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-white/10 text-white backdrop-blur-sm border border-white/10 hover:bg-white/20 w-full sm:w-auto"
                          : "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 bg-primary text-white font-semibold hover:bg-primary-dark w-full sm:w-auto";

                        return (
                          <a key={idx} href={c.href} className={className}>
                            {c.text}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* left/right arrows */}
          <button
            onClick={prevSlide}
            className="hero-arrow absolute top-1/2 -translate-y-1/2 arrow-left left-4 md:left-12"
            aria-label="previous slide"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            onClick={nextSlide}
            className="hero-arrow absolute top-1/2 -translate-y-1/2 arrow-right right-4 md:right-12"
            aria-label="next slide"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          {/* indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full ${
                  i === activeSlide ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </section>

        {/* Intruding cards — made responsive so they don't crash the hero on mobile.
            - on mobile the block is pushed down (mt-6)
            - on md+ we keep a subtle overlap (-mt-6)
            - cards are given sharp edges (rounded-none) and reduced width on md+ so they don't feel too wide
        */}
        <div className="relative intrude-wrapper px-4 mt-6 md:-mt-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 intrude-card justify-items-center">
              <div className="card glass p-6 card-hover flex flex-col justify-between bg-white w-full md:w-[320px] rounded-none min-h-[220px] shadow-sm">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center text-2xl">
                      💼
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Fast Processing</h4>
                      <p className="text-sm text-gray-600">
                        Priority appointments, document checklists, and
                        embassy-ready submissions — we shave weeks off timelines
                        for busy clients.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  Available for executives, families and urgent cases.
                </div>
              </div>

              <div className="card glass bg-white p-6 card-hover flex flex-col justify-between w-full md:w-[320px] rounded-none min-h-[220px] shadow-sm">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center text-2xl">
                      🌍
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Global Coverage</h4>
                      <p className="text-sm text-gray-600">
                        Local counsel and in-country partners across major
                        embassies; bespoke strategies by destination.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  Consulate navigation, appointment handling and translation
                  support.
                </div>
              </div>

              <div className="card glass bg-white p-6 card-hover flex flex-col justify-between w-full md:w-[320px] rounded-none min-h-[220px] shadow-sm">
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center text-2xl">
                      🤝
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        White-Glove Service
                      </h4>
                      <p className="text-sm text-gray-600">
                        Dedicated case manager, interview prep and proactive
                        milestone updates for every client.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  Secure document handling and fast responses.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ABOUT / Trusted Experience — reduce bottom spacing and make sure only once */}
        <section id="about" className="max-w-6xl mx-auto px-6 py-12">
          <div className="stats-wrap bg-white rounded-3xl p-6 md:p-8 shadow-md grid grid-cols-1 md:grid-cols-3 items-center gap-6">
            <div className="animate-f-left">
              <h3 className="text-2xl font-extrabold">
                Trusted Experience, Measured Results
              </h3>
              <p className="mt-3 text-gray-600">
                We combine legal expertise, process engineering and a
                client-first approach to deliver predictable outcomes.
              </p>
            </div>

            <div className="flex items-center justify-center mt-4 md:mt-0 animate-f-m">
              <div className="flex flex-col items-center">
                <div className="badge-circle">
                  <span className="badge-number">24</span>
                </div>
                <div className="badge-sub">YEARS OF EXPERIENCE</div>
              </div>
            </div>

            <div className="text-left md:text-right animate-f-right">
              <div className="text-4xl sm:text-5xl font-extrabold">920</div>
              <div className="text-sm font-semibold tracking-wide text-dark/80 mt-1">
                INVESTMENT PROFESSIONALS
              </div>
              <p className="mt-3 text-gray-600 max-w-sm md:ml-auto">
                Our employees are the energy that drives us forward. Their
                commitment, expertise and diversity are the key to DIF’ success.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials (now scrollable & controlled)
            IMPORTANT: cards were given responsive widths so that on md+ three cards are visible in the viewport without horizontal overflow.
        */}
        <section className="testimonials-section">
          <div className="testimonials-wrap">
            <div className="testim-hero px-4">
              <div>
                <div className="testim-title">What our clients say</div>
                <div className="testim-sub">
                  Real outcomes, discreet handling — stories from teams and
                  families we've helped.
                </div>
              </div>

              <div className="rating-pill hidden sm:inline-flex">
                <i className="fas fa-star" style={{ fontSize: "0.95rem" }}></i>{" "}
                4.9
              </div>
            </div>

            <div
              className="testim-viewport px-4"
              id="testimViewport"
              ref={testimViewportRef}
            >
              <div className="holo-shimmer" aria-hidden></div>

              <div
                className="testim-track"
                id="testimTrack"
                ref={testimTrackRef}
              >
                {/* Each testimonial gets a responsive width: 100% on mobile, ~32% on md+ so 3 fit in viewport */}
                <article
                  className="testim-card w-full md:w-[32%] rounded-2xl bg-white p-4 shadow-sm"
                  data-index="0"
                >
                  <div className="testim-quote">
                    “They unlocked priority slots, handled every embassy
                    interaction, and saved our launch window — professional and
                    relentless.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60&auto=format&fit=crop"
                        alt="L. Morgan"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="testim-name">L. Morgan</div>
                      <div className="testim-role">
                        Head of People — Global SaaS
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <div className="text-sm text-gray-500">★★★★★</div>
                    </div>
                  </div>
                </article>

                <article
                  className="testim-card w-full md:w-[32%] rounded-2xl bg-white p-4 shadow-sm"
                  data-index="1"
                >
                  <div className="testim-quote">
                    “They rewrote our company narrative to match adjudicator
                    expectations. Result: embassy approved in record time.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://media.istockphoto.com/id/1350800599/photo/happy-indian-business-man-leader-manager-standing-in-office-headshot-portrait.webp?a=1&b=1&s=612x612&w=0&k=20&c=cGWD5EMDF_k_juW9FltuGmfqM-4mdyLAg2UcGLbZAiY="
                        alt="R. Kapoor"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="testim-name">R. Kapoor</div>
                      <div className="testim-role">Founder & CEO — Fintech</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-sm text-gray-500">★★★★★</div>
                    </div>
                  </div>
                </article>

                <article
                  className="testim-card w-full md:w-[32%] rounded-2xl bg-white p-4 shadow-sm"
                  data-index="2"
                >
                  <div className="testim-quote">
                    “A complex family relocation with sensitive documents —
                    handled with speed, transparency and empathy.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60&auto=format&fit=crop"
                        alt="A. Daniels"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="testim-name">A. Daniels</div>
                      <div className="testim-role">Private Client</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-sm text-gray-500">★★★★★</div>
                    </div>
                  </div>
                </article>

                <article
                  className="testim-card w-full md:w-[32%] rounded-2xl bg-white p-4 shadow-sm"
                  data-index="3"
                >
                  <div className="testim-quote">
                    “They turned a last-minute embassy block into a same-week
                    approval — our M&A go-live was saved. Honestly felt like
                    magic.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://media.istockphoto.com/id/1552851631/photo/busy-middle-aged-business-man-sitting-at-desk-working-on-laptop-writing.webp?a=1&b=1&s=612x612&w=0&k=20&c=w7hl9SQGAjBEp3KLlvZ71k78lnGI82hoyRfIhYVUqiI="
                        alt="C. Reyes"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <div className="testim-name">C. Reyes</div>
                      <div className="testim-role">COO — Series B</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-sm text-gray-500">★★★★★</div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div className="testim-controls px-4" aria-hidden="false">
              <button
                className="testim-btn"
                id="testimPrev"
                aria-label="previous testimonial"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <div
                id="testimDots"
                className="flex items-center gap-2 px-2"
              ></div>
              <button
                className="testim-btn"
                id="testimNext"
                aria-label="next testimonial"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div
              className="confetti"
              aria-hidden="true"
              style={{ opacity: "0.22", marginTop: "8px" }}
            >
              <svg
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0" stopColor="#38bdf8" stopOpacity="0.12" />
                    <stop offset="1" stopColor="#dc143c" stopOpacity="0.12" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="10" fill="url(#g1)" />
              </svg>
            </div>
          </div>
        </section>

        <section id="services" className="py-16 bg-light">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold">Our Visa Services</h2>
              <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
                We design bespoke journeys for executives, families and
                corporations — combining legal insight with operational
                delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
                <div className="text-4xl text-primary mb-4">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h4 className="font-semibold text-lg">
                  Executive &amp; Business Visas
                </h4>
                <p className="text-gray-600 mt-3">
                  Strategic document preparation, invitation handling and
                  accelerated embassy engagement for busy leaders.
                </p>
                <ul className="mt-4 text-sm text-gray-500 space-y-1">
                  <li>Priority appointment booking</li>
                  <li>Interview coaching</li>
                  <li>Dedicated case manager</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
                <div className="text-4xl text-primary mb-4">
                  <i className="fas fa-users"></i>
                </div>
                <h4 className="font-semibold text-lg">
                  Family &amp; Dependent Visas
                </h4>
                <p className="text-gray-600 mt-3">
                  Sensitive handling for family reunification, spousal and
                  dependent routes with tailored timelines.
                </p>
                <ul className="mt-4 text-sm text-gray-500 space-y-1">
                  <li>Document audits</li>
                  <li>Local liaison for biometrics</li>
                  <li>Post-arrival compliance guidance</li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg card-hover">
                <div className="text-4xl text-primary mb-4">
                  <i className="fas fa-building"></i>
                </div>
                <h4 className="font-semibold text-lg">Corporate Relocations</h4>
                <p className="text-gray-600 mt-3">
                  End-to-end migration services for mass transfers, with
                  tracking dashboards and employee briefings.
                </p>
                <ul className="mt-4 text-sm text-gray-500 space-y-1">
                  <li>Volume handling &amp; tracking</li>
                  <li>Employee briefings &amp; support</li>
                  <li>Partnered payroll &amp; tax triage</li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-10">
              <a
                href="#"
                className="vp-contact-trigger inline-block rounded-full px-6 py-3 cta-btn cta-w"
              >
                Request a Consultation
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-sky/10 to-primary/6">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-extrabold">
              Priority processing &amp; insider tips
            </h3>
            <p className="mt-3 text-gray-600">
              Subscribe to receive priority invites, document checklists and
              embassy updates.
            </p>

            <form
              id="newsletterForm"
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full sm:w-auto flex-1 max-w-md rounded-lg px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-sky"
              />
              <button className="rounded-lg px-6 py-3 cta-btn cta-w">
                Subscribe
              </button>
            </form>

            <div className="mt-4 text-sm text-gray-500">
              No spam. Exclusive offers and priority slots only.
            </div>
          </div>
        </section>

        <footer className="bg-dark text-white py-12">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-lg">VisaPremium</h4>
              <p className="text-gray-300 mt-2">
                Premium visa advisory for executives and corporates. Fast,
                discreet and reliable.
              </p>
            </div>
            <div>
              <h5 className="font-semibold">Services</h5>
              <ul className="mt-3 text-sm text-gray-400 space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Executive Visas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Family Visas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Corporate Relocations
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold">Quick Links</h5>
              <ul className="mt-3 text-sm text-gray-400 space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold">Contact</h5>
              <address className="not-italic text-sm text-gray-400 mt-2">
                <p>123 Visa Street</p>
                <p>New York, NY 10001</p>
                <p className="mt-2">+1 (555) 123-4567</p>
                <p>info@visapremium.com</p>
              </address>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400">
            <p>
              &copy; <span id="yr2"></span> VisaPremium. All rights reserved.
            </p>
          </div>
        </footer>
      </main>

      {/* Floating contact FAB */}
      <button
        id="vpContactFab"
        data-fab="true"
        className="vp-fab"
        aria-label="Contact us"
        onClick={openContact}
      >
        <span className="vp-pulse" aria-hidden="true"></span>
        <i className="fas fa-comment-dots" style={{ fontSize: "20px" }}></i>
      </button>

      {/* clickable label */}
      <div
        className="vp-fab-label"
        role="button"
        aria-hidden="false"
        onClick={openContact}
      >
        <div style={{ fontWeight: "700" }}>Need help?</div>
        <div style={{ fontSize: "11px", color: "#6b7280" }}>
          Chat, call or send a message
        </div>
      </div>

      {/* Contact modal — improved responsiveness + icon padding */}
      <div
        id="vpContactModal"
        className={`vp-modal ${isContactOpen ? "vp-open" : "vp-hidden"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vpContactTitle"
      >
        <div
          className="vp-backdrop"
          id="vpBackdrop"
          onClick={closeContact}
          style={{ cursor: "pointer" }}
        ></div>

        <div
          className="vp-panel"
          id="vpPanel"
          role="document"
          aria-hidden={!isContactOpen}
        >
          <button
            className="vp-close"
            id="vpClose"
            onClick={closeContact}
            aria-label="Close contact form"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="vp-panel-body">
            <div className="flex gap-3 items-start mb-2">
              <div className="vp-icon">
                <i className="fas fa-headset"></i>
              </div>

              <div style={{ flex: "1" }}>
                <h3 id="vpContactTitle">Let's get you help — fast</h3>
                <p className="small">
                  Choose a quick action or leave a message and we'll reply ASAP.
                </p>
              </div>
            </div>

            <form
              id="vpContactForm"
              style={{ marginTop: "6px" }}
              onSubmit={handleContactSubmit}
            >
              <div className="vp-grid vp-grid-2">
                <input
                  id="vp_name"
                  ref={nameRef}
                  className="vp-field"
                  name="name"
                  placeholder="Your name"
                  required
                />
                <input
                  id="vp_email"
                  className="vp-field"
                  name="email"
                  type="email"
                  placeholder="you@domain.com"
                  required
                />
              </div>

              <select
                id="vp_topic"
                className="vp-select"
                name="topic"
                style={{ marginTop: "10px" }}
              >
                <option value="general">General question</option>
                <option value="pricing">Pricing & Packages</option>
                <option value="urgent">Urgent / Priority</option>
                <option value="corporate">Corporate Relocation</option>
              </select>

              <textarea
                id="vp_message"
                className="vp-textarea"
                name="message"
                rows={4}
                placeholder="How can we help?"
                style={{ marginTop: "10px" }}
              ></textarea>

              <div className="vp-actions">
                <button type="submit" className="vp-primary">
                  Send message
                </button>
                <button id="vpQuickCall" type="button" className="vp-secondary">
                  Call
                </button>
                <button id="vpWhatsApp" type="button" className="vp-secondary">
                  WhatsApp
                </button>
              </div>

              <div
                style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px" }}
              >
                By contacting you agree to our{" "}
                <a href="#" style={{ color: "#dc143c", fontWeight: 700 }}>
                  privacy policy
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        id="vpToast"
        className={`vp-toast ${showToast ? "vp-show" : ""}`}
        role="status"
        aria-live="polite"
      >
        <div
          style={{
            background: "#082a3a",
            color: "white",
            padding: "10px 14px",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
          }}
        >
          {toastMsg}
        </div>
      </div>

      <ClientScripts />
    </>
  );
}
