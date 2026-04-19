/*
  # Seed Insights Data

  Inserts 12 sample insights across all three types (Risk, Opportunity, Alert)
  with varying impact and confidence scores for demonstration purposes.
*/

DELETE FROM insights;

INSERT INTO insights (type, title, description, impact_score, confidence_score) VALUES
  ('Risk', 'Market volatility spike detected', 'Unusual trading patterns detected in your target market segments. Consider adjusting risk exposure and review current positions.', 85, 92),
  ('Risk', 'Customer churn acceleration', 'Churn rate increased 34% in Enterprise segment over last 14 days. Recommend immediate retention outreach to top accounts.', 78, 88),
  ('Risk', 'API performance degradation', 'Response times elevated by 45% in production environment. Database query optimization and caching needed.', 65, 95),
  
  ('Opportunity', 'EU market expansion readiness', 'All pre-requisites met for European market entry. Regulatory approvals aligned and market demand indicators positive.', 88, 86),
  ('Opportunity', 'Cross-sell revenue potential', 'Identified $2.4M potential in cross-sell opportunities within existing customer base. Sales team alignment required.', 92, 81),
  ('Opportunity', 'Strategic partnership identified', 'Competitor analysis reveals beneficial partnership with emerging regional player. Technical integration feasible in 8 weeks.', 72, 79),
  
  ('Alert', 'High-value customer activity anomaly', 'Account Acme Corp showing unusual access patterns. Recommend verification of legitimacy to prevent account compromise.', 68, 89),
  ('Alert', 'Upcoming contract renewal window', 'Top 15 enterprise customers approaching renewal dates (30-60 days). Proactive engagement recommended to maximize retention.', 75, 97),
  ('Alert', 'Compliance deadline approaching', 'GDPR data retention policy review due in 21 days. Current system configuration requires audit and adjustment.', 82, 98),
  
  ('Risk', 'Conversion funnel leakage', 'Analysis shows 23% higher drop-off at payment stage vs. industry benchmark. UX testing and optimization required.', 71, 87),
  ('Opportunity', 'AI optimization recommendation', 'Machine learning model suggests 18% efficiency gain through process automation in order fulfillment pipeline.', 81, 84),
  ('Alert', 'Security patch availability', 'Critical security updates available for three primary dependencies. Update recommended within 7 days to maintain compliance.', 87, 99);
