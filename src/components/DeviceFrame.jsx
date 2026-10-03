export default function DeviceFrame({ children }) {
  return (
    <div className="md:max-w-[400px] md:mx-auto md:mt-10 md:h-[800px] md:rounded-[3rem] md:overflow-hidden md:border-[14px] md:border-black md:shadow-2xl relative bg-gray-950 h-screen w-full overflow-hidden">
      {/* Notch */}
      <div className="hidden md:block absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-40 mx-auto z-50"></div>
      {children}
    </div>
  );
}
