// pages/_document.js
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
            rel="stylesheet"
          />
          {/* Font Awesome (CDN) */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          />
          {/* Tailwind CDN (quick & simple) */}
          <script src="https://cdn.tailwindcss.com"></script>

          {/* Tailwind config (same as your original) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                tailwind.config = {
                  theme: {
                    extend: {
                      colors: {
                        primary: "#DC143C",
                        sky: "#38BDF8",
                        gold: "#D4AF37",
                        dark: "#0f172a",
                        light: "#f8fafc",
                        glass: "rgba(255,255,255,0.6)",
                      },
                      fontFamily: {
                        sans: ["Roboto","system-ui","-apple-system","Segoe UI","Arial"],
                      },
                    },
                  },
                };
              `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
