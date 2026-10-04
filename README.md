# K.Bahja ðŸŒŸ (Ø¨Ù‡Ø¬Ø©)

![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-blue?logo=expo)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E?logo=supabase)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)

**K.Bahja** is a comprehensive, dual-experience React Native platform designed specifically for the Algerian market. It bridges the gap between event/service customers and professional service providers (Venues, Beauty, Photography, etc.). Built with Expo, NativeWind, and Supabase, it provides a seamless, localized experience in both Arabic and French.

---

## ðŸ“± Features

### ðŸ‘¥ Dual-Role System
- **Client App**: Discover services, browse providers, view portfolios, book appointments, and handle payments.
- **Provider Dashboard**: Manage incoming orders, accept/reject requests, confirm completions (with integrated platform commission logic), and showcase past work on a localized portfolio.

### ðŸ’³ Localized Payment Workflows
- Built-in simulation phase for **Edahabia (Ø§Ù„Ø°Ù‡Ø¨ÙŠØ©)** and **CIB** payments.
- Supports receipt attachments/verifications for bookings.

### ðŸŒ Global i18n Translation System
- Fully dynamic application-wide localization.
- Flawlessly toggles between **Arabic** (RTL-ready structures) and **French**, ensuring maximum accessibility for the Algerian demographic.

### ðŸŽ¨ Beautiful, Modern UI
- Styled utilizing **NativeWind** for consistent, atomic visual language.
- Highly responsive components handling safe areas, keyboards (via `keyboard-aware-scroll-view`), and interactive modals.

### âš¡ Powered By Supabase
- **Authentication**: Secure email/password login integrated seamlessly with React Context.
- **Database**: Relational tables managing Users, Profiles, Providers, Services, Images, and Orders.
- **Storage**: Secure image uploading for Avatars and Provider Portfolios. 

---

## ðŸ› ï¸ Technology Stack

- **Framework**: [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) (SDK 52)
- **Styling**: [NativeWind](https://nativewind.dev/) (Tailwind CSS for React Native)
- **Backend / BaaS**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React Native](https://lucide.dev/)
- **Navigation**: [React Navigation v7](https://reactnavigation.org/) (Stack & Bottom Tabs)
- **Language**: TypeScript

---

## ðŸš€ Quick Start / Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed, and ideally an Expo Go mobile client or an emulator.
You will also need to configure your Supabase instance properties.

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Ohsama/K-Bahja.git
   cd K-Bahja
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file at the root of the project with your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the Application**
   ```bash
   npx expo start -c
   ```
   Press `a` to run on Android, `i` to run on iOS, or scan the QR code with Expo Go.

---

## ðŸ“¦ Building for Production (APK)

This project has been pre-configured for Expo Application Services (EAS). To generate a shareable `.apk` file for Android devices:

```bash
eas build -p android --profile preview
```
*(Ensure you have an Expo dev account and the `eas-cli` installed globally: `npm install -g eas-cli`)*

---

## ðŸ—‚ï¸ Core Architecture

- `/src/components`: Reusable UI elements (Cards, Buttons, Inputs, Layouts).
- `/src/context`: Global App State, `useAppContext` hooking User state and Localization `t()`.
- `/src/i18n`: Global translation dictionary handling FR/AR string definitions.
- `/src/lib`: Core integrations such as the `supabase.ts` initialization.
- `/src/navigation`: Segregated routing flows (`AuthNavigator`, `CustomerNavigator`, `ProviderNavigator`, `ProfileStack`).
- `/src/screens`: 
  - `/auth`: Registration and Onboarding logic.
  - `/common`: Unified views (PersonalInfo, PaymentMethods, ChangePassword).
  - `/customer`: Browsing, Booking, Searching.
  - `/provider`: Portfolios, Order Management.

---

## ðŸ¤ Project State
**MVP Status**: Complete âœ… 
Ready for Beta Client/Vendor onboarding and structural field testing!

---

## ðŸ” Security Notice

> **âš ï¸ Important:** Never commit your `.env` file or `SUPABASE.txt` to version control. Use `.env.example` as a template and fill in your own Supabase credentials locally.

---

## ðŸ“„ License

This project is licensed under the ****.
Copyright Â© 2026 **Boukhalfa Oussama** â€” see the [LICENSE](LICENSE) file for details.
---

## License

**All Rights Reserved (c) 2024-2026 Oussama Boukhalfa**

This project is published for **portfolio and showcase purposes only**.
You may view the source code, but you may not copy, modify, distribute,
sublicense, or use it commercially without explicit written permission.

See [LICENSE](./LICENSE) for full terms.
