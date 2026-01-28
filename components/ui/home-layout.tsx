import * as React from 'react';

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[2000px] mx-auto h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 w-full max-w-[2000px] mx-auto h-full overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {children}
      </div>
    </div>
  );
}

export { HomeLayout };
