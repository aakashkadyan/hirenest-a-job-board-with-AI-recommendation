import React, { useState } from 'react';
import ReactQuill from 'react-quill';

const JobForm = () => {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    console.log(description); // submit this to backend
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Job</h2>
      {/* Other input fields... */}
      
      <label className="block mb-2 font-semibold">Job Description</label>
      <ReactQuill value={description} onChange={setDescription} className="mb-6" />

      
</div>
  );
};

export default JobForm;