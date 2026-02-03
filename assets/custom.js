const CustomProductRecommendations = class extends HTMLElement {
  constructor() {
    super();
    this.init();
  }
  navigating = false;

  init() {
    const url = this.getAttribute("data-url");
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        this.innerHTML = text;
        this.classList.remove("loading");

        setTimeout(() => {
          const title = this.querySelector(
            ".pdp-custom-recommendations__header-title",
          );
          const titleAttr = this.getAttribute("data-title");
          if (title && titleAttr) {
            title.innerText = titleAttr;
          }

          const wrapper = this.querySelector(
            ".pdp-custom-recommendations__wrapper",
          );
          if (wrapper) {
            wrapper.addEventListener(
              "touchstart",
              this.onTouchStart.bind(this),
            );
            wrapper.addEventListener(
              "touchend",
              this.onTouchEnd.bind(this),
              false,
            );
          }

          const buttons = this.querySelectorAll(
            ".pdp-custom-recommendations__header-button",
          );
          if (buttons) {
            buttons.forEach((button) => {
              button.addEventListener(
                "click",
                this.onNavigateButtonClick.bind(this),
              );
            });
          }
        }, 100);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  handleGesture() {
    if (Math.abs(this.touchendX - this.touchstartX) > 50) {
      if (this.touchendX < this.touchstartX) {
        this.navigate(true);
      } else if (this.touchendX > this.touchstartX) {
        this.navigate(false);
      }
    }
  }

  onTouchStart(event) {
    this.touchstartX = event.changedTouches[0].screenX;
    this.touchstartY = event.changedTouches[0].screenY;
  }

  onTouchEnd(event) {
    this.touchendX = event.changedTouches[0].screenX;
    this.touchendY = event.changedTouches[0].screenY;
    this.handleGesture();
  }

  onNavigateButtonClick(e) {
    const next = e.target.classList.contains(
      "pdp-custom-recommendations__header-next",
    );
    console.log("e", e);

    this.navigate(next);
  }

  navigate(next) {
    if (this.navigating) {
      return;
    }

    const items = this.getItems();
    const activeIndex = this.getActiveIndex();

    if (next && activeIndex < items.length - 1) {
      items[activeIndex].classList.remove("active");
      items[activeIndex + 1].classList.add("active");
    } else if (!next && activeIndex > 0) {
      items[activeIndex].classList.remove("active");
      items[activeIndex - 1].classList.add("active");
    }

    this.navigating = true;
    setTimeout(() => {
      this.navigating = false;
    }, 450);
  }

  getItems() {
    return this.querySelectorAll(".pdp-custom-recommendations__item");
  }

  getActiveIndex() {
    let index = 0;
    this.getItems().forEach((item, i) => {
      if (item.classList.contains("active")) {
        index = i;
      }
    });
    return index;
  }
};

if (!window.customElements.get("custom-product-recommendations")) {
  window.customElements.define(
    "custom-product-recommendations",
    CustomProductRecommendations,
  );
}

function wrapPriceAndReviews() {
  const reviewsBlock = document.querySelector("reviewsio-product-ratings");
  const priceBlock = document.querySelector(
    ".product-info__price .rating-with-text",
  );

  if (reviewsBlock && priceBlock) {
    // Entferne ggf. alten Wrapper, um Dopplungen zu vermeiden
    let oldWrapper = document.querySelector(".price-and-reviews");
    if (oldWrapper) {
      // Entpacke die Elemente, bevor du den Wrapper entfernst
      oldWrapper.parentNode.insertBefore(priceBlock, oldWrapper);
      oldWrapper.remove();
    }

    const wrapper = document.createElement("div");
    wrapper.className = "price-and-reviews";
    priceBlock.parentNode.insertBefore(wrapper, priceBlock);
    wrapper.appendChild(priceBlock);
    wrapper.appendChild(reviewsBlock);
  }
}

document.addEventListener("DOMContentLoaded", wrapPriceAndReviews);

async function saveAndReattachReviewWidget() {
  // Direkt das Reviews-Element sichern (solange es noch da ist)
  const reviewsBlock = document.querySelector("reviewsio-product-ratings");
  if (!reviewsBlock) {
    console.warn("Kein Review-Widget gefunden");
    return;
  }
  // Element sichern und aus dem DOM entfernen, damit es nicht überschrieben wird.
  const savedReviews = reviewsBlock;
  savedReviews.parentNode.removeChild(savedReviews);

  // Warte einige Millisekunden, bis der Preis-Block neu gerendert wurde.
  await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms Delay, ggf. anpassen

  // Jetzt sollte der neue Preis-Block vorhanden sein.
  const priceBlock = document.querySelector(
    ".product-info__price .rating-with-text",
  );
  if (!priceBlock) {
    console.warn("Kein Price-Block gefunden");
    return;
  }

  // Prüfe, ob bereits ein Wrapper existiert, andernfalls erstelle einen neuen.
  let wrapper = document.querySelector(".price-and-reviews");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.className = "price-and-reviews";
    // Füge den Wrapper vor dem Price-Block ein und verschiebe den Price-Block hinein.
    priceBlock.parentNode.insertBefore(wrapper, priceBlock);
    wrapper.appendChild(priceBlock);
  }

  // Jetzt hänge das gespeicherte Reviews-Widget in den Wrapper ein.
  wrapper.appendChild(savedReviews);
}

document.addEventListener("reviews:rerender", saveAndReattachReviewWidget);

document.addEventListener("DOMContentLoaded", function () {
  // Hier prüfen wir, ob die URL nicht den Editor-Pfad enthält.
  if (
    !window.location.href.includes(
      "admin.shopify.com/store/fissler-shop/themes/1",
    )
  ) {
    var labels = document.querySelectorAll(".section-id-label");
    labels.forEach(function (label) {
      label.remove();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const dataLayerLength = window.dataLayer.length;
    setInterval(() => {
      if (window.dataLayer.length > dataLayerLength) {
        const consentChanges = window.dataLayer.filter(
          (item) => item[0] === "consent" && item[1] === "update",
        );
        if (consentChanges.length < 2) return;
        let consent = consentChanges[0][2];
        if (consentChanges.length > 2) {
          consent = consentChanges[consentChanges.length - 2][2];
        }

        const updatedConsent = consentChanges[consentChanges.length - 1][2];
        let anyRetract = false;
        Object.keys(consent).forEach((key) => {
          if (updatedConsent[key] !== "granted" && consent[key] === "granted") {
            anyRetract = true;
          }
        });
        if (anyRetract) {
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }
    }, 500);
  }, 3000);
});

document.addEventListener("DOMContentLoaded", function () {
  // Prüfen ob wir auf der Cart-Seite sind
  if (window.location.pathname === "/cart") {
    const style = document.createElement("style");
    style.innerHTML = `
      .bmsm-cart-drawer-block {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const announcementBar = document.querySelector(".bmsm-stickyannouncementbar");

  if (
    window.location.pathname.includes("/pages/store-locator") ||
    window.location.pathname.includes("/pages/stores/")
  ) {
    const style = document.createElement("style");
    style.innerHTML = `
    .bmsm-stickyannouncementbar {
      display: none !important;
    }
  `;
    document.head.appendChild(style);
  }
  // Ansonsten normale Funktionalität
  else if (announcementBar) {
    const style = document.createElement("style");
    style.innerHTML = `
      .facets__floating-filter {
        transform: translateY(-60px) !important;
      }
    `;
    document.head.appendChild(style);
  }
});
