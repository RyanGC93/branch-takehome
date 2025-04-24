import React, { useState, useCallback, useEffect } from "react";
import { FaPills } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const CARD_WIDTH = "350px";
const CARD_HEIGHT = "auto"; //
const BORDER_COLOR = "#e5e7eb";
const BORDER_RADIUS = "0.5rem";
const TEXT_COLOR_DARK = "#1f2937";
const TEXT_COLOR_MEDIUM = "#374151";
const TEXT_COLOR_LIGHT = "#6b7280";
const PRIMARY_COLOR = "#3b82f6";

const cardStyle = {
  border: `1px solid ${BORDER_COLOR}`,
  borderRadius: BORDER_RADIUS,
  marginBottom: "1rem",
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  boxSizing: "border-box",
};

const loadingStyle = {
  ...cardStyle,
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
};

const emptyStyle = {
  ...cardStyle,
};

const emptyContentStyle = {
  padding: "1rem",
  textAlign: "center",
};

const DrugCard = ({ drugData, loading }) => {
  if (loading) {
    return (
      <div style={loadingStyle}>
        <ClipLoader color={PRIMARY_COLOR} size={30} loading={loading} />
      </div>
    );
  }

  if (!drugData) {
    return (
      <div style={emptyStyle}>
        <div style={emptyContentStyle}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "500", color: TEXT_COLOR_DARK }}>
            Drug Details
          </h3>
          <p style={{ fontSize: "0.875rem", color: TEXT_COLOR_LIGHT }}>
            Enter an NDC to view drug information.
          </p>
        </div>
        <div style={{ padding: "1rem", textAlign: "center" }}>
          <p>No drug data to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div
        style={{
          position: "relative",
          padding: "1rem",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <FaPills
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem", 
            fontSize: "1.5rem",
            color: PRIMARY_COLOR,
          }}
        />
        <h3
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: TEXT_COLOR_DARK,
            textAlign: "center",
            margin: 0,
            paddingLeft: "3rem", 
            paddingRight: "1rem",
          }}
        >
          {drugData.Name}
        </h3>
        <p
          style={{
            fontSize: "1rem",
            color: TEXT_COLOR_MEDIUM,
            textAlign: "center",
            margin: "0.25rem 0 0 0",
          }}
        >
          {drugData["Brand Name"]}
        </p>
      </div>
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", marginTop: "1rem", boxSizing: "border-box" }}>
        <p>
          <strong style={{ fontWeight: "500" }}>Drug Class:</strong>{" "}
          {drugData["Drug Class"]}
        </p>
        <p>
          <strong style={{ fontWeight: "500" }}>NDC:</strong> {drugData.NDC}
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
          <strong style={{ fontWeight: "500" }}>Indications:</strong>
          <ul style={{ listStyleType: "disc", paddingLeft: "1.25rem", margin: "0.25rem 0" }}>
            {drugData.Indications &&
              drugData.Indications.map((indication, index) => (
                <li key={index} style={{ textAlign: "left", fontSize: "1rem", color: TEXT_COLOR_MEDIUM }}>
                  {indication}
                </li>
              ))}
          </ul>
        </div>
        <p>
          <strong style={{ fontWeight: "500" }}>Warnings:</strong>{" "}
          {drugData.Warnings}
        </p>
        <p>
          <strong style={{ fontWeight: "500" }}>Image:</strong> {drugData.Image}
        </p>
      </div>
    </div>
  );
};

const DrugSearchApp = () => {
  const [ndc, setNdc] = useState("");
  const [drugCards, setDrugCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrugData = useCallback(async () => {
    if (!ndc) {
      setError("Please enter an NDC.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/drug?NDc=${ndc}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError(`Drug with NDC '${ndc}' not found.`);
        } else {
          setError(`Error: ${response.status} - ${response.statusText}`);
        }
        return;
      }
      const data = await response.json();
      setDrugCards((prevCards) => [...prevCards, data]);
      setNdc("");
    } catch (err) {
      setError(err.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [ndc, setDrugCards]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      fetchDrugData();
    }
  };

  useEffect(() => {
    setPageLoading(true);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  if (pageLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <ClipLoader color={PRIMARY_COLOR} size={50} loading={pageLoading} />
        <span style={{ marginLeft: "1rem" }}>Loading Drug Search App...</span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          "@media (min-width: 640px)": {
            flexDirection: "row",
            alignItems: "center",
          },
          gap: "1rem",
          alignItems: "flex-start",
          marginBottom: "1rem",
          marginLeft: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Enter NDC"
          value={ndc}
          onChange={(e) => setNdc(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            maxWidth: "20rem",
            padding: "0.75rem",
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: "0.375rem",
            boxSizing: "border-box",
          }}
          disabled={loading}
        />
        <button
          onClick={fetchDrugData}
          disabled={loading}
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: PRIMARY_COLOR,
            color: "#fff",
            borderRadius: "0.375rem",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            ":hover": { backgroundColor: "#2563eb" },
            ...(loading ? { opacity: 0.5, cursor: "not-allowed" } : {}),
          }}
        >
          {loading ? "Loading..." : "Add Drug"}
        </button>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: "#fecaca",
            borderColor: "#f87171",
            color: "#b91c1c",
            padding: "1rem",
            borderRadius: "0.375rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
            marginLeft: "1rem",
          }}
        >
          <div
            style={{
              height: "1rem",
              width: "1rem",
              backgroundColor: "currentColor",
              maskImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='h-4 w-4'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' x2='12' y1='8' y2='12'%3E%3C/line%3E%3Cline x1='12' x2='12.01' y1='16' y2='16'%3E%3C/line%3E%3C/svg%3E\")",
              maskSize: "contain",
              maskRepeat: "no-repeat",
            }}
          ></div>
          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Error</h3>
            <p style={{ fontSize: "1rem" }}>{error}</p>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
        }}
      >
        {drugCards.map((drug, index) => (
          <DrugCard key={index} drugData={drug} loading={loading} />
        ))}
      </div>
    </div>
  );
};

export default DrugSearchApp;