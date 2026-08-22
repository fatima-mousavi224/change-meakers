'use client';
import { Post } from '@prisma/client';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { uploadCardImage } from 'lib/uploadCardImage';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';
import toast from 'react-hot-toast';
import Heading from '@/components/Heading';
import { cn } from '@/utilities/cn';
import LinearWithValueLabel from '@/components/common/LinearProgressWithLabel';
import Button from '@/components/common/Button';
import { formatDate } from '@/utilities/formatDatetoMMYYDDD';
import Image from 'next/image';
import { X } from 'lucide-react'; // Add this import for the close icon

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false
});

type UploadImageType = {
  image: string;
};

export default function PostForm({ post }: { post?: Post | null }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FieldValues>();

  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [postImagesIsLoading, setpostImagesLoading] = useState(false);
  const [postImagesProgress, setPostImagesProgress] = useState(0);
  const [imagesPreview, setImagesPreview] = useState<
    Array<{ url: string; file: File | null }>
  >(post?.postImages?.map((img) => ({ url: img.image, file: null })) || []);



  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    let postImages: UploadImageType[] = post?.postImages || [];

    async function handlePostImagesUpload() {
      if (data.postImages && data.postImages.length > 0) {
        setpostImagesLoading(true);
        try {
          const newPostImages: UploadImageType[] = [];
          for (const item of data.postImages) {
            const downloadURL = await uploadCardImage(item, 'postImages');
            newPostImages.push({ image: downloadURL });
            setPostImagesProgress(100);
          }
          postImages = newPostImages;
        } catch (error) {
          console.log('Error in uploading image', error);
          toast.error('Error in uploading image');
        } finally {
          setpostImagesLoading(false);
        }
      }
    }

    if (post) {
      toast.success('updating post, please wait...');
    } else {
      toast.success('creating post, please wait...');
    }

    await handlePostImagesUpload();

    const postData = {
      ...data,
      postImages
    };

    if (post) {
      await axios
        .patch(`/api/post/${post?.id}`, postData)
        .then(() => {
          router.refresh();
          toast.success('Post updated successfully');
          reset();
        })
        .catch((err) => {
          toast.error('Error while updating post to db!', err);
        });
    } else {
      await axios
        .post(`/api/post`, postData)
        .then(() => {
          router.refresh();
          toast.success('Post created successfully');
          reset();
        })
        .catch((err) => {
          toast.error('Error while saving post to db!', err);
        });
    }
  };

  const handleImageRemove = (index: number) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));

    // Reset the file input
    const fileInput = document.getElementById('postImages') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="lg:max-w-[40rem]  mx-auto lg:shadow-md lg:p-12 lg:rounded-md my-12">
      <Heading title={post ? 'Update Post' : 'Create Post'} center />
      <form className="flex flex-col gap-3 " onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <input
            {...register('title', { required: 'This field is required' })}
            type="text"
            id="title"
            className={cn(
              'border-2 border-slate-400 outline-none  focus:border-slate-500 px-2 py-2 rounded',
              { 'border-rose-400': errors['title'] }
            )}
            defaultValue={post?.title}
          />
        </div>
        <div className="form-item-container">
          <label htmlFor="description">Description</label>
          <Controller
            name="description"
            control={control}
            defaultValue={post?.description}
            render={({ field }) => (
              <SimpleMDE
                placeholder="Description"
                {...field}
                className={cn(
                  'rounded border-2 border-slate-400 outline-none  focus:border-slate-500',
                  {
                    'border-rose-500': errors['description']
                  }
                )}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tags"></label>
          {/* <select
            multiple
            {...register('categoryId', { required: 'This field is required' })}
            id="tags"
            className={cn(
              'border-2 border-slate-400 outline-none  focus:border-slate-500 px-2 py-2 rounded',
              { 'border-rose-400': errors['tags'] }
            )}
            defaultValue={post?.categoryId}
          >
            <option value="">Select tags</option>
            <option value="Education">Education</option>
            <option value="Human Rights">Human Rights</option>
            <option value="News">News</option>
            <option value="Highlights">Highlights</option>
            <option value="Others">Others</option>
          </select> */}
        </div>
        <div className="form-item-container">
          <label htmlFor="postDate">Select your post date</label>
          <input
            type="date"
            defaultValue={formatDate(
              post?.postDate ? new Date(post.postDate) : ''
            )}
            id="postDate"
            {...register('postDate')}
            className={cn(
              'border-2 border-slate-400 outline-none  focus:border-slate-500 px-2 py-2 rounded cursor-pointer',
              { 'border-rose-400': errors['postDate'] }
            )}
          />
        </div>
 

        <div className="form-item-container">
          <label htmlFor="postImages"> Upload post images</label>
          <input
            multiple
            accept="image/*"
            type="file"
            id="postImages"
            {...register('postImages', {
              required: !post && 'Post images are required'
            })}
            onChange={(e) => {
              const files = e.target.files;
              if (files) {
                const newPreviews = Array.from(files).map((file) => ({
                  url: URL.createObjectURL(file),
                  file
                }));
                setImagesPreview(newPreviews);
              }
            }}
            className={cn(
              'border-2 border-slate-400 outline-none  focus:border-slate-500 px-2 py-2 rounded cursor-pointer',
              { 'border-rose-400': errors['postImages'] }
            )}
          />
          {imagesPreview.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {imagesPreview.map((preview, index) => (
                <div key={index} className="relative">
                  <Image
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover"
                    width={96}
                    height={96}
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <LinearWithValueLabel isLoading={isLoading} progress={progress} />
        </div>

        <Button
          type="submit"
          className={cn(' mt-3', { 'cursor-not-allowed': isSubmitting })}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
