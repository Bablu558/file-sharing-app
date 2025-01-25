

import React, { useEffect, useState } from 'react';
import { getFiles } from '../services/api';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  CardActions,
  // IconButton,
  // Tooltip,
} from '@mui/material';
// import ShareIcon from '@mui/icons-material/Share';
// import { CopyToClipboard } from 'react-copy-to-clipboard';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await getFiles(token);
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files', error);
        setErrorMessage(error.response ? error.response.data.message : 'An error occurred');
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = (fileUrl, filename) => {
    fetch(fileUrl, { method: 'GET' })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename; 
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error('Download failed:', error);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#e0f7fa',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Uploaded Files
      </Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <Grid
        container
        spacing={3}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {files.length > 0 ? (
          files.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {file.filename}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <a
                      href={`http://localhost:5000${file.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      download={file.filename}
                    >
                      View
                    </a>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDownload(`http://localhost:5000${file.fileUrl}`, file.filename)}
                  >
                    Download
                  </Button>

                  {/* Share Button */}
                  {/* { <CopyToClipboard text={`http://localhost:5000/download/${file.filename}`}>
                    <Tooltip title="Share">
                      <IconButton color="primary">
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </CopyToClipboard> } */}
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">No files uploaded yet.</Typography>
        )}
      </Grid>
      <Button
        variant="outlined"
        sx={{ mt: 3 }}
        href="/upload"
        fullWidth
      >
        Upload New File
      </Button>
    </Box>
  );
};

export default FileList;
