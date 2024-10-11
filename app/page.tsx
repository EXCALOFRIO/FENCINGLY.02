import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TournamentList } from '@/components/tournament-list';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Fencing Tournament Management</h1>
      <div className="flex justify-center space-x-4 mb-8">
        <Link href="/tournament/new">
          <Button>Create New Tournament</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Admin Login</Button>
        </Link>
      </div>
      <TournamentList />
    </div>
  );
}