import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth.css';

type AuthCardProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLinkTo: string;
  footerLinkLabel: string;
};

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkTo,
  footerLinkLabel,
}: AuthCardProps) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon" aria-hidden="true">
            ✦
          </div>
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>
        {children}
        <p className="auth-footer">
          {footerText} <Link to={footerLinkTo}>{footerLinkLabel}</Link>
        </p>
      </div>
    </div>
  );
}
