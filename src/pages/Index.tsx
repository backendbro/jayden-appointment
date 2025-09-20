import ClientScripts from "../components/ClientScripts";
import "../styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Link } from "react-router-dom";

export default function Index() {
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
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                aria-label="menu"
              >
                <svg
                  className="w-6 h-6 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>

              <a href="/" className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1521791055366-0d553872125f?w=120&q=80&auto=format&fit=crop"
                  className="w-10 h-10 rounded-md object-cover shadow-sm"
                  alt="logo"
                />
                <span className="bg-red hidden md:inline-block text-lg font-semibold">
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
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="open sidebar"
              >
                <svg
                  className="w-5 h-5 text-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="desktop-sidebar"
        className="fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transform translate-x-full"
      >
        <div className="p-8 mt-20 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3
                  className="text-3xl font-extrabold"
                  style={{
                    background: "linear-gradient(90deg, #38bdf8, #dc143c)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Hello Friends
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  Join our newsletter for priority processing slots, embassy
                  tips and exclusive offers.
                </p>
              </div>
              <button
                id="close-desktop-sidebar"
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form id="subscribeForm" className="mt-6 space-y-4">
              <label className="text-xs font-medium text-gray-600">Email</label>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky"
              />
              <button
                type="submit"
                className="w-full rounded-lg px-4 py-3 bg-gradient-to-r from-sky to-primary text-white font-semibold shadow cta-btn"
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
                <a href="#" className="hover:text-primary">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="hover:text-primary">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="hover:text-primary">
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

      <aside
        id="mobile-sidebar"
        className="fixed top-0 left-0 h-full bg-white shadow-xl z-50 transform -translate-x-full"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <a href="#" className="text-lg font-bold text-dark">
              VisaPremium
            </a>
            <button
              id="close-mobile-sidebar"
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav className="flex flex-col gap-3">
            <a href="#" className="py-2 font-medium hover:text-primary">
              Home
            </a>
            <a href="#services" className="py-2 font-medium hover:text-primary">
              Services
            </a>
            <a href="#about" className="py-2 font-medium hover:text-primary">
              About
            </a>

            <a
              href="appointment.html"
              className="py-2 font-medium hover:text-primary"
            >
              Appointment
            </a>
          </nav>
        </div>
      </aside>

      <main className="pt-16">
        <section id="heroSection" className="relative">
          <div id="slides" className="absolute inset-0">
            <div
              className="hero-slide"
              data-bg="https://images.unsplash.com/photo-1653389527286-604ab2dd2471?w=1600&auto=format&fit=crop&q=80&ixlib=rb-4.1.0"
            >
              <div className="hero-overlay" aria-hidden></div>
              <div className="h-full flex items-center justify-center px-6">
                <div className="text-center max-w-3xl">
                  <h1 className="text-4xl md:text-6xl hero-heading text-white font-extrabold">
                    Trusted Visa Advisors, Exceptional Outcomes
                  </h1>
                  <p className="mt-6 text-lg md:text-xl hero-sub text-white max-w-2xl mx-auto">
                    Precise documentation, embassy-ready submissions and an
                    industry-leading success rate.
                  </p>
                  <div className="mt-8 flex justify-center gap-4">
                    <a
                      href="#services"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-sky to-primary text-white font-semibold shadow cta-btn"
                    >
                      Our Services
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 border-2 border-white/30 text-white font-medium cta-btn cta-ghost"
                    >
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero-slide"
              data-bg="https://www.dif.co/wp-content/uploads/2023/01/shutterstock_1612750594_hi-300x200.jpg"
            >
              <div className="hero-overlay" aria-hidden></div>
              <div className="h-full flex items-center justify-center px-6">
                <div className="text-center max-w-3xl">
                  <h1 className="text-4xl md:text-6xl hero-heading text-white font-extrabold">
                    Global Reach, Local Expertise
                  </h1>
                  <p className="mt-6 text-lg md:text-xl hero-sub text-white max-w-2xl mx-auto">
                    Our network of counsel and partners in-country gives you an
                    edge where timing and compliance matter most.
                  </p>
                  <div className="mt-8 flex justify-center gap-4">
                    <a
                      href="#services"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-sky to-primary text-white font-semibold shadow cta-btn"
                    >
                      Explore Services
                    </a>
                    <a
                      href="#pricing"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 border-2 border-white/30 text-white font-medium cta-btn cta-ghost"
                    >
                      See Pricing
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero-slide active"
              data-bg="https://plus.unsplash.com/premium_photo-1661414779271-d8478e2944bc?w=1600&auto=format&fit=crop&q=80"
            >
              <div className="hero-overlay" aria-hidden></div>
              <div className="h-full flex items-center justify-center px-6">
                <div className="text-center max-w-3xl">
                  <h1 className="text-4xl md:text-6xl hero-heading text-white font-extrabold">
                    Premium Visa Services That Move Faster
                  </h1>
                  <p className="mt-6 text-lg md:text-xl hero-sub text-white max-w-2xl mx-auto">
                    White-glove, personalised immigration guidance for
                    executives, families and corporate relocations — handled by
                    senior advisors across multiple jurisdictions.
                  </p>
                  <div className="mt-8 flex justify-center gap-4">
                    <a
                      href="#services"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-sky to-primary text-white font-semibold shadow cta-btn"
                    >
                      Get Started
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 border-2 border-white/30 text-white font-medium cta-btn cta-ghost"
                    >
                      Request Consultation
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            id="prev-slide"
            className="hero-arrow absolute top-1/2 -translate-y-1/2 arrow-left left-8 md:left-12"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button
            id="next-slide"
            className="hero-arrow absolute top-1/2 -translate-y-1/2 arrow-right right-8 md:right-12"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              className="w-2.5 h-2.5 rounded-full bg-white/60"
              data-index="0"
            ></button>
            <button
              className="w-2.5 h-2.5 rounded-full bg-white/40"
              data-index="1"
            ></button>
            <button
              className="w-2.5 h-2.5 rounded-full bg-white/40"
              data-index="2"
            ></button>
          </div>
        </section>

        <div className="relative intrude-wrapper px-4 -mt-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center gap-6 intrude-card">
              <div className="card glass p-6 card-hover flex flex-col justify-between bg-white">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center text-2xl">
                      💼
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Fast Processing</h4>
                      <p className="text-sm text-gray-600 max-w-xs">
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

              <div className="card glass bg-white p-6 card-hover flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center text-2xl">
                      🌍
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Global Coverage</h4>
                      <p className="text-sm text-gray-600 max-w-xs">
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

              <div className="card glass bg-white p-6 card-hover flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/90 flex items-center justify-center text-2xl">
                      🤝
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">
                        White-Glove Service
                      </h4>
                      <p className="text-sm text-gray-600 max-w-xs">
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

        <section id="about" className="max-w-6xl mx-auto px-6 py-24">
          <div className="stats-wrap bg-white rounded-3xl p-8 shadow-md grid md:grid-cols-3 items-center gap-6">
            <div className="animate-f-left">
              <h3 className="text-2xl font-extrabold">
                Trusted Experience, Measured Results
              </h3>
              <p className="mt-3 text-gray-600">
                We combine legal expertise, process engineering and a
                client-first approach to deliver predictable outcomes.
              </p>
            </div>

            <div className="flex items-center justify-center -mt-20 md:mt-0 animate-f-m">
              <div className="flex flex-col items-center">
                <div className="badge-circle">
                  <span className="badge-number">24</span>
                </div>
                <div className="badge-sub">YEARS OF EXPERIENCE</div>
              </div>
            </div>

            <div className="text-right md:text-right animate-f-right">
              <div className="text-5xl font-extrabold">920</div>
              <div className="text-sm font-semibold tracking-wide text-dark/80 mt-1">
                INVESTMENT PROFESSIONALS
              </div>
              <p className="mt-3 text-gray-600 max-w-sm ml-auto">
                Our employees are the energy that drives us forward. Their
                commitment, expertise and diversity are the key to DIF’ success.
              </p>
            </div>
          </div>
        </section>

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

            <div className="testim-viewport px-4" id="testimViewport">
              <div className="holo-shimmer" aria-hidden></div>

              <div className="testim-track" id="testimTrack">
                <article className="testim-card" data-index="0">
                  <div className="testim-quote">
                    “They unlocked priority slots, handled every embassy
                    interaction, and saved our launch window — professional and
                    relentless.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60&auto=format&fit=crop"
                        alt="avatar 1"
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

                <article className="testim-card" data-index="1">
                  <div className="testim-quote">
                    “They rewrote our company narrative to match adjudicator
                    expectations. Result: embassy approved in record time.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1545996124-68aeef80d5d7?w=200&q=60&auto=format&fit=crop"
                        alt="avatar 2"
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

                <article className="testim-card" data-index="2">
                  <div className="testim-quote">
                    “A complex family relocation with sensitive documents —
                    handled with speed, transparency and empathy. The kids
                    landed school placements smoothly.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&q=60&auto=format&fit=crop"
                        alt="avatar 3"
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

                <article className="testim-card" data-index="3">
                  <div className="testim-quote">
                    “They turned a last-minute embassy block into a same-week
                    approval — our M&A go-live was saved. Honestly felt like
                    magic.”
                  </div>

                  <div className="testim-meta">
                    <div className="testim-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1548142813-8af8f1a8f1d7?w=200&q=60&auto=format&fit=crop"
                        alt="avatar 4"
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
                    <stop offset="0" stop-color="#38bdf8" stop-opacity="0.12" />
                    <stop offset="1" stop-color="#dc143c" stop-opacity="0.12" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="100" height="10" fill="url(#g1)" />
              </svg>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Latest Stories &amp; News</h3>
              <div className="text-sm text-gray-500">
                Curated updates from our team
              </div>
            </div>

            <div className="relative">
              <div id="newsTrack" className="news-track">
                <article className="news-item bg-white rounded-2xl shadow-md overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80&auto=format&fit=crop"
                    alt="fast track"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-sm text-primary">June 15, 2023</span>
                    <h4 className="text-lg font-semibold mt-2">
                      How to Fast-Track Your Visa
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Practical tips our advisors use to speed up processing
                      without losing compliance.
                    </p>
                    <a
                      href="#"
                      className="inline-block mt-4 text-primary font-semibold"
                    >
                      Read More
                    </a>
                  </div>
                </article>

                <article className="news-item bg-white rounded-2xl shadow-md overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1508385082359-f6b3f2ab1b83?w=1200&q=80&auto=format&fit=crop"
                    alt="relocation"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-sm text-primary">June 8, 2023</span>
                    <h4 className="text-lg font-semibold mt-2">
                      Case Study: Corporate Relocation
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      How we helped a tech company move 200 staff with minimal
                      downtime.
                    </p>
                    <a
                      href="#"
                      className="inline-block mt-4 text-primary font-semibold"
                    >
                      Read More
                    </a>
                  </div>
                </article>

                <article className="news-item bg-white rounded-2xl shadow-md overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=80&auto=format&fit=crop"
                    alt="mistakes"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-sm text-primary">May 30, 2023</span>
                    <h4 className="text-lg font-semibold mt-2">
                      Top Mistakes to Avoid
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Common application pitfalls and how our clients avoid
                      them.
                    </p>
                    <a
                      href="#"
                      className="inline-block mt-4 text-primary font-semibold"
                    >
                      Read More
                    </a>
                  </div>
                </article>

                <article className="news-item bg-white rounded-2xl shadow-md overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80&auto=format&fit=crop"
                    alt="consulate"
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-sm text-primary">May 22, 2023</span>
                    <h4 className="text-lg font-semibold mt-2">
                      Policy Update: Consulate Hours
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Important schedule changes that affect appointment
                      planning.
                    </p>
                    <a
                      href="#"
                      className="inline-block mt-4 text-primary font-semibold"
                    >
                      Read More
                    </a>
                  </div>
                </article>
              </div>
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
                id="vpContactFab"
                href="#"
                className="inline-block rounded-full px-6 py-3 bg-gradient-to-r from-sky to-primary text-white font-semibold shadow cta-btn"
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
              <button className="rounded-lg px-6 py-3 bg-gradient-to-r from-sky to-primary text-white font-semibold shadow cta-btn">
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

      <button id="vpContactFab" className="vp-fab" aria-label="Contact us">
        <span className="vp-pulse" aria-hidden="true"></span>
        <i className="fas fa-comment-dots" style={{ fontSize: "20px" }}></i>
      </button>
      <div className="vp-fab-label" aria-hidden="true">
        <div style={{ fontWeight: "700" }}>Need help?</div>
        <div style={{ fontSize: "11px", color: "#6b7280" }}>
          Chat, call or send a message
        </div>
      </div>

      <div
        id="vpContactModal"
        className="vp-modal vp-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vpContactTitle"
      >
        <div className="vp-backdrop" id="vpBackdrop"></div>

        <div className="vp-panel" id="vpPanel" role="document">
          <button
            className="vp-close"
            id="vpClose"
            aria-label="Close contact form"
          >
            <i className="fas fa-times"></i>
          </button>

          <div className="vp-panel-body">
            <div
              style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "8px",
                  background: "linear-gradient(90deg, #38bdf8, #dc143c)",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  fontSize: "18px",
                }}
              >
                <i className="fas fa-headset"></i>
              </div>
              <div style={{ flex: "1" }}>
                <h3 id="vpContactTitle">Let's get you help — fast</h3>
                <p className="small">
                  Choose a quick action or leave a message and we'll reply ASAP.
                </p>
              </div>
            </div>

            <form id="vpContactForm" style={{ marginTop: "12px" }}>
              <div className="vp-grid vp-grid-2">
                <input
                  id="vp_name"
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
              .
            </form>
          </div>
        </div>
      </div>

      <div
        id="vpToast"
        className="vp-toast"
        role="status"
        aria-live="polite"
      ></div>

      <ClientScripts />
    </>
  );
}
