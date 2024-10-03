const Page = () => {
  return (
    <div className="notification bg-white border border-gray-300 rounded-lg shadow-md p-4 mb-4 flex items-start">
      <div className="notification-icon mr-4">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-3-3v6m3-3H9m2-5h2m-2 5h2m-2 5h2m-2-5h2m-2-5h2m-2 5h2"
          />
        </svg>
      </div>
      <div className="notification-content">
        <p className="text-gray-800 font-semibold">User John Doe</p>
        <p className="text-gray-600 text-sm">
          updated the profile information at 10:30 AM
        </p>
        <p className="text-gray-600 text-sm">October 3, 2024</p>
      </div>
    </div>
  );
};

export default Page;
