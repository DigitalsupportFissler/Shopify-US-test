const CollectionTabs = class extends HTMLElement {
  constructor() {
    super();
    const buttons = this.querySelectorAll(".collection-tabs__tabs-wrapper button");
    buttons.forEach(button => {
      button.addEventListener("click", this.onTabClick.bind(this));
    });
  }

  onTabClick = function(event) {
    const buttons = this.querySelectorAll(".collection-tabs__tabs-wrapper button");
    const index = event.target.getAttribute("data-index");
    buttons.forEach(button => {
      if (button.getAttribute("data-index") === index) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
    event.target.classList.add("active");

    const contents = this.querySelectorAll(".collection-tabs__content-wrapper .collection-tabs__content");
    contents.forEach(content => {
      if (content.getAttribute("data-index") === index) {
        content.classList.add("active");
      } else {
        content.classList.remove("active");
      }
    });
    
  }
};

if (!window.customElements.get("collection-tabs")) {
  window.customElements.define("collection-tabs", CollectionTabs);
}