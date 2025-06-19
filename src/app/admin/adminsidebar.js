"use client";

import { useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { AuthContext } from "@/context/AuthProvider";
const bApp = process.env.NEXT_PUBLIC_API_URL;
export default function AdminSideBar() {
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
      />
      <ul className="nav flex-column text-center mt-5 ">
        <li className="nav-item  mb-3">
          <Link href="/admin/dashboard" className="nav-link text-white">
            Dashboard
          </Link>
        </li>
        <li className="nav-item mb-3">
          <div className="dropdown">
            <Link
              className="new-btn dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              Student Management
            </Link>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link className="dropdown-item" href="/admin/addNewStudent">
                  Add New Student
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/admin/users">
                  View Students
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="nav-item mb-3">
          <div className="dropdown">
            <Link
              className="new-btn dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              Teacher Management
            </Link>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link className="dropdown-item" href="/admin/addNewTeacher">
                  Add New Teacher
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" href="/admin/teachers">
                  View Teachers
                </Link>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item mb-3">
          <div className="dropdown">
            <Link
              className="new-btn dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              Academics Management
            </Link>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link
                  className="dropdown-item"
                  href="/admin/academics/pendingresults">
                  View Uploaded Results
                </Link>
              </li>
            </ul>
          </div>
        </li>

        <li className="nav-item mb-3">
          <div className="dropdown">
            <Link
              className="new-btn dropdown-toggle"
              href="#"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false">
              Finance
            </Link>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link
                  className="dropdown-item"
                  href="/admin/academics/receipts">
                  Payment History
                </Link>
              </li>
            </ul>
          </div>
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
