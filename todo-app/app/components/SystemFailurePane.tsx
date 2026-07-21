const SystemFailurePane = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <div className="rounded-xl border border-red-200 bg-red-50 px-8 py-6 text-center">
        <h2 className="text-3xl font-extrabold text-red-900 mb-2">
          System Failure
        </h2>
        <p className="text-lg text-red-900">
          Todo App is currently unhealthy. Please wait for recovery.
        </p>
      </div>
    </div>
  );
};

export default SystemFailurePane;
