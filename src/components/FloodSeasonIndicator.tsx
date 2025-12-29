export default function FloodSeasonIndicator() {
  const month = new Date().getMonth(); // 0 = Jan

  const isFloodSeason = month >= 10 || month <= 3; // Nov–Apr
  const isPeak =
    month === 0 || month === 1 || month === 2; // Jan–Mar

  const getStatusInfo = () => {
    if (isPeak) {
      return {
        status: "Peak Flood Risk",
        period: "(Jan–Mar)",
        color: "high",
        icon: "⚠️"
      };
    } else if (isFloodSeason) {
      return {
        status: "Flood Season Active",
        period: "(Nov–Apr)",
        color: "moderate",
        icon: "🌧️"
      };
    } else {
      return {
        status: "Low Flood Risk Period",
        period: "(May–Oct)",
        color: "low",
        icon: "✅"
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className={`card status-card status-${statusInfo.color}`}>
      <div className="card-header">
        <div className="card-icon" style={{ backgroundColor: statusInfo.color === 'high' ? '#fee2e2' : statusInfo.color === 'moderate' ? '#fef3c7' : '#dcfce7' }}>
          {statusInfo.icon}
        </div>
        <h3 className="card-title">Flood Season Status</h3>
      </div>
      <div className="status-indicator">
        <span>{statusInfo.icon}</span>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {statusInfo.status}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
            {statusInfo.period}
          </div>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '1rem' }}>
        Monitor weather conditions and stay prepared for potential flooding.
      </p>
    </div>
  );
}
