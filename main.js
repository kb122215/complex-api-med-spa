class MedSpaApp {
  constructor() {
    this.medicationInput = document.querySelector("#medicationInput");
    this.searchButton = document.querySelector("#searchButton");
    this.suggestions = document.querySelector("#suggestions");
    this.message = document.querySelector("#message");
    this.results = document.querySelector("#results");

    this.brandName = document.querySelector("#brandName");
    this.genericName = document.querySelector("#genericName");
    this.route = document.querySelector("#route");
    this.productType = document.querySelector("#productType");
    this.manufacturer = document.querySelector("#manufacturer");

    this.wikiTitle = document.querySelector("#wikiTitle");
    this.wikiDescription = document.querySelector("#wikiDescription");
    this.wikiLink = document.querySelector("#wikiLink");

    this.searchButton.addEventListener("click", () => this.searchMedication());

    this.medicationInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") this.searchMedication();
    });

    this.suggestions.addEventListener("click", (event) => {
      const chip = event.target.closest(".chip");
      if (!chip) return;
      this.medicationInput.value = chip.dataset.med;
      this.searchMedication();
    });
  }

  async searchMedication() {
    const medication = this.medicationInput.value.trim();

    if (!medication) {
      this.showMessage("Please enter a medication.", "error");
      return;
    }

    this.setLoading(true);
    this.showMessage("Searching…");
    this.results.classList.add("hidden");

    try {
      // API 1: openFDA
      const drugData = await this.getDrugData(medication);
      this.displayDrugData(drugData);

      // Use data from API 1 to query API 2
      const genericName = drugData.openfda?.generic_name?.[0] || medication;
      const wikiData = await this.getWikipediaData(genericName, medication);
      this.displayWikipediaData(wikiData);

      this.results.classList.remove("hidden");
      this.showMessage("");
    } catch (error) {
      console.error(error);
      this.showMessage(
        `Sorry, we couldn't find "${medication}". Try a brand or generic name.`,
        "error",
      );
    } finally {
      this.setLoading(false);
    }
  }

  async getDrugData(medication) {
    // Quotes let multi-word names ("Juvederm Ultra") search as one phrase
    const term = encodeURIComponent(`"${medication}"`);
    const fields = [
      "openfda.brand_name",
      "openfda.generic_name",
      "openfda.substance_name",
    ];

    for (const field of fields) {
      const url = `https://api.fda.gov/drug/label.json?search=${field}:${term}&limit=1`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        if (data.results?.length) return data.results[0];
      }
    }

    throw new Error("Medication not found");
  }

  async getWikipediaData(...names) {
    const titles = this.buildWikiTitles(names);

    for (const title of titles) {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) continue;

        const data = await response.json();
        if (data.type === "disambiguation") continue;

        return data;
      } catch {}
    }

    return null;
  }

  buildWikiTitles(names) {
    const titles = names
      .filter(Boolean)
      .flatMap((name) => {
        const clean = name.toLowerCase().trim();
        const firstWord = clean.split(/[\s,]+/)[0];
        return [clean, firstWord];
      })
      .map((title) => {
        const capitalized = title.charAt(0).toUpperCase() + title.slice(1);
        return capitalized.replaceAll(" ", "_");
      });

    return [...new Set(titles)];
  }

  displayDrugData(drug) {
    const { openfda = {} } = drug;

    this.brandName.textContent = this.format(openfda.brand_name?.[0]);
    this.genericName.textContent = this.format(openfda.generic_name?.[0]);
    this.route.textContent = this.format(openfda.route?.[0]);
    this.productType.textContent = this.format(openfda.product_type?.[0]);
    this.manufacturer.textContent = this.format(openfda.manufacturer_name?.[0]);
  }

  displayWikipediaData(data) {
    if (!data) {
      this.wikiTitle.textContent = "Additional Information";
      this.wikiDescription.textContent =
        "No background article was found for this medication.";
      this.wikiLink.classList.add("hidden");
      return;
    }

    this.wikiTitle.textContent = data.title || "Additional Information";
    this.wikiDescription.textContent =
      data.extract || "No description available.";

    const link = data.content_urls?.desktop?.page;
    this.wikiLink.href = link || "#";
    this.wikiLink.classList.toggle("hidden", !link);
  }

  // "HUMAN PRESCRIPTION DRUG"  "Human Prescription Drug"
  format(value) {
    if (!value) return "Not available";

    return value
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  setLoading(isLoading) {
    this.searchButton.disabled = isLoading;
    this.searchButton.textContent = isLoading ? "Searching…" : "Search";
  }

  showMessage(text, type = "") {
    this.message.textContent = text;
    this.message.className = `message ${type}`.trim();
  }
}

const app = new MedSpaApp();
