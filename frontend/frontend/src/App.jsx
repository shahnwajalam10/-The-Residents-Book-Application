import { useEffect, useState } from "react";

const dummyUsers = [
  {
    _id: "dummy1",
    firstName: "Alice",
    lastName: "Johnson",
    title: "Frontend Developer",
    profilePhoto: "https://randomuser.me/api/portraits/women/1.jpg",
    linkedIn: "https://linkedin.com/in/alicejohnson",
    twitter: "https://twitter.com/alicejohnson"
  },
  {
    _id: "dummy2",
    firstName: "Bob",
    lastName: "Smith",
    title: "Backend Engineer",
    profilePhoto: "https://randomuser.me/api/portraits/men/2.jpg",
    linkedIn: "https://linkedin.com/in/bobsmith",
    twitter: ""
  },
  {
    _id: "dummy3",
    firstName: "Clara",
    lastName: "Lee",
    title: "UI/UX Designer",
    profilePhoto: "https://randomuser.me/api/portraits/women/3.jpg",
    linkedIn: "",
    twitter: "https://twitter.com/claralee"
  }
];

function Navbar() {
  return (
    <nav className="bg-white border-b-2 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black font-mono">The Residents Book</h1>
      </div>
    </nav>
  );
}

function UserCard({ user, onClose }) {
  const [imgSrc, setImgSrc] = useState(user.profilePhoto);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black border-2 border-black rounded-full w-8 h-8 text-center leading-6 hover:bg-red-200"
        >
          ✕
        </button>

        <div className="flex items-center space-x-6">
          <img
            src={imgSrc}
            onError={() => setImgSrc("")}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-24 h-24 rounded-full object-cover border-4 border-black"
          />
          <div>
            <h3 className="text-2xl font-bold text-black">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-lg text-gray-700 font-medium">{user.title}</p>
            {user.linkedIn && (
              <a
                href={user.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline block mt-1"
              >
                LinkedIn
              </a>
            )}
            {user.twitter && (
              <a
                href={user.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 underline block"
              >
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    profilePhoto: "",
    linkedIn: "",
    twitter: ""
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(dummyUsers);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://the-residents-book-application-1.onrender.com/users");
        const result = await res.json();
        if (result.users && result.users.length > 0) {
          setUsers(result.users);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.title) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://the-residents-book-application-1.onrender.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok) {
        alert("Error: " + (result.message || "Something went wrong"));
      } else {
        setUsers((prev) => [...prev, result.user]);
        setSelectedUser(result.user);
        setShowForm(false);
        setFormData({
          firstName: "",
          lastName: "",
          title: "",
          profilePhoto: "",
          linkedIn: "",
          twitter: ""
        });
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 overflow-auto">
      <Navbar />

      <div className="text-center my-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded font-semibold hover:bg-gray-100 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all font-mono"
        >
          Add Resident
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="relative bg-white p-6 rounded-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mx-auto space-y-4">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-black border-2 border-black rounded-full w-8 h-8 text-center leading-6 hover:bg-red-200"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center">Create User</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {["firstName", "lastName", "title", "profilePhoto", "linkedIn", "twitter"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={`${field[0].toUpperCase() + field.slice(1)}${
                    field === "firstName" || field === "lastName" || field === "title" ? " *" : ""
                  }`}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-2 border-2 border-black rounded focus:outline-none"
                  required={field === "firstName" || field === "lastName" || field === "title"}
                />
              ))}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-semibold ${
                  loading
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                }`}
              >
                {loading ? "Submitting..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="cursor-pointer bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center space-x-4 transition hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <img
              src={user.profilePhoto}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full border-2 border-black object-cover"
              onError={(e) => (e.target.src = "")}
            />
            <div>
              <h3 className="font-bold text-lg text-black">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-gray-700 text-sm">{user.title}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && <UserCard user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}
