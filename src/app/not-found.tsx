'use client';

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-6 text-center">
      <div>
        <h1 className="font-display text-5xl text-walnut">404</h1>
        <p className="mt-2 text-charcoal/80">
          The page you’re looking for doesn’t exist.
        </p>
      </div>
    </main>
  );
}