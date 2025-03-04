'use client';

import ConnectButton from '../components/ConnectButton';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b">
        <Image src="/lit.svg" alt="Lit logo" width={32} height={32}></Image>
        <a
          href="https://developer.litprotocol.com/?ref=demo.getlit.dev"
          target="_blank"
          rel="noopener nofollow"
          className="lit-cta"
        >
          Build on Lit
        </a>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <ConnectButton />
      </main>
      <footer className="p-4 text-center border-t">
        <a
          href="https://github.com/LIT-Protocol/pkp-social-auth-example"
          target="_blank"
          rel="noopener nofollow"
          className="footer-link"
        >
          View the source code
        </a>
      </footer>
    </div>
  );
}
