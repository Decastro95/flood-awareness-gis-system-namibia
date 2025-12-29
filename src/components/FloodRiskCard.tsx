"use client";

export default function FloodRiskCard() {
  // Mock flood risk data - in a real app, this would come from sensors/API
  const getRiskLevel = () => {
    const hour = new Date().getHours();
    // Simulate higher risk during certain hours
    if (hour >= 18 && hour <= 6) {
      return { level: "MONITOR", color: "moderate", icon: "👀" };
    } else if (Math.random() > 0.7) { // Random high risk for demo
      return { level: "HIGH", color: "high", icon: "🚨" };
    } else {
      return { level: "LOW", color: "low", icon: "✅" };
    }
  };

  const riskData = getRiskLevel();

  return (
    <div className={`card status-card status-${riskData.color}`}>
      <div className="card-header">
        <div className="card-icon" style={{
          backgroundColor: riskData.color === 'high' ? '#fee2e2' :
                          riskData.color === 'moderate' ? '#fef3c7' : '#dcfce7'
        }}>
          {riskData.icon}
        </div>
        <h3 className="card-title">Flood Risk Assessment</h3>
      </div>

      <div className="status-indicator">
        <span>{riskData.icon}</span>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {riskData.level} RISK LEVEL
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            Current assessment
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
        </div>
        <div>
          <strong>Next Check:</strong> {new Date(Date.now() + 3600000).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
