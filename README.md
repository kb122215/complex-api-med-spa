# GlowCheck ✨ — Med Spa Medication Reference

A clean, spa-inspired reference tool that lets med spa staff look up a medication and instantly see its **official FDA label details** alongside **plain-language background information**, all in one place.

Built with HTML, CSS, and JavaScript. Used data returned from one API to make a request to a second API.

<img width="1232" height="962" alt="image" src="https://github.com/user-attachments/assets/97bc17a9-2f72-4f5f-a599-b33b48e2059a" />


---

## 🔍 How It Works

GlowCheck chains two public APIs together:

1. **openFDA Drug Label API**: The user searches a brand or generic name (e.g. _Latisse_). The app checks brand names first, then generic and substance names, and returns the product's generic name, route, product type, and manufacturer.
2. **Wikipedia REST API**: The **generic name returned by the FDA** (e.g. _Bimatoprost_) is used to fetch a summary from Wikipedia, giving staff easy-to-read context on what the medication is and how it's used.

```
User search ──▶ openFDA ──▶ generic name ──▶ Wikipedia ──▶ background summary
```
<img width="1232" height="969" alt="image" src="https://github.com/user-attachments/assets/9a467267-d8f2-45f8-9b17-3a26ad205198" />



---

## 🌿 Features

- **Two-API lookup**: FDA data feeds directly into the Wikipedia request
- **Smart fallbacks**: searches brand → generic → substance name, and tries cleaned-up title variations on Wikipedia (FDA names come back in ALL CAPS)
- **Graceful errors**: if no Wikipedia article is found, the FDA results still display
- **Quick-pick chips** for common med spa products: Botox, Dysport, Lidocaine, Tretinoin, Latisse
- **Search on Enter**, loading state on the button, and friendly error messages
- **Responsive design** that stacks cleanly on mobile
- **Accessible markup**: labeled input and an `aria-live` status message

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript
  No frameworks, or build tools required.

---

## 🚀 Getting Started

```bash
git clone https://github.com/kb122215/<your-repo-name>.git
cd <your-repo-name>
```

Then open `index.html` in your browser, or use the **Live Server** extension in VS Code.

---

## 💡 What I Learned

- Chaining API calls so the response from one request becomes the input for the next
- Writing fallback logic when an API's data doesn't match another API's format
- Structuring a front-end app with a single class to keep DOM references, events, and API calls organized
