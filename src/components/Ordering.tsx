import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem, CartItem } from './types';

const Ordering: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  const fetchMenuItems = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('Menu').select('id, DrinkName, description, price');

    if (error) {
      setError(error.message);
    } else {
      setMenuItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const addToCart = (item: MenuItem) => {
    setOrderSuccess(false);
    const existingItem = cart.find((cartItem) => cartItem.DrinkName === item.DrinkName);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.DrinkName === item.DrinkName
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { DrinkName: item.DrinkName, quantity: 1, price: item.price }]);
    }
  };

  const removeFromCart = (DrinkName: string) => {
    setOrderSuccess(false);
    const existingItem = cart.find((cartItem) => cartItem.DrinkName === DrinkName);
    if (existingItem) {
      if (existingItem.quantity > 1) {
        setCart(
          cart.map((cartItem) =>
            cartItem.DrinkName === DrinkName
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
        );
      } else {
        setCart(cart.filter((cartItem) => cartItem.DrinkName !== DrinkName));
      }
    }
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const details = cart.map((item) => ({
      quantity: item.quantity,
      DrinkName: item.DrinkName,
    }));

    const totalPrice = calculateTotal();
    const saleDate = new Date().toISOString();

    const { error } = await supabase.from('Sales').insert([
      {
        Details: details,
        price: totalPrice,
        sale_date: saleDate,
      },
    ]);

    if (error) {
      setError(error.message);
      alert(`Error placing order: ${error.message}`);
    } else {
      setCart([]);
      setOrderSuccess(true);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Bubble Tea Menu</h1>

      {loading && <p>Loading menu...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}
      {orderSuccess && <p style={styles.success}>Order placed successfully!</p>}

      <div style={styles.menuGrid}>
        {menuItems.map((item) => (
          <div key={item.id} style={styles.menuCard}>
            <h2>{item.DrinkName}</h2>
            <p>{item.description}</p>
            <p style={styles.price}>${item.price.toFixed(2)}</p>
            <button style={styles.addButton} onClick={() => addToCart(item)}>
              Add to Order
            </button>
          </div>
        ))}
      </div>

      <h2>Your Order</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <div style={styles.cartContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Drink Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.DrinkName}>
                  <td>{item.DrinkName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button style={styles.removeButton} onClick={() => removeFromCart(item.DrinkName)}>
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          <button style={styles.orderButton} onClick={placeOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  menuGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  menuCard: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '15px',
    width: '200px',
    boxShadow: '2px 2px 12px #aaa',
  },
  price: {
    fontWeight: 'bold',
    marginTop: '10px',
  },
  addButton: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cartContainer: {
    marginTop: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '10px',
  },
  removeButton: {
    padding: '4px 8px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  orderButton: {
    padding: '10px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: '#dc3545',
  },
  success: {
    color: '#28a745',
  },
};

export default Ordering;