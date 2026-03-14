import { MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Caregiver, formatIDR } from '../data/mockData';
import { RatingStars } from './RatingStars';

interface CaregiverCardProps {
  caregiver: Caregiver;
}

export function CaregiverCard({ caregiver }: CaregiverCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={() => navigate(`/caregiver/${caregiver.id}`)}
    >
      {/* Photo */}
      <div className="relative overflow-hidden h-48">
        <img
          src={caregiver.photo}
          alt={caregiver.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
              caregiver.availabilityStatus === 'available'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                caregiver.availabilityStatus === 'available' ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            {caregiver.availabilityStatus === 'available' ? 'Tersedia' : 'Sibuk'}
          </span>
        </div>
        {/* Gender badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            caregiver.gender === 'Perempuan'
              ? 'bg-pink-100 text-pink-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {caregiver.gender}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-gray-900 mb-1">{caregiver.name}</h3>

        {/* Personality traits */}
        <div className="flex flex-wrap gap-1 mb-3">
          {caregiver.personality.slice(0, 3).map((trait) => (
            <span key={trait} className="px-2 py-0.5 bg-[#EBF4FF] text-[#2E8BFF] rounded-full text-xs">
              {trait}
            </span>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{caregiver.city}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars rating={caregiver.rating} size="sm" showNumber reviewCount={caregiver.reviewCount} />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <div>
            <span className="text-[#2E8BFF] font-semibold">{formatIDR(caregiver.hourlyRate)}</span>
            <span className="text-gray-400 text-sm">/jam</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3 h-3" />
            <span>Maks {caregiver.maxHoursPerDay} jam/hari</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-4 pb-4">
        <button className="w-full py-2 rounded-xl bg-[#EBF4FF] text-[#2E8BFF] text-sm font-medium hover:bg-[#2E8BFF] hover:text-white transition-colors duration-200">
          Lihat Profil
        </button>
      </div>
    </div>
  );
}
