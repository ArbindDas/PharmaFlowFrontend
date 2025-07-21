
// components/CartIconCounter.jsx
import { ShoppingCart } from 'lucide-react';
import { useFirebaseCart } from '../context/FirebaseCartContext';

export function CartIconCounter() {
  const { totalItems } = useFirebaseCart();
  
  return (
    <div className="relative">
      <ShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </div>
  );
}