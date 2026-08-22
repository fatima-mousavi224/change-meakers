'use client';
import { UserProfile } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { uploadCardImage } from 'lib/uploadCardImage';
import { countryData } from '@/lib/data';
import LinearWithValueLabel from '../common/LinearProgressWithLabel';
import Input from './Input';
import Select from './Select';

interface ProfileFormProps {
  userProfile?: UserProfile | null;
}

export default function ProfileForm({ userProfile }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const [IsCoverPhotoLoading, setCoverPhotoLoading] = useState(false);
  const [IsProfilePhotoLoading, setProfilePhotoLoading] = useState(false);
  const [coverPhotoProgress, setCoverPhotoProgress] = useState(0);
  const [profilePhotoProgress, setProfilePhotoProgress] = useState(0);

  const handleUploadCoverPhoto = async (
    item: File,
    uploadedCoverImage: { image: string }[]
  ) => {
    setCoverPhotoLoading(true);
    try {
      const downloadURL = await uploadCardImage(item, 'profile-cover');
      uploadedCoverImage.push({ image: downloadURL });
      setCoverPhotoProgress(100);
    } catch (error) {
      console.log('Error in uploading image', error);
      toast.error('Error in uploading image');
    } finally {
      setCoverPhotoLoading(false);
    }
  };

  const handleUploadProfilePhoto = async (
    item: File,
    uploadedProfileImage: { image: string }[]
  ) => {
    setProfilePhotoLoading(true);
    try {
      const downloadURL = await uploadCardImage(item, 'profile-photo');
      uploadedProfileImage.push({ image: downloadURL });
      setProfilePhotoProgress(100);
    } catch (error) {
      console.log('Error in uploading image', error);
      toast.error('Error in uploading image');
    } finally {
      setProfilePhotoLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const uploadedCoverImage: { image: string }[] = [];
    const uploadedProfileImage: { image: string }[] = [];
    try {
      await handleUploadCoverPhoto(data.coverPhoto[0], uploadedCoverImage);
      await handleUploadProfilePhoto(
        data.profilePhoto[0],
        uploadedProfileImage
      );
      const finalData = {
        ...data,
        coverPhoto: uploadedCoverImage,
        profilePhoto: uploadedProfileImage
      };
      if (userProfile) {
        const res = await fetch(`/api/profile`, {
          body: JSON.stringify(finalData),
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (res.status === 200) {
          toast.success('Profile updated successfully');
          reset();
        }

        return;
      } else {
        const res = await fetch('/api/profile', {
          body: JSON.stringify(finalData),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (res.status === 201) {
          toast.success('Profile created successfully');
          reset();
        }
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <div className="  w-full flex flex-col justify-center mx-auto md:p-10 px-4 py-10">
      <h1 className="font-bold lg:text-[38.36px] text-2xl text-center mb-8">
        Profile
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          idLabel="email"
          labelName="Email"
          nameRegister="email"
          placeholder="johnsmith@gmail.com"
          register={register}
          type="email"
          errors={errors}
          defaultValue={userProfile?.email}
        />
        <Input
          idLabel="phone"
          labelName="Phone Number"
          nameRegister="phone"
          placeholder="0093786810272"
          register={register}
          type="tel"
          errors={errors}
          defaultValue={userProfile?.phone}
        />
        <div className="w-full flex justify-between items-center md:flex-row flex-col md:gap-5">
          <div className="md:w-1/2 w-full">
            <Select
              idLabel="Country"
              labelName="country"
              register={register}
              errors={errors}
              options={countryData}
              defaultValue={userProfile?.country}
            />
          </div>
          <div className="md:w-1/2 w-full">
            <Input
              defaultValue={userProfile?.city}
              idLabel="city"
              labelName="City"
              nameRegister="city"
              placeholder="Type Your City"
              register={register}
              type="tel"
              errors={errors}
            />
          </div>
        </div>

        <Input
          idLabel="coverPhoto"
          labelName="Cover Photo"
          nameRegister="coverPhoto"
          placeholder="coverPhoto"
          register={register}
          type="file"
          errors={errors}
        />

        <LinearWithValueLabel
          isLoading={IsCoverPhotoLoading}
          progress={coverPhotoProgress}
        />

        <Input
          idLabel="profilePhoto"
          labelName="Profile Photo"
          nameRegister="profilePhoto"
          placeholder="profile photo"
          register={register}
          type="file"
          errors={errors}
        />
        <LinearWithValueLabel
          isLoading={IsProfilePhotoLoading}
          progress={profilePhotoProgress}
        />

        <div className="gap-3 flex">
          <button
            type="reset"
            className="md:px-4 md:py-2 py-1 px-2 hover:bg-primary-50 transition hover:text-white rounded-[8px] mt-4 border border-[#134C83] font-bold text-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-50 hover:bg-white hover:text-black border border-primary-50 transition text-white md:px-4 md:py-2 py-1 px-2 rounded-[8px] mt-4 "
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
