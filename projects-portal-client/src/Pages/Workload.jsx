import React, { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'

const Workload = () => {
    const [searchText, setSearchText] = useState('');
    const [charge, setCharge] = useState([]);
     useEffect (() => {
        fetch ('charge.json').then(res => res.json()).then(data => setCharge(data))
     } , [searchText])

    const handleSearch = () => {
        const filter = charge.filter((project) => project.projectType.toLowerCase().indexOf(searchText.toLowerCase()) !== -1 
        );
        console.log(filter)
        setCharge(filter)
       
    }
console.log(searchText)
  return (
    <div className='maw-w-screen-2xl container mx-auto xl:px-24 px-4'>
      <PageHeader title={"Charge de travail estimée"} path={"Charge"}/>

      <div className='mt-5'>
        <div className='search-box p-2 text-center mb-2'>
            <input type='text' name='search' id='search' className='py-2 pl-3 border focus:outline-none
            lg:w-6/12 mb-4 w-full' onChange={(e) => setSearchText(e.target.value)}/>
            <button onClick={handleSearch} className='bg-blue text-white font-semibold px-8 py-2 rounded-sm mb-4'>Rechercher</button>

        </div>
      </div>

      {/*charge display card */}
      <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-12 my-12 items-center'>
        {
            charge.map((data) => (
                <div key={data.id} className='shadow px-4 py-8'>
                    <h4 className='font-semibold text-xl'>{data.projectType}</h4>
                    <p className='my-2 font-medium text-blue text-lg'>{data.estimatedWorkload}</p>
                    < div className='flex flex-wrap gap-4'>
                        <a href='/' className='underline'>{data.status}</a>
                        <a href='/' className='underline'>{data.skills}</a>
                    </div>

                </div>
            ))
        }
      </div>
    </div>
  )
}

export default Workload
