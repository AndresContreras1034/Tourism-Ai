import "./Login.css";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="login-page">
      {/* NAVBAR (SIN PROPS - USA AUTHCONTEXT) */}
      <Navbar />

      {/* MAIN — LoginForm maneja todo: login, MFA, redirect */}
      <main className="login-content">
        <LoginForm />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}