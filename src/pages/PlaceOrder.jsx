
import { useNavigate } from "react-router-dom";

export function PlaceOrder() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items: cartItems })
    });

    const newOrder = await response.json();
    clearCart();
    navigate(`/dashboard/orders/${newOrder.id}`); // Redirect to order detail
  };

  return (
    <div>
      <h2>Review Your Order</h2>
      <button onClick={handleSubmit}>Place Order</button>
    </div>
  );
}