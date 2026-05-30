"use client";

import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Gift,
  Globe,
  Heart,
  Laptop,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  SprayCan,
  Trash2,
  X,
} from "lucide-react";

type OfferIcon = "car" | "shield" | "spray" | "gift" | "globe" | "heart";

type Offer = {
  id: string;
  name: string;
  price: number;
  unitLabel?: string;
  description: string;
  features: string[];
  note?: string;
  funnyLine?: string;
  icon: OfferIcon;
  mood: string;
};

type CartItem = {
  offer: Offer;
  quantity: number;
};

const offers: Offer[] = [
  {
    id: "normal-joyride",
    name: "Normal Joyride",
    price: 10000,
    unitLabel: "per ride",
    mood: "Soft life entry",
    description:
      "You cannot be walking under the sun with your babe. God forbid rain now joins. Show her you have class.",
    features: [
      "One-way ride to the event",
      "Normal car",
      "Bodyguard-style escort",
      "Door opening",
      "Load carrying",
      "Photo/video not included",
    ],
    icon: "car",
  },
  {
    id: "suv-joyride",
    name: "SUV Joyride",
    price: 70000,
    unitLabel: "per ride",
    mood: "Main character arrival",
    description:
      "For the people who want their entrance to announce itself before they even step out.",
    features: [
      "One-way SUV ride to the event",
      "Bodyguard-style escort",
      "Door opening",
      "Load carrying",
      "Premium arrival feel",
      "Photo/video not included",
    ],
    icon: "shield",
  },
  {
    id: "spray-prop-bundle",
    name: "Spray Prop Bundle",
    price: 20000,
    mood: "Funds without injury",
    description:
      "What is wedding without money? We help you show funds without throwing funds.",
    features: [
      "Money/spray prop bundle",
      "Small gift for your babe",
      "Bought, not rented",
      "Can be bought individually",
    ],
    note: "Props are for fun, content, and event entertainment only.",
    icon: "spray",
  },
  {
    id: "premium-spray-bundle",
    name: "Premium Spray Bundle",
    price: 35000,
    mood: "Spray aura",
    description: "For the boss who wants to spray aura, not problems.",
    features: [
      "Premium money/spray prop bundle",
      "Special small gift for your babe",
      "Extra premium treatment",
      "Bought, not rented",
      "Can be bought individually",
    ],
    icon: "gift",
  },
  {
    id: "couple-website-feature",
    name: "Couple Website Feature",
    price: 5000,
    mood: "Public evidence",
    description:
      "Get you and your babe featured on the public wedding website. Because every babe deserves special treatment.",
    features: [
      "Your names",
      "Your pictures",
      "What you want to say",
      "Couple caption",
      "Public feature on the wedding website",
      "Possible Couple of the Day feature",
    ],
    funnyLine:
      "Your pictures will be etched in the sands of the internet. Unless you break up sha, then we can talk.",
    icon: "globe",
  },
  {
    id: "personalized-love-page",
    name: "Personalized Love Page",
    price: 50000,
    mood: "Private premium romance",
    description:
      "A private password-protected love website for just you and your babe.",
    features: [
      "Password-protected access",
      "Music",
      "Photo carousel",
      "Love letter",
      "Countdown",
      "Proposal or romantic message",
      "Couple story section",
      "Built for proposals, anniversaries, birthdays, fake weddings, or just showing love",
    ],
    icon: "heart",
  },
];

const combos = [
  "Joyride + Couple Website Feature",
  "Spray Prop Bundle + Couple Website Feature",
  "SUV Joyride + Premium Spray Bundle + Personalized Love Page",
  "Personalized Love Page + Couple Website Feature",
];

const steps = [
  {
    title: "Pick your aura",
    copy: "Choose the services you want and add them to your cart.",
  },
  {
    title: "Fill the booking form",
    copy: "Tell us your name, babe's name, event details, pickup location if needed, and what you want us to know.",
  },
  {
    title: "We confirm your booking",
    copy: "We reach out to confirm availability, payment, and final details.",
  },
  {
    title: "You show up with aura",
    copy: "We handle the experience. You enjoy the moment.",
  },
];

