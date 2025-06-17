/* eslint-disable import/no-unresolved */
import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import ContainerCard from 'src/components/ContainerCard';
import useMutationPost from 'src/hooks/useMutationPost';
import WangTextEditor from './WangTextEditor';

function News() {
  const [html, setHtml] = useState('');
  const [formValues, setFormValues] = useState({
    title: '',
    isPublish: false,
  });
  const mutationPost = useMutationPost({
    module: 'news',
  });
  const handleSave = () => {
    mutationPost.mutate({
      html,
      title: formValues.title,
      isPublish: true,
    });
  };
  return (
    <ContainerCard>
      <Box>
        <TextField
          value={formValues.title}
          onChange={(i) => setFormValues((prev) => ({ ...prev, title: i.target.value }))}
          size="small"
          label="Judul berita"
          fullWidth
          sx={{ my: 2 }}
        />
        <WangTextEditor html={html} setHtml={setHtml} />
        <Button disabled={mutationPost.isLoading} variant="contained" onClick={handleSave}>
          Simpan
        </Button>
      </Box>
    </ContainerCard>
  );
}

export default News;
