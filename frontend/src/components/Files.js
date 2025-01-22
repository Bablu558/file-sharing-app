
import React, { useEffect, useState } from 'react';
import { getFiles } from '../services/api';

const Files = ({ token }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await getFiles(token);
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files', error);
      }
    };

    fetchFiles();
  }, [token]);

  return (
    <div>
      <h1>Files</h1>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <a href={`http://localhost:5000/${file.path}`} target="_blank" rel="noopener noreferrer">
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Files;
