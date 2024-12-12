import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchItems() {
      const res = await fetch('/api/get_items');
      const data = await res.json();
      setItems(data);
    }
    fetchItems();
  }, []);

  const addItem = async () => {
    if (!newItem.trim()) {
      setError('Item name cannot be empty');
      return;
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }
    setError('');

    const res = await fetch('/api/create_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem, quantity }),
    });

    if (!res.ok) {
      setError('Failed to add item');
    }

    const data = await res.json();
    setItems([...items, data]);
    setNewItem('');
    setQuantity(1);
  };

  const toggleCompletion = async (id, completed) => {
    const res = await fetch('/api/update_item', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !completed }),
    });
    const updatedItem = await res.json();
    setItems(items.map(item => (item.id === id ? updatedItem : item)));
  };

  const deleteItem = async (id) => {
    await fetch('/api/delete_item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>Shopping List</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          style={{ flex: 2, padding: '12px', fontSize: '1rem' }}
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Item name"
        />
        <input
          style={{ flex: 1, padding: '12px', fontSize: '1rem' }}
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />
        <button
          style={{ flex: 1, padding: '12px', fontSize: '1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          onClick={addItem}
        >
          Add Item
        </button>
      </div>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            <span
              style={{
                textDecoration: item.completed ? 'line-through' : 'none',
                flex: 2,
                fontSize: '1rem',
              }}
            >
              {item.name} (x{item.quantity})
            </span>
            <button
              style={{
                flex: 1,
                padding: '8px',
                marginLeft: '10px',
                fontSize: '0.9rem',
                backgroundColor: item.completed ? '#f0ad4e' : '#5bc0de',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => toggleCompletion(item.id, item.completed)}
            >
              {item.completed ? 'Undo' : 'Complete'}
            </button>
            <button
              style={{
                flex: 1,
                padding: '8px',
                marginLeft: '10px',
                fontSize: '0.9rem',
                backgroundColor: '#d9534f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
              onClick={() => deleteItem(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
