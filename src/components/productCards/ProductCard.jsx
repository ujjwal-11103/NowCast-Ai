import React from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  image,
  navPath,
  navText,
  flag,
  productName,
  productNameTitle,
  productDetails,
  isComingSoon
}) => {
  const navigate = useNavigate();

  const handleNavClick = (e) => {
    if (e) e.preventDefault();

    if (isComingSoon) {
      toast.info("Coming soon!", {
        description: "This feature is under development."
      });
      return;
    }

    localStorage.setItem("selective", true);
    localStorage.setItem("productWise", productName);
    localStorage.setItem("currentWise", null);

    navigate(navPath);
  };
  return (
    <div className={`rounded-xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group/card w-full ${flag ? "bg-emerald-50/30 border-emerald-200 shadow-emerald-50/50" : "bg-red-50/30 border-red-200 shadow-red-50/50"
      }`}>
      {/* Header / Logo section */}
      <div className={`px-4 py-2 flex items-center justify-between border-b ${flag ? "bg-emerald-100/50 border-emerald-100" : "bg-red-100/50 border-red-100"
        }`}>
        <div className="grid grid-cols-12 gap-4 w-full items-center">
          <div className="col-span-3 flex items-center gap-2">
            <div className="p-0.5 bg-white rounded-lg shadow-sm border border-slate-100 shrink-0">
              <img src={image} alt="product" className="h-6 w-6 object-contain" />
            </div>
            <h6 className="font-extrabold text-slate-800 text-xs font-[Montserrat] tracking-tight truncate">{productNameTitle}</h6>
          </div>

          <div className="col-span-9 flex justify-end">
            <div
              onClick={handleNavClick}
              className="flex items-center gap-1.5 cursor-pointer group/link px-2 py-1 hover:bg-white/60 rounded-md transition-colors"
            >
              <span className="text-[11px] font-bold text-slate-500 group-hover/link:text-indigo-600 transition-colors uppercase tracking-wide">
                {navText}
              </span>
              <svg className="w-3 h-3 text-slate-400 group-hover/link:text-indigo-600 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid - Updated to match parent header alignment */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2">
        <div className="col-span-3"></div> {/* Spacer for Product Name column */}
        <div className="col-span-9 grid grid-cols-4 text-center">
          {productDetails?.map((item, index) => (
            <div key={index} className="flex flex-col items-center justify-center">
              <span className={`text-sm font-bold font-[Montserrat] truncate w-full ${index === 2 || index === 3 ? (flag ? "text-emerald-600" : "text-red-500") : "text-slate-700"
                }`}>
                {item?.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
