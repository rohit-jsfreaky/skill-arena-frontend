import { CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "verified_win":
      return (
        <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
          <CheckCircle className="h-4 w-4" />
          <span>Verified Win</span>
        </div>
      );
    case "verified_loss":
      return (
        <div className="flex items-center space-x-1 bg-rose-100 text-rose-700 px-3 py-1 rounded-full">
          <XCircle className="h-4 w-4" />
          <span>Verified Loss</span>
        </div>
      );
    case "disputed":
      return (
        <div className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
          <AlertTriangle className="h-4 w-4" />
          <span>Disputed</span>
        </div>
      );
    case "admin_reviewed":
      return (
        <div className="flex items-center space-x-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
          <CheckCircle className="h-4 w-4" />
          <span>Admin Reviewed</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center space-x-1 bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4" />
          <span>Pending</span>
        </div>
      );
  }
};