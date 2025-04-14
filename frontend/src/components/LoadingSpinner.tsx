const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-oceanTeal border-t-primary-sageGreen"></div>
      <p className="text-primary-oceanTeal font-medium">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;