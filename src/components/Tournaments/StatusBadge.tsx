import { CheckCircle, XCircle, AlertCircle, Clock, Shield } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const baseClasses = "flex items-center space-x-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm whitespace-nowrap";
  const iconClasses = "h-3 w-3 sm:h-4 sm:w-4";

  switch (status) {
    case "verified_win":
      return (
        <div className={`${baseClasses} bg-emerald-100 text-emerald-700`}>
          <CheckCircle className={iconClasses} />
          <span>Verified Win</span>
        </div>
      );
    case "verified_loss":
      return (
        <div className={`${baseClasses} bg-rose-100 text-rose-700`}>
          <XCircle className={iconClasses} />
          <span>Verified Loss</span>
        </div>
      );
    case "disputed":
      return (
        <div className={`${baseClasses} bg-amber-100 text-amber-700`}>
          <AlertCircle className={iconClasses} />
          <span>Disputed</span>
        </div>
      );
    case "admin_reviewed":
      return (
        <div className={`${baseClasses} bg-indigo-100 text-indigo-700`}>
          <Shield className={iconClasses} />
          <span>Admin Reviewed</span>
        </div>
      );
    default:
      return (
        <div className={`${baseClasses} bg-slate-100 text-slate-600`}>
          <Clock className={iconClasses} />
          <span>Pending</span>
        </div>
      );
  }
};