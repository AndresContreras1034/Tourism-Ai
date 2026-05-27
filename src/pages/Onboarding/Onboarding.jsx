import { useContext } from "react";
import FiltersForm from "../../components/filters/FiltersForm";
import { AuthContext } from "../../context/AuthContext";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

export default function Onboarding({ onComplete }) {
  const { user, setUser } = useContext(AuthContext);

  return (
    <div className="onboarding-page">
      <Navbar />

      <main style={{ minHeight: "80vh" }}>
        <FiltersForm
          onSuccess={(profileData) => {
            console.log("✅ Perfil creado:", profileData);

            setUser({
              ...user,
              profile: profileData,
            });

            localStorage.setItem("userProfile", JSON.stringify(profileData));

            // 🔥 abre el modal MFA en lugar de navegar al home
            onComplete?.();
          }}
        />
      </main>

      <Footer />
    </div>
  );
}