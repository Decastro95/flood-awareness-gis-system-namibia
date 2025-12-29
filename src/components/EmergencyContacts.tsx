export default function EmergencyContacts() {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: "#fee2e2" }}>
          🚨
        </div>
        <h3 className="card-title">Emergency Contacts</h3>
      </div>

      <div style={{ fontSize: "0.95rem", color: "#374151" }}>
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontWeight: "600", color: "#dc2626", marginBottom: "0.25rem" }}>
            General Emergency
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>112</div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
            Namibian Police
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>10111</div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
            Fire Department
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>10111</div>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
            Namibia Red Cross
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>+264 61 411 100</div>
        </div>
      </div>

      <div style={{
        marginTop: "1rem",
        padding: "0.75rem",
        backgroundColor: "#fef2f2",
        borderRadius: "6px",
        border: "1px solid #fecaca"
      }}>
        <p style={{ margin: "0", fontSize: "0.8rem", color: "#991b1b", fontWeight: "500" }}>
          ⚠️ Always call emergency services immediately in case of danger. This information is for public awareness only.
        </p>
      </div>
    </div>
  );
}
