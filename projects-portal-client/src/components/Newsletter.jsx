import React, { useState } from 'react';
import { FaEnvelopeOpenText, FaRocket } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [emailMessage, setEmailMessage] = useState('');
  const [cvMessage, setCvMessage] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubscribe = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setEmailMessage(data.message);
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setEmailMessage('Error subscribing to newsletter. Please try again later.');
    }
  };

  const handleUploadCV = async (event) => {
    event.preventDefault();
    if (!file) {
      setCvMessage('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload-cv', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setCvMessage(data.message);
      setFile(null);
    } catch (error) {
      console.error('Error uploading CV:', error);
      setCvMessage('Error uploading CV. Please try again later.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubscribe}>
        <div>
          <h4 className='text-lg font-bold mb-2 flex items-center justify-center gap-2'>
              <FaEnvelopeOpenText className="text-2xl" />
              Restez informé des nouveaux projets !
          </h4>
          <p className='text-primary/75 text-base mb-4'>
            Inscrivez-vous à notre newsletter pour recevoir les dernières mises à jour sur les projets disponibles et les opportunités d&apos;engagement.
          </p>
          <div className='w-full space-y-4'>
            <input type='email' value={email} onChange={handleEmailChange} name='email' id='email' placeholder='Votre adresse e-mail' className='w-full block py-2 px-3 border focus:outline-none' />
            <input type='submit' value="S'inscrire" className='w-full block py-2 px-3 border focus:outline-none bg-blue rounded-sm text-white cursor-pointer font-semibold hover:bg-blue-600' />
            {emailMessage && <p className='text-primary/75'>{emailMessage}</p>}
          </div>
        </div>
      </form>

      <form onSubmit={handleUploadCV} className='mt-20'>
        <div>
          <h4 className='text-lg font-bold mb-2 flex items-center justify-center gap-2'>
            <FaRocket className="text-2xl" />
            Soyez notifié plus vite !
          </h4>
          <p className='text-primary/75 text-base mb-4'>
            Abonnez-vous pour être parmi les premiers informés des nouveaux projets et opportunités de collaboration.<br/>
            Maximisez vos chances en restant à l&apos;avant-garde.
          </p>
          <div className='w-full space-y-4'>
            <input type="file" onChange={handleFileChange} className='w-full block py-2 px-3 border focus:outline-none' />
            <input type='submit' value="Envoyez votre CV" className='w-full block py-2 px-3 border focus:outline-none rounded-sm text-white cursor-pointer font-semibold bg-blue hover:bg-blue-600' />
            {cvMessage && <p className='text-primary/75'>{cvMessage}</p>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Newsletter;
