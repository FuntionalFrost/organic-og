# Security Policy

## Supported Versions

Only the latest release on the `main` branch receives active security updates and patches.

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

The Organic-OG team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose any findings.

If you believe you have found a security vulnerability in Organic-OG (such as cryptographic HMAC signature bypass, API token leakage, Server-Side Request Forgery via remote image fetching, or denial-of-service in the SVG/Resvg rendering pipeline), **please do NOT open a public GitHub issue or discussion.**

Instead, please send an encrypted or direct email to:

📧 **`devfrost@protonmail.com`**

### What to Include in Your Report

To help us investigate and triage your report quickly, please include:

1. **Vulnerability Type**: (e.g. HMAC validation flaw, SSRF in image fetcher, SQL injection, timing attack).
2. **Component Affected**: Specific endpoint or file (e.g. `/api/og`, `/api/sign`, `/lib/server/og/security.ts`).
3. **Proof of Concept (PoC)**: Clear, step-by-step reproduction instructions, sample curl commands, or script demonstrating the vulnerability.
4. **Impact Assessment**: What an attacker could achieve if exploiting the issue.
5. **Potential Remediation**: Suggestions or draft patches if you have one.

---

## Response Process & Timeline

- **Initial Acknowledgment**: Within **48 hours** of receiving your report.
- **Triage & Assessment**: Within **5 business days**, we will assess severity and confirm impact.
- **Fix & Disclosure**: We will prepare and verify a fix in a private branch. Once deployed or released, we will publish a security advisory and credit you (if desired).

Thank you for helping keep Organic-OG and its users safe!
