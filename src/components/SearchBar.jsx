export default function SearchBar() {
  return (
    <div className="sticky top-0 z-40 p-4 bg-gray-950/80 backdrop-blur-xl">
      <input 
        type="text" 
        placeholder="Search memories... try 'golden sunset lake'" 
        className="w-full bg-white/10 text-white rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
      />
    </div>
  );
}
