"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface ImpactFromAPI {
  id: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  standardImpacts: {
    id: string;
    title: string;
    impactTags: string;
    writersName: string;
    date: string;
    contentDescription: string;
    writerPhoto: string | null;
    galleryPhoto: string[];
  }[];
  highlightedImpacts: {
    id: string;
    message1: string | null;
    title2: string | null;
    impactTags2: string | null;
    date2: string | null;
    message2: string | null;
    writersName2: string | null;
    contentDescription2: string | null;
    writerPhoto2: string | null;
    coverPhoto: string | null;
    galleryPhoto2: string[];
  }[];
}

export default function EditImpactPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const impactId = params.id as string;
    
    if (!impactId) {
      router.push("/admin/impacts");
      return;
    }

    // Fetch impact data and redirect to comprehensive edit page
    fetchImpactAndRedirect(impactId);
  }, [params.id, router]);

  const fetchImpactAndRedirect = async (impactId: string) => {
    try {
      setLoading(true);
      
      // Fetch the specific impact
      const response = await fetch(`/api/impact?page=1&limit=100`);
      if (!response.ok) {
        throw new Error("Failed to fetch impact data");
      }
      
      const data = await response.json();
      const impact = data.impacts.find((imp: ImpactFromAPI) => imp.id === impactId);
      
      if (!impact) {
        throw new Error("Impact not found");
      }

      // Store impact data in sessionStorage for the edit page to use
      sessionStorage.setItem("editImpactData", JSON.stringify(impact));
      
      // Redirect to the comprehensive impact management page with edit parameter
      router.push(`/admin/project-and-initiative/impact?edit=${impactId}`);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading impact data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/admin/impacts")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Impacts
          </button>
        </div>
      </div>
    );
  }

  return null;
} 