'use client';
import 'easymde/dist/easymde.min.css';
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm
} from 'react-hook-form';

import SimpleMDE from 'react-simplemde-editor';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';
import { Member } from '@prisma/client';
import { useState } from 'react';
import firebaseApp from '@/lib/firebase';
import Heading from '@/components/Heading';
import { cn } from '@/utilities/cn';
import LinearWithValueLabel from '@/components/common/LinearProgressWithLabel';
import Button from '@/components/common/Button';

type UploadImageType = {
  image: string;
};

interface MemberFormProps {
  member?: Member | null;
}

export default function MemberForm({ member }: MemberFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FieldValues>();
  const [isMemberAvatarIsLoading, setMemeberAvatarLoading] = useState(false);
  const [MemberAvatarProgress, setMemberAvatarProgress] = useState(0);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const uploadedMemberAvatar: UploadImageType[] = [];

    async function handleMemeberAvatarUpload() {
      const item = data.avatar[0];
      try {
        const fileName = new Date().getTime() + item.name;
        const storage = getStorage(firebaseApp);
        const storageRef = ref(storage, `MemberAvatar/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, item);
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setMemberAvatarProgress(progress);
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case 'paused':
                  console.log('Upload is paused');
                  setMemeberAvatarLoading(false);
                  break;
                case 'running':
                  console.log('Upload is running');
                  setMemeberAvatarLoading(true);
                  break;
              }
            },
            (error) => {
              console.log('Error uploading image', error);
              reject(error);
              setMemeberAvatarLoading(false);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  uploadedMemberAvatar.push({ image: downloadURL });
                  console.log('File available at', downloadURL);
                  setMemeberAvatarLoading(false);
                  resolve();
                })
                .catch((err) => {
                  console.log('Error getting the downloadURL');
                  reject(err);
                  setMemeberAvatarLoading(false);
                });
            }
          );
        });
      } catch (error) {
        console.log('Error in uploading image', error);
        toast.error('Error in uploading image');
        setMemeberAvatarLoading(false);
      }
    }

    // upload post images to firebase

    await handleMemeberAvatarUpload();

    const memberData = {
      ...data,
      avatar: uploadedMemberAvatar
    };

    // save post to db
    if (member) {
      await axios
        .patch(`/api/member/${member.id}`, memberData)
        .then(() => {
          router.refresh();
          toast.success('Member updated successfully');
          reset();
        })
        .catch((err: any) => {
          toast.error('Error while updating Member to db!', err.message);
        })
        .finally(() => {
          reset();
        });
    } else {
      await axios
        .post(`/api/member`, memberData)
        .then(() => {
          router.refresh();
          toast.success('Member created successfully');
          reset();
        })
        .catch((err: any) => {
          toast.error('Error while saving Member to db!', err.message);
        })
        .finally(() => {
          reset();
        });
    }
  };

  return (
    <div className="lg:max-w-[40rem]  mx-auto lg:shadow-md lg:p-12 lg:rounded-md my-12">
      <Heading title="Add a member" center />
      <form className="flex flex-col gap-3 " onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            {...register('name', { required: 'This field is required' })}
            type="text"
            defaultValue={member?.name}
            id="name"
            className={cn(
              'border-2 border-slate-400 outline-none  focus:border-slate-500 px-2 py-2 rounded',
              { 'border-rose-400': errors['name'] }
            )}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="position">Position</label>
          <input
            {...register('position', { required: 'This field is required' })}
            type="text"
            defaultValue={member?.position}
            id="position"
            className={cn(
              'border-2 border-slate-400 outline-none  focus:border-slate-500 px-2 py-2 rounded',
              { 'border-rose-400': errors['position'] }
            )}
          />
        </div>
        <div className="form-item-container">
          <label htmlFor="description">Description</label>
          <Controller
            name="description"
            control={control}
            defaultValue={member?.description}
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
        <div className="form-item-container">
          <label htmlFor="avatar">Upload avatar</label>
          <input
            type="file"
            id="avatar"
            {...register('avatar', {
              required: 'post cover image is required'
            })}
            className={cn(
              'border-2 border-slate-400 outline-none  focus:border-slate-500 px-2 py-2 rounded cursor-pointer',
              { 'border-rose-400': errors['avatar'] }
            )}
          />
          <LinearWithValueLabel
            isLoading={isMemberAvatarIsLoading}
            progress={MemberAvatarProgress}
          />
        </div>

        <Button type="submit" className="mt-3">
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
