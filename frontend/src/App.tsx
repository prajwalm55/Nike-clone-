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
import SalePage from './pages/SalePage'
import KidsPage from './pages/KidsPage'
import LookbookPage from './pages/LookbookPage'
import SustainabilityPage from './pages/SustainabilityPage'
import SizeGuidePage from './pages/SizeGuidePage'
import AboutPage from './pages/AboutPage'
import HelpPage from './pages/HelpPage'
import OrdersPage from './pages/OrdersPage'
import OutfitBuilderPage from './pages/OutfitBuilderPage'
import AccountPage from './pages/AccountPage'

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
                  <Route path="/sale" element={<SalePage />} />
                  <Route path="/kids" element={<KidsPage />} />
                  <Route path="/lookbook" element={<LookbookPage />} />
                  <Route path="/sustainability" element={<SustainabilityPage />} />
                  <Route path="/size-guide" element={<SizeGuidePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/outfit-builder" element={<OutfitBuilderPage />} />
                  <Route path="/account" element={<AccountPage />} />
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
