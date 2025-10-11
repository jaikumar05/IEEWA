"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Building, MapPin, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import type { Candidate } from "@/types/candidate";

type Props = {
  candidate: Candidate;
  onEdit: () => void;
  onDelete: () => void;
};

export default function CandidateCard({ candidate, onEdit, onDelete }: Props) {
  const router = useRouter();

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => router.push(`/candidate/${candidate.id}`)}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{candidate.name}</CardTitle>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {candidate.designation && (
          <p className="text-sm font-medium text-teal-600">{candidate.designation}</p>
        )}
        {candidate.emailId && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-3 w-3" />
            <span>{candidate.emailId}</span>
          </div>
        )}
        {candidate.mobileNo && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-3 w-3" />
            <span>{candidate.mobileNo}</span>
          </div>
        )}
        {candidate.employer && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="h-3 w-3" />
            <span>{candidate.employer}</span>
          </div>
        )}
        {candidate.city && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-3 w-3" />
            <span>{candidate.city}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}