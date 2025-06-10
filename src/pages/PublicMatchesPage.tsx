import React, { useEffect, useState } from 'react';
import { PublicMatchesList } from '@/components/TDM/PublicMatchesList';
import { Button } from '@/components/ui/button';
import { getPublicTdmMatches } from '@/api/tdmMatches';
import { TdmMatch } from '@/interface/tdmMatches';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';

const PublicMatchesPage = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<TdmMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await getPublicTdmMatches();
      if (response.data.success) {
        setMatches(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Available TDM Matches</h1>
          <p className="text-muted-foreground">
            Join an existing TDM match as Team B or create your own match
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchMatches} size="sm" className="flex items-center gap-1">
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button onClick={() => navigate('/tdm/create')} className="flex items-center gap-1">
            <Plus size={16} />
            Create Match
          </Button>
        </div>
      </div>

      <PublicMatchesList matches={matches} isLoading={loading} />
    </div>
  );
};

export default PublicMatchesPage;