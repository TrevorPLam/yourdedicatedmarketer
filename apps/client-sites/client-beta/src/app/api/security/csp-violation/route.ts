/**
 * CSP Violation Reporting API Endpoint for Client Beta
 * 
 * Handles Content Security Policy violation reports for security monitoring.
 * Integrates with security logging and alerting systems.
 * 
 * Version: 2.0.0
 * Updated: April 2026
 */

import { NextRequest, NextResponse } from 'next/server';
// import { getSecurityConfig } from '../../../../../../security.config'; // Temporarily commented for Next.js security upgrade

// Violation severity levels
const SEVERITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

type SeverityLevel = typeof SEVERITY_LEVELS[keyof typeof SEVERITY_LEVELS];

// CSP Violation interface
interface CSPViolation {
  'csp-report': {
    documentURI: string;
    referrer: string;
    violatedDirective: string;
    effectiveDirective: string;
    originalPolicy: string;
    disposition: string;
    blockedURI?: string;
    lineNumber?: number;
    columnNumber?: number;
    sourceFile?: string;
    statusCode?: number;
    sample?: string;
  };
}

/**
 * Determine violation severity based on directive and content
 */
function determineSeverity(violation: CSPViolation): SeverityLevel {
  const report = violation['csp-report'];
  
  // High severity violations
  if (report.violatedDirective === 'script-src' || 
      report.violatedDirective === 'object-src' ||
      report.violatedDirective === 'frame-src') {
    return SEVERITY_LEVELS.HIGH;
  }
  
  // Medium severity violations
  if (report.violatedDirective === 'connect-src' ||
      report.violatedDirective === 'style-src' ||
      report.violatedDirective === 'default-src') {
    return SEVERITY_LEVELS.MEDIUM;
  }
  
  // Low severity violations
  return SEVERITY_LEVELS.LOW;
}

/**
 * Sanitize violation data for logging
 */
function sanitizeViolation(violation: CSPViolation): CSPViolation {
  const report = { ...violation['csp-report'] };
  
  // Remove potentially sensitive information
  if (report.blockedURI && report.blockedURI.includes('token=')) {
    report.blockedURI = report.blockedURI.split('token=')[0] + 'token=[REDACTED]';
  }
  
  if (report.documentURI && report.documentURI.includes('session=')) {
    report.documentURI = report.documentURI.split('session=')[0] + 'session=[REDACTED]';
  }
  
  return {
    'csp-report': report,
  };
}

/**
 * Main API handler for CSP violations
 */
export async function POST(request: NextRequest) {
  try {
    // Get request context
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const clientIP = xForwardedFor?.split(',')[0] || 'unknown'; // request.ip is not available in Next.js
    const timestamp = new Date().toISOString();
    
    // Parse violation report
    const violation: CSPViolation = await request.json();
    
    // Validate violation structure
    if (!violation || !violation['csp-report']) {
      return NextResponse.json(
        { error: 'Invalid violation report format' },
        { status: 400 }
      );
    }
    
    // Sanitize violation data
    const sanitizedViolation = sanitizeViolation(violation);
    
    // Determine severity
    const severity = determineSeverity(sanitizedViolation);
    
    // Get security configuration
    // const securityConfig = getSecurityConfig(); // Temporarily commented for Next.js security upgrade
    
    // Log violation with context
    const logEntry = {
      timestamp,
      severity,
      violation: sanitizedViolation,
      context: {
        userAgent,
        clientIP,
        app: 'client-beta',
        environment: process.env.NODE_ENV || 'development', // Fallback for Next.js security upgrade
      },
    };
    
    // Log to console (development) or external service (production)
    if (process.env.NODE_ENV === 'development') { // Simplified for Next.js security upgrade
      console.error('CSP Violation (Client Beta):', JSON.stringify(logEntry, null, 2));
    } else {
      // In production, send to security monitoring service
      // await sendToSecurityMonitoring(logEntry);
      console.error('CSP Violation detected on client beta and logged:', {
        timestamp: logEntry.timestamp,
        severity: logEntry.severity,
        directive: logEntry.violation['csp-report'].violatedDirective,
        clientIP: logEntry.context.clientIP,
      });
    }
    
    // Return success response
    return NextResponse.json(
      { 
        success: true,
        message: 'Violation report received and logged',
        reportId: crypto.randomUUID(),
        timestamp,
        client: 'beta',
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error processing CSP violation report (Client Beta):', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process violation report',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests for CSP violation reports',
    },
    { status: 405 }
  );
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
