import React from 'react';
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 text-2xl text-black">
            <img src="/images/logo.png" alt="Logo PolyProjets" style={{ height: '40px', borderRadius: '10px', width: '40px' }} />
            <span>PolyProjets</span>
          </div>
          <div className="text-base text-primary font-medium space-x-5">
            <Link to="/login" className="py-2 px-5 border rounded">Se Connecter</Link>
            <Link to="/sign-up" className="py-2 px-5 border rounded text-white bg-blue">S&rsquo;inscrire</Link>
          </div>
        </div>

        <div className="md:max-w-screen-2xl container mx-auto md:px-24 px-4 md:py-20 py-14">
          <h1 className="text-5xl font-bold text-primary mb-3">
            <span className="animate-pulse">Faites décoller</span> <span className="text-blue">votre carrière</span> <span className="animate-pulse">dès aujourd&rsquo;hui</span>!
          </h1>
          <p className="text-lg text-black/70 mb-8">Plongez dans un univers de projets captivants et faites votre choix parmi les meilleures opportunités en ingénierie et technologie!</p>
        </div>
        <div className="bg-gray-100 rounded-md p-4 mb-8">
          <p className="text-lg text-black/70">
            <span className="text-xl font-bold text-gray-800">PolyProjets</span> est une plateforme innovante qui connecte les étudiants, les mentors et les entreprises à travers des projets collaboratifs passionnants. Que vous soyez un étudiant à la recherche d&rsquo;expériences pratiques enrichissantes, un enseignant désireux de proposer des projets stimulants à vos étudiants ou un professionnel souhaitant partager votre expertise, PolyProjets offre une communauté dynamique et des ressources pour propulser votre carrière vers de nouveaux sommets.
          </p>
          <p className="text-lg text-black/70">Peu importe votre rôle dans le domaine de l&rsquo;éducation ou de l&rsquo;industrie, PolyProjets vous permet de créer un compte gratuitement. En tant qu&rsquo;étudiant, vous pouvez parcourir les projets, postuler et collaborer avec d&rsquo;autres passionnés. En tant qu&rsquo;enseignant, vous pouvez proposer des projets pour vos étudiants et les guider dans leurs réalisations. Quant aux professionnels, vous pouvez partager votre expérience en mentorant des étudiants et en proposant des projets innovants. Rejoignez-nous dès aujourd&rsquo;hui pour explorer de nouvelles opportunités et faire partie d&rsquo;une communauté d&rsquo;apprentissage dynamique!</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
