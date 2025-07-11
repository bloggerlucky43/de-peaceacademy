import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { AuthContext } from "@/context/AuthProvider";
export default function TeacherSidebar() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${bApp}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // sends the cookie
      });

      if (response.ok) {
        alert("Logged out successfully");
        setUser(null);
        localStorage.removeItem("userInfo");
        router.push("/login");
      } else {
        const data = await response.json();
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout");
    }
  };
  return (
    <div className="d-none d-sm-block d-flex flex-column p-3 text-white custom-nav align-items-center">
      <Image
        src="/DE.png"
        alt="schoollogo"
        width={70}
        height={70}
        className="rounded mx-auto d-block custom-logo"
        loading="lazy"
      />
      <ul className="nav flex-column text-center mt-5 ">
        <li className="nav-item  mb-2">
          <Link href="/teacher/dashboard" className="nav-link text-white">
            Dashboard
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link href="/teacher/edit/results" className="nav-link text-white">
            Edit Result
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link href="/teacher/results" className="nav-link text-white">
            Upload Result
          </Link>{" "}
        </li>

        <li className="nav-item">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
