import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import PageHeader from '../components/PageHeader';


const ProjectDetails = () => {
    const {id} = useParams();
    const [project, setProject] = useState([])
    useEffect(() => {
        fetch(`http://localhost:5000/all-projects/${id}`).then(res => res.json()).then(data => setProject(data))

    }, [])
const handleApply = async () => {
    const { value: url } = await Swal.fire({
        input: "url",
        inputLabel: "URL address",
        inputPlaceholder: "Enter the URL"
      });
      if (url) {
        Swal.fire(`Entered URL: ${url}`);
      }
}
  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
        <PageHeader title={"Détails du projet"} path={"Détails du projet"}/>
      <h2>Les détails du projet: {id}</h2>
      <h1>{project.projectName}</h1>

      <button className='bg-blue px-8 py-2 text-white' onClick={handleApply}>Postuler maintenant</button>
    </div>
  )
}

export default ProjectDetails
