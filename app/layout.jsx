import "./globals.css"

export const metadata = {
  title: "AR Business Card",
  description: "สร้างและจัดการนามบัตร AR ของคุณ",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
