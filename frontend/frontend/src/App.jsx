import { useEffect, useState } from "react";

const fallbackImage = "https://via.placeholder.com/150?text=No+Image";

function UserCard({ user, onClose }) {
  const [imgSrc, setImgSrc] = useState(user.profilePhoto || fallbackImage);

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
            onError={() => setImgSrc(fallbackImage)}
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
    twitter: "",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:8000/users");
        const result = await res.json();
        setUsers(result.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
      const res = await fetch("http://localhost:8000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        alert("Error: " + (result.message || "Something went wrong"));
      } else {
        setUsers((prev) => [...prev, result.user]);
        setSelectedUser(result.user);
        setFormData({
          firstName: "",
          lastName: "",
          title: "",
          profilePhoto: "",
          linkedIn: "",
          twitter: "",
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
    <div className="min-h-screen bg-gray-100 p-6 overflow-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] w-full max-w-md mx-auto space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Create User</h2>

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

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className="cursor-pointer bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 flex items-center space-x-4 transition hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <img
              src={user.profilePhoto || fallbackImage}
              onError={(e) => (e.target.src = fallbackImage)}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-16 h-16 rounded-full border-2 border-black object-cover"
            />
            <div>
              <h3 className="font-bold text-lg text-black">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-700 text-sm">{user.title}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedUser && (
        <UserCard user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
}
