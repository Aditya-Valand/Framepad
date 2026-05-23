import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Img,
} from '@react-email/components';

interface PasswordResetEmailProps {
  resetUrl: string;
  expiresInMinutes?: number;
}

export function PasswordResetEmail({
  resetUrl,
  expiresInMinutes = 15,
}: PasswordResetEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`Reset your Polamuse password — link expires in ${expiresInMinutes} minutes`}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Logo / Brand */}
          <Section style={logoSection}>
            <Text style={logoText}>Polamuse</Text>
          </Section>

          <Hr style={divider} />

          {/* Main content */}
          <Section style={content}>
            <Text style={heading}>Reset your password</Text>
            <Text style={paragraph}>
              We received a request to reset the password for your Polamuse account.
              Click the button below to choose a new password.
            </Text>

            <Section style={buttonContainer}>
              <Link href={resetUrl} style={button}>
                Reset Password
              </Link>
            </Section>

            <Text style={note}>
              This link expires in <strong>{`${expiresInMinutes} minutes`}</strong>.
              If you did not request a password reset, you can safely ignore this email —
              your account is unchanged.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If the button above doesn&apos;t work, paste this URL into your browser:
            </Text>
            <Text style={urlText}>{resetUrl}</Text>
            <Text style={footerSmall}>
              © {new Date().getFullYear()} Polamuse · Physical polaroids from ₹79
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordResetEmail;

/* Styles */
const body: React.CSSProperties = {
  backgroundColor: '#EDE6DC',
  fontFamily: "'DM Sans', Inter, -apple-system, BlinkMacSystemFont, sans-serif",
  margin: 0,
  padding: '40px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  margin: '0 auto',
  maxWidth: 520,
  padding: 0,
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(26,23,20,0.10)',
};

const logoSection: React.CSSProperties = {
  padding: '28px 40px 20px',
};

const logoText: React.CSSProperties = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 26,
  fontWeight: 300,
  fontStyle: 'italic',
  color: '#1A1714',
  margin: 0,
  letterSpacing: '-0.01em',
};

const divider: React.CSSProperties = {
  borderColor: 'rgba(26,23,20,0.08)',
  borderTopWidth: 1,
  margin: '0 40px',
};

const content: React.CSSProperties = {
  padding: '32px 40px 24px',
};

const heading: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  color: '#1A1714',
  margin: '0 0 14px',
  letterSpacing: '-0.01em',
};

const paragraph: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 400,
  color: '#4A4440',
  lineHeight: 1.6,
  margin: '0 0 28px',
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 28px',
};

const button: React.CSSProperties = {
  backgroundColor: '#8B6F5C',
  borderRadius: 100,
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: 15,
  fontWeight: 500,
  letterSpacing: '0.01em',
  padding: '14px 40px',
  textDecoration: 'none',
  textAlign: 'center',
};

const note: React.CSSProperties = {
  fontSize: 13,
  color: '#8A8078',
  lineHeight: 1.6,
  margin: 0,
};

const footer: React.CSSProperties = {
  padding: '20px 40px 28px',
};

const footerText: React.CSSProperties = {
  fontSize: 12,
  color: '#9A9088',
  margin: '0 0 6px',
};

const urlText: React.CSSProperties = {
  fontSize: 11,
  color: '#8B6F5C',
  wordBreak: 'break-all',
  margin: '0 0 20px',
  lineHeight: 1.5,
};

const footerSmall: React.CSSProperties = {
  fontSize: 11,
  color: '#B8B0A8',
  margin: 0,
  letterSpacing: '0.04em',
};
