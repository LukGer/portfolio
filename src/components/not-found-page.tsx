import PixelTrail from "@/components/pixel-trail";
import useScreenSize from "@/hooks/use-screen-size";

const NotFoundPage: React.FC = () => {
  const screenSize = useScreenSize();

  return (
    <div className="h-screen bg-white text-black flex flex-col font-mono">
      <div className="absolute inset-0 z-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 16 : 24}
          fadeDuration={500}
          pixelClassName="bg-primary"
        />
      </div>

      <div className="justify-center items-center flex flex-col w-full h-full">
        <h2 className="text-[12rem] z-10 pointer-events-none">404</h2>
        <p className="pt-0.5 text-xl z-10 pointer-events-none">
          page not found
        </p>

        <a href="/" className="mt-4 z-10 hover:text-primary">
          Go back home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
