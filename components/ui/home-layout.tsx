function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto h-screen w-full max-w-[2000px] overflow-hidden">
      <div className="from-background via-background to-primary/5 mx-auto grid h-full w-full max-w-[2000px] grid-cols-1 gap-8 overflow-hidden bg-gradient-to-br p-8 *:h-full *:min-h-0 lg:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

export { HomeLayout };
