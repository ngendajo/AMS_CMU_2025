import React from 'react';



function GalleryTable({ galleries, onDisplay, onDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Image</th>
          <th>Displayed</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {galleries.map((gallery) => (
          <tr key={gallery.id}>
            <td>{gallery.id}</td>
            <td role="cell"><img src={"http://localhost:8000"+gallery.image_url} width={75} height={75}   /></td>
     
            <td>
              {gallery.displayed ? ( 
                <div>
                <button onClick={() => onDisplay(gallery.id)} >
                  Don't Display
                </button>
              </div>
              ) : (
                <div>
                  <button onClick={() => onDisplay(gallery.id)} >
                    Display
                  </button>
                </div>
              )}
            </td>
            <td>
                <button onClick={() => onDelete(gallery.id)} >
                    Delete
                </button>
            </td>


          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GalleryTable;

