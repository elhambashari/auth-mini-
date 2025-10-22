import { useState } from "react";
import SignIn from "./pages/signIn.js";
import SignUp from "./pages/signUp.js";
import "./App.css";

function App() {
  const [page, setPage] = useState<"signin" | "signup">("signin");

  return (
    <div className="container">
      <div>
        <button onClick={() => setPage("signin")}>Sign In</button>
        <button onClick={() => setPage("signup")}>Sign Up</button>
      </div>

      {page === "signin" ? <SignIn /> : <SignUp />}
    </div>
  );
}

export default App;
