"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../sidebar";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { AuthContext } from "@/context/AuthProvider";
const bApp = process.env.NEXT_PUBLIC_API_URL;
export default function Results() {
  const { user, setUser, pageloading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedSession, setSelectedSession] = useState("2024/2025");
  const [selectedTerm, setSelectedTerm] = useState("First Term");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  //   const location = useLocation();

  const handleSideBar = (e) => {
    e.preventDefault();
    setSidebarVisible(!sidebarVisible); // Toggle sidebar visibility
  };
  const handleSessionChange = (e) => setSelectedSession(e.target.value);
  const handleTermChange = (e) => setSelectedTerm(e.target.value);
  useEffect(() => {
    if (!user && !pageloading) {
      router.push("/login");
    }
  }, [user, pageloading, router]);

  if (pageloading || !user)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  const userId = user?.id;

  const fetchData = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${bApp}/api/student_result?userId=${userId}&term=${selectedTerm}&session=${selectedSession}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("the results from the backend", data.results);
        setResults(data.results);
      }
    } catch (error) {
      console.error("Internal server error", error);
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
  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();

    // Background color RGB
    const bgcolor = [239, 231, 225];
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set fill color first
    doc.setFillColor(...bgcolor);
    // Draw background rectangle
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Load image
    const img = new Image();
    img.src = "/DE-removebg-preview.png";

    img.onload = () => {
      const imgWidth = 40;
      const imgHeight = 40;
      const imgX = (pageWidth - imgWidth) / 2;
      doc.addImage(img, "PNG", imgX, 10, imgWidth, imgHeight);

      // Add Title
      doc.setFontSize(16);
      doc.text("Academic Result", pageWidth / 2, 60, { align: "center" });
      doc.setFontSize(12);
      doc.text(
        `Student: ${user?.name} | Session: ${selectedSession} | Term: ${selectedTerm}`,
        pageWidth / 2,
        70,
        { align: "center" }
      );

      // Table headers and data
      const tableColumn = [
        "Subject",
        "Test",
        "Exam",
        "Total",
        "Class",
        "Term",
        "Session",
        "Grade",
        "Comment",
      ];

      // Make sure each row has 9 columns href match headers
      const tableRows = results.map((res) => [
        res.subject,
        res.test_score,
        res.exam_score,
        res.totalscore,
        res.class_name,
        res.term,
        res.session, // <-- you missed session here
        res.grade,
        res.comment,
      ]);

      // Generate Table
      autoTable(doc, {
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 41, 37] }, // #3b2925 RGB
      });

      // Summary Section
      let finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(11);
      doc.text("Summary", 14, finalY);
      doc.text("Term Average: 80.4%", 14, finalY + 10);
      doc.text("Class Position: 3rd", 14, finalY + 20);
      doc.text(
        `Teacher's Remark: ${user?.name} has shown remarkable improvement this term. Keep it up!`,
        14,
        finalY + 30
      );

      // Save the PDF
      doc.save("result.pdf");
    };
  };
  return (
    <>
      <div className="d-flex topdiv vh-100">
        {/* Sidebar - Toggled visibility */}
        {sidebarVisible && <Sidebar />}

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
                <h3 className="m-0">Welcome {user.name}</h3>
                <p>{new Date().toDateString()}</p>
              </div>
            </div>
          </div>

          {sidebarVisible && (
            <div className="d-block d-sm-none custom-brown p-3">
              <ul className="nav flex-column text-center">
                <li className="nav-item mb-2">
                  <Link href="/student/dashboard" className="nav-link text-nav">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/student/profile" className="nav-link text-nav">
                    Profile
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/student/results" className="nav-link text-nav">
                    Result
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/student/payment" className="nav-link text-nav">
                    Pay School Fee
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link href="/student/receipt" className="nav-link text-nav">
                    View Receipt
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

          <div className="container my-5">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10">
                <div className="card shadow bg-shadow">
                  <div className="card-header bg-card text-white">
                    <h5 className="mb-0 text-center text-wrap">
                      Academic Results - {user.term}, {user.session} Session
                    </h5>
                  </div>
                  <div className="card-body">
                    <form className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label">Select Term</label>
                        <select
                          className="form-select"
                          value={selectedTerm}
                          onChange={handleTermChange}>
                          <option value="First Term">First Term</option>
                          <option value="Second Term">Second Term</option>
                          <option value="Third Term">Third Term</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Select Session</label>
                        <select
                          className="form-select"
                          value={selectedSession}
                          onChange={handleSessionChange}>
                          <option value="2024/2025">2024/2025</option>
                          <option value="2025/2026">2025/2026</option>
                          <option value="2026/2027">2026/2027</option>
                          <option value="2027/2028">2027/2028</option>
                          <option value="2028/2029">2028/2029</option>
                        </select>
                      </div>

                      <div className="col-md-4 d-flex align-items-end">
                        <button
                          type="button"
                          onClick={fetchData}
                          disabled={loading}
                          className="btn btn-primary w-100">
                          {loading ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"></span>
                              Loading....
                            </>
                          ) : (
                            "Load Result"
                          )}
                        </button>
                      </div>
                    </form>

                    <div className="table-responsive">
                      <table className="table table-bordered table-striped text-center">
                        <thead className="custom-thead">
                          <tr>
                            <th className="text-wrap">Subject</th>
                            <th>Test</th>
                            <th>Exam</th>
                            <th>Total</th>
                            <th className="text-wrap">Class</th>
                            <th>Term</th>
                            <th>Grade</th>
                            <th className="text-wrap">
                              Teacher&apos;s Comment
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.length === 0 ? (
                            <tr>
                              <td colSpan={10}>No results found</td>
                            </tr>
                          ) : (
                            results.map((result) => (
                              <tr key={result.id}>
                                <td>{result.subject}</td>
                                <td>{result.test_score}</td>
                                <td>{result.exam_score}</td>
                                <td>{result.totalscore}</td>
                                <td>{result.class_name}</td>
                                <td>{result.term}</td>
                                <td>{result.grade}</td>
                                <td className="text-start">{result.comment}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Section */}
                    <div className="mt-4">
                      <p>
                        <strong>Term Average:</strong> 80.4%
                      </p>
                      <p>
                        <strong>Class Position:</strong> 3rd
                      </p>
                      <p>
                        <strong>Teacher&apos;s General Remark:</strong>{" "}
                        {user.name} has shown remarkable improvement this term.
                        Keep it up!
                      </p>
                      <button
                        onClick={handleDownloadPDF}
                        className="btn btn-outline-success mt-3">
                        Download Result as PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
