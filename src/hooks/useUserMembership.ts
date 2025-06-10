import { useState, useEffect, useCallback } from "react";

import api from "@/utils/apiClient";
import { useMYUser } from "@/context/UserContext";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";

export interface MembershipPlan {
  id: number;
  name: string;
  price: number;
  duration: {
    days?: number;
    months?: number;
    years?: number;
  };
  benefits: string[];
}

export interface UserMembership {
  active: boolean;
  expiresAt?: string;
  plan?: {
    id: number;
    name: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export const useUserMembership = () => {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [userMembership, setUserMembership] = useState<UserMembership | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { myUser, fetchUser } = useMYUser();

  const fetchMembershipPlans = useCallback(async () => {
    try {

      console.log(myUser)
      console.log("fetching")
      setLoading(true);
      const response = await api.get<MembershipPlan[]>("api/memberships");
      console.log("response", response);
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching membership plans:", error);
      showErrorToast("Failed to load membership plans");
    } finally {
      setLoading(false);
    }
  }, []);

  // Check user's membership status
  const checkMembershipStatus = useCallback(async () => {
    if (!myUser) return;

    try {
      setLoading(true);
      const response = await api.post<UserMembership>(
        "api/memberships/status",
        {
          userId: myUser.id,
        }
      );
      setUserMembership(response.data);
    } catch (error) {
      console.error("Error checking membership status:", error);
    } finally {
      setLoading(false);
    }
  }, [myUser]);

  // Initialize Razorpay payment
  const initializeRazorpay = useCallback(() => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
        showErrorToast(
          "Razorpay SDK failed to load. Please check your connection"
        );
      };
      document.body.appendChild(script);
    });
  }, []);

  // Purchase membership with Razorpay
  const purchaseMembership = useCallback(
    async (planId: number) => {
      if (!myUser) {
        showErrorToast("Please log in to purchase a membership");
        return;
      }

      try {
        setPurchaseLoading(true);

        // Initialize Razorpay SDK
        const res = await initializeRazorpay();
        if (!res) {
          showErrorToast("Razorpay SDK failed to load");
          return;
        }

        // Create order
        const orderResponse = await api.post("api/memberships/create-order", {
          membershipId: planId,
        });

        if (!orderResponse.data.orderId) {
          showErrorToast("Failed to create payment order");
          return;
        }

        // Get plan details for displaying in payment
        const selectedPlan = plans.find((plan) => plan.id === planId);
        if (!selectedPlan) {
          showErrorToast("Invalid membership plan");
          return;
        }

        // Open Razorpay payment window
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID", // Ensure this is correctly set
          amount: selectedPlan.price * 100, // Razorpay takes amount in paise
          currency: "INR",
          name: "Skill Arena",
          description: `Membership: ${selectedPlan.name}`,
          order_id: orderResponse.data.orderId,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            try {
              // Verify payment
              const paymentVerification = await api.post(
                "api/memberships/verify-payment",
                {
                  membershipId: planId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  user_id:myUser.id
                }
              );

              if (paymentVerification.data.success) {
                showSuccessToast("Membership purchased successfully!");
                fetchUser(myUser.email);
                checkMembershipStatus();
              } else {
                showErrorToast("Payment verification failed");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              showErrorToast("An error occurred during payment verification");
            }
          },
          prefill: {
            name: myUser.name,
            email: myUser.email,
          },
          theme: {
            color: "#BBF429",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error("Razorpay payment error:", error);
        showErrorToast("Payment initialization failed");
      } finally {
        setPurchaseLoading(false);
      }
    },
    [myUser, plans, initializeRazorpay, fetchUser, checkMembershipStatus]
  );

  // Format duration to human-readable form
  const formatDuration = useCallback(
    (
      duration: { days?: number; months?: number; years?: number } | null
    ): string => {
      if (!duration) return "N/A";

      if (typeof duration === "object") {
        if (duration.days) {
          return duration.days === 1 ? "1 Day" : `${duration.days} Days`;
        }
        if (duration.months) {
          return duration.months === 1
            ? "1 Month"
            : `${duration.months} Months`;
        }
        if (duration.years) {
          return duration.years === 1 ? "1 Year" : `${duration.years} Years`;
        }
      }

      // Default message if duration is in an unrecognized format
      return "Subscription";
    },
    []
  );

  // Calculate time remaining until membership expires
  const getTimeRemaining = useCallback((expiryDate: string): string => {
    const expiry = new Date(expiryDate);
    const now = new Date();

    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Expired";
    if (diffDays === 1) return "1 day remaining";
    if (diffDays < 30) return `${diffDays} days remaining`;

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "~1 month remaining";

    return `~${diffMonths} months remaining`;
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembershipPlans();
    }, 500);

    return () => clearTimeout(timer); 
  }, []);

  // Check membership status when user data changes
  useEffect(() => {
    if (myUser) {
      checkMembershipStatus();
    }
  }, [myUser, checkMembershipStatus]);

  return {
    plans,
    userMembership,
    loading,
    purchaseLoading,
    purchaseMembership,
    formatDuration,
    getTimeRemaining,
    checkMembershipStatus,
  };
};
