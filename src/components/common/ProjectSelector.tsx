"use client";
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  projectTitle: string;
  cardDescription: string;
  navigationLabel: string;
}

interface ProjectSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export default function ProjectSelector({
  value,
  onChange,
  placeholder = "Search and select a project...",
  className,
  error = false,
}: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle search filtering
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = projects.filter((project) =>
        project.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  // Find selected project when value changes
  useEffect(() => {
    if (value && projects.length > 0) {
      const project = projects.find(p => p.projectTitle === value);
      setSelectedProject(project || null);
      setSearchTerm(project?.projectTitle || value);
    } else if (!value) {
      setSelectedProject(null);
      setSearchTerm("");
    }
  }, [value, projects]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);
    setIsOpen(true);
    
    // If the input doesn't match any existing project, clear the selection
    if (!projects.some(p => p.projectTitle === inputValue)) {
      onChange("");
      setSelectedProject(null);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setSearchTerm(project.projectTitle);
    onChange(project.projectTitle);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
          error && "border-red-500",
          className
        )}
        autoComplete="off"
      />
      
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          {loading ? (
            <div className="px-4 py-2 text-gray-500">Loading projects...</div>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectSelect(project)}
                className={cn(
                  "relative cursor-pointer select-none px-4 py-2 hover:bg-gray-100",
                  selectedProject?.id === project.id && "bg-blue-50 text-blue-900"
                )}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{project.projectTitle}</span>
                  {project.cardDescription && (
                    <span className="text-sm text-gray-500 truncate">
                      {project.cardDescription}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">
              {searchTerm ? "No projects found" : "No projects available"}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 