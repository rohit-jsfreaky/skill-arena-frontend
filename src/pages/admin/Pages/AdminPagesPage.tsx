import React, { useState, useEffect } from "react";
import { getAllPages, getPageContent, PageContent } from "@/api/admin/pages";
import { showErrorToast } from "@/utils/toastUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/my-ui/Loader";
import PageEditor from "@/components/admin/pages/PageEditor";

const AdminPagesPage = () => {
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<PageContent[]>([]);
  const [activeTab, setActiveTab] = useState("about_us");
  const [currentPage, setCurrentPage] = useState<PageContent | null>(null);
  const [pageLoading, setPageLoading] = useState(false);

  const fetchPages = async () => {
    const result = await getAllPages(setLoading);
    if (result.success) {
      setPages(result.data);

      // If we don't have about_us and contact_us, set default values
      const hasAboutUs = result.data.some((p) => p.page_name === "about_us");
      const hasContactUs = result.data.some(
        (p) => p.page_name === "contact_us"
      );

      if (!hasAboutUs) {
        result.data.push({
          page_name: "about_us",
          title: "About Us",
          content: "<p>About our company...</p>",
        });
      }

      if (!hasContactUs) {
        result.data.push({
          page_name: "contact_us",
          title: "Contact Us",
          content: "<p>Contact information and form...</p>",
        });
      }

      setPages(result.data);
    } else {
      showErrorToast(result.message);
    }
  };

  const fetchPageContent = async (pageName: string) => {
    // First check if we already have this page data
    const existingPage = pages.find((p) => p.page_name === pageName);

    if (existingPage) {
      setCurrentPage(existingPage);
    } else {
      const result = await getPageContent(pageName, setPageLoading);
      if (result.success) {
        setCurrentPage(result.data);
      } else {
        // Handle case where page doesn't exist yet
        setCurrentPage({
          page_name: pageName,
          title: pageName === "about_us" ? "About Us" : "Contact Us",
          content: `<p>Enter your ${
            pageName === "about_us" ? "About Us" : "Contact Us"
          } content here...</p>`,
        });
      }
    }
    setPageLoading(false);
  };

  // Initial load of pages
  useEffect(() => {
    fetchPages();
  }, []);

  // Load content when tab changes
  useEffect(() => {
    let timer;
    console.log(activeTab);
    if (activeTab) {
      setPageLoading(true);
      timer = setTimeout(() => {
        fetchPageContent(activeTab);
      }, 1000);

      console.log(currentPage);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [activeTab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle page save
  const handlePageSave = () => {
    fetchPages();
    fetchPageContent(activeTab);
  };

  return (
    <div className="w-full min-h-screen flex-col gap-4 sm:gap-8 bg-black p-3 sm:p-4">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Manage Pages</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size={40} color="white" />
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full max-w-md mx-auto mb-6 bg-black border border-[#BBF429] text-white">
              <TabsTrigger
                value="about_us"
                className="flex-1 data-[state=active]:bg-[#BBF429] data-[state=active]:text-black text-white"
              >
                About Us
              </TabsTrigger>
              <TabsTrigger
                value="contact_us"
                className="flex-1 data-[state=active]:bg-[#BBF429] data-[state=active]:text-black text-white"
              >
                Contact Us
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about_us">
              {pageLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size={40} color="white" />
                </div>
              ) : currentPage ? (
                <PageEditor
                  pageName="about_us"
                  initialTitle={currentPage.title}
                  initialContent={currentPage.content}
                  onSave={handlePageSave}
                />
              ) : null}
            </TabsContent>

            <TabsContent value="contact_us">
              {pageLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size={40} color="white" />
                </div>
              ) : currentPage ? (
                <PageEditor
                  pageName="contact_us"
                  initialTitle={currentPage.title}
                  initialContent={currentPage.content}
                  onSave={handlePageSave}
                />
              ) : null}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdminPagesPage;
