'use client';
import { MapPin } from 'lucide-react';
import  Link  from 'next/link';



interface selectedSeatButtonProps{
    id: string;
}

export default function SelectSeatButton({id}:selectedSeatButtonProps) {
  return (
    <Link
      href={`/siege/${id}`}
      className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg"
    >
      <MapPin className="w-5 h-5" />
      Choisir sa place
    </Link>
  );
}
