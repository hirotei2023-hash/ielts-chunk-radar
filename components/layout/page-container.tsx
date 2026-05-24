// components/layout/page-container.tsx

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="mx-auto max-w-lg pb-20">
      {title && (
        <header className="px-4 pt-4 pb-2">
          <h1 className="text-lg font-bold" style={{ color: "#fafaf9" }}>
            {title}
          </h1>
        </header>
      )}
      <main className="px-4">{children}</main>
    </div>
  );
}
