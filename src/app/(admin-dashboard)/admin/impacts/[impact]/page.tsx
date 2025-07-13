'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import ProjectSelector from '@/components/common/ProjectSelector';
import "react-quill/dist/quill.snow.css";
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface FormData {
  title: string;
  date: string;
  impactTags: string;
  author: string;
  description: string;
  projectName: string;
  authorPhoto: File | null;
  coverPhoto: File | null;
  galleryPhoto: File[];
}

export default function ImpactPage() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      date: '',
      impactTags: '',
      author: '',
      description: '',
      projectName: '',
      authorPhoto: null,
      coverPhoto: null,
      galleryPhoto: []
    }
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const uploadImageUrl = async (file: File, fieldName: string): Promise<string> => {
    if (!file) return '';

    const storage = getStorage();
    const fileName = `${fieldName}_${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, `impacts/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitMessage('');
      setSubmitStatus(null);

      // Upload images
      const uploadedFiles: { [key: string]: string | string[] } = {};

      if (data.authorPhoto) {
        uploadedFiles.authorPhoto = await uploadImageUrl(data.authorPhoto, 'authorPhoto');
      }
      if (data.coverPhoto) {
        uploadedFiles.coverPhoto = await uploadImageUrl(data.coverPhoto, 'coverPhoto');
      }
      if (data.galleryPhoto.length > 0) {
        uploadedFiles.galleryPhoto = await Promise.all(
          data.galleryPhoto.map(file => uploadImageUrl(file, 'galleryPhoto'))
        );
      }

      const formDataToSend = {
        title: data.title,
        date: data.date ? new Date(data.date).toISOString() : null,
        impactTags: data.impactTags,
        author: data.author,
        description: data.description,
        projectName: data.projectName,
        authorPhoto: uploadedFiles.authorPhoto || null,
        coverPhoto: uploadedFiles.coverPhoto || null,
        galleryPhoto: uploadedFiles.galleryPhoto || []
      };

      const apiUrl = isEditMode ? `/api/impact/${editingImpactId}` : '/api/impact';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataToSend)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(isEditMode ? 'Impact updated successfully' : 'Impact created successfully');
        toast.success(isEditMode ? 'Impact updated successfully' : 'Impact created successfully');
        reset();
        setIsEditMode(false);
        setEditingImpactId(null);
        setRefreshTrigger(prev => prev + 1);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error submitting form');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : 'Error submitting form');
      toast.error('Error creating impact');
    }
  };

  return (
    <div className="flex mt-4 max-w-screen-2xl mx-auto">
      <main className="mx-auto w-full px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {isEditMode ? 'Edit Impact' : 'Create New Impact'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project</label>
              <ProjectSelector
                value={watch('projectName')}
                onChange={(value) => setValue('projectName', value)}
                className="mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                {...register('date')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Impact Tags</label>
              <input
                type="text"
                {...register('impactTags')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Separate tags with commas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                {...register('author')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Author Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setValue('authorPhoto', file);
                }}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cover Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setValue('coverPhoto', file);
                }}
                className="mt-1 block w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Gallery Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setValue('galleryPhoto', files);
                }}
                className="mt-1 block w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-5">Description</label>
            <ReactQuill
              theme="snow"
              style={{
                backgroundColor: 'white',
              }}
              value={watch('description')}
              onChange={(value) => setValue('description', value)}
              className="quill-editor"
            />
            {errors.description && (
              <p className="text-red-500 mt-1 text-sm">
                {errors?.description.message as string}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-9">
            <button
              type="button"
              onClick={() => {
                reset();
                setIsEditMode(false);
                setEditingImpactId(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Impact' : 'Create Impact'}
            </button>
          </div>
        </form>

        {submitMessage && (
          <div
            className={`mt-4 p-4 rounded-md ${
              submitStatus === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {submitMessage}
          </div>
        )}

      </main>
    </div>
  );
} 