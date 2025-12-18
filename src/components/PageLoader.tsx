const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-muted border-t-accent animate-spin" />
      </div>
    </div>
  );
};

export default PageLoader;
