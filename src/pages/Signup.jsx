import { useState } from "react";
import { account } from "../appwrite/config";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // 🔥 ensure no active session
      try {
        await account.deleteSession("current");
      } catch {}

      await account.create("unique()", email, password);
      await account.createEmailPasswordSession(email, password);

      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1>Signup</h1>

      <form onSubmit={handleSignup}>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
