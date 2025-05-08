import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="grid">
        <div>
          <h2>Optima Loyalty</h2>
          <p>No. 14, USJ 10/1E, Subang UEP, 47620, Subang Jaya, Selangor</p>
        </div>
        <div>
          <h3>Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
       
       
      </div>
      <p className="copyright">© 2023 Electro. All rights reserved.</p>
    </footer>
  );
}