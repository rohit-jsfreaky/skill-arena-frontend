import React, { useEffect, useState } from "react";
import { useAdminMembership } from "./useAdminMembership";
import MembershipHeader from "@/components/admin/membership/MembershipHeader";
import MembershipForm from "@/components/admin/membership/MembershipForm";
import DeleteMembershipDialog from "@/components/admin/membership/DeleteMembershipDialog";
import Table, { TableColumn } from "@/containers/Table/Table";
import { Membership } from "@/api/admin/membership";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import MembershipCard from "@/components/admin/membership/MembershipCard";

const MembershipManagement: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  const {
    memberships,
    loading,
    isModalOpen,
    setIsModalOpen,
    editMembership,
    deleteDialogOpen,
    setDeleteDialogOpen,
    processingAction,
    handleCreateMembership,
    handleEditMembership,
    handleSubmit,
    handleDeleteClick,
    handleDeleteConfirm,
    formatDuration,
    formatPrice,
    fetchMemberships,
    games,
    gamesLoading,
  } = useAdminMembership();

  useEffect(() => {
    console.log("memberships", memberships);
  }, [memberships]);

  // Check for mobile view
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  // Define table columns
  const columns: TableColumn<Membership>[] = [
    {
      key: "name",
      label: "Name",
      render: (membership) => (
        <span className="font-medium">{membership.name}</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (membership) => formatPrice(membership.price),
    },
    {
      key: "duration",
      label: "Duration",
      render: (membership) => formatDuration(membership.duration),
    },
    {
      key: "benefits",
      label: "Benefits",
      render: (membership) => (
        <div className="max-w-xs">
          {membership.benefits && membership.benefits.length > 0 ? (
            <ul className="list-disc pl-4 space-y-1 text-sm">
              {membership.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
              {membership.benefits.length > 3 && (
                <li className="text-[#BBF429]">
                  +{membership.benefits.length - 3} more...
                </li>
              )}
            </ul>
          ) : (
            <span className="text-gray-400">No benefits listed</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      label: <div className="text-right">Actions</div>,
      className: "text-right",
      render: (membership) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-blue-500 border-blue-500 hover:bg-blue-100 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              handleEditMembership(membership);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 border-red-500 hover:bg-red-100 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(membership.id as number);
            }}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full w-full px-4 py-14 bg-black">
      <div className="container mx-auto">
        <MembershipHeader
          onCreateClick={handleCreateMembership}
          onRefresh={fetchMemberships}
        />

        {isMobile ? (
          // Mobile card view
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#BBF429]"></div>
              </div>
            ) : memberships.length === 0 ? (
              <div className="text-center py-8 text-white">
                No membership plans found
              </div>
            ) : (
              memberships.map((membership) => (
                <MembershipCard
                  key={membership.id}
                  membership={membership}
                  formatPrice={formatPrice}
                  formatDuration={formatDuration}
                  onEdit={handleEditMembership}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </div>
        ) : (
          // Desktop table view
          <div className="bg-[#1A1A1A] rounded-lg overflow-hidden shadow-lg">
            <Table
              columns={columns}
              data={memberships.map((membership) => ({ ...membership }))}
              loading={loading}
              loadingMessage={
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BBF429]"></div>
                </div>
              }
              emptyMessage="No membership plans found"
              rowKeyField="id"
              headerClassName="bg-[#BBF429] text-[#1A1A1A]"
              rowClassName={() => "border-b border-[#333] text-white"}
              containerClassName="rounded-lg overflow-hidden"
            />
          </div>
        )}

        {/* Membership Form Modal */}
        <MembershipForm
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          membership={editMembership}
          processing={processingAction}
          games={games}
          gamesLoading={gamesLoading}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteMembershipDialog
          isOpen={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          processing={processingAction}
        />
      </div>
    </div>
  );
};

export default MembershipManagement;
