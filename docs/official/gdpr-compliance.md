# GDPR Compliance

## Overview

The General Data Protection Regulation (GDPR) is a comprehensive data protection law that applies to organizations processing personal data of EU residents. This guide covers implementation requirements for marketing agencies managing client data.

**Source**: Based on [GDPR Official Text](https://gdpr-info.eu/) and [ICO GDPR Guidance](https://ico.org.uk/for-organisations/guide-to-data-protection/).

---

## Core Principles

### GDPR Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Lawfulness** | Process data lawfully, fairly, transparently | Consent management, privacy notices |
| **Purpose Limitation** | Collect for specified, explicit purposes | Data classification, access controls |
| **Data Minimization** | Only collect necessary data | Form validation, field restrictions |
| **Accuracy** | Keep data accurate and up-to-date | Update mechanisms, verification |
| **Storage Limitation** | Keep only as long as necessary | Retention policies, auto-deletion |
| **Integrity** | Ensure security and confidentiality | Encryption, access controls, RLS |
| **Accountability** | Demonstrate compliance | Documentation, audit logs, DPO |

### Data Subject Rights

```typescript
// lib/gdpr/rights.ts
export interface DataSubjectRequest {
  userId: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  requestedAt: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  data?: any;
}

// Right to Access (Article 15)
export async function handleAccessRequest(userId: string): Promise<AccessReport> {
  const userData = await gatherUserData(userId);
  
  return {
    personalData: userData.profile,
    processingPurposes: ['marketing', 'analytics', 'account_management'],
    dataRecipients: ['analytics_provider', 'email_service'],
    retentionPeriod: '2 years from last activity',
    dataSource: 'user_registration',
    automatedDecisions: userData.automatedDecisions,
  };
}

// Right to Rectification (Article 16)
export async function handleRectificationRequest(
  userId: string,
  corrections: Partial<UserProfile>
): Promise<void> {
  await sql`
    UPDATE users 
    SET ${sql(corrections)}, 
        updated_at = NOW(),
        rectification_requested = true
    WHERE id = ${userId}
  `;
  
  await logAuditEvent({
    type: 'rectification',
    userId,
    changes: Object.keys(corrections),
  });
}

// Right to Erasure (Article 17) - "Right to be Forgotten"
export async function handleErasureRequest(userId: string): Promise<void> {
  // Anonymize instead of delete for analytics preservation
  await sql`
    UPDATE users
    SET 
      email = CONCAT('deleted_', id, '@example.com'),
      name = 'Deleted User',
      phone = NULL,
      address = NULL,
      deleted_at = NOW(),
      is_active = false
    WHERE id = ${userId}
  `;
  
  // Delete related data
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
  await sql`DELETE FROM email_logs WHERE user_id = ${userId}`;
  
  // Keep anonymized analytics
  await sql`
    UPDATE analytics_events
    SET user_id = NULL
    WHERE user_id = ${userId}
  `;
}

// Right to Data Portability (Article 20)
export async function handlePortabilityRequest(userId: string): Promise<ExportData> {
  const data = await gatherUserData(userId);
  
  return {
    format: 'JSON',
    data: {
      profile: data.profile,
      preferences: data.preferences,
      activity: data.activity,
      exports: data.exports,
    },
    machineReadable: true,
    commonlyUsed: true,
  };
}

// Right to Restriction (Article 18)
export async function handleRestrictionRequest(
  userId: string,
  scope: string[]
): Promise<void> {
  await sql`
    INSERT INTO processing_restrictions (user_id, restricted_scopes, requested_at)
    VALUES (${userId}, ${JSON.stringify(scope)}, NOW())
    ON CONFLICT (user_id) DO UPDATE
    SET restricted_scopes = EXCLUDED.restricted_scopes,
        updated_at = NOW()
  `;
}
```

---

## Legal Basis

### Consent Management

```typescript
// lib/gdpr/consent.ts
interface ConsentRecord {
  userId: string;
  purpose: string;
  granted: boolean;
  grantedAt?: Date;
  withdrawnAt?: Date;
  ipAddress: string;
  userAgent: string;
  version: string;
}

const CONSENT_PURPOSES = {
  marketing: 'Receive marketing emails and promotional content',
  analytics: 'Collect anonymized usage data for improvements',
  third_party: 'Share data with trusted partners',
  profiling: 'Create personalized experiences',
} as const;

export async function recordConsent(
  userId: string,
  purpose: keyof typeof CONSENT_PURPOSES,
  granted: boolean,
  request: Request
): Promise<void> {
  const consent: ConsentRecord = {
    userId,
    purpose,
    granted,
    grantedAt: granted ? new Date() : undefined,
    withdrawnAt: !granted ? new Date() : undefined,
    ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
    version: '2024-01',
  };
  
  await sql`
    INSERT INTO consent_logs (
      user_id, purpose, granted, granted_at, withdrawn_at,
      ip_address, user_agent, version
    ) VALUES (
      ${consent.userId}, ${consent.purpose}, ${consent.granted},
      ${consent.grantedAt}, ${consent.withdrawnAt},
      ${consent.ipAddress}, ${consent.userAgent}, ${consent.version}
    )
  `;
}

export async function hasConsent(
  userId: string,
  purpose: keyof typeof CONSENT_PURPOSES
): Promise<boolean> {
  const result = await sql`
    SELECT granted FROM consent_logs
    WHERE user_id = ${userId}
      AND purpose = ${purpose}
    ORDER BY granted_at DESC
    LIMIT 1
  `;
  
  return result[0]?.granted ?? false;
}

export async function withdrawConsent(
  userId: string,
  purpose?: keyof typeof CONSENT_PURPOSES
): Promise<void> {
  if (purpose) {
    await recordConsent(userId, purpose, false, {} as Request);
  } else {
    // Withdraw all consents
    for (const p of Object.keys(CONSENT_PURPOSES)) {
      await recordConsent(userId, p as any, false, {} as Request);
    }
  }
}

// Consent UI Component
export function getConsentPreferences(userId: string): Promise<ConsentPreferences> {
  return sql`
    SELECT 
      purpose,
      granted,
      granted_at,
      version
    FROM consent_logs
    WHERE user_id = ${userId}
      AND (withdrawn_at IS NULL OR withdrawn_at < granted_at)
    ORDER BY granted_at DESC
  `;
}
```

### Privacy Notice

```typescript
// components/PrivacyNotice.tsx
export function PrivacyNotice() {
  return (
    <div className="privacy-notice">
      <h2>Privacy Notice</h2>
      
      <section>
        <h3>Data Controller</h3>
        <p>Marketing Agency Ltd<br />
        123 Business Street<br />
        London, UK<br />
        Email: privacy@agency.com<br />
        Phone: +44 20 1234 5678</p>
      </section>
      
      <section>
        <h3>Data We Collect</h3>
        <ul>
          <li>Name and contact information</li>
          <li>Company information</li>
          <li>Website usage data</li>
          <li>Communication preferences</li>
        </ul>
      </section>
      
      <section>
        <h3>How We Use Your Data</h3>
        <ul>
          <li>Provide requested services</li>
          <li>Send marketing communications (with consent)</li>
          <li>Improve our services</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>
      
      <section>
        <h3>Your Rights</h3>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion</li>
          <li>Withdraw consent</li>
          <li>Data portability</li>
          <li>Lodge a complaint with ICO</li>
        </ul>
      </section>
      
      <section>
        <h3>Data Retention</h3>
        <p>We retain your personal data for:</p>
        <ul>
          <li>Active accounts: Duration of relationship + 2 years</li>
          <li>Inactive accounts: 2 years from last activity</li>
          <li>Marketing data: Until consent withdrawn</li>
          <li>Legal records: As required by law</li>
        </ul>
      </section>
    </div>
  );
}
```

---

## Data Protection by Design

### Privacy by Default

```typescript
// lib/gdpr/privacy-by-default.ts
export const privacyDefaults = {
  // Data collection defaults
  collection: {
    marketingEmails: false,  // Opt-in required
    analytics: true,           // Legitimate interest, but anonymized
    thirdPartySharing: false, // Opt-in required
    profiling: false,        // Opt-in required
  },
  
  // Visibility defaults
  visibility: {
    profilePublic: false,
    emailVisible: false,
    activityVisible: false,
  },
  
  // Retention defaults
  retention: {
    inactiveAccountDays: 730, // 2 years
    marketingDataDays: 365,
    analyticsDataDays: 1095,  // 3 years
  },
};

// Apply privacy defaults on user creation
export async function createUserWithPrivacyDefaults(
  email: string,
  name: string
): Promise<User> {
  return await sql`
    INSERT INTO users (
      email, name, 
      marketing_consent, analytics_consent,
      third_party_consent, profiling_consent,
      profile_public, email_visible,
      created_at
    ) VALUES (
      ${email}, ${name},
      ${privacyDefaults.collection.marketingEmails},
      ${privacyDefaults.collection.analytics},
      ${privacyDefaults.collection.thirdPartySharing},
      ${privacyDefaults.collection.profiling},
      ${privacyDefaults.visibility.profilePublic},
      ${privacyDefaults.visibility.emailVisible},
      NOW()
    )
    RETURNING *
  `;
}
```

### Data Minimization

```typescript
// lib/gdpr/data-minimization.ts
// Only collect necessary fields
const requiredFields = ['email', 'name'];
const optionalFields = ['company', 'phone', 'job_title'];
const marketingFields = ['interests', 'budget_range'];

export function validateFormData(data: FormData): ValidationResult {
  const errors: string[] = [];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!data.get(field)) {
      errors.push(`${field} is required`);
    }
  }
  
  // Validate no unexpected sensitive data
  const sensitivePatterns = [
    /ssn/i, /social.?security/i,
    /passport/i, /driver.?license/i,
    /credit.?card/i, /bank.?account/i,
  ];
  
  const formData = Object.fromEntries(data.entries());
  for (const [key, value] of Object.entries(formData)) {
    for (const pattern of sensitivePatterns) {
      if (pattern.test(key) || pattern.test(String(value))) {
        errors.push(`Sensitive data detected in field: ${key}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Auto-delete old data
export async function runDataRetentionCleanup(): Promise<void> {
  // Delete inactive accounts
  await sql`
    DELETE FROM users
    WHERE last_activity < NOW() - INTERVAL '2 years'
      AND is_active = false
  `;
  
  // Anonymize old analytics
  await sql`
    UPDATE analytics_events
    SET user_id = NULL,
        ip_address = '0.0.0.0',
        user_agent = 'anonymized'
    WHERE created_at < NOW() - INTERVAL '3 years'
  `;
  
  // Delete expired consents
  await sql`
    DELETE FROM consent_logs
    WHERE withdrawn_at IS NOT NULL
      AND withdrawn_at < NOW() - INTERVAL '1 year'
  `;
}
```

---

## Security Measures

### Technical Safeguards

```typescript
// lib/gdpr/security.ts
// Encryption at rest
export function encryptSensitiveData(data: string): EncryptedData {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

// Pseudonymization
export function pseudonymizeUser(userId: string): string {
  // Create irreversible pseudonym
  return crypto
    .createHash('sha256')
    .update(userId + process.env.PEPPER)
    .digest('hex')
    .slice(0, 16);
}

// Access logging
export async function logDataAccess(
  userId: string,
  dataSubjectId: string,
  action: string,
  purpose: string
): Promise<void> {
  await sql`
    INSERT INTO data_access_logs (
      accessor_id, subject_id, action, purpose, 
      accessed_at, ip_address
    ) VALUES (
      ${userId}, ${dataSubjectId}, ${action}, ${purpose},
      NOW(), ${getClientIP()}
    )
  `;
}
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all personal data tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_own_data ON users
  FOR ALL
  USING (auth.uid() = id);

-- Admins can see all data (with logging)
CREATE POLICY admin_access ON users
  FOR ALL
  TO admin_role
  USING (true)
  WITH CHECK (log_access_attempt());

-- Function to log admin access
CREATE OR REPLACE FUNCTION log_access_attempt()
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO admin_access_logs (admin_id, action, performed_at)
  VALUES (current_user, TG_OP, NOW());
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

---

## Breach Notification

### Detection and Response

```typescript
// lib/gdpr/breach-management.ts
interface DataBreach {
  id: string;
  detectedAt: Date;
  discoveredBy: string;
  type: 'unauthorized_access' | 'data_loss' | 'ransomware' | 'insider_threat';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedUsers: number;
  affectedDataCategories: string[];
  description: string;
  containmentActions: string[];
  notificationSent: boolean;
  notificationSentAt?: Date;
  supervisoryAuthorityNotified: boolean;
  supervisoryAuthorityNotifiedAt?: Date;
}

export async function reportDataBreach(breach: Omit<DataBreach, 'id'>): Promise<void> {
  const breachId = generateUUID();
  
  // Log breach
  await sql`
    INSERT INTO data_breaches (
      id, detected_at, discovered_by, type, severity,
      affected_users, affected_data_categories, description,
      containment_actions
    ) VALUES (
      ${breachId}, ${breach.detectedAt}, ${breach.discoveredBy},
      ${breach.type}, ${breach.severity}, ${breach.affectedUsers},
      ${JSON.stringify(breach.affectedDataCategories)},
      ${breach.description}, ${JSON.stringify(breach.containmentActions)}
    )
  `;
  
  // Notify DPO immediately
  await notifyDPO(breachId, breach);
  
  // If high risk to individuals, notify supervisory authority within 72 hours
  if (['high', 'critical'].includes(breach.severity)) {
    await notifySupervisoryAuthority(breachId, breach);
  }
}

async function notifyDPO(breachId: string, breach: any): Promise<void> {
  await sendEmail({
    to: process.env.DPO_EMAIL!,
    subject: `URGENT: Data Breach Report - ${breachId}`,
    body: `
      A data breach has been detected:
      
      ID: ${breachId}
      Type: ${breach.type}
      Severity: ${breach.severity}
      Affected Users: ${breach.affectedUsers}
      Detected: ${breach.detectedAt}
      
      Description: ${breach.description}
      
      Immediate actions taken:
      ${breach.containmentActions.map(a => `- ${a}`).join('\n')}
    `,
  });
}

async function notifySupervisoryAuthority(
  breachId: string,
  breach: any
): Promise<void> {
  // ICO notification (UK)
  const notification = {
    breachId,
    nature: breach.type,
    categories: breach.affectedDataCategories,
    approximateNumber: breach.affectedUsers,
    likelyConsequences: getLikelyConsequences(breach),
    measuresTaken: breach.containmentActions,
    contactDetails: {
      dpo: process.env.DPO_EMAIL,
      organization: 'Marketing Agency Ltd',
    },
  };
  
  // Submit via ICO online form or API
  await submitICONotification(notification);
  
  // Update breach record
  await sql`
    UPDATE data_breaches
    SET supervisory_authority_notified = true,
        supervisory_authority_notified_at = NOW()
    WHERE id = ${breachId}
  `;
}
```

---

## Documentation Requirements

### Records of Processing

```typescript
// lib/gdpr/records.ts
interface ProcessingRecord {
  activity: string;
  purpose: string;
  dataCategories: string[];
  dataSubjects: string[];
  recipients: string[];
  thirdCountryTransfers?: {
    country: string;
    safeguards: string;
  }[];
  retentionPeriod: string;
  securityMeasures: string[];
  dpoContact: string;
}

const recordsOfProcessing: ProcessingRecord[] = [
  {
    activity: 'Client contact management',
    purpose: 'Provide marketing services',
    dataCategories: ['name', 'email', 'phone', 'company', 'job_title'],
    dataSubjects: ['prospects', 'clients'],
    recipients: ['internal_staff', 'crm_system'],
    retentionPeriod: 'Duration of relationship + 2 years',
    securityMeasures: ['encryption', 'access_controls', 'audit_logs'],
    dpoContact: 'privacy@agency.com',
  },
  {
    activity: 'Email marketing',
    purpose: 'Send promotional content',
    dataCategories: ['email', 'name', 'preferences', 'engagement_history'],
    dataSubjects: ['subscribers'],
    recipients: ['email_service_provider'],
    thirdCountryTransfers: [
      { country: 'US', safeguards: 'Standard Contractual Clauses' },
    ],
    retentionPeriod: 'Until consent withdrawn',
    securityMeasures: ['encryption', 'consent_management'],
    dpoContact: 'privacy@agency.com',
  },
];

export async function generateROPA(): Promise<string> {
  // Generate Records of Processing Activities report
  const report = recordsOfProcessing.map(record => `
    Activity: ${record.activity}
    Purpose: ${record.purpose}
    Data Categories: ${record.dataCategories.join(', ')}
    Data Subjects: ${record.dataSubjects.join(', ')}
    Recipients: ${record.recipients.join(', ')}
    Retention: ${record.retentionPeriod}
    Security: ${record.securityMeasures.join(', ')}
    DPO: ${record.dpoContact}
    
    ${record.thirdCountryTransfers 
      ? `Transfers: ${record.thirdCountryTransfers.map(t => 
          `${t.country} (${t.safeguards})`
        ).join(', ')}`
      : ''}
  `).join('\n---\n');
  
  return report;
}
```

---

## Compliance Checklist

### Technical Implementation

- [ ] Consent management system implemented
- [ ] Privacy notice accessible and comprehensive
- [ ] Data subject rights API implemented
- [ ] RLS policies on personal data tables
- [ ] Encryption for sensitive data fields
- [ ] Audit logging for data access
- [ ] Data retention automation
- [ ] Breach detection and notification
- [ ] Cookie consent banner
- [ ] Data portability export format

### Organizational

- [ ] DPO appointed (if required)
- [ ] Privacy policy published
- [ ] Data processing agreements signed
- [ ] Staff training completed
- [ ] Records of processing maintained
- [ ] DPIA for high-risk processing
- [ ] International transfer mechanisms
- [ ] Breach response procedures
- [ ] Regular compliance audits

---

## Resources

### Official Guidance
- [GDPR Text](https://gdpr-info.eu/)
- [ICO Guide to GDPR](https://ico.org.uk/for-organisations/guide-to-data-protection/)
- [EU Commission GDPR](https://commission.europa.eu/law/law-topic/data-protection/data-protection-eu_en)

### Tools
- [Cookie Consent Banner](https://github.com/orestbida/cookieconsent)
- [GDPR Compliance Checker](https://gdpr.eu/compliance-checklist/)

---

_Updated April 2026 based on GDPR requirements and best practices._
