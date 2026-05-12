import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { Navbar } from '@/components/layout/Navbar'
import { WizardChat } from '@/components/ui/WizardChat'
import { CauldronDrawer } from '@/components/ui/CauldronDrawer'
import { HomePage } from '@/pages/HomePage'
import { ExplorarPage } from '@/pages/ExplorarPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { MisPedidosPage } from '@/pages/MisPedidosPage'
import { MisDatosPage } from '@/pages/MisDatosPage'

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [wizardOpen, setWizardOpen] = useState(false)
  const [cauldronOpen, setCauldronOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="bg-floria-deep font-fredoka">
            <Navbar
              scrolled={scrolled}
              wizardOpen={wizardOpen}
              onWizardToggle={() => setWizardOpen((v) => !v)}
              cauldronOpen={cauldronOpen}
              onCauldronToggle={() => setCauldronOpen((v) => !v)}
            />
            <Routes>
              <Route path="/"          element={<HomePage />} />
              <Route path="/explorar"  element={<ExplorarPage />} />
              <Route path="/login"        element={<LoginPage />} />
              <Route path="/registro"     element={<RegisterPage />} />
              <Route path="/mis-pedidos"  element={<MisPedidosPage />} />
              <Route path="/mis-datos"    element={<MisDatosPage />} />
            </Routes>
          </div>

          <WizardChat isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
          <CauldronDrawer isOpen={cauldronOpen} onClose={() => setCauldronOpen(false)} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
