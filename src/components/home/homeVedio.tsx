export default function HomeVedio() {
  return (
    <div className="flex justify-center items-center mb-10">
      <iframe
        //   width=""
        //   height="514"
        src="https://www.youtube.com/embed/FLL63GwTaFQ"
        allowFullScreen
        className="rounded-lg shadow-lg overflow-hidden md:w-[80%] w-full h-[300px] md:h-[737px]"
      ></iframe>
    </div>
  );
}
