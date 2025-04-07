import Head from "next/head";

export default function BlogHead() {
  return (
    <Head>
      {/* Inline critical CSS */}
      <style>{`
        /* Only the most critical above-the-fold styles */
        body { background-color: #F8F8F8; }
        .header { font-family: 'Poppins', sans-serif; }
      `}</style>

      {/* Link to non-critical CSS */}
      <link 
        rel="stylesheet" 
        href="/styles/non-critical.css" 
        media="print" 
        onLoad={(e) => {
          (e.target as HTMLLinkElement).media = 'all';
        }}
      />
    </Head>
  );
}
