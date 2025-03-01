import React from "react";

const Announcements = () => {
  return (
    <div className="bg-white rounded-xl p-4">
      {/* title  */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-gray-400 text-xs">View All</span>
      </div>
      {/* announcements  */}
      <div className="flex flex-col gap-4 mt-4">
        {/* announcement 1  */}
        <div className="bg-customSkyLight rounded-md p-4 mt-1">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-gray-400 text-xs bg-white rounded-md px-1 py-1">25-01-01</span>
          </div>
          <p className="text-gray-400 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </div>
        {/* announcement 2  */}
        <div className="bg-customPurpleLight rounded-md p-4 mt-1">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-gray-400 text-xs bg-white rounded-md px-1 py-1">25-01-01</span>
          </div>
          <p className="text-gray-400 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </div>
        {/* announcement 3  */}
        <div className="bg-customYellowLight rounded-md p-4 mt-1">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Lorem ipsum dolor sit</h2>
            <span className="text-gray-400 text-xs bg-white rounded-md px-1 py-1">25-01-01</span>
          </div>
          <p className="text-gray-400 text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
