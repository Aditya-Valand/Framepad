'use client'

export const dynamic = 'force-dynamic'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#EDE6DC',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.6rem',
            fontStyle: 'italic',
            fontWeight: 300,
            color: '#5C4A3A',
            marginBottom: 8,
          }}>
            Something went wrong.
          </div>
          <p style={{ fontSize: 13, color: '#A39080', marginBottom: 24 }}>
            An unexpected error occurred.
          </p>
          <button
            onClick={() => reset()}
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 13,
              fontWeight: 500,
              background: '#8B6F5C',
              color: '#fff',
              border: 'none',
              borderRadius: 100,
              padding: '9px 22px',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
