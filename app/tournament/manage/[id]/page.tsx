import ManageTournamentClient from './manage-tournament-client';

export default function ManageTournament({ params }: { params: { id: string } }) {
  return <ManageTournamentClient id={params.id} />;
}