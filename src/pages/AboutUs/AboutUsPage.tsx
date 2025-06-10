import React, { useState, useEffect } from "react";
import { getPageContent, PageContent } from "@/api/pages";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import { showErrorToast } from "@/utils/toastUtils";
// import { format } from "date-fns";

const AboutUsPage = () => {
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<PageContent | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      const result = await getPageContent("about_us", setLoading);
      if (result.success) {
        setPageData(result.data);
      } else {
        showErrorToast("Failed to load About Us content");
      }
    };

    fetchPageContent();
  }, []);

  return (
    <div className="bg-gradient-to-r from-black via-black to-[#BBF429] min-h-screen py-5">
      <div className="mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size={40} color="white" />
          </div>
        ) : pageData ? (
          <div className=" rounded-lg  p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {pageData.title}
            </h1>
            <div 
              className="prose prose-invert max-w-none text-white/90"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
            {/* <div className="mt-8 text-right text-gray-400 text-sm">
              Last updated: {format(new Date(pageData.updated_at), "MMMM d, yyyy")}
            </div> */}
          </div>
        ) : (
          <div className="text-center text-white p-8">
            <h2 className="text-2xl font-bold mb-4">About Us page not found</h2>
            <p>The requested content is not available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUsPage;