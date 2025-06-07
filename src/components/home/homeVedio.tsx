export default function HomeVideo() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 md:py-20">
      {/* Left Section: Text Content */}
      <div className="w-full md:w-1/2 pr-10">
        <div className="border-l-8 rounded-lg border-primary-800 pl-4 mb-8">
          <h1 className="text-3xl font-bold">Stories in Videos</h1>
          <p>Youtube Videos</p>
        </div>
        <p className="text-gray-600 mb-4 text-lg">
          See how we are making a difference, from local communities to global
          projects. Our videos show the work we do and the stories behind it.
          <p className="mt-3">
          Visit our YouTube channel to follow our latest updates and projects
          from around the world.
          </p>
        </p>
      </div>

      {/* Right Section: Video Embed */}
      <div className="relative w-full md:w-[65%]">
        <iframe
          src="https://www.youtube.com/embed/FLL63GwTaFQ"
          allowFullScreen
          className="rounded-2xl shadow-lg sm:w-[90%] w-full h-[200px] md:h-[440px]"
        ></iframe>
        {/* Caption Overlay with Small Primary Background */}
     <div className="absolute md:-bottom-6 -bottom-3 -z-10 md:right-4 -right-3 bg-primary-100 px-3 py-1 text-sm text-white h-32 w-32 rounded-2xl">
     </div>
      </div>
    </div>
  );
}
