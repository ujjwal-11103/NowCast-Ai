import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const TileComponent = ({
  image,
  title,
  navPath,
  navText,
  flag,
  tileDetails,
  titleName,
  isComingSoon
}) => {
  const navigate = useNavigate();

  const handleNavClick = (e) => {
    if (e) e.preventDefault();

    console.log("Nav Click:", { title, isComingSoon, navPath });

    if (isComingSoon) {
      toast.info("Coming soon!", {
        description: "This feature is under development."
      });
      return;
    }

    localStorage.setItem("selective", true);
    localStorage.setItem("currentWise", title);
    localStorage.setItem("tileDetails", JSON.stringify(tileDetails));
    localStorage.setItem("productWise", null);

    navigate(navPath);
  };
  console.log("currentWise", tileDetails);
  return (
    <div className={`p-2 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col gap-1 group/tile w-full ${flag ? "bg-emerald-50/40 border-l-4 border-l-emerald-500 border-emerald-100/60 shadow-emerald-100/50" : "bg-red-50/40 border-l-4 border-l-red-500 border-red-100/60 shadow-red-100/50"
      }`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
            <img src={image} alt="logo" className="h-5 w-auto max-w-[40px] object-contain" />
          </div>
          <span className="font-bold text-slate-800 text-xs font-[Montserrat] tracking-tight">{titleName}</span>
        </div>

        <div
          onClick={handleNavClick}
          className="flex items-center gap-1.5 cursor-pointer group/link px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
        >
          <span className="text-[11px] font-bold text-slate-500 group-hover/link:text-indigo-600 transition-colors uppercase tracking-wide">
            {navText}
          </span>
          <svg className="w-3 h-3 text-slate-400 group-hover/link:text-indigo-600 transition-colors transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-1 gap-x-2 pt-0.5">
        {tileDetails?.map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{item?.title}</span>
            <span className={`text-sm font-extrabold font-[Montserrat] ${item?.title === "ROI"
              ? (flag ? "text-emerald-600" : "text-red-500")
              : "text-slate-700"
              }`}>
              {item?.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileComponent;
