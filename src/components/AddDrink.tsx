// AddDrink.tsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { InsertMenuItem } from './types';
import toast, { Toaster } from 'react-hot-toast'; // Import react-hot-toast
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AddDrink: React.FC = () => {
  const [drinkName, setDrinkName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!drinkName.trim() || !description.trim() || price <= 0) {
      toast.error('Please fill in all fields with valid data.');
      setLoading(false);
      return;
    }

    const newDrink: InsertMenuItem = {
      DrinkName: drinkName.trim(),
      description: description.trim(),
      price: parseFloat(price.toFixed(2)),
    };

    const { data, error } = await supabase.from('Menu').insert([newDrink]);

    if (error) {
      toast.error(`Error adding drink: ${error.message}`);
    } else {
      toast.success(`Drink "${drinkName}" added successfully!`);
      // Reset form fields
      setDrinkName('');
      setDescription('');
      setPrice(0);
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.navContainer}>
        <Link to="/admin" style={styles.backButton}>
          &larr; Back to Admin
        </Link>
      </div>
      <h1 style={styles.heading}>Add New Drink</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="drinkName" style={styles.label}>
            Drink Name:
          </label>
          <input
            type="text"
            id="drinkName"
            value={drinkName}
            onChange={(e) => setDrinkName(e.target.value)}
            style={styles.input}
            required
            placeholder="e.g., Classic Milk Tea"
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            required
            placeholder="Describe the drink..."
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="price" style={styles.label}>
            Price ($):
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            style={styles.input}
            step="0.01"
            min="0"
            required
            placeholder="e.g., 4.99"
          />
        </div>

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? 'Adding...' : 'Add Drink'}
        </button>
      </form>
      <Toaster />
    </div>
  );
};

// Enhanced Inline CSS Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '40px auto',
    padding: '30px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
  },
  navContainer: {
    marginBottom: '20px',
    textAlign: 'right', // Align the back button to the right
  },
  backButton: {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: '500',
    fontSize: '16px',
    padding: '8px 12px',
    border: '1px solid #007bff',
    borderRadius: '5px',
    transition: 'background-color 0.3s, color 0.3s',
  },
  backButtonHover: {
    backgroundColor: '#007bff',
    color: '#ffffff',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: '500',
    color: '#555555',
    fontSize: '16px',
  },
  input: {
    width: '100%', // Ensure the inputs take full width
    padding: '10px 14px',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
  },
  textarea: {
    width: '100%', // Ensure the textarea takes full width
    padding: '10px 14px',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    fontSize: '16px',
    resize: 'vertical',
    minHeight: '80px',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box', // Include padding and border in the element's total width and height
  },
  submitButton: {
    width: '100%', // Make the button full width
    padding: '12px 20px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  error: {
    color: '#dc3545',
    marginBottom: '10px',
  },
  success: {
    color: '#28a745',
    marginBottom: '10px',
  },
};

export default AddDrink;