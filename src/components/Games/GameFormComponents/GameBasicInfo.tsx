import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLATFORMS, GENRES } from '../constants.ts';
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isSameDay } from "date-fns";

interface GameBasicInfoProps {
  name: string;
  status: string;
  platform: string;
  genre: string;
  release_date: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export const GameBasicInfo: React.FC<GameBasicInfoProps> = ({
  name,
  status,
  platform,
  genre,
  release_date,
  onChange,
  onSelectChange,
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Custom date parsing to avoid timezone issues
  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    
    // Parse the date parts directly to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return null;
    
    // Create Date object with year, month (0-indexed), day
    return new Date(year, month - 1, day, 12, 0, 0);
  };
  
  const handleDateSelect = (date: Date) => {
    // Format as YYYY-MM-DD with padded zeros where needed
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    
    const syntheticEvent = {
      target: {
        name: 'release_date',
        value: formattedDate
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
    setDatePickerOpen(false);
  };

  // Custom calendar navigation
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  // Generate days for the calendar
  const getDaysInMonth = () => {
    const firstDay = startOfMonth(currentMonth);
    const lastDay = endOfMonth(currentMonth);
    return eachDayOfInterval({ start: firstDay, end: lastDay });
  };
  
  // Get blanks for the start of the month
  const getStartBlanks = () => {
    const weekStart = 0; // Sunday
    const firstDayOfMonth = startOfMonth(currentMonth);
    const firstDayWeekday = getDay(firstDayOfMonth);
    const diff = (firstDayWeekday - weekStart + 7) % 7;
    return Array(diff).fill(null);
  };
  
  const days = getDaysInMonth();
  const startBlanks = getStartBlanks();
  const selectedDate = parseDate(release_date);
  
  // Format the displayed date for the button
  const displayDate = release_date ? 
    format(parseDate(release_date) || new Date(), 'MMMM d, yyyy') : 
    "Select date";

  return (
    <div className="space-y-4 sm:space-y-6 col-span-1 md:col-span-2 w-full max-w-[900px] mx-auto">
      {/* Game name takes full width on all screens */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Game Name *</Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Enter game name"
          className="bg-[#2A2A2A] border-[#444] focus:border-[#BBF429]"
          required
        />
      </div>

      {/* Grid layout that adapts to different screen sizes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
          <Select
            value={status}
            onValueChange={(value) => onSelectChange("status", value)}
          >
            <SelectTrigger className="bg-[#2A2A2A] border-[#444] focus:border-[#BBF429]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A]">
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Platform */}
        <div className="space-y-2">
          <Label htmlFor="platform" className="text-sm font-medium">Platform</Label>
          <Select
            value={platform}
            onValueChange={(value) => onSelectChange("platform", value)}
          >
            <SelectTrigger className="bg-[#2A2A2A] border-[#444] focus:border-[#BBF429]">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] text-white max-h-[200px] overflow-y-auto">
              {PLATFORMS.map((platform) => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Genre */}
        <div className="space-y-2">
          <Label htmlFor="genre" className="text-sm font-medium">Genre</Label>
          <Select
            value={genre}
            onValueChange={(value) => onSelectChange("genre", value)}
          >
            <SelectTrigger className="bg-[#2A2A2A] border-[#444] focus:border-[#BBF429]">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="bg-[#2A2A2A] text-white max-h-[200px] overflow-y-auto">
              {GENRES.map((genre) => (
                <SelectItem key={genre.value} value={genre.value}>
                  {genre.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Release Date - with Calendar Dialog */}
        <div className="space-y-2">
          <Label htmlFor="release_date" className="text-sm font-medium">Release Date</Label>
          <Button
            type="button"
            variant="outline"
            onClick={() => setDatePickerOpen(true)}
            className={`w-full justify-start text-left font-normal bg-[#2A2A2A] border-[#444] hover:bg-[#333] hover:text-white ${!release_date && "text-muted-foreground"}`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayDate}
          </Button>
        </div>
      </div>

      {/* Custom Date Picker Dialog */}
      <Dialog open={datePickerOpen} onOpenChange={setDatePickerOpen}>
        <DialogContent className="bg-[#1A1A1A] text-white border border-[#BBF429] p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#BBF429]">Select Release Date</DialogTitle>
          </DialogHeader>
          
          {/* Custom Calendar Implementation */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <Button 
                onClick={prevMonth} 
                variant="default" 
                size="icon"
                className="border-[#444] text-white hover:bg-[#2A2A2A] hover:text-[#BBF429]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <h2 className="font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              
              <Button 
                onClick={nextMonth} 
                variant="default" 
                size="icon"
                className="border-[#444] text-white hover:bg-[#2A2A2A] hover:text-[#BBF429]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Blank spaces for days before the start of the month */}
              {startBlanks.map((_, index) => (
                <div key={`blank-${index}`} className="h-9"></div>
              ))}
              
              {/* Actual days */}
              {days.map((day) => {
                const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                
                return (
                  <Button
                    key={day.toString()}
                    onClick={() => handleDateSelect(day)}
                    variant="ghost"
                    className={`h-9 w-full rounded-md ${
                      isSelected
                        ? 'bg-[#BBF429] text-black hover:bg-[#A8E000]'
                        : 'hover:bg-[#2A2A2A] text-white'
                    }`}
                  >
                    {format(day, 'd')}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="default" 
              onClick={() => setDatePickerOpen(false)}
              className="border-[#BBF429] text-white hover:bg-[#2A2A2A]"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setDatePickerOpen(false)}
              className="bg-[#BBF429] hover:bg-[#A8E000] text-black"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};