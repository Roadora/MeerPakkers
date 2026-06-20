/* MeerPakkers Mobile Topbar Shell v1
   Canonical non-Home mobile container for the existing shared topbar.
   Home is explicitly excluded because it has its own locked topbar.
*/
(function(window, document){
  "use strict";

  var MOBILE_QUERY = "(max-width: 767px)";
  var HEADER_SELECTOR = ".mp-mobile-top-header.mp-mobile-topbar-unified-v3";
  var SHELL_CLASS = "mp-mobile-topbar-shell";
  var SHELL_ATTR = "data-mp-mobile-topbar-shell";

  function isMobile(){
    return !window.matchMedia || window.matchMedia(MOBILE_QUERY).matches;
  }

  function isHomePage(){
    return document.body && (
      document.body.classList.contains("mp-home-page") ||
      document.body.classList.contains("home-page") ||
      document.body.getAttribute("data-page") === "home"
    );
  }

  function ensureShell(header){
    if(!header || !header.parentNode){ return null; }

    var parent = header.parentElement;
    if(parent && parent.hasAttribute(SHELL_ATTR)){
      return parent;
    }

    var shell = document.createElement("div");
    shell.className = SHELL_CLASS;
    shell.setAttribute(SHELL_ATTR, "v1");
    shell.setAttribute("data-mp-mobile-topbar-owned", "shared-component");

    // Preserve the exact position of the header in the DOM.
    // We only wrap the already-rendered canonical mobile header.
    header.parentNode.insertBefore(shell, header);
    shell.appendChild(header);

    return shell;
  }

  function normalizeShell(shell){
    if(!shell){ return; }
    shell.classList.add(SHELL_CLASS);
    shell.setAttribute(SHELL_ATTR, "v1");
  }

  function mountShells(){
    if(!isMobile() || isHomePage()){ return; }

    var headers = document.querySelectorAll(HEADER_SELECTOR);
    Array.prototype.forEach.call(headers, function(header){
      normalizeShell(ensureShell(header));
    });
  }

  function boot(){
    mountShells();
    // Existing legacy scripts can render their header just after DOMContentLoaded.
    window.setTimeout(mountShells, 60);
    window.setTimeout(mountShells, 220);
    window.setTimeout(mountShells, 500);
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", boot, { once:true });
  }else{
    boot();
  }

  if(window.MutationObserver && document.body){
    var scheduled = false;
    var observer = new MutationObserver(function(){
      if(scheduled){ return; }
      scheduled = true;
      window.setTimeout(function(){
        scheduled = false;
        mountShells();
      }, 40);
    });
    observer.observe(document.body, { childList:true, subtree:true });
  }

  window.MeerPakkersMobileTopbarShell = {
    version: "v1",
    mountShells: mountShells,
    ensureShell: ensureShell
  };
})(window, document);
