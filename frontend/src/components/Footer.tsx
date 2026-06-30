import { Link } from 'react-router-dom'
import Newsletter from './Newsletter'

export default function Footer() {
  return (
    <footer className="footer">
      <Newsletter />
      <div className="footer-grid">
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products">All Products</Link>
          <Link to="/sale">Sale</Link>
          <Link to="/kids">Kids</Link>
          <Link to="/lookbook">Lookbook</Link>
          <Link to="/outfit-builder">Outfit Builder</Link>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <Link to="/help">FAQ</Link>
          <Link to="/orders">Order Status</Link>
          <Link to="/size-guide">Size Guide</Link>
          <Link to="/shoe-finder">Shoe Finder</Link>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/sustainability">Sustainability</Link>
          <Link to="/member">Membership</Link>
          <Link to="/account">Account</Link>
        </div>
        <div className="footer-col">
          <h4>Features</h4>
          <Link to="/compare">Compare</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/shoe-finder">AI Shoe Finder</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Nike Clone. Educational demo — not affiliated with Nike, Inc.</span>
        <span>Terms of Use &middot; Privacy Policy</span>
      </div>
    </footer>
  )
}
