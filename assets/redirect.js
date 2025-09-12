(function () {
  if (window.location.search.includes("preview_theme_id=")) return;
  const p = window.location.pathname;
  const query = window.location.search || "";

  // Existiert die Query? Wenn ja, prüfen wir Parameter
  if (query) {
    const urlParams = new URLSearchParams(query);

    // Prüfen ob "page" == "1" ist UND "phcursor" existiert
    if (urlParams.get('page') === '1' && urlParams.has('phcursor')) {
      // Neue URL ohne Query-Parameter (Kanonische URL)
      const canonicalUrl = p;

      // Weiterleitung auf kanonische URL ohne Parameter
      window.location.replace(canonicalUrl);
      return; // Ausführung beenden, damit nicht weitere Weiterleitungen geprüft werden
    }
  }

  // Japan
  if (p === "/jp" || p === "/jp/") {
    window.location.replace("https://jp.fissler.com/" + query);
  } else if (p.startsWith("/jp/")) {
    window.location.replace("https://jp.fissler.com" + p + query);
  }

  // Global
  else if (p === "/global" || p === "/global/") {
    window.location.replace("https://global.fissler.com/" + query);
  } else if (p.startsWith("/global/")) {
    window.location.replace("https://global.fissler.com" + p + query);
  }

  // US
  else if (p === "/us" || p === "/us/") {
    window.location.replace("https://us.fissler.com/" + query);
  } else if (p.startsWith("/us/")) {
    window.location.replace("https://us.fissler.com" + p + query);
  }
  // Shopify pagination redirect: Remove ?page=1 or &page=1 for any URL
  (function () {
    const url = new URL(window.location.href);
    // Find 'page' param and check if it's '1'
    if (url.searchParams.get("page") === "1") {
      url.searchParams.delete("page");
      // Remove trailing ? if no params left
      let newUrl = url.pathname + (url.search ? url.search : "");
      // Prevent redirect loop
      if (window.location.pathname + window.location.search !== newUrl) {
        window.location.replace(newUrl);
      }
    }
  })();

  (function () {
    const current = window.location.pathname;
    // Collapse all multiple slashes to single
    const normalized = current.replace(/\/{2,}/g, "/");
    // Remove trailing slash on all non-root paths
    const target =
      normalized === "/" ? normalized : normalized.replace(/\/$/, "");
    if (current !== target) {
      const query = window.location.search || "";
      const hash = window.location.hash || "";
      window.location.replace(target + query + hash);
    }
  })();
})();
