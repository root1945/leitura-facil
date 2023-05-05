import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
})

export const metadata = {
  title: 'Leitura Facial',
  description: 'APS - Leitura Facial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>{children}</body>
    </html>
  )
}
