
import { useParams } from "react-router-dom";
import { useState , useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
export function OrderDetail() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setOrder(data);
    };
    fetchOrder();
  }, [orderId]);

  if (!order) return <LoadingSpinner />;

  return (
    <div>
      <h2>Order #{order.id}</h2>
      <OrderItems items={order.items} />
      <OrderSummary total={order.total} />
    </div>
  );
}