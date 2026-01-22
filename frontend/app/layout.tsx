import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Georgia, 'Times New Roman', serif", background: "linear-gradient(180deg, #f4f1ea, #efe4d6)", color: "#1f1f1f" }}>
        {children}
      </body>
    </html>
  );
}
