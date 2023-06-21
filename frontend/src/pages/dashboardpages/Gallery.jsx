import React from 'react'
import {Gallery} from 'react-grid-gallery'



export default function GalleryPage() {

  const gimages = [
    {
       src: "http://localhost:8000/media/profiles/default.jpg",
       width: 320,
       height: 174,
       caption: "After Rain (Jeshu John - designerspics.com)",
    },
    {
       src: "http://localhost:8000/media/profiles/default.jpg",
       width: 320,
       height: 212,
       tags: [
          { value: "Ocean", title: "Ocean" },
          { value: "People", title: "People" },
       ],
       alt: "Boats (Jeshu John - designerspics.com)",
    },
  
    {
       src: "http://locolhost:8000/media/profiles/deafult.jpgg",
       width: 320,
       height: 212,
    },
 ];


  return (
    <div>
      <Gallery images={gimages} />
    </div>
  );
}
