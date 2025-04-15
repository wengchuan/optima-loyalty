import React from 'react'
import './voucher.css'
import Link from 'next/link'
export default function Voucher({product,handleAddToCart,openRedeemModal }) {
  
  
    return (
    <div className="voucher-card">
      <img src={"http://localhost:8080"+product.image} alt={product} />
      <h4>{product.title} </h4>
      <p>{product.points} points</p>
      <div className="button-group">
  <button className="redeem-btn" onClick={() => openRedeemModal(product)}>
    Redeem
  </button>
  <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
    Add to Cart
  </button>
</div>

              <Link href={`/product/${product.id}`} className="view-details">
                View Details
              </Link>
    </div>
  )
}
