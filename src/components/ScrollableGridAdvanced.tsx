import { Image } from "@imagekit/next";

const ScrollableGrid = ({
  images,
  urlEndpoint,
}: {
  images: { id: string; url: string }[];
  urlEndpoint: string;
}) => {
  // Calculate how many columns we need based on the number of images
  // This creates a nice distribution across multiple columns
  const getColumns = (imageCount: number): number => {
    if (imageCount <= 3) return 1;
    if (imageCount <= 8) return 2;
    if (imageCount <= 15) return 3;
    return Math.ceil(imageCount / 5);
  };

  const columns = getColumns(images.length);

  // Distribute images across columns in a round-robin fashion
  const distributeImages = () => {
    const cols: { id: string; url: string }[][] = Array.from(
      { length: columns },
      () => []
    );
    images.forEach((image, index) => {
      cols[index % columns].push(image);
    });
    return cols;
  };

  const columnData = distributeImages();

  return (
    <section className="w-full max-w-full space-y-5 md:space-y-8">
      <h1 className="mx-auto max-w-4xl px-4 text-2xl font-semibold md:text-3xl">
        Event Gallery
      </h1>

      {/* Scrollable container */}
      <div className="no-scrollbar overflow-x-auto scroll-smooth">
        <div className="flex min-w-max gap-3 px-4 md:gap-4">
          {columnData.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-3 md:gap-4">
              {column.map((image, imgIndex) => {
                // Vary the heights for a more dynamic look
                const heights = ["h-48", "h-64", "h-56", "h-72", "h-60"];
                const heightClass =
                  heights[(colIndex + imgIndex) % heights.length];

                return (
                  <div
                    key={image.id}
                    className={`relative w-64 md:w-80 ${heightClass} overflow-hidden rounded-lg`}
                  >
                    <Image
                      urlEndpoint={urlEndpoint}
                      src={image.url}
                      alt={image.url}
                      fill
                      className="object-cover"
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollableGrid;
