import { useAuth } from "../context/AuthContext";
import { account } from "../appwrite/config";

function Home() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div>
      <h1>Home (Protected)</h1>

      {user && (
        <>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  );
}

export default Home;
