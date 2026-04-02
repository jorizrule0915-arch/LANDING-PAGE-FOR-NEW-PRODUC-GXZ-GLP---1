const stickyCta = document.getElementById("sticky-cta");
const hero = document.querySelector(".hero");
const revealItems = document.querySelectorAll(".reveal");
const faqButtons = document.querySelectorAll(".faq-question");
const checkoutLinks = document.querySelectorAll("[data-checkout-link]");
const creatorCodeTargets = document.querySelectorAll("[data-creator-code]");
const creatorNameTargets = document.querySelectorAll("[data-creator-name]");
const codeMessageTargets = document.querySelectorAll("[data-code-message]");
const urgencyMessageTargets = document.querySelectorAll("[data-urgency-message]");
const offerEndTargets = document.querySelectorAll("[data-offer-end]");

const queryParams = new URLSearchParams(window.location.search);

const rawCreatorName =
  queryParams.get("creator") ||
  queryParams.get("influencer") ||
  queryParams.get("ig_creator") ||
  "";
const rawCreatorCode =
  queryParams.get("code") ||
  queryParams.get("discount") ||
  queryParams.get("coupon") ||
  "";
const batchEnds = queryParams.get("batch_ends") || queryParams.get("offer_ends") || "";

const normalizedCreatorName = rawCreatorName.replace(/^@/, "").trim();
const creatorDisplayName = normalizedCreatorName
  ? `@${normalizedCreatorName}`
  : "a creator you trust";
const creatorCode = rawCreatorCode.trim();
const creatorCodeDisplay = creatorCode || "your creator code";
const offerEndDisplay = batchEnds || "soon";

creatorNameTargets.forEach((item) => {
  item.textContent = creatorDisplayName;
});

creatorCodeTargets.forEach((item) => {
  item.textContent = creatorCodeDisplay;
});

codeMessageTargets.forEach((item) => {
  item.textContent = creatorCode
    ? `Use code ${creatorCode} at checkout to unlock your exclusive offer.`
    : "Use your creator's code to unlock your exclusive offer.";
});

urgencyMessageTargets.forEach((item) => {
  item.textContent = batchEnds
    ? `Current batch pricing ends ${batchEnds}.`
    : "Current batch pricing ends soon.";
});

offerEndTargets.forEach((item) => {
  item.textContent = offerEndDisplay;
});

const utmSource = queryParams.get("utm_source") || "instagram";
const utmCampaign = queryParams.get("utm_campaign") || normalizedCreatorName || "";

checkoutLinks.forEach((link) => {
  const href = link.getAttribute("href");
  if (!href) {
    return;
  }

  let url;
  try {
    url = new URL(href, window.location.origin);
  } catch (_error) {
    return;
  }

  if (creatorCode) {
    url.searchParams.set("discount", creatorCode);
    url.searchParams.set("code", creatorCode);
  }

  if (normalizedCreatorName) {
    url.searchParams.set("creator", normalizedCreatorName);
  }

  if (!url.searchParams.get("utm_source")) {
    url.searchParams.set("utm_source", utmSource);
  }

  if (utmCampaign && !url.searchParams.get("utm_campaign")) {
    url.searchParams.set("utm_campaign", utmCampaign);
  }

  link.setAttribute("href", url.toString());
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px 0px",
  }
);

const revealBuckets = new Map();

revealItems.forEach((item) => {
  const parent = item.parentElement || document.body;
  const siblingIndex = revealBuckets.get(parent) || 0;
  const delay = Math.min(siblingIndex * 70, 210);
  item.style.setProperty("--reveal-delay", `${delay}ms`);
  revealBuckets.set(parent, siblingIndex + 1);
  revealObserver.observe(item);
});

const updateStickyCta = () => {
  if (!stickyCta || !hero) {
    return;
  }

  const triggerPoint = hero.offsetHeight * 0.55;
  stickyCta.classList.toggle("is-visible", window.scrollY > triggerPoint);
};

window.addEventListener("scroll", updateStickyCta, { passive: true });
window.addEventListener("resize", updateStickyCta);
updateStickyCta();

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isExpanded = button.getAttribute("aria-expanded") === "true";
    const answer = button.nextElementSibling;

    button.setAttribute("aria-expanded", String(!isExpanded));

    if (answer) {
      answer.hidden = isExpanded;
    }
  });
});
