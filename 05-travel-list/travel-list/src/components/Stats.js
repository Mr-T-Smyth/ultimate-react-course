export default function Stats({ items }) {
  if (items.length === 0)
    return (
      <p className="stats">
        <em>Nothing to pack yet. What are you waiting for? 🤔</em>
      </p>
    );

  const totalItems = items.length;
  const packedItems = items.filter((item) => item.packed).length;
  const percentage = Math.round((packedItems / totalItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everything! Ready to go ✈️"
          : `💼 You have ${totalItems} items on your list, and you already packed
          ${packedItems} (${percentage}%)`}
      </em>
    </footer>
  );
}
