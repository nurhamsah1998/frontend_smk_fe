/* eslint-disable import/no-unresolved */
/* eslint-disable arrow-body-style */
import '@wangeditor/editor/dist/css/style.css'; // import css

import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { apiUrl } from 'src/hooks/api';
import { i18nChangeLanguage } from '@wangeditor/editor';
import axios from 'axios';
import { useSnackbar } from 'notistack';

i18nChangeLanguage('en');

function WangTextEditor({ html, setHtml = () => {}, onChangeUploadImage = () => {} }) {
  const [editor, setEditor] = useState(null); // TS syntax
  const token = window.localStorage.getItem('accessToken');
  const { enqueueSnackbar } = useSnackbar();
  const toolbarConfig = {
    excludeKeys: ['fullScreen', 'uploadVideo', 'editVideoSize', 'fontFamily'],
  };
  const editorConfig = {
    placeholder: 'Tulis disini...',
    MENU_CONF: {
      uploadImage: {
        async customUpload(file, insertFn) {
          try {
            onChangeUploadImage(file);
            const formData = new FormData();
            formData.append('img', file);
            const data = await axios.post(`${apiUrl}news-image`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                authorization: `Bearer ${token}`,
              },
            });
            const { url, alt } = data.data || {};
            const urlFile = `${apiUrl}news-image/${url}`;
            insertFn(urlFile, alt, urlFile);
          } catch (error) {
            enqueueSnackbar(error?.response?.data?.msg || error?.message || 'Gagal', { variant: 'error' });
            console.log(error);
          }
        },
      },
    },
  };
  // Timely destroy editor, important!
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
    </>
  );
}

export default WangTextEditor;
