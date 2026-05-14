"use client";

export default function Error({ reset }) {
  return (
    <div className="w-full max-w-md text-center p-8">
      <h1 className="text-xl mb-2">This page didn&apos;t load</h1>
      <p className="text-muted-foreground mb-6">
        Something went wrong on our end. You can try refreshing or head back home.
      </p>
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          type="button"
          className="btn bg-primary text-foreground border border-transparent"
          onClick={() => reset()}
        >
          Try again
        </button>
        <a className="btn bg-secondary text-accent border border-accent" href="/">
          Go home
        </a>
      </div>
    </div>
  );
}
