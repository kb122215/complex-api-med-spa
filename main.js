class MedSpaApp {
  constructor() {
    this.medicationInput = document.querySelector("#medicationInput");
    this.searchButton = document.querySelector("#searchButton");
    this.message = document.querySelector("#message");
    this.results = document.querySelector("#results");

    this.brandName = document.querySelector("#brandName");
    this.genericName = document.querySelector("#genericName");
    this.route = document.querySelector("#route");
    this.productType = document.querySelector("#productType");

    this.wikiTitle = document.querySelector("#wikiTitle");
    this.wikiDescription = document.querySelector("#wikiDecription");
    this.wikiLink = document.querySelector("#wikiLink");

    this.searchButton.addEventListener("click", () => {
      this.searchMedication();
    });
  }
}
