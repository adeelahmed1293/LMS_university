import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SubPortalDetails() {
  const { subPortalId } = useParams(); // Get subPortalId from URL
  const [subPortal, setSubPortal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSubPortal() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/subportals/${subPortalId}`);
        if (!res.ok) throw new Error("Failed to fetch sub-portal");

        const data = await res.json();
        setSubPortal(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (subPortalId) fetchSubPortal();
  }, [subPortalId]);

  if (loading) return <div>Loading sub-portal...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!subPortal) return <div>Sub-Portal not found</div>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>{subPortal.title}</h1>
      <p>
        <strong>Type:</strong> {subPortal.type}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {subPortal.description || "No description provided."}
      </p>

      <h3>File:</h3>
      {subPortal.file ? (
        <a
          href={`/api/subportals/file/${subPortal._id}`}
          target="_blank"
          rel="noopener noreferrer"
          download={subPortal.file.filename}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {subPortal.file.filename}
        </a>
      ) : (
        <p>No file uploaded.</p>
      )}
    </div>
  );
}
