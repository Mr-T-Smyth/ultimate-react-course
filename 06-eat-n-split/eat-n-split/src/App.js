import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const showSplitBill = selectedFriend !== null;

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setSelectedFriend(null);
  }

  function handleAddFriend(newFriend) {
    handleShowAddFriend();

    setFriends((friends) => [...friends, newFriend]);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((current) => (current?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(updatedFriend) {
    setFriends((friends) => {
      return friends.map((friend) => {
        if (friend.id === updatedFriend.id) {
          return updatedFriend;
        }

        return friend;
      });
    });

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onFriendAdded={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {showSplitBill && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onFriendAdded }) {
  const initialURL = "https://i.pravatar.cc/48";
  const initialName = "";

  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialURL);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) {
      return;
    }

    const id = crypto.randomUUID();
    const friend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };

    onFriendAdded(friend);
    setName(initialName);
    setImage(initialURL);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🖼 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [totalBill, setTotalBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = totalBill ? totalBill - userExpense : "";
  const [payer, setPayer] = useState("user");

  const name = selectedFriend.name;

  function handleSubmit(e) {
    e.preventDefault();

    if (!totalBill || !userExpense || !friendExpense) {
      return;
    }

    const updatedFriend = {
      ...selectedFriend,
      balance:
        selectedFriend.balance +
        (payer === "user" ? userExpense : -userExpense),
    };

    onSplitBill(updatedFriend);
    setTotalBill("");
    setUserExpense("");
    setPayer("user");
  }

  function handleSetUserExpense(e) {
    const value = Number(e.target.value);
    setUserExpense(value > totalBill ? totalBill : value);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {name}</h2>
      <label>💰 Total bill</label>
      <input
        type="number"
        value={totalBill}
        onChange={(e) => setTotalBill(Number(e.target.value))}
      />

      <label>💵 Your expense</label>
      <input
        type="number"
        value={userExpense}
        onChange={handleSetUserExpense}
      />

      <label>👭 {name}'s expense </label>
      <input type="number" value={friendExpense} disabled />

      <label>🤑 Who is paying the bill</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
