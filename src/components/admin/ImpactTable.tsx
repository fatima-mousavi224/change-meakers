"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

interface StandardImpact {
  id: string;
  title: string;
  impactTags: string;
  writersName: string;
  date: string;
  contentDescription: string;
  writerPhoto: string | null;
  galleryPhoto: string[];
}

interface HighlightedImpact {
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
}

interface Impact {
  id: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  standardImpacts: StandardImpact[];
  highlightedImpacts: HighlightedImpact[];
}

interface ImpactTableProps {
  projectFilter?: string;
  refreshTrigger?: number;
  onEditImpact: (impact: Impact) => void;
}

export default function ImpactTable({ projectFilter, refreshTrigger, onEditImpact }: ImpactTableProps) {
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchImpacts();
  }, [projectFilter, currentPage, refreshTrigger]);

  const fetchImpacts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });
      
      if (projectFilter) {
        params.append("project", projectFilter);
      }

      const response = await fetch(`/api/impact?${params}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch impacts");
      }
      
      const data = await response.json();
      setImpacts(data.impacts);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (impactId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(impactId)) {
      newExpanded.delete(impactId);
    } else {
      newExpanded.add(impactId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleEditClick = (impact: Impact) => {
    onEditImpact(impact);
    // Scroll to form
    const formElement = document.getElementById('impact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-100"></div>
        <span className="ml-2 text-gray-600">Loading impacts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchImpacts}
          className="mt-2 text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (impacts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No impacts found</p>
        <p className="text-gray-400 text-sm mt-2">
          {projectFilter 
            ? `No impacts found for "${projectFilter}"`
            : "Create your first impact story to see it here"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Impact Stories
            {projectFilter && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                for "{projectFilter}"
              </span>
            )}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project & Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Standard Impacts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Highlighted Impacts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {impacts.map((impact) => (
                <React.Fragment key={impact.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {impact.projectName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDate(impact.createdAt)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {impact.standardImpacts.map((standard, index) => (
                          <div key={standard.id} className="border-l-2 border-blue-200 pl-3">
                            <div className="text-sm font-medium text-gray-900">
                              {standard.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              By {standard.writersName} • {formatDate(standard.date)}
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              {standard.impactTags}
                            </div>
                            {expandedRows.has(impact.id) && (
                              <div className="text-sm text-gray-600 mt-2">
                                {truncateText(standard.contentDescription, 200)}
                              </div>
                            )}
                          </div>
                        ))}
                        {impact.standardImpacts.length === 0 && (
                          <span className="text-gray-400 text-sm">No standard impacts</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        {impact.highlightedImpacts.map((highlighted, index) => (
                          <div key={highlighted.id} className="border-l-2 border-yellow-200 pl-3">
                            <div className="text-sm font-medium text-gray-900">
                              {highlighted.title2 || "Highlighted Impact"}
                            </div>
                            {highlighted.writersName2 && highlighted.date2 && (
                              <div className="text-xs text-gray-500">
                                By {highlighted.writersName2} • {formatDate(highlighted.date2)}
                              </div>
                            )}
                            {highlighted.impactTags2 && (
                              <div className="text-xs text-yellow-600 mt-1">
                                {highlighted.impactTags2}
                              </div>
                            )}
                            {expandedRows.has(impact.id) && (
                              <div className="space-y-1 mt-2">
                                {highlighted.message1 && (
                                  <div className="text-sm text-gray-600">
                                    <strong>Message 1:</strong> {truncateText(highlighted.message1, 150)}
                                  </div>
                                )}
                                {highlighted.message2 && (
                                  <div className="text-sm text-gray-600">
                                    <strong>Message 2:</strong> {truncateText(highlighted.message2, 150)}
                                  </div>
                                )}
                                {highlighted.contentDescription2 && (
                                  <div className="text-sm text-gray-600">
                                    <strong>Description:</strong> {truncateText(highlighted.contentDescription2, 200)}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                        {impact.highlightedImpacts.length === 0 && (
                          <span className="text-gray-400 text-sm">No highlighted impacts</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleRowExpansion(impact.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title={expandedRows.has(impact.id) ? "Collapse" : "Expand details"}
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditClick(impact)}
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Edit impact"
                        >
                          <FaEdit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete impact"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 