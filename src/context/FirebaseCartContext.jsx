// // src/context/FirebaseCartContext.js
// import { createContext, useContext, useEffect, useState } from "react";
// import {
//   getDatabase,
//   ref,
//   set,
//   onValue,
//   update,
//   remove,
//   get, // Add this import
// } from "firebase/database";
// import { app } from "../firebase"; // Your Firebase config file
// import { auth } from "../firebase"; // Make sure to import auth

// const FirebaseCartContext = createContext();

// export function FirebaseCartProvider({ children }) {
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const db = getDatabase(app);

//   const getCurrentUserId = () => {
//     // Check for authenticated user first
//     if (auth.currentUser) {
//       console.log("Using authenticated user ID:", auth.currentUser.uid);
//       return auth.currentUser.uid;
//     }

//     // Fallback to guest ID
//     let guestId = localStorage.getItem("guestId");
//     if (!guestId) {
//       guestId = "guest_" + Math.random().toString(36).substring(2, 11);
//       localStorage.setItem("guestId", guestId);
//       console.log("Generated new guest ID:", guestId);
//     }
//     return guestId;
//   };

//   // Add this useEffect to track cart changes
//   useEffect(() => {
//     const userId = getCurrentUserId();
//     const cartRef = ref(db, `carts/${userId}/items`);

//     const unsubscribe = onValue(cartRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const cartData = snapshot.val();
//         const cartItems = Object.keys(cartData).map((key) => ({
//           id: key,
//           ...cartData[key],
//         }));
//         setCart(cartItems);
//       } else {
//         setCart([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);
  

//   const addToCart = async (medicine) => {
//     console.group("addToCart Debugging");
//     try {
//       // 1. Get user ID
//       const userId = getCurrentUserId();
//       console.log("📌 Current User ID:", userId);
//       console.log("🔍 Medicine being added:", medicine);

//       // Verify required medicine fields
//       if (!medicine.id || !medicine.price) {
//         console.error("❌ Missing required fields in medicine object");
//         console.log("Medicine object must contain at least id and price");
//         throw new Error("Medicine object must contain at least id and price");
//       }

//       // 2. Create reference
//       const cartRef = ref(db, `carts/${userId}/items/${medicine.id}`);
//       console.log("🗂️ Database reference path:", cartRef.toString());

//       // 3. Check existing item
//       console.log("🔎 Checking for existing item...");
//       const snapshot = await get(cartRef);
//       console.log("📊 Snapshot exists:", snapshot.exists());

//       if (snapshot.exists()) {
//         const currentData = snapshot.val();
//         console.log("🛒 Existing item data:", currentData);

//         const newQuantity =
//           (currentData.quantity || 0) + (medicine.quantity || 1);
//         console.log(
//           "🧮 New quantity calculation:",
//           `${currentData.quantity} + ${medicine.quantity} = ${newQuantity}`
//         );

//         // 4. Update existing item
//         console.log("🔄 Updating existing item...");
//         await update(cartRef, {
//           quantity: newQuantity,
//           updatedAt: Date.now(),
//         });
//         console.log("✅ Successfully updated item quantity");
//       } else {
//         // 5. Add new item
//         console.log("🆕 Adding new item to cart...");
//         const itemToAdd = {
//           ...medicine,
//           quantity: medicine.quantity || 1,
//           createdAt: Date.now(),
//           updatedAt: Date.now(),
//         };
//         console.log("📦 Item to be added:", itemToAdd);

//         await set(cartRef, itemToAdd);
//         console.log("✅ Successfully added new item");
//       }

//       // 6. Verify write
//       console.log("🔍 Verifying write operation...");
//       const updatedSnapshot = await get(cartRef);
//       console.log("🔄 Updated item data:", updatedSnapshot.val());
//     } catch (error) {
//       console.error("❌ Error in addToCart:", error);
//       console.log("Error details:", {
//         name: error.name,
//         message: error.message,
//         stack: error.stack,
//       });

//       // Check Firebase specific error
//       if (error.code) {
//         console.log("Firebase error code:", error.code);
//         console.log("Firebase error message:", error.message);
//       }

