import React from 'react';
import FormSection from "@/components/admin/Tournaments/FormSection";
import TournamentTitle from "@/components/admin/Tournaments/TournamentTitle";
import TournamentGameName from "@/components/admin/Tournaments/TournamentGameName";
import TournamentDescription from "@/components/admin/Tournaments/TournamentDescription";
import TournamentTeamMode from "@/components/admin/Tournaments/TournamentTeamMode";
import TournamentPrizePool from "@/components/admin/Tournaments/TournamentPrizePool";
import TournamentEntryFees from "../../Tournaments/TournamentEntryFees";
import TournamentParticipants from "@/components/admin/Tournaments/TournamentParticipants";
import TournamentTime from "@/components/admin/Tournaments/TournamentTime";
import TournamentRules from "@/components/admin/Tournaments/TournamentRules";
import TournamentImage from "@/components/admin/Tournaments/TournamentImage";
import TournamentRoom from "@/components/admin/Tournaments/TournamentRoom";
import { TournamentFormState } from './hooks/useTournamentForm';

interface TournamentFormComponentsProps {
  formData: TournamentFormState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  imageUpload: (file: File) => Promise<void>;
  uploading: boolean;
  minDateTime: string;
}

export const TournamentFormComponents: React.FC<TournamentFormComponentsProps> = ({
  formData,
  handleChange,
  imageUpload,
  uploading,
  minDateTime,
}) => {
  return (
    <>
      <FormSection title="Basic Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TournamentTitle handleChange={handleChange} title={formData.title} />
          <TournamentGameName game_name={formData.game_name} handleChange={handleChange} />
          <div className="md:col-span-2">
            <TournamentDescription description={formData.description} handleChange={handleChange} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Tournament Settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TournamentTeamMode handleChange={handleChange} team_mode={formData.team_mode} />
          <TournamentPrizePool handleChange={handleChange} prize_pool={formData.prize_pool} />
          <TournamentParticipants handleChange={handleChange} max_participants={formData.max_participants} />
        </div>
      </FormSection>

      <FormSection title="Entry Fees">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TournamentEntryFees handleChange={handleChange} fees={formData.entry_fee_normal} name="entry_fee_normal" />
          <TournamentEntryFees handleChange={handleChange} fees={formData.entry_fee_pro} name="entry_fee_pro" />
        </div>
      </FormSection>

      <FormSection title="Tournament Schedule">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TournamentTime
            time={formData.start_time}
            handleChange={handleChange}
            label="Start Time"
            name="start_time"
            minTime={minDateTime}
          />
          <TournamentTime
            time={formData.end_time}
            handleChange={handleChange}
            label="End Time"
            name="end_time"
            minTime={formData.start_time || minDateTime}
          />
        </div>
      </FormSection>

      <FormSection title="Game Room Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TournamentRoom
            handleChange={handleChange}
            value={formData.room_id}
            fieldName="room_id"
            label="Game Room ID"
            placeholder="Enter game room ID"
          />
          <TournamentRoom
            handleChange={handleChange}
            value={formData.room_password}
            fieldName="room_password"
            label="Game Room Password"
            placeholder="Enter game room password"
          />
        </div>
      </FormSection>

      <FormSection title="Tournament Media">
        <TournamentImage
          image_url={formData.image_url}
          handleChange={handleChange}
          handleImageUpload={imageUpload}
          uploading={uploading}
        />
      </FormSection>

      <FormSection title="Tournament Rules">
        <TournamentRules handleChange={handleChange} rules={formData.rules} />
      </FormSection>
    </>
  );
};