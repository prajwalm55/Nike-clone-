import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { CompareProvider } from './context/CompareContext'
import Header from './components/Header'
import Footer from './components/Footer'
import CompareBar from './components/CompareBar'
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AuthPage from './pages/AuthPage'
import ShoeFinderPage from './pages/ShoeFinderPage'
import ComparePage from './pages/ComparePage'
import WishlistPage from './pages/WishlistPage'
import MemberPage from './pages/MemberPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <Header />
              <CompareBar />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/shoe-finder" element={<ShoeFinderPage />} />
                  <Route path="/compare" element={<ComparePage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/member" element={<MemberPage />} />
                </Routes>
              </main>
              <Footer />
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
