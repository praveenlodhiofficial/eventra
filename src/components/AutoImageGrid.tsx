import Image from "next/image";

import FramerBlur from "./FramerBlur";

type Props = {
  images: string[];
};

const PATTERN = ["A", "B", "C"] as const;

export function AutoImageGrid({ images }: Props) {
  const groups: string[][] = [];

  for (let i = 0; i < images.length; i += 3) {
    groups.push(images.slice(i, i + 3));
  }

  return (
    <div className="no-scrollbar flex gap-3.5 overflow-hidden overflow-x-auto pb-2">
      {groups.map((group, index) => {
        const type = PATTERN[index % PATTERN.length];

        const widthClass =
          group.length === 3 ? "min-w-[600px]" : "min-w-[300px]";

        return (
          <div key={index} className={`grid ${widthClass} grid-cols-2 gap-3.5`}>
            {/* ================= GROUP OF 3 IMAGES ================= */}
            {group.length === 3 && (
              <>
                {/* Layout A */}
                {type === "A" && (
                  <>
                    <div className="relative col-span-2 h-80">
                      <Image
                        src={group[0]}
                        alt=""
                        fill
                        className="asp rounded-xl object-cover"
                      />
                    </div>
                    {group[1] && (
                      <div className="relative h-45">
                        <Image
                          src={group[1]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                    {group[2] && (
                      <div className="relative h-45">
                        <Image
                          src={group[2]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Layout B */}
                {type === "B" && (
                  <>
                    {group[0] && (
                      <div className="relative h-45">
                        <Image
                          src={group[0]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                    {group[1] && (
                      <div className="relative h-45">
                        <Image
                          src={group[1]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                    {group[2] && (
                      <div className="relative col-span-2 h-80">
                        <Image
                          src={group[2]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Layout C */}
                {type === "C" && (
                  <>
                    {group[0] && (
                      <div className="relative col-span-2 h-45">
                        <Image
                          src={group[0]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                    {group[1] && (
                      <div className="relative h-80">
                        <Image
                          src={group[1]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                    {group[2] && (
                      <div className="relative h-80">
                        <Image
                          src={group[2]}
                          alt=""
                          fill
                          className="asp rounded-xl object-cover"
                        />
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* ================= GROUP OF 2 IMAGES ================= */}
            {group.length === 2 && (
              <div className="col-span-2 grid grid-rows-[0.5fr_1fr] gap-3.5">
                {group.map((src, i) => (
                  <div key={i} className="relative">
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ================= GROUP OF 1 IMAGE ================= */}
            {group.length === 1 && (
              <div className="relative col-span-2 h-80">
                <Image
                  src={group[0]}
                  alt=""
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
