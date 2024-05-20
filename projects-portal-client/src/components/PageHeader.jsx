import React from 'react';

const PageHeader = ({title, path}) => {
  return (
    <div className='py-24 mt-3 bg-[#FAFAFA] rounded flex items-center justify-center '>
      <div>
        <h2 className='text-3xl text-blue font-medium mb-1 text-center'>{title}</h2>
        <p className='text-sm text-center'>
          {/* Ajout de styles en ligne pour souligner au survol */}
          <a href='/home' style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', borderBottom: '1px solid transparent' }} onMouseEnter={e => e.target.style.borderBottom = '1px solid blue'} onMouseLeave={e => e.target.style.borderBottom = '1px solid transparent'}>Accueil</a>
          {' '} / {path}
        </p>
      </div>
    </div>
  );
}

export default PageHeader;