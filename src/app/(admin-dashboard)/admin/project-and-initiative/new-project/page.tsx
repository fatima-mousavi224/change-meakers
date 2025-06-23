import React from 'react'
import CardComponentsForm from './card-components/page'
import { redirect } from 'next/navigation';

function CreateNewProjectPage() {
  redirect('/admin/project-and-initiative/new-project/card-components');
}

export default CreateNewProjectPage