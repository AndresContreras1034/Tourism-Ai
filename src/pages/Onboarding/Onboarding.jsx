import { useContext } from "react";
import FiltersForm from "../../components/filters/FiltersForm";
import { AuthContext } from "../../context/AuthContext";

export default function Onboarding({ onComplete }) {
  const { user, setUser } = useContext(AuthContext);

  return (
    <div className="onboarding-page">
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
    </div>
  );
}