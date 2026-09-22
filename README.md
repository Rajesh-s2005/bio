# Banu S — Advanced Marriage Bio-Data & Portfolio

A modern, executive marriage bio-data web application designed for **Banu S** with royal emerald & champagne gold aesthetics, verified credentials, print-ready PDF styling, and an interactive, reusable photo gallery.

---

## 📸 Photo Rule & Guarantee
- **Authentic Photos Only**: The website strictly displays the 3 authentic photos of Banu S provided.
- **Zero AI faces, couple images, or stock people**: No other person or face exists on the website.
- **Extensible Reusable Gallery**: Built with a modular component (`js/gallery.js`) and a client-side live photo dropzone so you can add more real photos anytime.

---

## 🌟 Extracted Bio-Data Details

- **Full Name**: Banu S
- **Date of Birth**: 23/02/1999 (Age: 27 Years)
- **Spiritual Status**: Regular Pioneer
- **Date of Baptism**: January 02, 2022
- **Congregation**: Mudichur Congregation, Chennai
- **Education Qualification**: B.E. in Computer Science Engineering
- **Company / Work**: E-con Systems India Pvt. Ltd. (Chennai)
- **Family**:
  - Father: Mr. Sivakumar
  - Mother: Mrs. Sundari
  - Sister: Kowsalya — B.Sc. Agriculture (Preparing for Banking & Public Sector Examinations)
  - Brother: Rajesh — Software Developer
- **Contact Number**: 94874 14817 (Direct Call & WhatsApp integrated)

---

## 🚀 How to Run & View
1. Open the project folder on your Desktop: `c:\Users\HP\OneDrive\Desktop\Banu`.
2. Double click **`index.html`** to open it in your favorite browser (Google Chrome, Microsoft Edge, etc.).
3. No build steps, npm, or servers required — it runs natively out of the box!

---

## 🖨️ How to Print / Save as PDF
- Click the **"Print Bio-Data"** button in the header or the **"Save Bio PDF"** button in the Hero section.
- Or press `Ctrl + P`.
- Select **"Save as PDF"** as your printer. The custom print stylesheet automatically formats a clean, executive document.

---

## 🖼️ How to Add More Real Photos
### Option 1: Live Interactive Dropzone (In-Browser)
1. Scroll down to the **Photo Gallery** section.
2. Click **"Add Real Photo"**.
3. Drag & drop or browse any image from your computer, give it a title/category, and click **"Add Photo to Gallery"**. It will immediately appear in the gallery and persist in your browser!

### Option 2: Permanent Code Addition
1. Place your new photo inside `assets/images/` (e.g. `assets/images/photo-4.jpg`).
2. Open `js/gallery.js` in a text editor.
3. In the `this.photos` array, add a new entry:
```javascript
{
  id: 'photo-4',
  src: 'assets/images/photo-4.jpg',
  title: 'Celebration Moment',
  category: 'traditional',
  categoryLabel: 'Traditional Attire',
  description: 'Family gathering celebration'
}
```
