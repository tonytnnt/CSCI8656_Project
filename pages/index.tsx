import { useState, useEffect } from 'react';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fetch items from the server
  useEffect(() => {
    async function fetchItems() {
      const res = await fetch('/api/get_items');
      const data = await res.json();
      setItems(data);
    }
    fetchItems();
  }, []);

  // Add a new item
  const addItem = async () => {
    if (!newItem) return;
    const res = await fetch('/api/create_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem, quantity }),
    });
    const data = await res.json();
    setItems([...items, data]);
    setNewItem('');
    setQuantity(1);
  };

  // Mark item as completed
  const toggleCompletion = async (id, completed) => {
    const res = await fetch('/api/update_item', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !completed }),
    });
    const updatedItem = await res.json();
    setItems(items.map(item => (item.id === id ? updatedItem : item)));
  };

  // Delete an item
  const deleteItem = async (id) => {
    await fetch('/api/delete_item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
      <h1>Shopping List</h1>
      <div>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Item name"
        />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <span
              style={{
                textDecoration: item.completed ? 'line-through' : 'none',
              }}
            >
              {item.name} (x{item.quantity})
            </span>
            <button onClick={() => toggleCompletion(item.id, item.completed)}>
              {item.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
