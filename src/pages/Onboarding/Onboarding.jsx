import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import FiltersForm from "../../components/filters/FiltersForm";
import { AuthContext } from "../../context/AuthContext";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  return (
    <div className="onboarding-page">
      <FiltersForm
        onSuccess={(profileData) => {
          console.log("✅ Perfil creado:", profileData);

          // 🧠 actualizar contexto global
          setUser({
            ...user,
            profile: profileData,
          });

          // 💾 opcional backup local
          localStorage.setItem(
            "userProfile",
            JSON.stringify(profileData)
          );

          // 🚀 ir al home (hero)
          navigate("/", {
            state: { fromOnboarding: true },
          });
        }}
      />
    </div>
  );
}