const faqs = [
  ["Can I buy only one service?", "Yes. You can buy individually. You do not have to buy a full package."],
  ["Is the spray prop rented or bought?", "It is bought, not rented."],
  ["Does the joyride include return trip?", "No. It is one-way to the event."],
  ["Does the joyride include pictures or videos?", "No. Photo and video are not included."],
  ["Is the personalized love page public?", "No. It is password-protected for just both of you."],
  ["Can I feature myself and my babe on the wedding website?", "Yes. You will send your names, pictures, and what you want to say."],
  ["Can we be Couple of the Day?", "Yes, based on availability and selection."],
  ["What happens if a service is not provided?", "Your money will be fully refunded, plus a small apology gift."],
];

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Icon({ name }: { name: OfferIcon }) {
  if (name === "car") return <Car aria-hidden size={21} strokeWidth={2.2} />;
  if (name === "shield") return <ShieldCheck aria-hidden size={21} strokeWidth={2.2} />;
  if (name === "spray") return <SprayCan aria-hidden size={21} strokeWidth={2.2} />;
  if (name === "gift") return <Gift aria-hidden size={21} strokeWidth={2.2} />;
  if (name === "globe") return <Globe aria-hidden size={21} strokeWidth={2.2} />;
  return <Heart aria-hidden size={21} strokeWidth={2.2} />;
}

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.offer.price * item.quantity, 0),
    [cart],
  );
  const cartSummary =
    cart
      .map((item) => `${item.offer.name} x${item.quantity} (${formatMoney(item.offer.price * item.quantity)})`)
      .join(" | ") || "No items selected";

  function addToCart(offer: Offer) {
    setCart((prev) => {
      const existing = prev.find((item) => item.offer.id === offer.id);
      if (existing) {
        return prev.map((item) =>
          item.offer.id === offer.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { offer, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function changeQuantity(offerId: string, direction: 1 | -1) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.offer.id === offerId
            ? { ...item, quantity: Math.max(0, item.quantity + direction) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(offerId: string) {
    setCart((prev) => prev.filter((item) => item.offer.id !== offerId));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Booking submission failed");
      }

      form.reset();
      setSubmitted(true);
      setCart([]);
    } catch {
      setSubmitError("Something went wrong while sending your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <header className="hero" id="top">
        <nav className="nav container" aria-label="Primary navigation">
          <a href="#top" className="brand-mark">Aura+</a>
          <div className="nav-links">
            <a href="#offers">Offers</a>
            <a href="#booking">Booking</a>
            <button className="nav-cart" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <ShoppingBag size={17} />
              <span>{cartCount}</span>
            </button>
          </div>
        </nav>

        <div className="container hero-content">
          <motion.p
            className="badge"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            Built for CU fake wedding season
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Aura+
          </motion.h1>
          <motion.p
            className="tagline"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Make your campus love look expensive.
          </motion.p>
          <motion.p
            className="hero-copy"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Fake wedding season is here. And yes, we know it is fake. You know it is fake. But from the fake, we can
            still make something real. Show up with class, say your heart, and give your babe a moment they will not
            forget.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
          >
            <a href="#offers" className="btn btn-light">
              View Offers <ArrowRight size={17} />
            </a>
            <a href="#booking" className="btn btn-outline-light">
              Book Your Aura
            </a>
          </motion.div>
        </div>
      </header>

      <section className="ribbon" aria-label="Aura promise">
        <span>From the fake, we make it feel real.</span>
        <span>Your fake wedding should not look fake.</span>
        <span>Campus love, but with aura.</span>
      </section>

      <section className="manifesto section">
        <div className="container manifesto-grid">
          <div>
            <p className="kicker">Why Aura+ exists</p>
            <h2>Fake event. Real memory. Premium evidence.</h2>
          </div>
          <p className="lead">
            This is the best time to look serious, act serious, and package the moment well. Whether it is a fake
            wedding, a fake event, a proposal, a love page, or just you trying to show your babe that you are not
            completely unserious in this life, Aura+ helps you make the moment feel premium.
          </p>
        </div>
      </section>

      <section className="section offers-section" id="offers">
        <div className="container section-head">
          <p className="kicker">The Aura Menu</p>
          <h2>Choose the pressure you want to apply.</h2>
          <p className="sub">Start small, combine services, or arrive like the chairman of fake wedding season.</p>
        </div>

        <div className="container offers-grid">
          {offers.map((offer, index) => (
            <motion.article
              className={`offer-card ${index === 1 || index === 5 ? "offer-card-featured" : ""}`}
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <div className="offer-card-top">
                <span className="icon-shell"><Icon name={offer.icon} /></span>
                <span className="offer-mood">{offer.mood}</span>
              </div>
              <h3>{offer.name}</h3>
              <p className="price">
                {formatMoney(offer.price)} {offer.unitLabel ? <span>{offer.unitLabel}</span> : null}
              </p>
              <p className="offer-copy">{offer.description}</p>
              <ul className="feature-list">
                {offer.features.map((feature) => (
                  <li key={feature}><CheckCircle2 size={15} /> {feature}</li>
                ))}
              </ul>
              {offer.note ? <p className="note">{offer.note}</p> : null}
              {offer.funnyLine ? <p className="note">{offer.funnyLine}</p> : null}
              <button className="btn btn-red" onClick={() => addToCart(offer)}>
                <Plus size={17} /> Add to Cart
              </button>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="package-strip section">
        <div className="container package-grid">
          <div>
            <p className="kicker">Build your scene</p>
            <h2>No pressure. Unless you want pressure.</h2>
            <p className="lead">
              Pick only what you want. You can book one thing, or combine different Aura+ services to create your own
              main-character package.
            </p>
          </div>
          <div className="combo-list">
            {combos.map((combo) => (
              <p key={combo}><Sparkles size={16} /> {combo}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section process">
        <div className="container">
          <p className="kicker">How it works</p>
          <h2>Four steps from unserious to unforgettable.</h2>
          <div className="steps">
            {steps.map((step, index) => (
              <div className="step" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section booking-section" id="booking">
        <div className="container booking-grid">
          <aside className="booking-summary">
            <p className="kicker">Your current aura</p>
            <h2>{formatMoney(total)}</h2>
            <p>{cartSummary}</p>
            <div className="summary-icons" aria-hidden>
              <Car />
              <Gift />
              <Laptop />
              <Heart />
            </div>
          </aside>

          <div>
            <p className="kicker">Book it</p>
            <h2>Say your heart. If anything happens later, say you were joking.</h2>
            <form action="/api/bookings" method="POST" className="booking-form" onSubmit={handleSubmit}>
              <input type="hidden" name="_subject" value="New Aura+ Booking" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="Selected Services (summary)" value={cartSummary} />
              <input type="hidden" name="Total Amount (raw)" value={`${total}`} />

              <label>Full name<input name="full_name" required /></label>
              <label>WhatsApp number<input name="whatsapp" required /></label>
              <label>Email address<input name="email" type="email" required /></label>
              <label>Are you booking for yourself or someone else?<input name="booking_for" required /></label>
              <label>Your name as it should appear<input name="your_display_name" required /></label>
              <label>Babe's name as it should appear<input name="babe_display_name" required /></label>
              <label>What are you booking?<textarea name="what_are_you_booking" readOnly value={cartSummary} /></label>
              <label>Total amount<input name="total_amount" readOnly value={formatMoney(total)} /></label>
              <label>Event date<input name="event_date" type="date" required /></label>
              <label>Event time<input name="event_time" type="time" required /></label>
              <label>Pickup location, if booking Joyride<input name="pickup_location" /></label>
              <label>Drop-off/event location<input name="event_location" required /></label>
              <label>Upload picture link / Google Drive link<input name="picture_link" /></label>
              <label>What do you want to say?<textarea name="what_you_want_to_say" /></label>
              <label>Preferred music, if booking personalized love page<input name="preferred_music" /></label>
              <label>Countdown date, if booking personalized love page<input name="countdown_date" type="date" /></label>
              <label>Gift note or preference, if booking spray prop bundle<textarea name="gift_note" /></label>
              <label>Extra instructions<textarea name="extra_instructions" /></label>

              <label className="check"><input type="checkbox" required /> I confirm that the details I provided are correct.</label>
              <label className="check"><input type="checkbox" required /> I understand that my booking is only confirmed after payment and confirmation.</label>

              <button className="btn btn-red" type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Booking"}
              </button>
            </form>
            {submitError ? <p className="error">{submitError}</p> : null}
            {submitted ? (
              <p className="success">
                Your Aura+ booking has been received. We will reach out to confirm the details. More love. More life.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section fine-print">
        <div className="container fine-grid">
          <div>
            <p className="kicker">Clean disclaimer</p>
            <h2>For fun, content, romance, and aura support.</h2>
          </div>
          <div className="fine-list">
            <p>Money/spray props are for fun, content, and event entertainment only. They are not real currency and should not be used as real money.</p>
            <p>Joyrides are one-way rides and are subject to vehicle availability.</p>
            <p>Bodyguard-style escort means entrance assistance, door opening, load carrying, and aura support. It is not a professional security service.</p>
            <p>Photo and video coverage are not included unless agreed separately.</p>
            <p>Booking is only confirmed after payment and confirmation.</p>
            <p>If any paid service is not provided, your money will be fully refunded, plus a small apology gift.</p>
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <p className="kicker">FAQ</p>
            <h2>Small questions before big romance.</h2>
          </div>
          <div className="faq">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <h2>Aura+</h2>
            <p>Make your campus love look expensive.</p>
            <p className="mini">Built for CU fake wedding season.</p>
          </div>
          <a className="btn btn-light" href="#booking">Book Your Aura <ArrowRight size={17} /></a>
        </div>
      </footer>

      <button className="sticky-cart" onClick={() => setCartOpen(true)}>
        <ShoppingBag size={17} /> <span>Cart</span> <strong>{cartCount}</strong>
      </button>

      <div className={`backdrop ${cartOpen ? "show" : ""}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-label="Shopping cart">
        <div className="cart-head">
          <div>
            <p className="kicker">Aura cart</p>
            <h3>Your selected pressure</h3>
          </div>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={18} /></button>
        </div>

        {cart.length === 0 ? <p className="empty-cart">Your cart is empty for now. Romance is waiting.</p> : null}

        {cart.map((item) => (
          <div className="cart-item" key={item.offer.id}>
            <div>
              <strong>{item.offer.name}</strong>
              <p>{formatMoney(item.offer.price)} each</p>
              <div className="quantity">
                <button onClick={() => changeQuantity(item.offer.id, -1)} aria-label={`Reduce ${item.offer.name}`}>
                  <Minus size={14} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => changeQuantity(item.offer.id, 1)} aria-label={`Increase ${item.offer.name}`}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
            <div className="cart-price">
              <p>{formatMoney(item.offer.price * item.quantity)}</p>
              <button onClick={() => removeFromCart(item.offer.id)} aria-label={`Remove ${item.offer.name}`}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        <div className="cart-total">
          <span>Total</span>
          <strong>{formatMoney(total)}</strong>
        </div>
        <a href="#booking" className="btn btn-red" onClick={() => setCartOpen(false)}>
          Proceed to Booking
        </a>
      </aside>
    </main>
  );
}
