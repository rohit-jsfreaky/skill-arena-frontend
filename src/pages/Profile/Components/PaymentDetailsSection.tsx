import { UserContextType } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Save, Upload, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { updateUser } from "@/api/user";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import { handleImageUpload } from "@/api/tournamentsResult";

interface PaymentDetailsSectionProps {
  myUser: UserContextType;
  fetchUser: (email: string) => Promise<void>;
  userEmail: string | undefined;
}

const PaymentDetailsSection = ({
  myUser,
  fetchUser,
  userEmail,
}: PaymentDetailsSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [paytmNumber, setPaytmNumber] = useState(myUser.paytm_number || "");
  const [upiId, setUpiId] = useState(myUser.upi_id || "");
  const [accountDetails, setAccountDetails] = useState(
    myUser.account_details || ""
  );
  const [upiQrUrl, setUpiQrUrl] = useState(myUser.upi_qr_code_url || "");
  const [selectedQrImage, setSelectedQrImage] = useState<File | null>(null);
  const [previewQrUrl, setPreviewQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setPaytmNumber(myUser.paytm_number || "");
    setUpiId(myUser.upi_id || "");
    setAccountDetails(myUser.account_details || "");
    setSelectedQrImage(null);
    setPreviewQrUrl(null);
    setIsUploaded(false);
  };

  const handleQrImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedQrImage(file);
      setPreviewQrUrl(URL.createObjectURL(file));
    }
  };

  const handleQrImageUpload = async () => {
    // This function will be handled by the user's custom API
    // You can implement your upload logic here
    if (!selectedQrImage) return showErrorToast("Please select an image first");

    const { message, success, data } = await handleImageUpload(
      selectedQrImage,
      setImageUploading
    );
    if (success) {
      console.log("Image upload response:", data);
      setUpiQrUrl(data);
      showSuccessToast(message);
      console.log("Image uploaded successfully:", selectedQrImage);
      setSelectedQrImage(null);
      setIsUploaded(true);
    } else {
      showErrorToast(message);
    }
    console.log(
      "Image upload handler - implement your API call here",
      selectedQrImage
    );
  };

  const clearSelectedImage = () => {
    setSelectedQrImage(null);
    setPreviewQrUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveClick = async () => {
    if (selectedQrImage)
      return showErrorToast("Please upload the QR code first");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("id", myUser.id.toString());
    formData.append("paytm_number", paytmNumber);
    formData.append("upi_id", upiId);
    formData.append("account_details", accountDetails);

    if (upiQrUrl) {
      formData.append("upi_qr_code_url", upiQrUrl);
    }

    try {
      const response = await updateUser({ data: formData });

      if (response?.success) {
        showSuccessToast("Payment details updated successfully");
        if (userEmail) {
          await fetchUser(userEmail);
        }
        setIsEditing(false);
        clearSelectedImage();
      } else if (response?.error) {
        showErrorToast(response.error);
      }
    } catch {
      showErrorToast("Failed to update payment details");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    console.log("upiQrUrl", upiQrUrl);
  }, [upiQrUrl]);

  return (
    <div className="px-4 md:px-8 py-6">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
        Payment Details
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditClick}
            className="text-white hover:bg-[#BBF429]/20"
          >
            <Edit className="h-4 w-4 mr-1 " /> Edit
          </Button>
        )}
      </h3>

      <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-[#BBF429]/20">
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Paytm Number</label>
            {isEditing ? (
              <Input
                type="text"
                value={paytmNumber}
                onChange={(e) => {
                  if (e.target.value.length <= 10)
                    setPaytmNumber(e.target.value);
                }}
                placeholder="Enter your Paytm number"
                className="bg-black/50 border-[#BBF429]/20 text-white focus:border-[#BBF429]"
              />
            ) : (
              <p className="text-white text-lg font-medium">
                {myUser.paytm_number || "Not provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">UPI ID</label>
            {isEditing ? (
              <Input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter your UPI ID"
                className="bg-black/50 border-[#BBF429]/20 text-white focus:border-[#BBF429]"
              />
            ) : (
              <p className="text-white text-lg font-medium">
                {myUser.upi_id || "Not provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Account Details</label>
            {isEditing ? (
              <Textarea
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                placeholder="Enter bank account details (Acc. number, IFSC, etc.)"
                className="bg-black/50 border-[#BBF429]/20 text-white focus:border-[#BBF429] min-h-[100px]"
              />
            ) : (
              <p className="text-white text-lg font-medium whitespace-pre-wrap">
                {myUser.account_details || "Not provided"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">UPI QR Code</label>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleQrImageChange}
                  className="bg-black/50 border-[#BBF429]/20 text-white focus:border-[#BBF429]"
                />

                {previewQrUrl && (
                  <div className="relative w-48 h-48 mx-auto flex gap-2 flex-col md:flex-row">
                    <img
                      src={previewQrUrl}
                      alt="QR Code Preview"
                      className="w-full h-full object-contain rounded-md border border-[#BBF429]/20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={clearSelectedImage}
                      className="absolute top-2 right-2 bg-black/70 text-white hover:bg-black rounded-full p-1"
                    >
                      <X size={16} />
                    </Button>

                    <div className="flex space-x-2 mt-2 items-end">
                      <Button
                        onClick={handleQrImageUpload}
                        disabled={isUploaded}
                        className="bg-[#333] text-white hover:bg-[#444]"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        {imageUploading ? (
                          <LoadingSpinner color="white" size={16} />
                        ) : isUploaded ? (
                          "Uploaded"
                        ) : (
                          "Upload QR Code"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {myUser?.upi_qr_code_url ? (
                  <div className="max-w-[200px] mx-auto">
                    <img
                      src={myUser?.upi_qr_code_url}
                      alt="UPI QR Code"
                      className="w-full h-auto rounded-md border border-[#BBF429]/20"
                    />
                  </div>
                ) : (
                  <p className="text-white text-lg font-medium">Not provided</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end space-x-3 mt-4">
          <Button
            variant="default"
            onClick={handleCancelClick}
            className="text-gray-400 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveClick}
            className="bg-[#BBF429] text-black hover:bg-[#BBF429]/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner color="black" size={24} />
            ) : (
              <>
                <Save className="h-4 w-4 mr-1" /> Save Changes
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentDetailsSection;
