import { useState } from "react";
import { Link } from "react-router-dom";
import AdminSideBar from "../adminsidebar";

const ListOfResult = () => {
  // State to toggle sidebar visibility
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTerm, setCurrentTerm] = useState("First Term");
  const [selectedClass, setSelectedClass] = useState("SS1");
  const [session, setSession] = useState("2024/2025");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState(null);
  const [students, setStudents] = useState([]);

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userName = userInfo?.name;

  const HandleStudentLoading = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${bApp}/api/get-student?classname=${selectedClass}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      console.log(data);
      setStudents(data.results);
    } catch (error) {
      alert(error.message);
      console.error("error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${bApp}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // sends the cookie
      });

      if (response.ok) {
        alert("Logged out successfully");
        localStorage.removeItem("userInfo");
        navigate("/login");
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
    <>
      <div className="d-flex topdiv vh-100">
        {/* TeacherSidebar - Toggled visibility */}
        {sidebarVisible && <AdminSideBar />}

        <div className="flex-grow-1">
          {/* Top Bar */}
          <div className="custom-topbar d-flex justify-content-between align-items-center py-2 px-3 shadow-sm">
            <div className="d-flex ">
              <button
                className="btn ms-3 me-3 click-custom"
                onClick={handleSideBar}>
                {sidebarVisible ? (
                  <i className="fa fa-times" aria-hidden="true"></i>
                ) : (
                  <i className="fa fa-bars" aria-hidden="true"></i>
                )}
              </button>
              <div className="d-flex flex-column ">
                <h3 className="m-0">Welcome John Doe Mushin</h3>
                <p>{new Date().toDateString()}</p>
              </div>
            </div>
          </div>

          {sidebarVisible && (
            <div className="d-block d-sm-none custom-brown p-3">
              <ul className="nav flex-column text-center">
                <li className="nav-item mb-2">
                  <Link to="/admin_dashboard" className="nav-link text-nav">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link to="/admin/users" className="nav-link text-nav">
                    View Students
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link to="/admin/teachers" className="nav-link text-nav">
                    View Teachers
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/admin/academics/pendingresults"
                    className="nav-link text-nav">
                    View Uploaded Results
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link
                    to="/admin/academics/receipts"
                    className="nav-link text-nav">
                    Payment History
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <button onClick={handleLogout} className="sm-logout-btn">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          <div className="container head-mg">
            <h4 className="mb-4">Uploaded Results</h4>
            <div className="mb-3 text-end">
              <Link to="#" className="btn btn-secondary">
                Upload New Result
              </Link>
            </div>
            <table className="table table-striped table-hover">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Term</th>
                  <th>Session</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                <tr>
                  <td>1</td>
                  <td>Chika Nwosu</td>
                  <td>SS1</td>
                  <td>1st Term</td>
                  <td>2024/2025</td>
                  <td>
                    <span className="badge bg-success">Approved</span>
                  </td>
                  <td>
                    <Link to="#" className="btn btn-sm btn-primary">
                      View
                    </Link>
                    <Link to="#" className="btn btn-sm btn-warning">
                      Edit
                    </Link>
                    <Link to="#" className="btn btn-sm btn-danger">
                      Delete
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListOfResult;