//       throw error;
//     } finally {
//       console.groupEnd();
//     }
//   };
//   // Remove item from cart
//   const removeFromCart = async (id) => {
//     const userId = getCurrentUserId();
//     const cartRef = ref(db, `carts/${userId}/items/${id}`);
//     await remove(cartRef);
//   };

//   // Update item quantity
//   const updateQuantity = async (id, newQuantity) => {
//     if (newQuantity < 1) return;

//     const userId = getCurrentUserId();
//     const cartRef = ref(db, `carts/${userId}/items/${id}`);
//     await update(cartRef, { quantity: newQuantity });
//   };

//   // Clear entire cart
//   const clearCart = async () => {
//     const userId = getCurrentUserId();
//     const cartRef = ref(db, `carts/${userId}/items`);
//     await remove(cartRef);
//   };

//   // Calculate totals
//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//   const totalPrice = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return (
//     <FirebaseCartContext.Provider
//       value={{
//         cart,
//         loading,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         totalItems,
//         totalPrice,
//       }}
//     >
//       {children}
//     </FirebaseCartContext.Provider>
//   );
// }

// export const useFirebaseCart = () => useContext(FirebaseCartContext);


import { createContext, useContext, useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
  get,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { app, auth } from "../firebase";

const FirebaseCartContext = createContext();

export function FirebaseCartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // ← track userId in state
  const db = getDatabase(app);

  const getGuestId = () => {
    let guestId = localStorage.getItem("guestId");
    if (!guestId) {
      guestId = "guest_" + Math.random().toString(36).substring(2, 11);
      localStorage.setItem("guestId", guestId);
    }
    return guestId;
  };

  // ✅ Step 1: Listen to auth state changes to set userId
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ✅ Merge guest cart into logged-in user cart
        const guestId = localStorage.getItem("guestId");
        if (guestId) {
          const guestCartRef = ref(db, `carts/${guestId}/items`);
          const snapshot = await get(guestCartRef);
          if (snapshot.exists()) {
            const guestItems = Object.values(snapshot.val());
            for (const item of guestItems) {
              const userItemRef = ref(db, `carts/${user.uid}/items/${item.id}`);
              await set(userItemRef, item);
            }
            await remove(guestCartRef);
            localStorage.removeItem("guestId");
          }
        }
        setUserId(user.uid);
      } else {
        // Not logged in — use guest ID
        setUserId(getGuestId());
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // ✅ Step 2: Re-subscribe to cart whenever userId changes
  useEffect(() => {
    if (!userId) return; // wait until userId is determined

    const cartRef = ref(db, `carts/${userId}/items`);
    const unsubscribeCart = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const cartData = snapshot.val();
        const cartItems = Object.values(cartData);
        setCart(cartItems);
      } else {
        setCart([]);
      }
      setLoading(false);
    });

    return () => unsubscribeCart(); // ✅ clean up old listener when userId changes
  }, [userId]); // ← re-runs when userId changes

  const addToCart = async (medicine) => {
    if (!userId) return;
    
    try {
      const cartRef = ref(db, `carts/${userId}/items/${medicine.id}`);
      const snapshot = await get(cartRef);

      if (snapshot.exists()) {
        const currentData = snapshot.val();
        const newQuantity = (currentData.quantity || 0) + (medicine.quantity || 1);
        await update(cartRef, { quantity: newQuantity, updatedAt: Date.now() });
      } else {
        await set(cartRef, {
          ...medicine,
          quantity: medicine.quantity || 1,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error("❌ Error in addToCart:", error);
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    const cartRef = ref(db, `carts/${userId}/items/${id}`);
    await remove(cartRef);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    const cartRef = ref(db, `carts/${userId}/items/${id}`);
    await update(cartRef, { quantity: newQuantity });
  };

  const clearCart = async () => {
    const cartRef = ref(db, `carts/${userId}/items`);
    await remove(cartRef);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <FirebaseCartContext.Provider
      value={{ cart, loading, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </FirebaseCartContext.Provider>
  );
}

export const useFirebaseCart = () => useContext(FirebaseCartContext);