import { useState } from "react";
import PackingList from "./PackingList";
import Form from "./Form";
import Stats from "./Stats";
import Logo from "./Logo";

export default function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems((items) => [...items, item]);
  }

  function handleDeleteItems(id) {
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItems(id) {
    setItems((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          packed: !item.packed,
        };
      })
    );
  }

  function handleMarkAllAsUnpacked() {
    setItems((items) =>
      items.map((item) => {
        return {
          ...item,
          packed: false,
        };
      })
    );
  }

  function handleRemoveAllItems() {
    const confirm = window.confirm(
      "Are you sure you want to remove all items?"
    );

    if (!confirm) return;

    setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItems={handleDeleteItems}
        onToggleItems={handleToggleItems}
        onMarkAllAsUnpacked={handleMarkAllAsUnpacked}
        onRemoveAllItems={handleRemoveAllItems}
      />
      <Stats items={items} />
    </div>
  );
}
