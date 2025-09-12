window.Shopify.loadFeatures(
  [{ name: "consent-tracking-api", version: "0.1" }],
  (error) => {
    if (error) throw error;
    console.log("** Shopify Consent Tracking API loaded");
    const syncTrackingConsent = (consentObj) => {
      window.Shopify.customerPrivacy.setTrackingConsent(consentObj, () => {
        console.log("** UC consent synced with Shopify Customer Privacy API");
        console.log("- Shopify consent:");
        console.log(window.Shopify.customerPrivacy.currentVisitorConsent());
        console.log("--------------------------");
      });
    };
    window.addEventListener("ucEvents", function (e) {
      if (e.detail && e.detail.event == "consent_status") {
        let analyticsConsent = e.detail["Shopify Analytics"];
        let marketingConsent = e.detail["Shopify Marketing"];
        let preferencesConsent = e.detail["Shopify Preferences"];
        console.log("** Usercentrics consent:");
        console.log("- action: " + e.detail.action);
        console.log("- type: " + e.detail.type);
        console.log("- Analytics: " + analyticsConsent);
        console.log("- Marketing: " + marketingConsent);
        console.log("- Preferences: " + preferencesConsent);
        let consentObj = {};
        switch (e.detail.action) {
          case "onDenyAllServices":
            consentObj = {
              analytics: false,
              marketing: false,
              preferences: false,
              sale_of_data: false,
            };
            break;
          case "onAcceptAllServices":
          case "onNonEURegion":
            consentObj = {
              analytics: true,
              marketing: true,
              preferences: true,
              sale_of_data: true,
            };
            break;
          default:
            consentObj = {
              analytics: analyticsConsent,
              marketing: marketingConsent,
              preferences: preferencesConsent,
            };
        }
        syncTrackingConsent(consentObj);
      }
    });
  }
);
